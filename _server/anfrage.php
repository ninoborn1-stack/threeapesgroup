<?php
/*
 * ThreeApesGroup – Anfrageformular
 *
 * Nimmt die Anfrage von threeapesgroup.com entgegen und schickt zwei Mails über das
 * Febas-Postfach (SMTP, DKIM-signiert wie im Webmail):
 *   1. die Anfrage an kontakt@threeapesgroup.com (Antworten gehen direkt an die Person)
 *   2. eine Eingangsbestätigung mit Zusammenfassung an die Person, von kontakt@
 * Es wird nichts gespeichert außer einem kurzen IP-Hash für den Spamschutz (1 Stunde).
 */
declare(strict_types=1);
date_default_timezone_set('Europe/Berlin');

require __DIR__ . '/mail_templates.php';

$cfgFile = __DIR__ . '/config.php';
if (!is_file($cfgFile)) { respond(500, ['ok' => false, 'error' => 'config']); }
$cfg = require $cfgFile;

/* ---------- CORS: nur die eigene Website ---------- */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    if (!in_array($origin, $cfg['allowed_origins'], true)) { respond(403, ['ok' => false, 'error' => 'origin']); }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('Access-Control-Max-Age: 86400');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { respond(405, ['ok' => false, 'error' => 'method']); }

/* ---------- Eingabe lesen ---------- */
$raw = file_get_contents('php://input', false, null, 0, 40000);
$in = json_decode((string)$raw, true);
if (!is_array($in)) { respond(400, ['ok' => false, 'error' => 'json']); }

$s = static function ($v, int $max): string {
    $v = is_string($v) ? $v : '';
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return trim(mb_substr($v, 0, $max));
};
$one = static fn($v, int $max): string => str_replace("\n", ' ', $s($v, $max)); // einzeilig, gegen Header-Tricks

$d = [
    'type'    => $one($in['type'] ?? '', 60),
    'budget'  => $one($in['budget'] ?? '', 40),
    'areas'   => array_values(array_filter(array_map(static fn($a) => $one($a, 40), is_array($in['areas'] ?? null) ? array_slice($in['areas'], 0, 12) : []))),
    'name'    => $one($in['name'] ?? '', 120),
    'email'   => $one($in['email'] ?? '', 160),
    'company' => $one($in['company'] ?? '', 160),
    'phone'   => $one($in['phone'] ?? '', 60),
    'message' => $s($in['message'] ?? '', 6000),
    'code'    => strtoupper($one($in['code'] ?? '', 24)),
    'lang'    => ($in['lang'] ?? '') === 'en' ? 'en' : 'de',
];

/* ---------- Spamschutz ---------- */
if (($in['website'] ?? '') !== '') { respond(200, ['ok' => true, 'ref' => ref()]); }          // Honeypot: Bots bekommen "ok", es passiert nichts
if ((int)($in['t'] ?? 0) < 3000) { respond(200, ['ok' => true, 'ref' => ref()]); }           // in unter 3 Sekunden ausgefüllt = Bot
if (!rateOk((int)($cfg['rate_limit_per_hour'] ?? 5))) { respond(429, ['ok' => false, 'error' => 'rate']); }

/* ---------- Prüfen ---------- */
$errors = [];
if ($d['name'] === '') $errors[] = 'name';
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if (mb_strlen($d['message']) < 5) $errors[] = 'message';
if (empty($in['consent'])) $errors[] = 'consent';
if ($d['budget'] === '') $errors[] = 'budget';
if ($errors) { respond(422, ['ok' => false, 'error' => 'fields', 'fields' => $errors]); }

// Sondercode wird hier geprüft, nicht im Browser
$codes = array_map('strtoupper', $cfg['codes'] ?? []);
$d['code_status'] = $d['code'] === '' ? 'none' : (in_array($d['code'], $codes, true) ? 'valid' : 'invalid');
$d['locked_used'] = $d['type'] === 'Partnerschaft' || $d['budget'] === 'unter 2.500 €';

$d['ref'] = ref();
$d['date'] = (new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin')));

/* ---------- Mails ---------- */
$site = rtrim((string)($cfg['site_url'] ?? 'https://threeapesgroup.com'), '/');
$from = [$cfg['from_email'], $cfg['from_name']];

$internal = tpl_internal($d, $site);
$confirm  = tpl_confirm($d, $site);

try {
    $smtp = new MiniSmtp($cfg['smtp_host'], (int)$cfg['smtp_port'], $cfg['smtp_user'], $cfg['smtp_pass'], (string)($cfg['smtp_secure'] ?? ''));
    $smtp->send($from, [$cfg['to_email'], 'ThreeApesGroup'], $internal['subject'], $internal['html'], $internal['text'],
        [$d['email'], $d['name']], ['X-TAG-Ref' => $d['ref']]);
    try {
        $smtp->send($from, [$d['email'], $d['name']], $confirm['subject'], $confirm['html'], $confirm['text'],
            [$cfg['from_email'], $cfg['from_name']], ['Auto-Submitted' => 'auto-replied', 'X-Auto-Response-Suppress' => 'All']);
    } catch (Throwable $e) {
        error_log('TAG confirm failed: ' . $e->getMessage());   // Anfrage ist trotzdem angekommen
    }
    $smtp->quit();
} catch (Throwable $e) {
    error_log('TAG inquiry failed: ' . $e->getMessage());
    respond(502, ['ok' => false, 'error' => 'mail']);
}

respond(200, ['ok' => true, 'ref' => $d['ref']]);


/* =================================================================
   Hilfsfunktionen
   ================================================================= */
function respond(int $code, array $body): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function ref(): string {
    $abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $r = '';
    for ($i = 0; $i < 4; $i++) $r .= $abc[random_int(0, strlen($abc) - 1)];
    return 'TAG-' . date('ymd') . '-' . $r;
}

function rateOk(int $max): bool {
    $dir = __DIR__ . '/.rate';
    if (!is_dir($dir)) @mkdir($dir, 0700);
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0';
    $f = $dir . '/' . hash('sha256', $ip . date('YmdH') . __FILE__) . '.n';   // gesalzener Hash, wechselt jede Stunde
    $n = is_file($f) ? (int)file_get_contents($f) : 0;
    if ($n >= $max) return false;
    @file_put_contents($f, (string)($n + 1), LOCK_EX);
    foreach (glob($dir . '/*.n') ?: [] as $old) { if (filemtime($old) < time() - 7200) @unlink($old); }
    return true;
}

/* ---------- Kleiner SMTP-Client (SSL auf 465 oder STARTTLS auf 587) ---------- */
final class MiniSmtp {
    private $fp;
    private string $host;

    public function __construct(string $host, int $port, string $user, string $pass, string $secure = '') {
        $this->host = $host;
        $secure = $secure !== '' ? $secure : ($port === 465 ? 'ssl' : 'starttls');   // 'none' nur für lokale Tests
        $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $host]]);
        $remote = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port;
        $this->fp = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
        if (!$this->fp) throw new RuntimeException("connect $errno $errstr");
        stream_set_timeout($this->fp, 20);
        $this->expect(220);
        $me = gethostname() ?: 'localhost';
        $this->cmd("EHLO $me", 250);
        if ($secure === 'starttls') {
            $this->cmd('STARTTLS', 220);
            if (!stream_socket_enable_crypto($this->fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) throw new RuntimeException('starttls');
            $this->cmd("EHLO $me", 250);
        }
        $this->cmd('AUTH LOGIN', 334);
        $this->cmd(base64_encode($user), 334);
        $this->cmd(base64_encode($pass), 235);
    }

    public function send(array $from, array $to, string $subject, string $html, string $text, ?array $replyTo = null, array $extra = []): void {
        $this->cmd('MAIL FROM:<' . $from[0] . '>', 250);
        $this->cmd('RCPT TO:<' . $to[0] . '>', [250, 251]);
        $this->cmd('DATA', 354);
        $domain = substr(strrchr($from[0], '@') ?: '@localhost', 1);
        $b = 'b' . bin2hex(random_bytes(12));
        $h = [
            'Date' => date('r'),
            'From' => self::addr($from),
            'To' => self::addr($to),
            'Subject' => self::enc($subject),
            'Message-ID' => '<' . bin2hex(random_bytes(16)) . '@' . $domain . '>',
            'MIME-Version' => '1.0',
            'Content-Type' => 'multipart/alternative; boundary="' . $b . '"',
        ];
        if ($replyTo) $h['Reply-To'] = self::addr($replyTo);
        foreach ($extra as $k => $v) $h[$k] = $v;
        $msg = '';
        foreach ($h as $k => $v) $msg .= "$k: $v\r\n";
        $msg .= "\r\n--$b\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
              . chunk_split(base64_encode($text))
              . "--$b\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
              . chunk_split(base64_encode($html))
              . "--$b--\r\n";
        // Base64 enthält keine Zeilen mit führendem Punkt, Header werden trotzdem geschützt
        $msg = preg_replace('/^\./m', '..', $msg);
        fwrite($this->fp, $msg . "\r\n.\r\n");
        $this->expect(250);
    }

    public function quit(): void {
        if ($this->fp) { @fwrite($this->fp, "QUIT\r\n"); @fclose($this->fp); $this->fp = null; }
    }

    private static function enc(string $s): string {
        return preg_match('/[^\x20-\x7E]/', $s) ? '=?UTF-8?B?' . base64_encode($s) . '?=' : $s;
    }
    private static function addr(array $a): string {
        $name = trim(str_replace(['"', "\r", "\n"], '', (string)($a[1] ?? '')));
        return $name === '' ? '<' . $a[0] . '>' : self::enc($name) . ' <' . $a[0] . '>';
    }
    private function cmd(string $line, $ok): string {
        fwrite($this->fp, $line . "\r\n");
        return $this->expect($ok);
    }
    private function expect($ok): string {
        $ok = (array)$ok; $all = '';
        while (($l = fgets($this->fp, 1024)) !== false) {
            $all .= $l;
            if (strlen($l) < 4 || $l[3] === ' ') break;
        }
        $code = (int)substr($all, 0, 3);
        if (!in_array($code, $ok, true)) throw new RuntimeException('SMTP ' . trim($all));
        return $all;
    }
}

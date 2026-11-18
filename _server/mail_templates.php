<?php
/*
 * ThreeApesGroup – HTML-Mails
 * Tabellen und Inline-Styles, damit es in Gmail, Apple Mail und Outlook gleich aussieht.
 */
declare(strict_types=1);

const TAG_FOREST = '#012B1D';
const TAG_DEEP   = '#011710';
const TAG_JUNGLE = '#01B36C';
const TAG_PEACH  = '#FEB192';
const TAG_PAPER  = '#EEF0EE';
const TAG_STEEL  = '#6B7578';
const TAG_FONT   = "Helvetica, Arial, 'Segoe UI', sans-serif";
const TAG_SERIF  = "Georgia, 'Times New Roman', serif";
const TAG_MONO   = "'SFMono-Regular', Menlo, Consolas, monospace";

function e(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8'); }
function nl(string $s): string { return nl2br(e($s), false); }

/* Formularwerte sind deutsch – für englische Mails übersetzen */
function tr_value(string $v, string $lang): string {
    if ($lang !== 'en') return $v;
    static $m = [
        'Projekt / Problem' => 'Project / problem', 'Beratung' => 'Consulting', 'Kunst & Kreativ' => 'Art & creative',
        'Netzwerk beitreten' => 'Join the network', 'Partnerschaft' => 'Partnership',
        'unter 2.500 €' => 'under €2,500', '2.500 – 5.000 €' => '€2,500 – 5,000', '5.000 – 10.000 €' => '€5,000 – 10,000',
        '10.000 – 25.000 €' => '€10,000 – 25,000', '25.000 – 50.000 €' => '€25,000 – 50,000', '50.000 € +' => '€50,000 +',
        'Strategie' => 'Strategy', 'Organisation' => 'Organization', 'KI' => 'AI', 'Kunst' => 'Art',
        'Foto & Video' => 'Photo & Video', 'Künstler & Labels' => 'Artists & Labels', 'Sponsoring' => 'Sponsorship', 'Weiß nicht' => 'Not sure',
    ];
    return $m[$v] ?? $v;
}

/* Gemeinsamer Rahmen */
function tag_frame(string $site, string $preheader, string $body, string $foot, string $lang): string {
    $logo = e($site . '/assets/img/mail-emblem.png');
    return '<!doctype html><html lang="' . $lang . '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>ThreeApesGroup</title></head>'
        . '<body style="margin:0;padding:0;background:' . TAG_PAPER . ';-webkit-text-size-adjust:100%;">'
        . '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' . e($preheader) . str_repeat('&#8199;&#65279;&#847; ', 40) . '</div>'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' . TAG_PAPER . ';"><tr><td align="center" style="padding:32px 14px;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">'
        // Kopf
        . '<tr><td style="background:' . TAG_FOREST . ';border-radius:14px 14px 0 0;padding:28px 36px 26px;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
        . '<td valign="middle" width="56"><img src="' . $logo . '" width="52" height="35" alt="" style="display:block;border:0;width:52px;height:auto;"></td>'
        . '<td valign="middle" style="font-family:' . TAG_FONT . ';font-size:17px;color:#F4F5F3;letter-spacing:.02em;padding-left:10px;"><b style="font-weight:700;">ThreeApes</b><span style="font-weight:300;">Group</span></td>'
        . '<td valign="middle" align="right" style="font-family:' . TAG_MONO . ';font-size:11px;letter-spacing:.14em;color:' . TAG_JUNGLE . ';text-transform:uppercase;">● ' . ($lang === 'en' ? 'Confidential' : 'Vertraulich') . '</td>'
        . '</tr></table></td></tr>'
        // Inhalt
        . '<tr><td style="background:#FFFFFF;padding:40px 36px 34px;">' . $body . '</td></tr>'
        // Fuß
        . '<tr><td style="background:' . TAG_DEEP . ';border-radius:0 0 14px 14px;padding:24px 36px;font-family:' . TAG_FONT . ';font-size:12px;line-height:1.6;color:#A9AFB2;">' . $foot . '</td></tr>'
        . '</table></td></tr></table></body></html>';
}

function tag_rows(array $rows): string {
    $h = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #E3E7E4;">';
    foreach ($rows as [$k, $v, $html]) {
        if ($v === '' || $v === null) continue;
        $h .= '<tr><td valign="top" width="132" style="padding:12px 12px 12px 0;border-bottom:1px solid #E3E7E4;font-family:' . TAG_MONO . ';font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:' . TAG_STEEL . ';">' . e($k) . '</td>'
            . '<td valign="top" style="padding:11px 0;border-bottom:1px solid #E3E7E4;font-family:' . TAG_FONT . ';font-size:15px;line-height:1.5;color:' . TAG_FOREST . ';">' . ($html ? $v : e((string)$v)) . '</td></tr>';
    }
    return $h . '</table>';
}

function tag_label(string $s): string {
    return '<p style="margin:0 0 14px;font-family:' . TAG_MONO . ';font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:' . TAG_JUNGLE . ';">— ' . e($s) . '</p>';
}

/* =================================================================
   Bestätigung an die anfragende Person
   ================================================================= */
function tpl_confirm(array $d, string $site): array {
    $en = $d['lang'] === 'en';
    $L = $en ? [
        'subject' => 'Your inquiry has arrived · ' . $d['ref'],
        'pre' => 'We\'ll get back to you within 48 hours. Usually sooner.',
        'h1a' => 'Arrived.', 'h1b' => 'We\'re on it.',
        'hi' => 'Hi ' . $d['name'] . ',',
        'intro' => 'thank you for your inquiry. It has reached us and is now with your point of contact. We\'ll get back to you within 48 hours, usually sooner.',
        'sum' => 'Your inquiry', 'ref' => 'Reference', 'type' => 'Type', 'budget' => 'Budget', 'areas' => 'Fields', 'company' => 'Company',
        'phone' => 'Phone', 'email' => 'Email', 'msg' => 'Your problem',
        'next' => 'What happens next',
        'steps' => [['One conversation.', 'We get in touch and clarify what the end result should be.'], ['The network.', 'We bring in the people who can solve it. You only ever talk to us.'], ['Solved.', 'You get the result. Afterwards, we forget the details.']],
        'disc' => 'What you wrote is read only by your point of contact. Need an NDA? Just reply to this email, we\'ll sign before the first conversation.',
        'reply' => 'Want to add something? Simply reply to this email.',
        'foot' => 'You received this email because you sent an inquiry via threeapesgroup.com. We don\'t use tracking.',
        'site' => 'Website', 'legal' => 'Legal notice', 'privacy' => 'Privacy policy', 'base' => '/en',
    ] : [
        'subject' => 'Deine Anfrage ist bei uns · ' . $d['ref'],
        'pre' => 'Wir melden uns innerhalb von 48 Stunden. Meist schneller.',
        'h1a' => 'Angekommen.', 'h1b' => 'Wir kümmern uns.',
        'hi' => 'Hallo ' . $d['name'] . ',',
        'intro' => 'danke für deine Anfrage. Sie ist bei uns eingegangen und liegt jetzt bei deinem Ansprechpartner. Wir melden uns innerhalb von 48 Stunden, meist schneller.',
        'sum' => 'Deine Anfrage', 'ref' => 'Referenz', 'type' => 'Art', 'budget' => 'Budget', 'areas' => 'Bereiche', 'company' => 'Unternehmen',
        'phone' => 'Telefon', 'email' => 'E-Mail', 'msg' => 'Dein Problem',
        'next' => 'So geht es weiter',
        'steps' => [['Ein Gespräch.', 'Wir melden uns und klären, was am Ende stehen soll.'], ['Das Netzwerk.', 'Wir holen die Leute dazu, die es lösen können. Du sprichst nur mit uns.'], ['Gelöst.', 'Du bekommst das Ergebnis. Danach vergessen wir die Details.']],
        'disc' => 'Was du geschrieben hast, liest nur dein Ansprechpartner. Du brauchst eine NDA? Antworte einfach auf diese Mail, wir unterschreiben vor dem ersten Gespräch.',
        'reply' => 'Du willst noch etwas ergänzen? Antworte einfach auf diese Mail.',
        'foot' => 'Du bekommst diese Mail, weil du über threeapesgroup.com eine Anfrage gestellt hast. Wir verwenden kein Tracking.',
        'site' => 'Website', 'legal' => 'Impressum', 'privacy' => 'Datenschutz', 'base' => '',
    ];

    $areas = implode(', ', array_map(static fn($a) => tr_value($a, $d['lang']), $d['areas']));
    $rows = [
        [$L['ref'], '<span style="font-family:' . TAG_MONO . ';font-size:14px;letter-spacing:.06em;">' . e($d['ref']) . '</span>', true],
        [$L['type'], tr_value($d['type'], $d['lang']), false],
        [$L['budget'], tr_value($d['budget'], $d['lang']), false],
        [$L['areas'], $areas, false],
        [$L['company'], $d['company'], false],
        [$L['phone'], $d['phone'], false],
        [$L['email'], $d['email'], false],
    ];

    $steps = '';
    foreach ($L['steps'] as $i => [$t, $x]) {
        $steps .= '<tr><td valign="top" width="40" style="padding:0 0 16px;font-family:' . TAG_MONO . ';font-size:12px;color:' . TAG_JUNGLE . ';">0' . ($i + 1) . '</td>'
            . '<td valign="top" style="padding:0 0 16px;font-family:' . TAG_FONT . ';font-size:15px;line-height:1.5;color:' . TAG_FOREST . ';"><b>' . e($t) . '</b> <span style="color:#4A5558;">' . e($x) . '</span></td></tr>';
    }

    $body = tag_label($L['ref'] . ' ' . $d['ref'])
        . '<h1 style="margin:0 0 26px;font-family:' . TAG_FONT . ';font-size:40px;line-height:1.05;font-weight:700;letter-spacing:-.02em;color:' . TAG_FOREST . ';">' . e($L['h1a']) . '<br>'
        . '<span style="font-family:' . TAG_SERIF . ';font-style:italic;font-weight:400;color:#E0875F;">' . e($L['h1b']) . '</span></h1>'
        . '<p style="margin:0 0 6px;font-family:' . TAG_FONT . ';font-size:16px;line-height:1.6;color:' . TAG_FOREST . ';">' . e($L['hi']) . '</p>'
        . '<p style="margin:0 0 34px;font-family:' . TAG_FONT . ';font-size:16px;line-height:1.6;color:#33403F;">' . e($L['intro']) . '</p>'
        . tag_label($L['sum']) . tag_rows($rows)
        . '<p style="margin:22px 0 8px;font-family:' . TAG_MONO . ';font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:' . TAG_STEEL . ';">' . e($L['msg']) . '</p>'
        . '<div style="padding:18px 20px;background:' . TAG_PAPER . ';border-left:3px solid ' . TAG_PEACH . ';border-radius:4px;font-family:' . TAG_FONT . ';font-size:15px;line-height:1.6;color:' . TAG_FOREST . ';">' . nl($d['message']) . '</div>'
        . '<div style="height:36px;line-height:36px;">&nbsp;</div>'
        . tag_label($L['next'])
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' . $steps . '</table>'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;"><tr><td style="padding:18px 20px;background:' . TAG_FOREST . ';border-radius:8px;font-family:' . TAG_FONT . ';font-size:14px;line-height:1.6;color:#DDE3DF;">'
        . '<span style="color:' . TAG_PEACH . ';">&#9650;</span>&nbsp; ' . e($L['disc']) . '</td></tr></table>'
        . '<p style="margin:26px 0 0;font-family:' . TAG_FONT . ';font-size:14px;line-height:1.6;color:#4A5558;">' . e($L['reply']) . '</p>';

    $b = $site . $L['base'];
    $foot = '<b style="color:#F4F5F3;">ThreeApesGroup</b> · Berlin · <a href="mailto:kontakt@threeapesgroup.com" style="color:' . TAG_PEACH . ';text-decoration:none;">kontakt@threeapesgroup.com</a><br>'
        . '<a href="' . e($b . '/') . '" style="color:#A9AFB2;">' . e($L['site']) . '</a> · <a href="' . e($b . '/impressum.html') . '" style="color:#A9AFB2;">' . e($L['legal']) . '</a> · <a href="' . e($b . '/datenschutz.html') . '" style="color:#A9AFB2;">' . e($L['privacy']) . '</a><br>'
        . '<span style="color:#6E7A76;">' . e($L['foot']) . '</span>';

    $text = $L['h1a'] . ' ' . $L['h1b'] . "\n\n" . $L['hi'] . "\n" . $L['intro'] . "\n\n" . strtoupper($L['sum']) . "\n";
    foreach ($rows as [$k, $v, $html]) { if ($v !== '') $text .= $k . ': ' . ($html ? $d['ref'] : $v) . "\n"; }
    $text .= "\n" . $L['msg'] . ":\n" . $d['message'] . "\n\n" . strtoupper($L['next']) . "\n";
    foreach ($L['steps'] as $i => [$t, $x]) $text .= '0' . ($i + 1) . ' ' . $t . ' ' . $x . "\n";
    $text .= "\n" . $L['disc'] . "\n" . $L['reply'] . "\n\n-- \nThreeApesGroup · Berlin · kontakt@threeapesgroup.com\n" . $b . "/\n";

    return ['subject' => $L['subject'], 'html' => tag_frame($site, $L['pre'], $body, $foot, $d['lang']), 'text' => $text];
}

/* =================================================================
   Anfrage an kontakt@ (intern, immer deutsch)
   ================================================================= */
function tpl_internal(array $d, string $site): array {
    $codeTxt = ['none' => 'kein Code', 'valid' => 'gültig ✓', 'invalid' => 'ungültig ✗'][$d['code_status']] ?? '';
    $flag = '';
    if ($d['locked_used'] && $d['code_status'] !== 'valid') {
        $flag = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr><td style="padding:14px 18px;background:#FFF1EA;border-left:3px solid #E0875F;border-radius:4px;font-family:' . TAG_FONT . ';font-size:14px;color:#7A3B1E;">'
            . 'Achtung: „Partnerschaft“ oder „unter 2.500 €“ gewählt, aber ohne gültigen Sondercode.</td></tr></table>';
    }
    $mailBtn = 'mailto:' . rawurlencode($d['email']) . '?subject=' . rawurlencode('Re: Deine Anfrage · ' . $d['ref']);
    $rows = [
        ['Name', $d['name'], false],
        ['E-Mail', '<a href="mailto:' . e($d['email']) . '" style="color:' . TAG_FOREST . ';">' . e($d['email']) . '</a>', true],
        ['Telefon', $d['phone'] !== '' ? '<a href="tel:' . e(preg_replace('/[^\d+]/', '', $d['phone']) ?? '') . '" style="color:' . TAG_FOREST . ';">' . e($d['phone']) . '</a>' : '', true],
        ['Unternehmen', $d['company'], false],
        ['Art', $d['type'], false],
        ['Budget', $d['budget'], false],
        ['Bereiche', implode(', ', $d['areas']), false],
        ['Sondercode', $d['code'] !== '' ? $d['code'] . ' · ' . $codeTxt : $codeTxt, false],
        ['Sprache', $d['lang'] === 'en' ? 'Englisch (Bestätigung auf Englisch)' : 'Deutsch', false],
        ['Eingang', $d['date']->format('d.m.Y, H:i') . ' Uhr', false],
    ];
    $body = tag_label('Neue Anfrage · ' . $d['ref'])
        . '<h1 style="margin:0 0 6px;font-family:' . TAG_FONT . ';font-size:30px;line-height:1.1;font-weight:700;letter-spacing:-.01em;color:' . TAG_FOREST . ';">' . e($d['name']) . '</h1>'
        . '<p style="margin:0 0 26px;font-family:' . TAG_FONT . ';font-size:15px;color:#4A5558;">' . e(trim($d['type'] . ' · ' . $d['budget'] . ($d['company'] !== '' ? ' · ' . $d['company'] : ''), ' ·')) . '</p>'
        . $flag
        . '<p style="margin:0 0 8px;font-family:' . TAG_MONO . ';font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:' . TAG_STEEL . ';">Das Problem</p>'
        . '<div style="margin:0 0 30px;padding:18px 20px;background:' . TAG_PAPER . ';border-left:3px solid ' . TAG_JUNGLE . ';border-radius:4px;font-family:' . TAG_FONT . ';font-size:16px;line-height:1.6;color:' . TAG_FOREST . ';">' . nl($d['message']) . '</div>'
        . tag_rows($rows)
        . '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;"><tr><td style="background:' . TAG_PEACH . ';border-radius:999px;">'
        . '<a href="' . e($mailBtn) . '" style="display:inline-block;padding:14px 26px;font-family:' . TAG_MONO . ';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:' . TAG_FOREST . ';text-decoration:none;">Antworten →</a></td></tr></table>'
        . '<p style="margin:18px 0 0;font-family:' . TAG_FONT . ';font-size:13px;color:' . TAG_STEEL . ';">„Antworten“ in deinem Mailprogramm geht direkt an ' . e($d['email']) . '. Eine Eingangsbestätigung mit dieser Zusammenfassung ist bereits raus.</p>';
    $foot = 'Gesendet vom Anfrageformular auf threeapesgroup.com · Nicht weiterleiten, enthält vertrauliche Angaben.';

    $subject = 'Neue Anfrage ' . $d['ref'] . ' · ' . $d['name'] . ' · ' . $d['budget'];
    $text = "Neue Anfrage " . $d['ref'] . "\n\n";
    foreach ($rows as [$k, $v, $html]) { if ($v !== '') $text .= $k . ': ' . trim(strip_tags(html_entity_decode((string)$v, ENT_QUOTES, 'UTF-8'))) . "\n"; }
    $text .= "\nDas Problem:\n" . $d['message'] . "\n";
    return ['subject' => $subject, 'html' => tag_frame($site, $d['name'] . ': ' . mb_substr($d['message'], 0, 90), $body, $foot, 'de'), 'text' => $text];
}

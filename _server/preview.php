<?php
// Schreibt Beispiel-Mails nach _server/preview/ – nur zum Ansehen, sendet nichts.
declare(strict_types=1);
date_default_timezone_set('Europe/Berlin');
require __DIR__ . '/mail_templates.php';

$base = [
    'type' => 'Projekt / Problem', 'budget' => '10.000 – 25.000 €', 'areas' => ['KI', 'Web & Software'],
    'name' => 'Alex Muster', 'email' => 'alex@example.com', 'company' => 'Muster GmbH', 'phone' => '+49 30 1234567',
    'message' => "Unser Support ertrinkt in Anfragen.\nDie Hälfte ist immer dieselbe Frage, zwei Leute sind gegangen.",
    'code' => '', 'code_status' => 'none', 'locked_used' => false, 'lang' => 'de',
    'ref' => 'TAG-261118-K7PQ', 'date' => new DateTimeImmutable('now'),
];
$site = $argv[1] ?? 'https://threeapesgroup.com';
@mkdir(__DIR__ . '/preview');
$out = [
    'bestaetigung-de' => tpl_confirm($base, $site),
    'confirmation-en' => tpl_confirm(['lang' => 'en', 'name' => 'Alex Example', 'company' => 'Example Ltd.'] + $base, $site),
    'intern' => tpl_internal(['code' => 'FALSCH1', 'code_status' => 'invalid', 'locked_used' => true, 'budget' => 'unter 2.500 €'] + $base, $site),
];
foreach ($out as $name => $m) {
    file_put_contents(__DIR__ . "/preview/$name.html", $m['html']);
    file_put_contents(__DIR__ . "/preview/$name.txt", "Betreff: {$m['subject']}\n\n{$m['text']}");
    echo "$name: {$m['subject']}\n";
}

<?php
/*
 * ThreeApesGroup – Einstellungen für das Anfrageformular
 *
 * 1. Diese Datei kopieren und als  config.php  speichern (gleicher Ordner wie anfrage.php).
 * 2. Unten das Passwort des Postfachs eintragen.
 * 3. config.php NIE ins GitHub-Repository legen. Sie ist in .gitignore eingetragen.
 */
return [
    // Postfach, über das gesendet wird (Login wie im Webmail)
    'smtp_host' => 'mail.febas.net',
    'smtp_port' => 465,                       // 465 = SSL/TLS
    'smtp_user' => 'nino@threeapesgroup.com',
    'smtp_pass' => 'HIER-PASSWORT-EINTRAGEN',

    // Absender und Empfänger
    'from_email' => 'kontakt@threeapesgroup.com',  // Alias von nino@, darf gesendet werden
    'from_name'  => 'ThreeApesGroup',
    'to_email'   => 'kontakt@threeapesgroup.com',  // hier kommen die Anfragen an

    // Nur diese Seiten dürfen das Formular absenden
    'allowed_origins' => [
        'https://threeapesgroup.com',
        'https://www.threeapesgroup.com',
        'http://localhost:5173',
    ],

    // Sondercodes im Klartext (nur hier auf dem Server, nicht im Repository).
    // Schaltet "unter 2.500 €" und "Partnerschaft" frei.
    'codes' => [
        // 'BEISPIELCODE',
    ],

    // Spamschutz: höchstens so viele Anfragen pro Absender-IP und Stunde
    'rate_limit_per_hour' => 5,

    // Basis-Adresse der Website (für Logo und Links in den Mails)
    'site_url' => 'https://threeapesgroup.com',
];

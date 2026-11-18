# Anfrageformular auf dem Febas-Webspace

Die Website läuft auf GitHub Pages und kann selbst keine Mails senden. Das Formular auf
`anfrage.html` schickt die Anfrage deshalb an `anfrage.php` auf dem Febas-Webspace,
erreichbar unter **https://form.threeapesgroup.com/anfrage.php**.

`anfrage.php` sendet über das Postfach (SMTP `mail.febas.net`, DKIM-signiert):
1. die Anfrage an **kontakt@threeapesgroup.com**. „Antworten“ geht direkt an die Person.
2. eine **Eingangsbestätigung** von kontakt@ an die Person, mit Referenznummer und Zusammenfassung.
   Auf der englischen Seite wird sie auf Englisch verschickt.

Gespeichert wird nichts, außer einem gesalzenen IP-Hash für maximal 2 Stunden (Spamschutz).

## Dateien

| Datei | Zweck |
|---|---|
| `anfrage.php` | Nimmt die Anfrage an, prüft sie und sendet beide Mails |
| `mail_templates.php` | Aussehen der beiden Mails |
| `config.sample.php` | Vorlage für `config.php` (Passwort, Empfänger, Sondercodes) |
| `.htaccess` | Sperrt alles außer `anfrage.php` |

`config.php` enthält das Postfach-Passwort und kommt **nie** ins Repository (steht in `.gitignore`).

## Einrichtung (einmalig)

1. **LiveConfig → Domains → Add subdomain…**: Subdomain `form`, Domain `threeapesgroup.com`,
   Webspace-Ordner z. B. `/form`.
2. Prüfen, dass in der Febas-DNS ein Eintrag `form` auf den Webserver zeigt.
   Alle anderen Einträge (GitHub, MX, DKIM, DMARC) bleiben unverändert.
3. **LiveConfig → SSL certificates**: Let's-Encrypt-Zertifikat für `form.threeapesgroup.com`.
4. `config.sample.php` als `config.php` kopieren und das Passwort von nino@ eintragen.
5. `anfrage.php`, `mail_templates.php`, `config.php` und `.htaccess` per FTP in den Ordner `/form` hochladen.
6. In `assets/js/config.js` steht `formEndpoint: "https://form.threeapesgroup.com/anfrage.php"`.

Ist `formEndpoint` leer, öffnet das Formular wie früher das Mailprogramm.

## Mails ansehen, ohne zu senden

```bash
php _server/preview.php
```

schreibt die drei Mails (Bestätigung DE und EN, interne Anfrage) als HTML-Dateien nach `_server/preview/`.

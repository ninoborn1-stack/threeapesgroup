# ThreeApesGroup – Website

Reine HTML/CSS/JS-Seite ohne Build-Schritt.

Live: https://threeapesgroup.com (GitHub Pages, Domain über die Datei `CNAME`). DNS liegt bei Febas: 4× A und 4× AAAA auf GitHub, `www` als CNAME auf `ninoborn1-stack.github.io`. Die Mail-Einträge (MX, SPF, mail, imap, smtp) gehören Febas und bleiben unverändert.

## Starten
```bash
python3 -m http.server 5173
```
Danach http://localhost:5173 öffnen.

## Seiten
| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Loader, Hero mit Suchfeld, Manifest mit Schutz-Dreieck, „Wir sind alle“, Protokoll, Netzwerk mit Kooperationen, Leistungen, Akten, Partner, Prozess, Anfrage-Hinweis (führt zu `anfrage.html`) |
| `manifest.html` | Die Idee hinter den drei Affen, 02 mit Labyrinth-Animation (`initWay` in main.js), Diskretion, FAQ |
| `netzwerk.html` | Großes Netzwerk mit Suchfeld, Disziplinen, „Netzwerk beitreten“ |
| `leistungen.html` | Alle 11 Leistungen im Detail mit Zuordnungs-Suche |
| `projekte.html` | Alle Akten mit Filter |
| `projekt.html` | Vorlage für eine einzelne Akte |
| `partner.html` | Enger Partner (Bunkerwest), Spannweite Sponsoring bis Kulturförderung, Partnerschaft nur mit Bewerbung oder Empfehlungscode. Keine Namen von Sponsoren |
| `anfrage.html` | Anfrageformular mit Schnellstart |
| `impressum.html`, `datenschutz.html` | Platzhalter, vor dem Livegang ausfüllen |

## Wo du was änderst
- **Navigation, Menü, Footer**: nur in `assets/js/layout.js`. Gilt für alle Seiten.
- **Sondercodes, Formular-Ziel, E-Mail, Netzwerk-Knoten und Stichwörter**: `assets/js/config.js`.
  - Neuer Sondercode: in der Browser-Konsole `TAG.hash("NEUERCODE")` eingeben und den Wert in `CONFIG.codes` eintragen.
  - `formEndpoint`: z. B. eine Formspree-URL. Leer = das Formular öffnet das Mailprogramm.
- **Farben und Design**: `assets/css/style.css`, ganz oben in `:root`.
- **Animationen**: `assets/js/main.js` (Auge, Reveals, Scramble), `assets/js/network.js` (Netzwerk).
- Platzhalter sind im HTML mit `PLATZHALTER` markiert.

## Inhalte tauschen
- **Akten (Projekte)**: nur Rahmen (Branche, Umfang, Ergebnis), nie Kundennamen. Einen `<article class="file">` kopieren. `data-cat` steuert den Filter auf `projekte.html` (z. B. `ki software`).
- **Geschwärzte Stellen**: Text in `<span class="redact">…</span>` setzen. Er wird beim Scrollen geschwärzt.
- **Partner-Logos**: `<span class="plogo">` durch `<img src="assets/img/partner/name.svg" class="plogo">` ersetzen.
- **Zahlen**: Attribut `data-count` (zählt beim Scrollen hoch).
- **Icons**: `<svg data-icon="ki"></svg>`. Alle Namen stehen oben in `main.js` unter `ICONS`. Klassen wie `a-spin`, `a-pulse`, `a-blink` im Icon sorgen für die kleine Dauerbewegung.
- **Kooperationen** (cnode, Zulano Gruppe): Startseite unter `class="coop"`, Unterseiten über `COOP` im Build-Skript. Beschreibungen sind Platzhalter.

## Links mit Vorbelegung
- `anfrage.html?problem=Text&bereich=KI,Sponsoring&typ=Beratung` füllt das Formular vor.
- Das einzige Anfrageformular steht auf `anfrage.html`. Alle anderen Seiten verlinken nur dorthin.
- `netzwerk.html?problem=Text` schickt den Text direkt durchs Netzwerk.

## Nach Änderungen
Die Dateien werden mit `?v=13` eingebunden. Nach größeren Änderungen die Zahl in allen HTML-Dateien erhöhen, damit Browser die neue Version laden.

## Problem-Assistent und Suche
- Datei: `assets/js/assist.js`. Läuft komplett im Browser, ohne Server.
- Jedes Suchfeld (Startseite, Netzwerk, Leistungen, Anfrage) zeigt beim Tippen Vorschläge und nach dem Absenden eine Einschätzung: Zeit bis zur Lösung, Aufwand, beteiligte Köpfe, Vorgehen, Rückfragen.
- Falltypen, Zeitrahmen und Stichwörter stehen oben in `assist.js` unter `CASES`. **`n` (Anzahl vergleichbarer Aufgaben) und `d` (Tage) sind Platzhalter: echte Erfahrungswerte eintragen.**

## Zweisprachig (Deutsch / Englisch)
- Deutsch ist die Quelle. Die englischen Seiten liegen unter `en/` und werden erzeugt, nie von Hand bearbeitet.
- Nach jeder Textänderung an einer deutschen Seite: `python3 _i18n/build_en.py`. Das Skript nennt jeden neuen deutschen Text ohne Übersetzung. Diesen in `_i18n/en.json` eintragen (`"Deutsch": "English"`) und erneut bauen.
- Sätze mit Auszeichnung (z. B. `<em>`), die sich Stück für Stück schlecht übersetzen, stehen in `en.json` als ganzer HTML-Block.
- Texte aus den Skripten (Menü, Footer, Formular-Meldungen, Problem-Assistent, Netzwerk-Grafik) stehen in `assets/js/en.js`.
- Der Umschalter DE / EN oben rechts führt immer auf dieselbe Seite in der anderen Sprache. `hreflang` setzt das Skript automatisch.

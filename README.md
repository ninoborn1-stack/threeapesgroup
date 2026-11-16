# ThreeApesGroup – Website

Reine HTML/CSS/JS-Seite ohne Build-Schritt.

## Starten
```bash
python3 -m http.server 5173
```
Danach http://localhost:5173 öffnen.

## Seiten
| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Loader, Hero mit Suchfeld, Auge (4 Schritte), „Wir sind alle“, Protokoll, Netzwerk mit Kooperationen, Leistungen, Akten, Partner, Prozess, Anfrage |
| `manifest.html` | Die Idee hinter den drei Affen, Diskretion, FAQ |
| `netzwerk.html` | Großes Netzwerk mit Suchfeld, Disziplinen, „Netzwerk beitreten“ |
| `leistungen.html` | Alle 11 Leistungen im Detail mit Zuordnungs-Suche |
| `projekte.html` | Alle Akten mit Filter |
| `projekt.html` | Vorlage für eine einzelne Akte |
| `partner.html` | Partner, Sponsoring, Partnerschaft mit Code |
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
- **Akten (Projekte)**: einen `<article class="file">` kopieren. `data-cat` steuert den Filter auf `projekte.html` (z. B. `ki software`).
- **Geschwärzte Stellen**: Text in `<span class="redact">…</span>` setzen. Er wird beim Scrollen geschwärzt.
- **Partner-Logos**: `<span class="plogo">` durch `<img src="assets/img/partner/name.svg" class="plogo">` ersetzen.
- **Zahlen**: Attribut `data-count` (zählt beim Scrollen hoch).
- **Icons**: `<svg data-icon="ki"></svg>`. Alle Namen stehen oben in `main.js` unter `ICONS`. Klassen wie `a-spin`, `a-pulse`, `a-blink` im Icon sorgen für die kleine Dauerbewegung.
- **Kooperationen** (cnode, Zulano Gruppe): Startseite unter `class="coop"`, Unterseiten über `COOP` im Build-Skript. Beschreibungen sind Platzhalter.

## Links mit Vorbelegung
- `anfrage.html?problem=Text&bereich=KI,Sponsoring&typ=Beratung` füllt das Formular vor.
- `netzwerk.html?problem=Text` schickt den Text direkt durchs Netzwerk.

## Nach Änderungen
Die Dateien werden mit `?v=13` eingebunden. Nach größeren Änderungen die Zahl in allen HTML-Dateien erhöhen, damit Browser die neue Version laden.

## Problem-Assistent und Suche
- Datei: `assets/js/assist.js`. Läuft komplett im Browser, ohne Server.
- Jedes Suchfeld (Startseite, Netzwerk, Leistungen, Anfrage) zeigt beim Tippen Vorschläge und nach dem Absenden eine Einschätzung: Zeit bis zur Lösung, Aufwand, beteiligte Köpfe, Vorgehen, Rückfragen.
- Falltypen, Zeitrahmen und Stichwörter stehen oben in `assist.js` unter `CASES`. **`n` (Anzahl vergleichbarer Aufgaben) und `d` (Tage) sind Platzhalter: echte Erfahrungswerte eintragen.**

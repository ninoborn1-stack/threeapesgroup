/* =================================================================
   ThreeApesGroup — Problem-Assistent
   Gibt zu einem Satz eine Einschätzung zurück: worum es geht, wie lange
   vergleichbare Aufgaben gedauert haben, wie aufwendig es ist, wer im
   Netzwerk dran wäre, wie wir vorgehen und was uns noch hilft.
   Dazu: Vorschläge beim Tippen.

   CASES pflegen:
   t  = Titel des Falltyps        k  = Stichwörter (klein, Wortanfänge reichen)
   a  = Bereiche im Formular      d  = [min, max] Tage bis zur Lösung (Erfahrungswert)
   cx = Aufwand 1–3               h  = Köpfe im Netzwerk
   r  = beteiligte Rollen         s  = Vorgehen (3 Schritte)   q = Rückfragen
   n  = Anzahl vergleichbarer Aufgaben   ← PLATZHALTER: echte Zahlen eintragen
   ================================================================= */
(function () {
  const CASES = [
    { id: "web", t: "Website bringt keine Kunden", ex: "Unsere Website bringt keine Kunden", a: ["Web & Software", "Strategie"], d: [28, 70], cx: 2, h: "3–5", n: 6,
      k: ["website", "webseite", "homepage", "seite bringt", "keine kunden", "keine anfragen", "sichtbar", "google", "seo", "conversion", "landingpage"],
      r: ["Webentwicklung", "Text & Angebot", "SEO"], s: ["Seite und Zahlen in wenigen Tagen ansehen", "Angebot, Texte und Wege zur Anfrage schärfen", "Umbauen, messen, nachziehen"], q: ["Woher kommen eure Besucher heute?", "Was soll ein Besucher am Ende tun?"] },
    { id: "shop", t: "Online-Shop verkauft nicht", ex: "Unser Online-Shop verkauft nichts", a: ["Web & Software", "Strategie"], d: [28, 70], cx: 2, h: "4–6", n: 4,
      k: ["shop", "onlineshop", "e-commerce", "warenkorb", "verkauft nicht", "verkauft nichts", "bestellungen", "produkte online"],
      r: ["Shop-Entwicklung", "Performance-Marketing", "Produktfotos"], s: ["Shop, Preise und Kaufweg prüfen", "Größte Bremse zuerst lösen", "Reichweite gezielt aufbauen"], q: ["Welches Shopsystem nutzt ihr?", "Wie viele Besucher kommen im Monat?"] },
    { id: "app", t: "Software oder App bauen", ex: "Wir brauchen eine eigene App", a: ["Web & Software"], d: [56, 150], cx: 3, h: "4–8", n: 3,
      k: ["app", "software", "tool", "plattform", "programm", "entwickeln", "mvp", "portal", "kundenportal", "schnittstelle"],
      r: ["Produktentwicklung", "Design", "Backend"], s: ["Ziel und kleinsten sinnvollen Umfang festlegen", "Klickbaren Entwurf bauen", "In Etappen entwickeln und ausliefern"], q: ["Gibt es schon etwas, das ersetzt werden soll?", "Wer nutzt es am Ende?"] },
    { id: "ki-support", t: "KI im Support", ex: "Wir wollen KI im Support einsetzen", a: ["KI", "IT"], d: [28, 70], cx: 2, h: "2–4", n: 3,
      k: ["ki", "ai", "chatbot", "gpt", "llm", "support", "kundenanfragen", "ertrinkt", "tickets", "anfragen beantworten", "künstliche"],
      r: ["KI-Entwicklung", "Prozessberatung"], s: ["Häufigste Anfragen auswerten", "Assistenten mit euren Inhalten aufsetzen", "Im echten Betrieb testen und übergeben"], q: ["Wie viele Anfragen kommen pro Woche?", "Über welche Kanäle kommen sie?"] },
    { id: "auto", t: "Abläufe automatisieren", ex: "Zu viel Handarbeit in unseren Abläufen", a: ["KI", "Organisation"], d: [21, 56], cx: 2, h: "2–4", n: 4,
      k: ["automatis", "manuell", "handarbeit", "excel", "zeitfresser", "workflow", "doppelt", "abtippen", "agent"],
      r: ["Automatisierung", "KI-Entwicklung", "Organisation"], s: ["Die drei größten Zeitfresser finden", "Automatisch lösen, wo es sich lohnt", "Team einweisen"], q: ["Welche Programme nutzt ihr täglich?", "Wie viele Leute sind betroffen?"] },
    { id: "hack", t: "IT-Notfall", ex: "Server gehackt, Daten weg", a: ["IT"], d: [1, 5], cx: 3, h: "2–4", n: 2, urgent: true,
      k: ["gehackt", "hack", "angriff", "virus", "ransomware", "trojaner", "daten weg", "server down", "ausfall", "phishing", "erpress", "verschlüsselt"],
      r: ["IT-Sicherheit", "Forensik", "Recht"], s: ["Schaden eingrenzen und sichern", "Systeme wiederherstellen", "Lücke schließen, damit es nicht wieder passiert"], q: ["Seit wann besteht das Problem?", "Gibt es ein aktuelles Backup?"] },
    { id: "it", t: "IT neu aufstellen", ex: "Unsere IT ist veraltet und unsicher", a: ["IT"], d: [21, 60], cx: 2, h: "2–4", n: 4,
      k: ["server", "cloud", "backup", "netzwerk", "edv", "microsoft", "veraltet", "unsicher", "it", "e-mail", "rechner", "sicherheit"],
      r: ["IT-Administration", "IT-Sicherheit"], s: ["Bestand aufnehmen", "Plan mit Prioritäten", "Umstellen ohne Stillstand"], q: ["Wie viele Arbeitsplätze?", "Gibt es jemanden intern für IT?"] },
    { id: "growth", t: "Wachstum stockt", ex: "Unser Umsatz wächst nicht mehr", a: ["Strategie"], d: [42, 120], cx: 2, h: "2–4", n: 4,
      k: ["wachstum", "wachsen", "stagn", "stockt", "umsatz", "markt", "expansion", "skalier", "neue kunden", "vertrieb", "neuausricht"],
      r: ["Strategie", "Vertrieb", "Marketing"], s: ["Zahlen und Markt ehrlich ansehen", "Zwei bis drei klare Hebel festlegen", "Umsetzen und begleiten"], q: ["Seit wann stockt es?", "Was habt ihr schon versucht?"] },
    { id: "brand", t: "Marke und Auftritt schärfen", ex: "Unsere Marke wirkt austauschbar", a: ["Strategie", "Foto & Video"], d: [35, 84], cx: 2, h: "3–5", n: 3,
      k: ["marke", "positionier", "branding", "auftritt", "image", "logo", "rebrand", "austauschbar", "erscheinungsbild"],
      r: ["Markenstrategie", "Design", "Foto & Video"], s: ["Kern der Marke klären", "Auftritt gestalten", "Ausrollen über alle Kanäle"], q: ["Wen wollt ihr erreichen?", "Was soll bleiben, was darf weg?"] },
    { id: "org", t: "Struktur und Abläufe", ex: "Bei uns ist niemand für etwas zuständig", a: ["Organisation"], d: [42, 98], cx: 2, h: "2–3", n: 4,
      k: ["chaos", "struktur", "ablauf", "abläufe", "organisation", "zuständig", "prozess", "effizien", "durcheinander", "überlastet"],
      r: ["Organisationsberatung", "Prozesse"], s: ["Mit den Beteiligten sprechen", "Klare Rollen und Abläufe festlegen", "Einführen und nachjustieren"], q: ["Wie groß ist das Team?", "Wo hakt es am meisten?"] },
    { id: "team", t: "Team in der Krise", ex: "Unser Team zerfällt", a: ["Coaching", "Organisation"], d: [21, 70], cx: 2, h: "2–3", n: 3,
      k: ["team", "konflikt", "kündig", "stimmung", "zerfällt", "streit", "fluktuation", "mitarbeitende", "motivation"],
      r: ["Coaching", "Mediation", "Führung"], s: ["Vertrauliche Einzelgespräche", "Gemeinsamer Termin mit klaren Regeln", "Begleitung über einige Wochen"], q: ["Wie viele Leute sind betroffen?", "Gibt es einen Auslöser?"] },
    { id: "coach", t: "Führung und Training", ex: "Unsere Führungskräfte brauchen ein Coaching", a: ["Coaching"], d: [7, 42], cx: 1, h: "1–2", n: 5,
      k: ["coaching", "schulung", "workshop", "training", "führung", "lernen", "mindset", "weiterbild"],
      r: ["Coaching", "Training"], s: ["Ziel klären", "Format passend zuschneiden", "Durchführen und nachhalten"], q: ["Für wie viele Personen?", "Lieber vor Ort oder online?"] },
    { id: "art-sell", t: "Kunstwerk diskret verkaufen", ex: "Ein Werk soll diskret verkauft werden", a: ["Kunst"], d: [30, 120], cx: 2, h: "2–4", n: 3,
      k: ["werk", "gemälde", "skulptur", "sammler", "nachlass", "kunst verkaufen", "kunstwerk", "bild verkaufen", "diskret verkaufen"],
      r: ["Kunsthandel", "Sammlerkontakte", "Bewertung"], s: ["Werk einschätzen lassen", "Passende Sammler leise ansprechen", "Verkauf ohne öffentliche Spur abwickeln"], q: ["Gibt es Papiere zur Herkunft?", "Gibt es einen Preisrahmen?"] },
    { id: "art-show", t: "Ausstellung oder Galerie finden", ex: "Ich suche eine Galerie für meine Arbeiten", a: ["Kunst"], d: [60, 180], cx: 2, h: "2–4", n: 2,
      k: ["ausstellung", "galerie", "ausstellen", "kurator", "vernissage", "künstlerin", "malerei"],
      r: ["Galerien", "Kuratoren"], s: ["Portfolio sichten", "Passende Häuser auswählen", "Persönlich vorstellen"], q: ["Gibt es ein Portfolio?", "Welche Städte kommen infrage?"] },
    { id: "music", t: "Künstler braucht Label oder Release", ex: "Ein Rapper braucht ein Label und Musikvideos", a: ["Künstler & Labels", "Foto & Video"], d: [42, 120], cx: 2, h: "3–6", n: 3,
      k: ["label", "release", "musik", "rapper", "album", "single", "artist", "vertrieb musik", "song", "booking", "ep"],
      r: ["Labels", "Vertrieb", "Video"], s: ["Musik und Stand anhören", "Mit passenden Labels sprechen", "Release planen"], q: ["Gibt es schon Veröffentlichungen?", "Wie groß ist die Reichweite heute?"] },
    { id: "video", t: "Video, Foto, Kampagne", ex: "Wir brauchen Musikvideos für ein Release", a: ["Foto & Video"], d: [21, 56], cx: 2, h: "3–6", n: 6,
      k: ["video", "musikvideo", "film", "dreh", "content", "kampagne", "shooting", "reel", "foto", "imagefilm", "social"],
      r: ["Regie", "Kamera", "Schnitt"], s: ["Idee und Ablauf klären", "Team und Ort zusammenstellen", "Drehen, schneiden, abliefern"], q: ["Wofür wird es gebraucht?", "Gibt es einen festen Termin?"] },
    { id: "sponsor-event", t: "Sponsor für ein Event", ex: "Wir suchen einen Sponsor für unsere Convention", a: ["Sponsoring"], d: [30, 90], cx: 2, h: "2–4", n: 4,
      k: ["sponsor", "convention", "festival", "event", "messe", "veranstaltung", "geldgeber", "konferenz", "turnier"],
      r: ["Sponsoring-Vermittlung", "Eventplanung"], s: ["Publikum und Reichweite aufbereiten", "Passende Marken ansprechen", "Vertrag und Gegenleistung klären"], q: ["Wann findet es statt?", "Wie viele Besucher erwartet ihr?"] },
    { id: "sponsor", t: "Sponsoren für Projekt oder Künstler", ex: "Unser Verein sucht Sponsoren", a: ["Sponsoring"], d: [30, 90], cx: 2, h: "2–3", n: 3,
      k: ["sponsor", "verein", "sponsoring", "markenpartner", "kooperation", "unterstützer", "ausrüster"],
      r: ["Sponsoring-Vermittlung", "Marken"], s: ["Angebot für Marken bauen", "Gezielt ansprechen", "Abschluss begleiten"], q: ["Was bietet ihr einer Marke?", "Gab es schon Sponsoren?"] },
    { id: "public", t: "Förderung, Amt, Verwaltung", ex: "Unser Förderantrag hängt beim Amt fest", a: ["Strategie"], d: [45, 180], cx: 3, h: "2–4", n: 2,
      k: ["förder", "antrag", "amt", "behörde", "verwaltung", "genehmigung", "stadt", "öffentlich", "zuschuss", "ausschreibung", "kommune"],
      r: ["Partner mit Verwaltungskontakt", "Förderberatung"], s: ["Stand und Unterlagen prüfen", "Richtige Stelle und richtigen Weg finden", "Antrag oder Gespräch begleiten"], q: ["Um welche Stelle geht es?", "Gibt es eine Frist?"] },
    { id: "legal", t: "Vertrag oder Rechtsfrage", ex: "Wir haben eine Abmahnung bekommen", a: ["Weiß nicht"], d: [3, 21], cx: 2, h: "1–2", n: 3,
      k: ["vertrag", "anwalt", "abmahnung", "klage", "recht", "agb", "marke anmelden", "kündigung vertrag", "datenschutz", "dsgvo"],
      r: ["Partnerkanzleien"], s: ["Unterlagen sichten", "Passende Kanzlei verbinden", "Nächste Schritte festlegen"], q: ["Gibt es eine Frist?", "Liegt etwas Schriftliches vor?"] },
    { id: "money", t: "Kapital oder Investor", ex: "Wir suchen einen Investor", a: ["Strategie"], d: [60, 180], cx: 3, h: "2–4", n: 2,
      k: ["investor", "finanzierung", "kapital", "kredit", "liquidität", "geld fehlt", "beteiligung", "business angel", "finanz"],
      r: ["Finanzierung", "Investorenkontakte"], s: ["Zahlen und Bedarf klären", "Unterlagen für Gespräche aufbereiten", "Gezielte Gespräche einfädeln"], q: ["Wie viel wird gebraucht?", "Wofür genau?"] },
    { id: "hire", t: "Die richtigen Leute finden", ex: "Wir finden keine guten Entwickler", a: ["Organisation"], d: [21, 70], cx: 2, h: "2–3", n: 3,
      k: ["personal", "mitarbeiter finden", "recruiting", "fachkräfte", "stelle", "bewerber", "entwickler finden", "einstellen", "freelancer"],
      r: ["Recruiting", "Netzwerk-Empfehlungen"], s: ["Profil schärfen", "Im Netzwerk gezielt fragen", "Kennenlernen einfädeln"], q: ["Fest oder auf Zeit?", "Bis wann?"] },
    { id: "crisis", t: "Ruf, Presse, Krise", ex: "Ein Shitstorm schadet unserem Ruf", a: ["Strategie", "Foto & Video"], d: [2, 21], cx: 3, h: "2–4", n: 2, urgent: true,
      k: ["shitstorm", "krise", "presse", "ruf", "bewertungen", "schlechte bewertung", "image schaden", "journalist", "negativ"],
      r: ["Krisenkommunikation", "Presse", "Recht"], s: ["Lage ruhig einschätzen", "Eine klare Linie festlegen", "Kommunizieren und beobachten"], q: ["Wo läuft es gerade?", "Seit wann?"] },
    { id: "space", t: "Ort, Räume, Location", ex: "Wir brauchen kurzfristig eine Location", a: ["Weiß nicht"], d: [7, 42], cx: 1, h: "1–3", n: 3,
      k: ["location", "raum", "räume", "halle", "büro", "studio", "atelier", "proberaum", "lager"],
      r: ["Immobilien-Kontakte", "Eventplanung"], s: ["Bedarf klären", "Passende Orte im Netzwerk erfragen", "Besichtigung einfädeln"], q: ["Welche Stadt?", "Ab wann und wie lange?"] },
  ];
  const GENERIC = { id: "open", t: "Dein Anliegen", a: ["Weiß nicht"], d: [7, 35], cx: 2, h: "2–5", n: 0,
    r: ["Wir hören uns im Netzwerk um"], s: ["Kurzes Gespräch, um es zu verstehen", "Die richtigen Leute im Netzwerk finden", "Lösung gemeinsam umsetzen"], q: ["Was ist das Ziel?", "Bis wann soll es gelöst sein?"] };

  const SITE = [
    { t: "Startseite", u: "index.html", k: ["start", "home", "überblick"] },
    { t: "Manifest", d: "Wofür wir stehen. Die drei Affen.", u: "manifest.html", k: ["manifest", "werte", "regeln", "drei affen", "diskretion", "prinzip", "wer seid"] },
    { t: "Netzwerk", d: "Über 1.000 Köpfe aus mehr als 18 Branchen.", u: "netzwerk.html", k: ["netzwerk", "köpfe", "branchen", "kontakte", "mitmachen", "teil werden", "verwaltung"] },
    { t: "Leistungen", d: "Elf Felder, in denen wir selbst arbeiten.", u: "leistungen.html", k: ["leistung", "angebot", "service", "was macht", "können"] },
    { t: "Projekte", d: "Geschwärzte Akten. Gelöste Fälle.", u: "projekte.html", k: ["projekt", "akten", "fälle", "referenz", "beispiele", "convention"] },
    { t: "Partner", d: "Galerien, Künstler, Labels und Sponsoren.", u: "partner.html", k: ["partner", "galerie", "künstler", "label", "sponsor"] },
    { t: "Anfrage", d: "Problem schildern. Ein Satz reicht.", u: "anfrage.html", k: ["anfrage", "kontakt", "schreiben", "mail", "sondercode", "code", "budget", "termin"] },
    { t: "Impressum", u: "impressum.html", k: ["impressum", "adresse", "anbieter"] },
    { t: "Datenschutz", u: "datenschutz.html", k: ["datenschutz", "daten", "dsgvo", "cookies"] },
  ];
  (window.NETWORK ? NETWORK.inner : []).forEach((n) => SITE.push({ t: n.l, d: "Leistung", u: "leistungen.html#" + n.slug, k: [n.l.toLowerCase(), ...n.k.slice(0, 5)] }));

  const URGENT = ["dringend", "sofort", "asap", "eilig", "notfall", "heute noch", "bis morgen", "morgen", "schnellstens", "akut", "gestern"];
  const NOBUDGET = ["kein budget", "kein geld", "ohne budget", "ohne geld", "knapp bei kasse", "wenig geld", "kaum budget", "kaum geld", "wenig budget", "kleines budget", "kostenlos", "umsonst"];
  const SECRET = ["diskret", "vertraulich", "anonym", "geheim", "niemand wissen", "unter uns"];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = (s) => " " + String(s).toLowerCase().replace(/[„“"!?.,;:()]/g, " ").replace(/\s+/g, " ") + " ";
  const has = (t, k) => (k.length <= 3 ? new RegExp(`(^|[^a-zäöüß])${k}([^a-zäöüß]|$)`).test(t) : t.includes(k));
  const any = (t, list) => list.some((k) => has(t, k));

  function score(t, c) {
    let s = 0;
    c.k.forEach((k) => { if (has(t, k)) s += k.includes(" ") ? 3 : k.length > 5 ? 2 : 1.5; });
    if (has(t, c.t.toLowerCase())) s += 4;
    return s;
  }

  function assess(text) {
    const t = norm(text);
    const ranked = CASES.map((c) => ({ c, s: score(t, c) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
    const top = ranked[0];
    const extra = top ? ranked.slice(1).filter((x) => x.s >= top.s * .4 && x.c.a.join() !== top.c.a.join()).slice(0, 2) : [];
    const c = top ? top.c : GENERIC;
    const areas = [...new Set([c, ...extra.map((x) => x.c)].flatMap((x) => x.a))];
    const urgent = any(t, URGENT) || !!c.urgent;
    let [lo, hi] = c.d;
    hi = Math.round(hi * (1 + extra.length * .3));
    const cx = Math.min(3, c.cx + (extra.length >= 2 || areas.length > 3 ? 1 : 0));
    const words = String(text).trim().split(/\s+/).length;
    const conf = !top ? 0 : top.s >= 4 && words >= 4 ? 3 : top.s >= 2 ? 2 : 1;
    const roles = [...new Set([c, ...extra.map((x) => x.c)].flatMap((x) => x.r))].slice(0, 5);
    const n = top ? c.n + extra.reduce((a, x) => a + Math.round(x.c.n / 2), 0) : 0;
    const notes = [];
    if (urgent) notes.push("Eilt? Wir ziehen es vor. Erste Schritte oft schon am selben Tag.");
    if (any(t, NOBUDGET)) notes.push("Wenig Budget heißt nicht keine Lösung: Sponsoring, Förderung oder Partner sind oft ein Weg.");
    if (any(t, SECRET)) notes.push("Läuft vollständig unter Verschluss. Namen bleiben geschwärzt.");
    if (words < 4) notes.push("Mit ein, zwei Sätzen mehr wird die Einschätzung genauer.");
    return { text, case: c, matched: !!top, also: extra.map((x) => x.c), areas, urgent, lo, hi, cx, conf, roles, n, notes };
  }

  const span = (lo, hi) => {
    const f = (d) => (d < 14 ? d + (d === 1 ? " Tag" : " Tage") : Math.round(d / 7) + " Wochen");
    if (hi < 14) return `${lo}–${hi} Tage`;
    if (lo >= 14) return `${Math.round(lo / 7)}–${Math.round(hi / 7)} Wochen`;
    return `${f(lo)} bis ${f(hi)}`;
  };
  const CX = ["", "Überschaubar", "Mittel", "Hoch"];
  const CONF = ["Grobe Einschätzung", "Erste Einschätzung", "Gute Einschätzung", "Sehr gut einschätzbar"];

  function render(r, opts = {}) {
    const c = r.case;
    const head = r.matched
      ? `<h4>${esc(c.t)}${r.also.length ? ` <em>+ ${r.also.map((x) => esc(x.t)).join(", ")}</em>` : ""}</h4>`
      : `<h4>Kein bekanntes Muster. <em>Genau dafür gibt es uns.</em></h4>`;
    const take = opts.take || "";
    return `
      <div class="asx" data-cx="${r.cx}">
        <div class="asx__head">
          <span class="asx__tag mono">${r.urgent ? '<i class="asx__urg">Eilt</i>' : ""}Einschätzung · ${CONF[r.conf]}</span>
          ${head}
          <p>Für uns gibt es keine Probleme, nur Wege. So würde dieser aussehen:</p>
        </div>
        <div class="asx__kpis">
          <div class="asx__kpi"><span class="mono">Zeit bis zur Lösung</span><b>${span(r.lo, r.hi)}</b><small>${r.urgent ? "Erste Schritte sofort" : "Antwort innerhalb von 48 h"}</small></div>
          <div class="asx__kpi"><span class="mono">Aufwand</span><b>${CX[r.cx]}</b><i class="asx__lvl" aria-hidden="true">${[1, 2, 3].map((i) => `<span class="${i <= r.cx ? "on" : ""}"></span>`).join("")}</i></div>
          <div class="asx__kpi"><span class="mono">Im Netzwerk dran</span><b>${esc(c.h)} Köpfe</b><small>${r.roles.map(esc).join(" · ")}</small></div>
        </div>
        <div class="asx__cols">
          <div><span class="mono">So gehen wir vor</span><ol>${c.s.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>
          <div><span class="mono">Das hilft uns noch</span><ul>${c.q.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
        </div>
        ${r.notes.length ? `<ul class="asx__notes">${r.notes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        <div class="asx__foot">
          <span class="mono">${r.n ? `Basis: ${r.n} vergleichbare Aufgaben` : "Basis: allgemeine Erfahrungswerte"} · unverbindlich</span>
          ${take}
        </div>
      </div>`;
  }

  /* ---------- Vorschläge beim Tippen ---------- */
  function suggest(text, max = 5) {
    const t = norm(text);
    if (t.trim().length < 2) return CASES.filter((c) => ["web", "ki-support", "sponsor-event", "art-sell", "team"].includes(c.id));
    const words = t.trim().split(" ").filter((w) => w.length > 1);
    return CASES.map((c) => {
      let s = score(t, c);
      const hay = (c.t + " " + c.k.join(" ")).toLowerCase();
      words.forEach((w) => { if (hay.includes(w)) s += 1; });
      return { c, s };
    }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, max).map((x) => x.c);
  }
  function siteHits(text, max = 4) {
    const t = norm(text), words = t.trim().split(" ").filter((w) => w.length > 3);
    if (!words.length) return [];
    const min = words.length > 3 ? 2 : 1;
    return SITE.map((p) => {
      const hay = (p.t + " " + (p.d || "") + " " + p.k.join(" ")).toLowerCase();
      let s = 0; words.forEach((w) => { if (hay.includes(w)) s += 1; }); p.k.forEach((k) => { if (has(t, k)) s += 2; });
      return { p, s };
    }).filter((x) => x.s >= min).sort((a, b) => b.s - a.s).slice(0, max).map((x) => x.p);
  }

  // Dropdown an ein Eingabefeld hängen
  function attach(input, onPick) {
    if (!input || input.dataset.asx) return;
    input.dataset.asx = "1";
    input.setAttribute("autocomplete", "off");
    input.setAttribute("aria-autocomplete", "list");
    const box = document.createElement("div");
    box.className = "asx-sug";
    box.setAttribute("role", "listbox");
    const host = input.closest("form") || input.parentElement;
    host.classList.add("asx-host");
    host.appendChild(box);
    let items = [], idx = -1;
    const close = () => { box.classList.remove("is-on"); idx = -1; input.setAttribute("aria-expanded", "false"); };
    const paint = () => {
      const list = suggest(input.value);
      items = list;
      if (!list.length) return close();
      box.innerHTML = `<span class="asx-sug__h mono">${input.value.trim().length < 2 ? "Häufig gefragt" : "Klingt nach"}</span>` +
        list.map((c, i) => `<button type="button" role="option" data-i="${i}" class="${i === idx ? "is-sel" : ""}"><b>${esc(c.t)}</b><span class="mono">${span(c.d[0], c.d[1])}</span></button>`).join("");
      box.classList.add("is-on");
      input.setAttribute("aria-expanded", "true");
    };
    input.addEventListener("focus", paint);
    input.addEventListener("input", () => { idx = -1; paint(); });
    input.addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-on")) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); idx = (idx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; paint(); }
      else if (e.key === "Enter" && idx >= 0) { e.preventDefault(); pick(items[idx]); }
      else if (e.key === "Escape") close();
    });
    const pick = (c) => { if (!input.value.trim() || input.value.trim().length < 12) input.value = c.ex; close(); onPick(input.value); };
    box.addEventListener("mousedown", (e) => { const b = e.target.closest("button[data-i]"); if (!b) return; e.preventDefault(); pick(items[+b.dataset.i]); });
    input.addEventListener("blur", () => setTimeout(close, 120));
    host.addEventListener("submit", close);
  }

  /* ---------- Suche über die ganze Seite (⌘K, /) ---------- */
  function overlay() {
    const o = document.createElement("div");
    o.className = "asxo"; o.id = "assist"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Suche");
    o.innerHTML = `
      <div class="asxo__bg" data-close></div>
      <div class="asxo__panel">
        <form class="asxo__form" autocomplete="off">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
          <input type="text" placeholder="Problem beschreiben oder Seite suchen" maxlength="160" aria-label="Problem oder Suchbegriff" />
          <button type="button" class="asxo__x mono" data-close>Esc</button>
        </form>
        <div class="asxo__body">
          <div class="asxo__site"></div>
          <div class="asxo__out" aria-live="polite"><p class="asxo__hint mono">Ein Satz reicht. Wir sagen dir, wie wir es lösen würden.</p></div>
        </div>
      </div>`;
    document.body.appendChild(o);
    const input = o.querySelector("input"), form = o.querySelector("form"), out = o.querySelector(".asxo__out"), site = o.querySelector(".asxo__site");
    const run = (text) => {
      if (!text.trim()) return;
      const r = assess(text);
      out.innerHTML = render(r, { take: `<a class="probe__take" href="${takeUrl(r)}">Als Anfrage übernehmen →</a>` });
    };
    input.addEventListener("input", () => {
      const hits = siteHits(input.value);
      site.innerHTML = hits.length ? `<span class="mono">Auf der Seite</span>` + hits.map((p) => `<a href="${p.u}"><b>${esc(p.t)}</b>${p.d ? `<small>${esc(p.d)}</small>` : ""}<i>→</i></a>`).join("") : "";
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); run(input.value); });
    attach(input, run);
    const open = (v) => {
      o.classList.add("is-on"); document.documentElement.classList.add("asxo-open");
      if (window.lenisInstance) lenisInstance.stop();
      if (v) { input.value = v; run(v); }
      setTimeout(() => input.focus(), 30);
    };
    const close = () => { o.classList.remove("is-on"); document.documentElement.classList.remove("asxo-open"); if (window.lenisInstance) lenisInstance.start(); };
    o.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); o.classList.contains("is-on") ? close() : open(); }
      else if (e.key === "Escape" && o.classList.contains("is-on")) close();
    });
    document.addEventListener("click", (e) => { const b = e.target.closest("[data-assist-open]"); if (b) { e.preventDefault(); open(); } });
    return { open, close };
  }

  function takeUrl(r) {
    if (window.inquiryUrl) return inquiryUrl(r.text, r.areas.filter((a) => a !== "Weiß nicht"));
    return "anfrage.html?problem=" + encodeURIComponent(r.text);
  }

  window.ASSIST = { assess, render, suggest, attach, takeUrl, CASES };
  void overlay; // Seitenweite Suche (⌘K) ist aus: gesucht wird in den Feldern auf den Seiten
})();

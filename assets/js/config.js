/* =================================================================
   ThreeApesGroup — KONFIGURATION
   Alles, was du regelmäßig anpassen willst, steht in dieser Datei.
   ================================================================= */

// Sprache: Englisch im Hauptordner (Standard), Deutsch unter /de/ (gebaut mit _i18n/build_site.py)
window.LANG = document.documentElement.lang === "en" ? "en" : "de";
window.BASE = window.LANG === "de" ? "../" : "";
window.T = (s) => (window.LANG === "en" && window.EN_UI && window.EN_UI[s]) || s;

window.CONFIG = {
  // Sondercodes werden nur als Hash gespeichert, damit sie nicht im Klartext im Quelltext stehen.
  // Neuen Code anlegen: Seite öffnen, in der Browser-Konsole  TAG.hash("MEINCODE")  eingeben
  // und den ausgegebenen Wert hier eintragen.
  // HINWEIS: Das ist nur eine Hürde im Browser. Wirklich sicher wird es erst, wenn der Server den Code prüft.
  codes: {
    "rukz0g85fi":  { name: "Standard-Sondercode", unlock: ["budget", "partner"] },
    "1mc55xe1j4a": { name: "Partner-Code",        unlock: ["budget", "partner"] },
  },
  // Formular-Ziel: z. B. ein Formspree-Endpoint ("https://formspree.io/f/xxxxxx").
  // Leer = die Anfrage öffnet das Mailprogramm mit vorausgefüllter E-Mail.
  formEndpoint: "https://form.threeapesgroup.com/anfrage.php",
  mailTo: "kontakt@threeapesgroup.com",
};

/* -----------------------------------------------------------------
   NETZWERK — Knoten der Netzwerk-Grafik und Stichwörter für die Suche
   ("Teste das Netzwerk"). inner = eigene Leistungen, outer = Netzwerk-Partner.
   l = Name, s = Kurzname (Handy), k = Stichwörter (klein geschrieben, Wortanfänge reichen)
   slug = Anker auf leistungen.html, area = Wert im Anfrageformular
   ----------------------------------------------------------------- */
window.NETWORK = {
  inner: [
    { l: "Strategie",      s: "Strategie",  slug: "strategie",    area: "Strategie",          k: ["strategie", "wachstum", "markt", "umsatz", "expansion", "plan", "skalier", "neuausricht", "positionier"] },
    { l: "Organisation",   s: "Orga",       slug: "organisation", area: "Organisation",       k: ["prozess", "struktur", "organis", "chaos", "ablauf", "effizien", "team", "führung"] },
    { l: "IT",             s: "IT",         slug: "it",           area: "IT",                 k: ["it", "server", "cloud", "sicherheit", "hack", "daten", "netzwerk", "edv", "backup", "system"] },
    { l: "KI",             s: "KI",         slug: "ki",           area: "KI",                 k: ["ki", "ai", "künstlich", "chatbot", "gpt", "automatis", "agent", "llm", "support"] },
    { l: "Web & Software", s: "Web",        slug: "web",          area: "Web & Software",     k: ["web", "seite", "website", "homepage", "app", "software", "shop", "tool", "programm", "plattform"] },
    { l: "Coaching",       s: "Coaching",   slug: "coaching",     area: "Coaching",           k: ["coaching", "schulung", "workshop", "lernen", "training", "mindset", "mitarbeitende"] },
    { l: "Kunst",          s: "Kunst",      slug: "kunst",        area: "Kunst",              k: ["kunst", "gemälde", "galerie", "sammler", "werk", "ausstellung", "bild", "skulptur"] },
    { l: "Foto & Video",   s: "Video",      slug: "foto-video",   area: "Foto & Video",       k: ["foto", "video", "film", "dreh", "kamera", "content", "kampagne", "shooting", "reel"] },
    { l: "Labels",         s: "Labels",     slug: "labels",       area: "Künstler & Labels",  k: ["label", "musik", "release", "künstler", "artist", "song", "album", "rapper", "single"] },
    { l: "Sponsoring",     s: "Sponsoring", slug: "sponsoring",   area: "Sponsoring",         k: ["sponsor", "partner", "brand", "festival", "deal", "marke"] },
  ],
  outer: [
    { l: "Recht",       k: ["recht", "vertrag", "anwalt", "klage", "agb", "marke anmelden", "abmahnung"] },
    { l: "Steuern",     k: ["steuer", "finanzamt", "buchhaltung"] },
    { l: "Finanzen",    k: ["finanz", "invest", "kapital", "kredit", "geld", "förder"] },
    { l: "Marketing",   k: ["marketing", "werbung", "social", "reichweite", "ads", "kunden gewinnen", "leads", "sichtbar"] },
    { l: "Design",      k: ["design", "logo", "branding", "corporate", "grafik"] },
    { l: "Events",      k: ["event", "party", "konferenz", "messe", "location"] },
    { l: "Booking",     k: ["booking", "auftritt", "dj", "gig", "tour"] },
    { l: "Produktion",  k: ["produktion", "herstell", "merch", "druck"] },
    { l: "Immobilien",  k: ["immobilie", "büro", "wohnung", "fläche", "standort"] },
    { l: "Personal",    k: ["personal", "recruiting", "mitarbeiter", "hiring", "fachkräfte", "bewerber"] },
    { l: "Logistik",    k: ["logistik", "versand", "lager", "lieferung"] },
    { l: "Medien & PR", k: ["presse", "pr", "medien", "interview", "image", "krise"] },
    { l: "Investoren",  k: ["investor", "funding", "start-up", "startup", "pitch"] },
    { l: "Hardware",    k: ["hardware", "gerät", "technik", "iot"] },
    { l: "E-Commerce",  k: ["e-commerce", "amazon", "onlineshop", "verkaufen"] },
    { l: "Sound",       k: ["sound", "mix", "master", "studio", "audio"] },
  ],
};

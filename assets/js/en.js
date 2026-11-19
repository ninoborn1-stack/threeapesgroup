/* =================================================================
   ThreeApesGroup — English texts for the scripts
   Loaded only on /en/ pages, right after config.js.
   Page texts (HTML) live in _i18n/en.json.
   ================================================================= */
window.EN_UI = {
  // Menu, footer
  "Manifest": "Manifesto", "Netzwerk": "Network", "Leistungen": "Services", "Projekte": "Projects", "Partner": "Partners",
  "Anfrage": "Inquiry", "Start": "Home", "Sprache": "Language", "Hauptnavigation": "Main navigation",
  "Menü öffnen": "Open menu", "Menü schließen": "Close menu",
  "Berlin — diskret seit 2026": "Berlin — discreet since 2026",
  "Kontakt": "Contact", "Seiten": "Pages", "Rechtliches": "Legal", "Impressum": "Legal notice", "Datenschutz": "Privacy policy",
  "Wir antworten innerhalb von 24 Stunden, sieben Tage die Woche. Was du schreibst, bleibt bei uns.": "We reply within 24 hours, seven days a week. What you write stays with us.",
  "Wir sehen nichts. Wir lösen alles.": "We see nothing. We solve everything.",
  "Nach oben ↑": "Back to top ↑",
  // Form
  "✓ Code akzeptiert. Budgets unter 2.500 € und Partnerschaftsanfragen sind jetzt freigeschaltet.": "✓ Code accepted. Budgets under €2,500 and partnership inquiries are now unlocked.",
  "Aktiv": "Active",
  "Dieser Code ist uns nicht bekannt.": "We don't know this code.",
  "Dafür brauchst du einen Sondercode.": "You need a special code for this.",
  "Partnerschaften gibt es nur mit Sondercode.": "Partnerships are only available with a special code.",
  "gültige E-Mail": "a valid email", "Budgetrahmen": "budget range", "Einwilligung": "consent",
  "Bitte noch ergänzen: ": "Please add: ",
  "Das hat leider nicht geklappt. Bitte versuch es noch einmal oder schreib uns direkt.": "That didn't work. Please try again or email us directly.",
  "Zu viele Anfragen in kurzer Zeit. Bitte versuch es später noch einmal oder schreib uns direkt.": "Too many inquiries in a short time. Please try again later or email us directly.",
  // Probe / search
  "Ins Formular übernommen. Unten ergänzen und absenden.": "Added to the form. Complete it below and send.",
  "Als Anfrage übernehmen →": "Turn into an inquiry →",
  "1 passende Leistung": "1 matching service", " passende Leistungen": " matching services", " unten markiert ↓": " highlighted below ↓",
  "Dein Problem in einem Satz": "Your problem in one sentence",
  // Animations
  "Wer?": "Who?", "Kunde?": "Client?", "Name?": "Name?", "Wie viel?": "How much?", "Worum geht's?": "What's it about?",
  "Für wen?": "For whom?", "Was genau?": "What exactly?", "Wer noch?": "Who else?",
  "PROBLEM": "PROBLEM", "WEG": "WAY",
  // Assistant
  "Leistung": "Service",
  "Eilt? Wir ziehen es vor. Erste Schritte oft schon am selben Tag.": "Urgent? We move it up. First steps often the same day.",
  "Wenig Budget heißt nicht keine Lösung: Sponsoring, Förderung oder Partner sind oft ein Weg.": "A small budget doesn't mean no solution: sponsorship, funding or partners are often a way.",
  "Läuft vollständig unter Verschluss. Namen bleiben geschwärzt.": "Runs fully under wraps. Names stay redacted.",
  "Mit ein, zwei Sätzen mehr wird die Einschätzung genauer.": "One or two more sentences make the assessment sharper.",
  "Überschaubar": "Manageable", "Mittel": "Medium", "Hoch": "High",
  "Grobe Einschätzung": "Rough estimate", "Erste Einschätzung": "First estimate", "Gute Einschätzung": "Good estimate", "Sehr gut einschätzbar": "Very clear estimate",
  "Kein bekanntes Muster.": "No known pattern.", "Genau dafür gibt es uns.": "That's exactly what we're for.",
  "Eilt": "Urgent", "Einschätzung": "Assessment",
  "Für uns gibt es keine Probleme, nur Wege. So würde dieser aussehen:": "For us there are no problems, only ways. This is what this one would look like:",
  "Zeit bis zur Lösung": "Time to solution", "Erste Schritte sofort": "First steps right away", "Antwort innerhalb von 24 h": "Reply within 24 h",
  "Aufwand": "Effort", "Im Netzwerk dran": "On it in the network", "Köpfe": "minds",
  "So gehen wir vor": "How we'd approach it", "Das hilft uns noch": "What else helps us",
  "Basis:": "Based on", "vergleichbare Aufgaben": "comparable tasks", "Basis: allgemeine Erfahrungswerte": "Based on general experience", "unverbindlich": "non-binding",
  "Häufig gefragt": "Often asked", "Klingt nach": "Sounds like",
};

/* Network graphic: English labels; area/slug stay German (form values) */
(function () {
  if (!window.NETWORK) return;
  const L = {
    "Strategie": ["Strategy", "Strategy", ["strategy", "growth", "market", "revenue", "expansion", "scale", "positioning"]],
    "Organisation": ["Organization", "Org", ["process", "structure", "organization", "chaos", "workflow", "efficien", "leadership"]],
    "IT": ["IT", "IT", ["it support", "it problem", "server", "cloud", "security", "hacked", "data", "backup", "system"]],
    "KI": ["AI", "AI", ["ai", "artificial", "chatbot", "automat", "agent", "llm", "support"]],
    "Web & Software": ["Web & Software", "Web", ["web", "website", "homepage", "app", "software", "shop", "tool", "platform"]],
    "Coaching": ["Coaching", "Coaching", ["coaching", "training", "workshop", "learning", "mindset", "employees"]],
    "Kunst": ["Art", "Art", ["art", "painting", "gallery", "collector", "artwork", "exhibition", "sculpture"]],
    "Foto & Video": ["Photo & Video", "Video", ["photo", "video", "film", "shoot", "camera", "content", "campaign", "reel"]],
    "Labels": ["Labels", "Labels", ["label", "music", "release", "artist", "song", "album", "rapper", "single"]],
    "Sponsoring": ["Sponsorship", "Sponsors", ["sponsor", "partner", "brand", "festival", "deal"]],
    "Recht": ["Legal", "", ["legal", "contract", "lawyer", "lawsuit", "terms", "trademark", "cease and desist"]],
    "Steuern": ["Tax", "", ["tax", "accounting", "bookkeeping"]],
    "Finanzen": ["Finance", "", ["finance", "invest", "capital", "loan", "money", "funding"]],
    "Marketing": ["Marketing", "", ["marketing", "advertising", "social", "reach", "ads", "leads", "visibility"]],
    "Design": ["Design", "", ["design", "logo", "branding", "graphic"]],
    "Events": ["Events", "", ["event", "party", "conference", "trade fair", "venue"]],
    "Booking": ["Booking", "", ["booking", "gig", "dj", "tour", "show"]],
    "Produktion": ["Production", "", ["production", "manufactur", "merch", "print"]],
    "Immobilien": ["Real estate", "", ["real estate", "office", "apartment", "space", "location"]],
    "Personal": ["Hiring", "", ["hiring", "recruiting", "staff", "talent", "candidates"]],
    "Logistik": ["Logistics", "", ["logistics", "shipping", "warehouse", "delivery"]],
    "Medien & PR": ["Media & PR", "", ["press", "pr", "media", "interview", "image", "crisis"]],
    "Investoren": ["Investors", "", ["investor", "funding", "start-up", "startup", "pitch"]],
    "Hardware": ["Hardware", "", ["hardware", "device", "tech", "iot"]],
    "E-Commerce": ["E-commerce", "", ["e-commerce", "amazon", "online shop", "selling"]],
    "Sound": ["Sound", "", ["sound", "mix", "master", "studio", "audio"]],
  };
  [...NETWORK.inner, ...NETWORK.outer].forEach((n) => {
    const e = L[n.l]; if (!e) return;
    n.l = e[0]; if (e[1]) n.s = e[1];
    n.k = [...e[2], ...n.k].filter((x) => x !== "it"); // englisches "it" ist kein IT
  });
})();

/* Problem assistant: texts per case (numbers and German keywords stay in assist.js) */
window.ASSIST_EN = {
  generic: { t: "Your request", r: ["We ask around in the network"], s: ["A short call to understand it", "Find the right people in the network", "Implement the solution together"], q: ["What's the goal?", "By when should it be solved?"] },
  site: [
    { t: "Home", u: "index.html", k: ["home", "start", "overview"] },
    { t: "Manifesto", d: "What we stand for. The three apes.", u: "manifest.html", k: ["manifesto", "values", "rules", "three apes", "discretion", "principle", "who are you"] },
    { t: "Network", d: "Over 150 minds from more than 15 industries.", u: "netzwerk.html", k: ["network", "minds", "industries", "contacts", "join", "become part", "public sector"] },
    { t: "Services", d: "Eleven fields we work in ourselves.", u: "leistungen.html", k: ["service", "offer", "what do you do", "capabilities"] },
    { t: "Projects", d: "Redacted files. Solved cases.", u: "projekte.html", k: ["project", "files", "cases", "references", "examples", "convention"] },
    { t: "Partners", d: "Bunkerwest, sponsorship and cultural funding.", u: "partner.html", k: ["partner", "gallery", "artist", "label", "sponsor"] },
    { t: "Inquiry", d: "Describe your problem. One sentence is enough.", u: "anfrage.html", k: ["inquiry", "contact", "write", "mail", "special code", "code", "budget", "appointment"] },
    { t: "Legal notice", u: "impressum.html", k: ["legal notice", "imprint", "address", "provider"] },
    { t: "Privacy policy", u: "datenschutz.html", k: ["privacy", "data", "gdpr", "cookies"] },
  ],
  cases: {
    "web": { t: "Website brings no clients", ex: "Our website brings in no clients", r: ["Web development", "Copy & offer", "SEO"], s: ["Review the site and numbers within days", "Sharpen the offer, copy and paths to inquiry", "Rebuild, measure, refine"], q: ["Where do your visitors come from today?", "What should a visitor do in the end?"], k: ["website", "homepage", "no clients", "no customers", "no inquiries", "no leads", "visibility", "google", "seo", "conversion", "landing page"] },
    "shop": { t: "Online shop isn't selling", ex: "Our online shop isn't selling", r: ["Shop development", "Performance marketing", "Product photos"], s: ["Check shop, prices and checkout", "Fix the biggest blocker first", "Build reach in a targeted way"], q: ["Which shop system do you use?", "How many visitors per month?"], k: ["shop", "online shop", "e-commerce", "cart", "not selling", "no sales", "orders", "products online"] },
    "app": { t: "Build software or an app", ex: "We need our own app", r: ["Product development", "Design", "Backend"], s: ["Set the goal and the smallest sensible scope", "Build a clickable prototype", "Develop and ship in stages"], q: ["Is there something it should replace?", "Who will use it in the end?"], k: ["app", "software", "tool", "platform", "program", "develop", "build", "mvp", "portal", "customer portal", "interface", "api"] },
    "ki-support": { t: "AI in customer support", ex: "We want to use AI in support", r: ["AI development", "Process consulting"], s: ["Analyze the most frequent requests", "Set up an assistant with your content", "Test in real operation and hand over"], q: ["How many requests come in per week?", "Through which channels?"], k: ["ai", "chatbot", "gpt", "llm", "support", "customer requests", "drowning", "tickets", "answer requests", "artificial"] },
    "auto": { t: "Automate workflows", ex: "Too much manual work in our processes", r: ["Automation", "AI development", "Organization"], s: ["Find the three biggest time sinks", "Automate where it pays off", "Train the team"], q: ["Which programs do you use daily?", "How many people are affected?"], k: ["automat", "manual", "by hand", "excel", "time sink", "workflow", "duplicate", "copying", "agent"] },
    "hack": { t: "IT emergency", ex: "Server hacked, data gone", r: ["IT security", "Forensics", "Legal"], s: ["Contain and secure the damage", "Restore systems", "Close the gap so it doesn't happen again"], q: ["Since when has the problem existed?", "Is there a current backup?"], k: ["hacked", "hack", "attack", "virus", "ransomware", "trojan", "data gone", "server down", "outage", "phishing", "extortion", "encrypted"] },
    "it": { t: "Rebuild your IT", ex: "Our IT is outdated and insecure", r: ["IT administration", "IT security"], s: ["Take stock", "Plan with priorities", "Switch over without downtime"], q: ["How many workstations?", "Is there anyone in-house for IT?"], k: ["server", "cloud", "backup", "network", "microsoft", "outdated", "insecure", "our it", "it support", "email", "computers", "security"] },
    "growth": { t: "Growth has stalled", ex: "Our revenue has stopped growing", r: ["Strategy", "Sales", "Marketing"], s: ["Look honestly at numbers and market", "Set two or three clear levers", "Implement and support"], q: ["Since when has it stalled?", "What have you tried already?"], k: ["growth", "grow", "stagnat", "stalled", "revenue", "market", "expansion", "scale", "new clients", "new customers", "sales", "realign"] },
    "brand": { t: "Sharpen brand and presence", ex: "Our brand feels interchangeable", r: ["Brand strategy", "Design", "Photo & Video"], s: ["Clarify the core of the brand", "Design the presence", "Roll out across all channels"], q: ["Who do you want to reach?", "What should stay, what can go?"], k: ["brand", "positioning", "branding", "presence", "image", "logo", "rebrand", "interchangeable", "identity"] },
    "org": { t: "Structure and processes", ex: "Nobody here is responsible for anything", r: ["Organizational consulting", "Processes"], s: ["Talk to the people involved", "Define clear roles and processes", "Introduce and fine-tune"], q: ["How big is the team?", "Where does it get stuck most?"], k: ["chaos", "structure", "process", "processes", "organization", "responsible", "efficien", "mess", "overloaded", "overwhelmed"] },
    "team": { t: "Team in crisis", ex: "Our team is falling apart", r: ["Coaching", "Mediation", "Leadership"], s: ["Confidential one-on-ones", "A joint session with clear rules", "Support over a few weeks"], q: ["How many people are affected?", "Was there a trigger?"], k: ["team", "conflict", "quit", "resign", "morale", "falling apart", "fight", "turnover", "employees", "motivation"] },
    "coach": { t: "Leadership and training", ex: "Our managers need coaching", r: ["Coaching", "Training"], s: ["Clarify the goal", "Tailor the format", "Run it and follow up"], q: ["For how many people?", "On site or online?"], k: ["coaching", "training", "workshop", "leadership", "managers", "learning", "mindset", "upskill"] },
    "art-sell": { t: "Sell an artwork discreetly", ex: "An artwork needs to be sold discreetly", r: ["Art dealing", "Collector contacts", "Appraisal"], s: ["Have the work appraised", "Quietly approach the right collectors", "Close the sale without a public trace"], q: ["Are there provenance papers?", "Is there a price range?"], k: ["artwork", "painting", "sculpture", "collector", "estate", "sell art", "sell a painting", "sell discreetly"] },
    "art-show": { t: "Find an exhibition or gallery", ex: "I'm looking for a gallery for my work", r: ["Galleries", "Curators"], s: ["Review the portfolio", "Select the right houses", "Introduce you in person"], q: ["Is there a portfolio?", "Which cities are an option?"], k: ["exhibition", "gallery", "exhibit", "curator", "opening", "artist", "painting"] },
    "music": { t: "Artist needs a label or release", ex: "A rapper needs a label and music videos", r: ["Labels", "Distribution", "Video"], s: ["Listen to the music and where it stands", "Talk to the right labels", "Plan the release"], q: ["Any releases yet?", "How big is the reach today?"], k: ["label", "release", "music", "rapper", "album", "single", "artist", "distribution", "song", "booking", "ep"] },
    "video": { t: "Video, photo, campaign", ex: "We need music videos for a release", r: ["Direction", "Camera", "Editing"], s: ["Clarify idea and schedule", "Put together team and location", "Shoot, edit, deliver"], q: ["What is it for?", "Is there a fixed date?"], k: ["video", "photo", "film", "shoot", "music video", "campaign", "content", "reel", "camera"] },
    "sponsor-event": { t: "Sponsor for an event", ex: "We're looking for a sponsor for our convention", r: ["Sponsorship brokering", "Event planning"], s: ["Prepare audience and reach", "Approach the right brands", "Settle contract and return"], q: ["When does it take place?", "How many visitors do you expect?"], k: ["sponsor", "event", "convention", "festival", "conference", "main sponsor"] },
    "sponsor": { t: "Sponsors for a project or artist", ex: "Our association is looking for sponsors", r: ["Sponsorship brokering", "Brands"], s: ["Build an offer for brands", "Approach them in a targeted way", "Support the closing"], q: ["What do you offer a brand?", "Have you had sponsors before?"], k: ["sponsor", "sponsors", "sponsorship", "brand partner", "association", "club", "funding"] },
    "public": { t: "Funding, authorities, administration", ex: "Our funding application is stuck with the authorities", r: ["Partners with public-sector contacts", "Funding advice"], s: ["Check status and documents", "Find the right office and the right route", "Support the application or meeting"], q: ["Which office is it about?", "Is there a deadline?"], k: ["funding", "grant", "authority", "authorities", "office", "permit", "administration", "application", "public sector", "government"] },
    "legal": { t: "Contract or legal question", ex: "We received a cease-and-desist letter", r: ["Partner law firms"], s: ["Review the documents", "Connect the right law firm", "Set the next steps"], q: ["Is there a deadline?", "Is there anything in writing?"], k: ["legal", "contract", "lawyer", "lawsuit", "cease and desist", "warning letter", "terms", "trademark"] },
    "money": { t: "Capital or investor", ex: "We're looking for an investor", r: ["Financing", "Investor contacts"], s: ["Clarify numbers and needs", "Prepare documents for talks", "Set up targeted conversations"], q: ["How much is needed?", "For what exactly?"], k: ["investor", "capital", "funding", "financing", "loan", "money", "raise", "pitch"] },
    "hire": { t: "Find the right people", ex: "We can't find good developers", r: ["Recruiting", "Network referrals"], s: ["Sharpen the profile", "Ask around the network in a targeted way", "Arrange introductions"], q: ["Permanent or temporary?", "By when?"], k: ["hire", "hiring", "recruit", "developers", "staff", "talent", "candidates", "employees"] },
    "crisis": { t: "Reputation, press, crisis", ex: "A shitstorm is hurting our reputation", r: ["Crisis communication", "Press", "Legal"], s: ["Assess the situation calmly", "Set one clear line", "Communicate and monitor"], q: ["Where is it happening right now?", "Since when?"], k: ["shitstorm", "reputation", "press", "crisis", "scandal", "media", "bad reviews"] },
    "space": { t: "Place, rooms, location", ex: "We need a location at short notice", r: ["Real estate contacts", "Event planning"], s: ["Clarify the need", "Ask around the network for the right places", "Arrange a viewing"], q: ["Which city?", "From when and for how long?"], k: ["location", "venue", "space", "room", "office", "short notice"] },
  },
};

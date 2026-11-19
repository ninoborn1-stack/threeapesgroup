"""Baut die deutschen Unterseiten nach _src/ (Startseite _src/index.html wird von Hand gepflegt).
Danach: python3 _i18n/build_site.py  ->  Englisch im Hauptordner, Deutsch unter de/
"""
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(os.path.dirname(HERE), "_src")   # deutsche Quellseiten; daraus baut _i18n/build_site.py die Website
V = "40"
FORM = open(os.path.join(HERE, "partials", "form.html")).read()

U = lambda pid, w=1200: f"https://images.unsplash.com/{pid}?w={w}&q=75"

def page(fname, title, desc, body, net=False):
    html = f'''<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content="{desc}" />
  <meta name="theme-color" content="#012B1D" />
  <link rel="icon" href="assets/img/emblem.webp" />
  <script>try{{if(sessionStorage.getItem("tag-pt")==="1")document.documentElement.classList.add("pt-in")}}catch(e){{}}</script>
  <link rel="stylesheet" href="assets/css/fonts.css?v={V}" />
  <link rel="stylesheet" href="assets/css/style.css?v={V}" />
</head>
<body>
  <div class="pt" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="grain" aria-hidden="true"></div>
  <div data-include="nav"></div>

  <main id="top">
{body}
  </main>

  <div data-include="footer"></div>

  <script src="assets/js/config.js?v={V}"></script>
  <script src="assets/js/layout.js?v={V}"></script>
  <script src="assets/vendor/gsap.min.js"></script>
  <script src="assets/vendor/ScrollTrigger.min.js"></script>
  <script src="assets/vendor/lenis.min.js"></script>
  <script src="assets/js/network.js?v={V}"></script>
  <script src="assets/js/assist.js?v={V}"></script>
  <script src="assets/js/main.js?v={V}"></script>
</body>
</html>
'''
    open(os.path.join(ROOT, fname), "w").write(html)

def phero(label, lines, lead, art, bg, actions="", facts="", short=False):
    ls = "\n".join(f'          <span class="line"><span class="line__inner">{l}</span></span>' for l in lines)
    f = f'<div class="phero__facts mono">{facts}</div>' if facts else ""
    return f'''    <section class="phero{' phero--short' if short else ''}">
      <div class="phero__bg" aria-hidden="true">{bg}</div>
      <div class="phero__main">
        <p class="label">{label}</p>
        <h1 class="phero__title">
{ls}
        </h1>
        <p class="phero__lead">{lead}</p>
        {f'<div class="phero__actions">{actions}</div>' if actions else ''}
        {f}
      </div>
      <div class="phero__aside" aria-hidden="true">
        {art}
      </div>
    </section>
'''

ART_WAY = '''<svg class="phero__way" id="waySvg" viewBox="0 0 400 320" aria-hidden="true"></svg>'''
ART_EYE = '''<svg class="phero__art" viewBox="0 0 400 300">
          <path d="M20 150 Q200 10 380 150 Q200 290 20 150 Z" />
          <circle cx="200" cy="150" r="62" class="pa-peach" />
          <circle cx="200" cy="150" r="24" />
          <path d="M40 270 L360 30" class="pa-peach" />
          <path d="M200 10 L200 40 M200 260 L200 290 M10 150 L40 150 M360 150 L390 150" class="pa-steel" />
        </svg>'''
ART_NET = '''<svg class="phero__dots" data-morph="scatter,nodes,talk,organisation,check" data-cap="Ein Netzwerk|Ein Kontakt|Ein Gespräch|Die richtigen Leute|Gelöst" data-links viewBox="0 0 400 320" aria-hidden="true"></svg>'''
ART_GRID = '''<svg class="phero__dots" data-morph="strategie,ki,web,kunst,foto-video,labels,sponsoring" data-cap="Strategie|KI|Web &amp; Software|Kunst|Foto &amp; Video|Künstler &amp; Labels|Sponsoring" viewBox="0 0 400 320" aria-hidden="true"></svg>'''
ART_FILE = '''<svg class="phero__art" viewBox="0 0 400 300">
          <path d="M70 20 L270 20 L330 80 L330 290 L70 290 Z" />
          <path d="M270 20 L270 80 L330 80" />
          <line x1="100" y1="120" x2="300" y2="120" class="pa-steel" /><line x1="100" y1="150" x2="300" y2="150" class="pa-steel" /><line x1="100" y1="180" x2="240" y2="180" class="pa-steel" />
          <path d="M100 135 L230 135" class="pa-peach" style="stroke-width:14" /><path d="M150 195 L290 195" class="pa-peach" style="stroke-width:14" />
          <rect x="190" y="225" width="120" height="44" class="pa-peach" transform="rotate(-10 250 247)" />
        </svg>'''
ART_HAND = '''<svg class="phero__dots" data-morph="kunst,labels,sponsoring,vermittlung" data-cap="Kunst|Künstler &amp; Labels|Sponsoring|Zusammengebracht" viewBox="0 0 400 320" aria-hidden="true"></svg>'''
ART_FORM = '''<svg class="phero__art" viewBox="0 0 400 300">
          <path d="M200 20 L370 280 L30 280 Z" />
          <path d="M200 80 L320 260 L80 260 Z" class="pa-steel" />
          <path d="M140 200 L185 240 L265 150" class="pa-peach" style="stroke-width:5" />
        </svg>'''

AREAS = ["Strategie","Organisation","IT","KI","Web &amp; Software","Coaching","Kunst","Foto &amp; Video","Labels","Booking","Sponsoring","Recht","Finanzen","Events","Förderung","Öffentliche Hand"]
AREA_ROW = "".join(f"<span>{x}</span><i>✦</i>" for x in AREAS)

COOP = """
      <div class="coop" style="margin-top:0;padding-top:0;border-top:0">
        <div class="coop__text">
          <p class="label">Bis in die Verwaltung</p>
          <h3 class="h2">Kontakt bis in die <em class="serif">Verwaltungsebene</em>.</h3>
        </div>
        <div class="coop__cards">
          <article class="coop__card"><div class="coop__top"><span class="mono">Ebene 01</span><svg data-icon="organisation"></svg></div><b class="coop__name">Verwaltung</b><p>Der kurze Weg zu Ämtern und Behörden.</p></article>
          <article class="coop__card"><div class="coop__top"><span class="mono">Ebene 02</span><svg data-icon="sponsoring"></svg></div><b class="coop__name">Förderung</b><p>Programme, Anträge und die Menschen, die sie kennen.</p></article>
          <article class="coop__card"><div class="coop__top"><span class="mono">Ebene 03</span><svg data-icon="shield"></svg></div><b class="coop__name">Öffentliche Hand</b><p>Projekte mit öffentlichen Auftraggebern.</p></article>
        </div>
        <!-- PLATZHALTER: Partnerunternehmen prüfen -->
        <p class="coop__via mono"><span>Wir arbeiten zusammen mit</span><b>cnode</b><i>✦</i><b>Zulano Gruppe</b><em>pre-incubated</em></p>
      </div>
"""

CROWD = """
    <section class="principles" style="padding-bottom:60px">
      <div class="crowd" style="margin-bottom:0">
        <div class="crowd__text">
          <p class="label">02 — Wer wir sind</p>
          <h2 class="h2 crowd__title">Wir sind <em class="serif">alle</em>.</h2>
          <p class="lead">Von außen siehst du drei Affen. Darin steckt jeder, den es für die Lösung braucht. Jede Disziplin, jede Branche, jede Ebene. Wer mit uns spricht, spricht mit allen.</p>
        </div>
        <div class="crowd__art">
          <svg id="crowdSvg" data-dots="mid" viewBox="0 0 600 620" aria-hidden="true"></svg>
        </div>
      </div>
    </section>
"""

def cta(title_html, text, btn="Problem schildern", href="anfrage.html"):
    return f'''    <section class="cta-band">
      <p class="label">Nächster Schritt</p>
      <h2 class="h2">{title_html}</h2>
      <p>{text}</p>
      <a href="{href}" class="btn btn--peach btn--xl">{btn} <span class="btn__arrow">→</span></a>
    </section>
'''

# =================================================================
# MANIFEST
# =================================================================
MANI_HERO = """
    <section class="principles principles--hero">
      <div class="crowd" style="margin-bottom:0">
        <div class="crowd__text">
          <p class="label">Manifest</p>
          <h1 class="h2 crowd__title">Wir sind <em class="serif">alle</em>.</h1>
          <p class="lead">Von außen siehst du drei Affen. Darin steckt jeder, den es für die Lösung braucht. Jede Disziplin, jede Branche, jede Ebene. Wer mit uns spricht, spricht mit allen.</p>
          <div class="phero__actions" style="margin-top:34px"><a href="anfrage.html" class="btn btn--peach">Problem schildern <span class="btn__arrow">→</span></a><a href="#regeln" class="btn btn--ghost">Die drei Affen</a></div>
        </div>
        <div class="crowd__art">
          <svg id="crowdSvg" data-dots="mid" data-dots-intro viewBox="0 0 600 620" aria-hidden="true"></svg>
        </div>
      </div>
    </section>
"""
MANI_02 = phero("02 — Keine Probleme", ["Keine Probleme.", 'Nur <em class="serif">Wege</em>.'],
    "Für uns gibt es keine Probleme. Es gibt nur Lösungen und die Wege dorthin. Die finden wir, schnell, in jedem Bereich und mit absoluter Diskretion.",
    ART_WAY, "SEE NO", facts="<span>Schnell</span><span>In jedem Bereich</span><span>Absolut diskret</span>").replace('<h1 class="phero__title">','<h2 class="phero__title">').replace('</h1>','</h2>').replace('class="phero"','class="phero phero--inline"')
manifest = MANI_HERO
manifest += f'''

    <section class="section section--deep">
      <div class="section__head section__head--split">
        <p class="label">01 — Die Idee</p>
        <h2 class="h2 reveal-words">Wir schauen nicht weg. Wir schauen auf den Weg.</h2>
        <p class="lead">Drei Affen: nichts sehen, nichts hören, nichts sagen. Die meisten kennen das als Wegschauen. Für uns heißt es: Wir sehen kein Problem. Wir sehen nur den Weg zur Lösung und die Menschen, die ihn gehen können.</p>
      </div>
      <div class="protocol" style="padding:0;background:none">
        <div class="protocol__text">
          <p class="lead" data-reveal>Du musst uns nicht erklären, wie deine Branche funktioniert. Du musst uns keine Vorgeschichte erzählen und niemanden beschuldigen. Ein Satz reicht: <b style="color:var(--paper)">Was soll am Ende stehen?</b></p>
          <p class="lead" data-reveal style="margin-top:22px">Den Rest erledigt ein Netzwerk aus Entwicklern, Strategen, Kreativen, Juristen, Künstlern und Labels. Jeder sieht nur seinen Teil. Das Ganze sieht nur einer: wir.</p>
        </div>
        <div class="protocol__doc">
          <div class="protocol__top mono"><span>Was wir wissen</span><span>Was nicht</span></div>
          <h3>Ein typisches Briefing</h3>
          <ol>
            <li><span>Ziel: Der Support soll wieder hinterherkommen.</span></li>
            <li><span>Firma: <span class="redact">Name und Ort bleiben intern</span></span></li>
            <li><span>Ursache: <span class="redact">Zwei Mitarbeiter gekündigt, altes Ticketsystem</span></span></li>
            <li><span>Budget: 10.000 – 25.000 €. Frist: acht Wochen.</span></li>
            <li><span>Wer schuld ist: <span class="redact">spielt keine Rolle</span></span></li>
          </ol>
          <div class="protocol__foot mono"><span>4 Zeilen reichen</span><span>TAG</span></div>
          <span class="protocol__stamp">Reicht</span>
        </div>
      </div>
    </section>

{MANI_02}
    <section class="section section--forest" id="regeln">
      <div class="section__head">
        <p class="label">03 — Drei Affen, drei Regeln</p>
        <h2 class="h2 reveal-words">Ein Logo. Drei Versprechen.</h2>
      </div>
      <div class="dotlogo" data-dots-trigger>
        <svg data-dots="full" viewBox="0 0 1000 680" aria-label="Das Logo der ThreeApesGroup aus Punkten"></svg>
        <div class="dotlogo__rules">
          <div data-reveal><span class="mono">01 — Nichts hören</span><h3>Was du sagst, bleibt hier.</h3><p>Wir hören zu und vergessen danach. Keine Geschichten über Kunden, nicht intern und nicht draußen.</p></div>
          <div data-reveal class="is-focus"><span class="mono">02 — Nichts sehen</span><h3>Wir sehen nur den Weg.</h3><p>Nicht die Vorgeschichte, nicht die Schuldfrage. Nur das Ziel und die Menschen, die es erreichen.</p></div>
          <div data-reveal><span class="mono">03 — Nichts sagen</span><h3>Keine Namen. Nie.</h3><p>Referenzen gibt es nur mit deiner Freigabe und nur geschwärzt. Am Ende spricht das Ergebnis.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--deep">
      <div class="section__head">
        <p class="label">04 — Absolute Diskretion</p>
        <h2 class="h2 reveal-words">Was wir nicht brauchen. Was wir garantieren.</h2>
      </div>
      <div class="versus">
        <div class="versus__col versus__col--no" data-reveal>
          <h3>Brauchen wir nicht</h3>
          <ul>
            <li><span>Wer <span class="redact">schuld</span> ist</span></li>
            <li><span>Wie es dazu <span class="redact">gekommen</span> ist</span></li>
            <li><span>Was die <span class="redact">Konkurrenz</span> macht</span></li>
            <li><span>Wie viel du <span class="redact">verdienst</span></span></li>
            <li><span>Wer sonst noch <span class="redact">Bescheid</span> weiß</span></li>
          </ul>
        </div>
        <div class="versus__col versus__col--yes" data-reveal>
          <h3>Garantieren wir</h3>
          <ul>
            <li>NDA auf Wunsch vor dem ersten Gespräch</li>
            <li>Ein Ansprechpartner. Immer derselbe.</li>
            <li>Jeder im Netzwerk sieht nur seinen Teil</li>
            <li>Keine Referenz ohne deine schriftliche Freigabe</li>
            <li>Löschung aller Unterlagen nach Projektende</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="quote">
      <blockquote>„Wir sehen keine Probleme. Nur Wege.“</blockquote>
      <cite class="mono">— ThreeApesGroup</cite>
    </section>

    <section class="section section--forest">
      <div class="section__head">
        <p class="label">05 — Fragen</p>
        <h2 class="h2 reveal-words">Was andere vorher wissen wollten.</h2>
      </div>
      <div class="faq">
        <details><summary>Warum stehen keine Preise auf der Seite?</summary><div class="faq__a"><p>Weil jedes Problem anders ist. Ein Preis auf der Seite wäre entweder zu hoch oder gelogen. Du wählst in der Anfrage einen Budgetrahmen ab 2.500 €, und wir sagen dir ehrlich, was dafür möglich ist.</p></div></details>
        <details><summary>Wie könnt ihr etwas lösen, ohne es zu verstehen?</summary><div class="faq__a"><p>Wir verstehen genug, um zu wissen, wer es lösen kann. Die Tiefe liefern die Spezialisten aus dem Netzwerk. Du sparst dir das lange Erklären, und wir sparen uns das Raten.</p></div></details>
        <details><summary>Wer steckt im Netzwerk?</summary><div class="faq__a"><p>Über 150 Leute aus mehr als 15 Branchen. Entwickler, Berater, Juristen, Produzenten, Künstler, Labels, Marken. Dazu kommt Kontakt bis in die Verwaltungsebene, über Unternehmen wie cnode und die Zulano Gruppe, mit denen wir zusammenarbeiten. Namen von Einzelnen nennen wir nicht. Das ist der Punkt. <!-- PLATZHALTER: Zahlen anpassen --></p></div></details>
        <details><summary>Was ist der Sondercode?</summary><div class="faq__a"><p>Für Partner, Empfehlungen und besondere Fälle. Mit dem Code lassen sich im Formular Budgets unter 2.500 € und Partnerschaftsanfragen auswählen. Wer einen braucht, bekommt ihn von uns persönlich.</p></div></details>
        <details><summary>Kann ich Teil des Netzwerks werden?</summary><div class="faq__a"><p>Ja. Wähl in der Anfrage „Netzwerk beitreten“ und schreib in zwei Sätzen, was du kannst. Wir melden uns, wenn es passt.</p></div></details>
      </div>
    </section>
'''
manifest += cta('Ein Satz. <em class="serif">Mehr nicht.</em>', "Erzähl uns nicht alles. Nur, was am Ende stehen soll.")
page("manifest.html", "Manifest — ThreeApesGroup", "Für uns gibt es keine Probleme, nur Wege. Die drei Regeln der ThreeApesGroup: nichts sehen, nichts hören, nichts sagen.", manifest)

# =================================================================
# NETZWERK
# =================================================================
NET = {
  "inner": ["Strategie","Organisation","IT","KI","Web & Software","Coaching","Kunst","Foto & Video","Labels","Sponsoring"],
  "outer": ["Recht","Steuern","Finanzen","Marketing","Design","Events","Booking","Produktion","Immobilien","Personal","Logistik","Medien & PR","Investoren","Hardware","E-Commerce","Sound"],
}
import random
random.seed(4)
disc = "".join(f'<div class="disc__item disc__item--own"><b>{n.replace("&","&amp;")}</b><span>Selbst</span></div>' for n in NET["inner"])
disc += "".join(f'<div class="disc__item"><b>{n.replace("&","&amp;")}</b><span>Netzwerk</span></div>' for n in NET["outer"])
netz = phero("Das Netzwerk", ["Ein Kontakt.", '<em class="serif">Hunderte</em> Lösungen.'],
    "Du sprichst mit einer Person. Dahinter arbeitet ein Netzwerk in jedem Bereich, von der Software bis zur öffentlichen Förderung. Du musst es nie sehen, und es erfährt deinen Namen nie.",
    ART_NET, "NETWORK", actions='<a href="#test" class="btn btn--peach">Netzwerk testen <span class="btn__arrow">↓</span></a>',
    facts="<span>150+ Köpfe</span><span>15+ Branchen</span><span>Bis in die Verwaltung</span><span>1 Ansprechpartner</span>")
netz += f'''
    <section class="network" id="test" style="padding-top:110px">
      <div class="probe" style="margin-bottom:10px">
        <form id="probe" data-probe="network" autocomplete="off">
          <label class="mono" for="probeInput">Sag uns ein Problem. Wir zeigen dir, wer es löst.</label>
          <div class="probe__row">
            <input id="probeInput" type="text" placeholder="z. B. „Unsere Website bringt keine Kunden“" maxlength="140" />
            <button type="submit" class="btn btn--jungle">Senden</button>
          </div>
          <div class="probe__result" id="probeResult" aria-live="polite"></div>
        </form>
        <div class="probe__examples">
          <button type="button" data-example="Wir brauchen eine App für unsere Kunden">App für Kunden</button>
          <button type="button" data-example="Unser Künstler braucht Booking und eine Tour">Booking &amp; Tour</button>
          <button type="button" data-example="Abmahnung bekommen wegen unserer Website">Abmahnung</button>
          <button type="button" data-example="Wir wollen ein Gemälde diskret verkaufen">Gemälde verkaufen</button>
          <button type="button" data-example="Investoren für unser Start-up finden">Investoren finden</button>
        </div>
      </div>
      <div class="network__stage">
        <svg class="network__svg" id="networkSvg" viewBox="0 0 1200 780" aria-label="Netzwerk-Visualisierung"></svg>
      </div>
      <div class="stats">
        <div class="stat"><p class="mono">Köpfe im Netzwerk <!-- PLATZHALTER --></p><div class="stat__val"><span class="stat__num" data-count="150">0</span><span class="stat__plus">+</span></div><div class="stat__viz" data-viz="dots" data-n="150"></div></div>
        <div class="stat"><p class="mono">Gelöst <!-- PLATZHALTER --></p><div class="stat__val"><span class="stat__num" data-count="40">0</span><span class="stat__plus">+</span></div><div class="stat__viz" data-viz="check" data-n="40"></div></div>
        <div class="stat"><p class="mono">Branchen <!-- PLATZHALTER --></p><div class="stat__val"><span class="stat__num" data-count="18">0</span><span class="stat__plus">+</span></div><div class="stat__viz" data-viz="sq" data-n="18"></div></div>
      </div>
    </section>

    <section class="section section--deep" style="padding-top:40px">
{COOP}
    </section>

    <section class="section section--paper">
      <div class="section__head">
        <p class="label">So routen wir</p>
        <h2 class="h2 reveal-words">Dein Problem nimmt den kürzesten Weg.</h2>
      </div>
      <div class="row3">
        <div data-reveal><svg data-icon="mail"></svg><h3>Ein Satz rein</h3><p>Du sagst uns, was am Ende stehen soll. Wir übersetzen das in eine Aufgabe, die keinen Namen braucht.</p></div>
        <div data-reveal><svg data-icon="nodes"></svg><h3>Leise verteilt</h3><p>Wir holen die Köpfe dazu, die genau das schon gelöst haben. Wie viele, entscheiden wir. Jeder sieht nur seinen Teil.</p></div>
        <div data-reveal><svg data-icon="check"></svg><h3>Ein Ergebnis raus</h3><p>Du bekommst das Ergebnis von uns. Nicht von zehn Dienstleistern. Eine Rechnung, ein Ansprechpartner.</p></div>
      </div>
    </section>

    <section class="section section--forest">
      <div class="protocol" style="padding:0;background:none">
        <div class="protocol__text">
          <p class="label">Mitmachen</p>
          <h2 class="h2">Du kannst <em class="serif">etwas</em>, das andere brauchen?</h2>
          <p class="lead">Wir suchen keine Agenturen, sondern Menschen, die liefern und schweigen können. Bezahlt wird fair und pünktlich. Über Kunden wird nicht geredet.</p>
          <div style="margin-top:34px"><a href="anfrage.html?typ=Netzwerk%20beitreten" class="btn btn--peach">Netzwerk beitreten <span class="btn__arrow">→</span></a></div>
        </div>
        <div class="protocol__doc">
          <div class="protocol__top mono"><span>Aufnahme</span><span>Intern</span></div>
          <h3>Was wir erwarten</h3>
          <ol>
            <li><span>Du hast etwas schon oft gelöst, nicht nur einmal.</span></li>
            <li><span>Du redest nicht über Kunden. Auch nicht über <span class="redact">große</span>.</span></li>
            <li><span>Du hältst Fristen. Ohne Erinnerung.</span></li>
            <li><span>Du arbeitest mit dem, was du bekommst, und fragst nicht nach dem Rest.</span></li>
          </ol>
          <div class="protocol__foot mono"><span>Netzwerk</span><span>TAG</span></div>
          <span class="protocol__stamp">Geprüft</span>
        </div>
      </div>
    </section>
'''
netz += cta('Teste es <em class="serif">echt</em>.', "Der Test oben zeigt die Richtung. Die echte Antwort bekommst du von uns persönlich.")
page("netzwerk.html", "Netzwerk — ThreeApesGroup", "Ein Kontakt, hunderte Lösungen: das diskrete Netzwerk der ThreeApesGroup aus über 150 Köpfen in mehr als 15 Branchen.", netz)

# =================================================================
# LEISTUNGEN
# =================================================================
SVC = [
 ("strategie","Strategie","Strategie","Wohin, wie schnell, mit wem. Wir finden die Richtung und die Leute, die sie mit dir gehen.",
   ["Wachstum stockt","Neuer Markt, kein Plan","Zu viele Ideen, keine Richtung"],["Positionierung und Markteintritt","Wachstums- und Exit-Strategie","Sparring auf Geschäftsführungsebene"],"photo-1552664730-d307ca884978","Beratung"),
 ("organisation","Organisation","Organisation","Struktur, die nicht im Weg steht. Prozesse, Rollen und Teams, die von allein laufen.",
   ["Chaos nach schnellem Wachstum","Niemand fühlt sich zuständig","Prozesse leben nur im Kopf"],["Prozessaufnahme und Neuaufbau","Rollen, Verantwortung, Führung","Begleitung im Wandel"],"photo-1556761175-b413da4baf72","Beratung"),
 ("it","IT-Beratung","IT","Systeme, die laufen. Und sicher sind. Ohne Fachchinesisch und ohne Abhängigkeit.",
   ["Server gehackt oder kurz davor","Veraltete Systeme, die keiner mehr versteht","Daten überall, nirgends sicher"],["Infrastruktur und Cloud","IT-Sicherheit und Notfallhilfe","Auswahl und Einführung von Systemen"],"photo-1518770660439-4636190af475","Beratung"),
 ("ki","KI-Beratung","KI","Automatisieren, was nervt. KI dort, wo sie wirklich Zeit spart, nicht dort, wo sie nur gut klingt.",
   ["Support ertrinkt in Anfragen","Immer gleiche Aufgaben fressen Zeit","Daten liegen ungenutzt herum"],["KI-Agents und Chatbots","Automatisierung von Abläufen","Integration in bestehende Systeme"],"photo-1677442136019-21780ecad995","Beratung"),
 ("web","Web & Software","Web & Software","Seiten, Apps und Tools, die etwas tun. Gebaut von Leuten, die das jeden Tag machen.",
   ["Website bringt keine Kunden","Shop verkauft nicht","Excel-Listen statt Software"],["Websites und Online-Shops","Apps und Plattformen","Interne Tools und Schnittstellen"],"photo-1460925895917-afdab827c52f","Beratung"),
 ("coaching","Coaching & Schulungen","Coaching","Teams und Menschen, die weiterkommen. Workshops, Schulungen und Einzelcoaching ohne Folienschlacht.",
   ["Team bremst sich selbst","Neue Tools, keiner kann sie","Führungskraft allein auf weiter Flur"],["Workshops und Teamtage","KI- und Tool-Schulungen","Einzelcoaching für Führung"],"photo-1544531586-fde5298cdd40","Beratung"),
 ("kunst","Kunsthandel","Kunst","Ankauf und Verkauf. Diskret. Werke finden den richtigen Ort, ohne Auktion und ohne Presse.",
   ["Sammlung soll aufgelöst werden","Werk gesucht, nirgends zu finden","Wert unklar"],["Diskreter Ankauf und Verkauf","Kuration und Bewertung","Zugang zu privaten Sammlern"],"photo-1541961017774-22349e4a1262","Kreativ"),
 ("foto-video","Foto & Video","Foto & Video","Bilder, die etwas auslösen. Vom einzelnen Shooting bis zur ganzen Kampagne.",
   ["Content sieht aus wie bei allen","Release ohne Visuals","Kampagne in drei Wochen"],["Kampagnen und Shootings","Musikvideos und Reels","Content-Produktion im Abo"],"photo-1492691527719-9d1e07e534b4","Kreativ"),
 ("labels","Künstler & Labels","Künstler & Labels","Vom Demo bis zum Release. Wir beraten Künstler und Labels und bringen sie mit den richtigen Leuten zusammen.",
   ["Gute Musik, keine Hörer","Label gesucht","Release ohne Plan"],["Aufbau von Künstlern und Labels","Release-Strategie","Vertrieb, Rechte, Verträge"],"photo-1511671782779-c97d3d27a1d4","Kreativ"),
 ("vermittlung","Künstlervermittlung","Künstler & Labels","Die richtigen Künstler am richtigen Ort. Für Events, Marken und Kooperationen.",
   ["Event steht, Act fehlt","Marke sucht Gesicht","Kooperation ohne Kontakt"],["Booking und Vermittlung","Marken-Kooperationen","Betreuung vor Ort"],"photo-1514525253161-7a46d19cd819","Kreativ"),
 ("sponsoring","Sponsoring","Sponsoring","Marken und Künstler, die zusammenpassen. Vom Matching bis zur Aktivierung.",
   ["Convention ohne Hauptsponsor","Marke will in die Szene","Sponsor da, aber keine Wirkung"],["Matching von Marken und Projekten","Verhandlung und Vertrag","Aktivierung und Auswertung"],"photo-1531058020387-3be344556be6","Kreativ"),
]
subnav = "".join(f'<a href="#{s[0]}">{s[1].replace("&","&amp;")}</a>' for s in SVC)
items = ""
for i, (slug, title, area, lead, probs, does, img, world) in enumerate(SVC, 1):
    t = title.replace("&", "&amp;")
    a = area.replace("&", "%26").replace(" ", "%20")
    short = lead.split(". ")[0].rstrip(".") + "."
    items += f'''        <article class="prod" id="{slug}" data-key="{slug if slug != 'vermittlung' else 'labels'}" data-world="{world.lower()}">
          <div class="prod__img"><img src="{U(img, 700)}" alt="Platzhalter: {t}" loading="lazy" /><svg data-icon="{slug}"></svg></div>
          <div class="prod__body">
            <span class="mono">{i:02d} · {world}</span>
            <h2>{t}</h2>
            <p>{short}</p>
            <div class="prod__tags">{"".join(f"<span>{d}</span>" for d in does[:2])}</div>
            <span class="prod__go"><span>Anfragen</span><span>→</span></span>
          </div>
          <a href="anfrage.html?bereich={a}" class="file__link" aria-label="{t} anfragen"></a>
        </article>
'''
items += '''        <a href="anfrage.html" class="prod prod--cta" data-world="alle"><span class="mono">Nicht dabei?</span><h2>Wir kennen jemanden.</h2><span class="prod__go" style="color:var(--forest);border-color:rgba(1,43,29,.25)"><span>Trotzdem anfragen</span><span>→</span></span></a>
'''
leist = phero("Leistungen", ["Zwei Welten.", '<em class="serif">Ein</em> Netzwerk.'],
    "Elf Felder, in denen wir selbst arbeiten. Für alles andere haben wir jemanden. Du musst nicht wissen, wo dein Problem hingehört. Wir schon.",
    ART_GRID, "SOLVE", facts="<span>Beratung &amp; Problemlösung</span><span>Kunst &amp; Kreativ</span>")
leist += f'''
    <section class="section section--deep" style="padding-top:90px;padding-bottom:90px">
      <div class="probe probe--left" style="max-width:820px">
        <form data-probe="services" autocomplete="off">
          <label class="mono" for="svcProbe">Du weißt nicht, wo es hingehört? Schreib es hier rein.</label>
          <div class="probe__row">
            <input id="svcProbe" type="text" placeholder="z. B. „Wir brauchen Musikvideos für ein Release“" maxlength="140" />
            <button type="submit" class="btn btn--jungle">Zuordnen</button>
          </div>
          <div class="probe__result" aria-live="polite"></div>
        </form>
      </div>
    </section>
    <section class="section section--forest" style="padding-top:60px">
      <div class="shop__bar">
        <div class="filter chips chips--sm" id="shopFilter" role="radiogroup" aria-label="Leistungen filtern" style="margin:0"><label class="chip"><input type="radio" name="w" value="alle" checked /><span>Alle</span></label><label class="chip"><input type="radio" name="w" value="beratung" /><span>Beratung</span></label><label class="chip"><input type="radio" name="w" value="kreativ" /><span>Kreativ</span></label></div>
        <span class="shop__count mono">11 Leistungen · und alles andere über das Netzwerk</span>
      </div>
      <div class="shop">
{items}      </div>
    </section>
'''
leist += cta('Nicht dabei? <em class="serif">Wir kennen jemanden.</em>', "Schreib uns trotzdem. Für alles andere gibt es das Netzwerk.")
page("leistungen.html", "Leistungen — ThreeApesGroup", "Strategie, Organisation, IT, KI, Web und Software, Coaching, Kunsthandel, Foto und Video, Künstler und Labels, Vermittlung und Sponsoring.", leist)

# =================================================================
# PROJEKTE
# =================================================================
FILES = [
 ("001","Software · KI","ki software","2026","Support im Dauer&shy;feuer","Industrie · Mittelstand","8 Wochen · 3 Köpfe","Der Support kommt nicht mehr hinterher.","−60%","Antwortzeit","photo-1551434678-e076c223a692"),
 ("007","IT · Sicherheit","software","2024","Freitagabend gehackt","Beratung · Kleinbetrieb","36 Stunden · 2 Köpfe","Systeme verschlüsselt, am Montag geht es weiter.","36 h","bis alles lief","photo-1550751827-4bd374c3f58b"),
 ("002","Sponsoring · Convention","sponsoring","2026","Convention ohne Geldgeber","Kultur · Veranstaltung","6 Wochen · 2 Köpfe","Kurz vor dem Termin fehlt der Hauptsponsor.","6","Wochen bis zum Deal","photo-1501386761578-eac5c94b800a"),
 ("003","Kunst · Handel","kunst","2025","Eine Sammlung, kein Aufsehen","Privat · Sammlung","4 Monate · 2 Köpfe","Werke sollen verkauft werden. Leise.","7","Werke platziert","photo-1579783902614-a3fb3927b6a5"),
 ("005","Strategie · Organisation","strategie","2025","Zu schnell gewachsen","Software · Start-up","3 Monate · 2 Köpfe","Schnell gewachsen, keiner weiß mehr, wer was macht.","−30%","Abstimmungszeit","photo-1522071820081-009f0129c71c"),
 ("009","Web · E-Commerce","software","2024","Der Shop, der nicht verkauft","Handel · Online","10 Wochen · 4 Köpfe","Viel Besuch, kaum Bestellungen.","+65%","Umsatz online","photo-1460925895917-afdab827c52f"),
]
cards = ""
for (n, cat, keys, yr, title, field, scope, prob, kpi, kpil, img) in FILES:
    cards += f'''        <article class="file" data-cat="{keys}">
          <div class="file__top mono"><b>Akte {n}</b><span>{cat}</span><span>{yr}</span></div>
          <div class="file__img"><img src="{U(img, 900)}" alt="Platzhalter Projektbild" loading="lazy" /><span class="file__stamp">Gelöst</span></div>
          <div class="file__body">
            <h3>{title}</h3>
            <div class="file__row"><span>Rahmen</span><span>{field}</span></div>
            <div class="file__row"><span>Umfang</span><span>{scope}</span></div>
            <div class="file__row"><span>Ausgangslage</span><span>{prob}</span></div>
            <div class="file__kpi"><b>{kpi}</b><span>{kpil}</span></div>
          </div>
          <a href="projekt.html" class="file__link" aria-label="Akte {n} öffnen"></a>
        </article>
'''
filters = [("alle","Alle"),("ki","KI"),("software","Software &amp; IT"),("strategie","Strategie"),("kunst","Kunst"),("sponsoring","Sponsoring")]
fhtml = "".join(f'<label class="chip"><input type="radio" name="f" value="{v}"{" checked" if v=="alle" else ""} /><span>{l}</span></label>' for v, l in filters)
proj = phero("Akten", ["Gelöste", '<em class="serif">Akten</em>.'],
    "Sechs Akten, die wir bewusst ausgewählt haben. Keine Namen, keine Details. Nur der Rahmen und was am Ende rauskam. Den Großteil unserer Arbeit zeigen wir nicht.",
    '<svg class="phero__dots" data-morph="doc,lock,eyeoff,check" data-cap="Eine Akte|Unter Verschluss|Namen geschwärzt|Gelöst" viewBox="0 0 400 320" aria-hidden="true"></svg>', "FILES", facts="<span>6 ausgewählte Akten</span><span>Keine Namen</span><span>Stand 2026</span>", short=True)
proj += f'''
    <section class="section section--deep" style="padding-top:90px">
      <div class="filter chips chips--sm" id="fileFilter" role="radiogroup" aria-label="Akten filtern">{fhtml}</div>
      <div class="files">
        <!-- PLATZHALTER-Akten: kopieren und anpassen. data-cat bestimmt den Filter. -->
{cards}      </div>
      <div class="files__foot">
        <p>Das sind sechs Akten, die wir zeigen wollen. Ob wir etwas wie deins schon gelöst haben, erzählen wir dir persönlich. Nicht hier.</p>
        <a href="anfrage.html" class="btn btn--peach">Deine Akte eröffnen <span class="btn__arrow">→</span></a>
      </div>
    </section>
'''
proj += cta('Die nächste Akte <em class="serif">ist deine</em>.', "Schick uns ein Problem. Wir machen eine gelöste Akte daraus.")
page("projekte.html", "Akten — ThreeApesGroup", "Gelöste Akten der ThreeApesGroup: Software, KI, Sponsoring, Kunst, Strategie. Keine Namen, nur Rahmen und Ergebnis.", proj)

# =================================================================
# PROJEKT-DETAIL (Vorlage)
# =================================================================
det = f'''    <section class="phero phero--short">
      <div class="phero__bg" aria-hidden="true">001</div>
      <div class="phero__main">
        <p class="crumb mono"><a href="projekte.html">Akten</a><span>/</span><span>Akte 001</span></p>
        <h1 class="phero__title">
          <span class="line"><span class="line__inner">Support im</span></span>
          <span class="line"><span class="line__inner"><em class="serif">Dauerfeuer</em>.</span></span>
        </h1>
        <p class="phero__lead">Ein Mittelständler, ein überlastetes Support-Team und acht Wochen Zeit. Wie wir es gelöst haben, ohne die Firma kennen zu müssen. <!-- PLATZHALTER --></p>
      </div>
      <div class="phero__aside" aria-hidden="true">{ART_FILE}</div>
    </section>
    <div class="case-meta">
      <div><span>Rahmen</span><b>Industrie · Mittelstand</b></div>
      <div><span>Bereich</span><b>Software · KI</b></div>
      <div><span>Dauer</span><b>8 Wochen</b></div>
      <div><span>Status</span><b style="color:var(--peach)">Gelöst</b></div>
    </div>
    <section class="section section--forest" style="padding-top:100px;padding-bottom:60px">
      <figure class="svc__media" data-media style="position:relative;top:0;aspect-ratio:21/9;margin:0"><img src="{U('photo-1551434678-e076c223a692',1800)}" alt="Platzhalter Projektbild" /></figure>
    </section>
    <section class="case-body section--forest">
      <h2>01 — Was wir wussten</h2>
      <div class="case-body__text">
        <p data-reveal>Der Support beantwortet 400 Anfragen pro Woche. Die Hälfte davon ist immer dieselbe Frage. Zwei Leute sind gegangen, das Ticketsystem ist <span class="redact">elf Jahre</span> alt.</p>
        <p data-reveal>Mehr mussten wir nicht wissen. Nicht, wer gekündigt hat. Nicht, wieso. Nicht, was der <span class="redact">Geschäftsführer</span> davon hält.</p>
      </div>
    </section>
    <section class="case-body section--forest">
      <h2>02 — Wen wir geholt haben</h2>
      <div class="case-body__text">
        <p data-reveal>Drei Leute aus dem Netzwerk, keiner von ihnen kannte den Namen des Kunden.</p>
        <div class="team-roles" data-reveal><span>KI-Entwickler</span><span>Prozessberaterin</span><span>Support-Trainer</span><span>+ wir als Ansprechpartner</span></div>
      </div>
    </section>
    <section class="case-body section--forest">
      <h2>03 — Was passiert ist</h2>
      <div class="case-body__text">
        <p data-reveal>Ein KI-Assistent beantwortet die Standardfragen, bevor sie zum Ticket werden. Das Team kümmert sich nur noch um die Fälle, die einen Menschen brauchen. Nach acht Wochen lief alles ohne uns. <!-- PLATZHALTER --></p>
      </div>
    </section>
    <div class="case-kpis">
      <div><b>−60%</b><span>Antwortzeit</span></div>
      <div><b>45%</b><span>Anfragen automatisch gelöst</span></div>
      <div><b>0</b><span>neue Stellen nötig</span></div>
    </div>
    <section class="section section--forest" style="padding-bottom:100px">
      <div class="case-gallery">
        <figure data-media><img src="{U('photo-1519389950473-47ba0277781c',1200)}" alt="Platzhalter" loading="lazy" /></figure>
        <figure data-media><img src="{U('photo-1531297484001-80022131f5a1',900)}" alt="Platzhalter" loading="lazy" /></figure>
        <figure data-media><img src="{U('photo-1504384308090-c894fdcc538d',900)}" alt="Platzhalter" loading="lazy" /></figure>
      </div>
    </section>
    <div class="case-next">
      <span class="mono">Nächste Akte</span>
      <a href="projekte.html" class="big" data-scramble>Convention ohne Geldgeber →</a>
    </div>
'''
det += cta('Klingt <em class="serif">bekannt</em>?', "Dann schreib uns. Ein Satz reicht für den Anfang.")
page("projekt.html", "Akte 001 — ThreeApesGroup", "Akte 001: Support im Dauerfeuer. Ein Projekt der ThreeApesGroup, Kundenname geschwärzt.", det)

# =================================================================
# PARTNER
# =================================================================
part = phero("Partner &amp; Sponsoring", ["Kunst, Künstler.", 'Und <em class="serif">Sponsoren</em>.'],
    "In der Kunst arbeiten wir eng mit dem Bunkerwest zusammen. Sponsoring, Firmen und Kulturförderung klären wir für andere und für uns selbst. Namen nennen wir dabei keine.",
    ART_HAND, "PARTNER", actions='<a href="#sponsoring" class="btn btn--peach">Sponsoring <span class="btn__arrow">↓</span></a><a href="anfrage.html?typ=Partnerschaft" class="btn btn--ghost">Partner werden</a>',
    facts="<span>Bunkerwest · Berlin</span><span>Sponsoring bis Kulturförderung</span>")
part += f'''
    <section class="partners" style="padding-top:110px">
      <div class="partners__head">
        <div><p class="label">Mit wem wir arbeiten</p><h2 class="h2 reveal-words">Ein Ort. Ein enger Partner.</h2></div>
        <p>Statt vieler Namen zeigen wir einen. Mit dem Bunkerwest arbeiten wir sehr eng zusammen. <!-- PLATZHALTER: ein, zwei Sätze zum Bunkerwest --></p>
      </div>
      <div class="home-base" data-reveal>
        <p class="home-base__name" aria-label="Bunkerwest"><span>BUNKER</span><span class="home-base__out">WEST</span></p>
        <div class="home-base__meta">
          <div><span class="mono">Ort</span><b>Hohenzollerndamm, Berlin</b></div>
          <div><span class="mono">Was</span><b>Kunst, Ausstellungen, Events</b></div>
          <div><span class="mono">Für uns</span><b>Ort unserer Netzwerktreffen</b></div>
        </div>
      </div>

      <div class="partners__head" id="sponsoring" style="margin-top:120px;margin-bottom:50px">
        <div><p class="label">Sponsoring</p><h2 class="h2 reveal-words">Von Sponsoring bis Kulturförderung.</h2></div>
        <p>Wer mit wem, bleibt unter uns. Nur so viel: Wir haben das alles schon gemacht, für andere und für uns selbst.</p>
      </div>
      <ol class="range">
          <li data-reveal><span class="range__n mono">01</span><h3>Sponsoring</h3><p>Marken für Künstler, Ausstellungen und Projekte.</p></li>
          <li data-reveal><span class="range__n mono">02</span><h3>Firmen</h3><p>Partnerschaften zwischen Unternehmen und Kultur.</p></li>
          <li data-reveal><span class="range__n mono">03</span><h3>Events</h3><p>Haupt- und Co-Sponsoren, Aktivierung vor Ort.</p></li>
          <li data-reveal><span class="range__n mono">04</span><h3>Kulturförderung</h3><p>Stiftungen, Förderprogramme, öffentliche Hand.</p></li>
          <li data-reveal><span class="range__n mono">05</span><h3>Community</h3><p>Wir selbst machen nur kleine, exklusive Community-Events. Unser Netzwerk trifft sich in Berlin im Bunkerwest, der das ganze Jahr über viele eigene Events veranstaltet.</p></li>
      </ol>
    </section>

    <section class="section section--paper">
      <div class="section__head">
        <p class="label">Kuratiertes Sponsoring</p>
        <h2 class="h2 reveal-words">Wir finden, wer zusammenpasst.</h2>
      </div>
      <div class="dual">
        <div class="dual__col" data-reveal>
          <svg data-icon="sponsoring"></svg>
          <h3>Für Marken</h3>
          <p style="margin:0;color:var(--steel-l)">Du willst in eine Szene, die man nicht kaufen kann? Im Netzwerk sind die Künstler, Galerien, Events und Projekte, die zu dir passen.</p>
          <ul><li>Passende Künstler, Events und Projekte</li><li>Verhandlung und Vertrag aus einer Hand</li><li>Aktivierung, die nicht nach Werbung aussieht</li><li>Auswertung mit echten Zahlen</li></ul>
          <a href="anfrage.html?bereich=Sponsoring" class="btn btn--peach" style="align-self:flex-start">Als Marke anfragen <span class="btn__arrow">→</span></a>
        </div>
        <div class="dual__col" data-reveal>
          <svg data-icon="labels"></svg>
          <h3>Für Künstler &amp; Projekte</h3>
          <p style="margin:0;color:var(--steel-l)">Du hast Reichweite, eine Ausstellung, eine Convention oder ein Projekt und brauchst einen Sponsor? Wir klären das. Leise.</p>
          <ul><li>Marken, die zu dir passen</li><li>Faire Deals, klare Verträge</li><li>Wir verhandeln, du machst weiter</li><li>Langfristig statt einmalig</li></ul>
          <a href="anfrage.html?bereich=Sponsoring" class="btn btn--peach" style="align-self:flex-start">Als Künstler anfragen <span class="btn__arrow">→</span></a>
        </div>
      </div>
    </section>

    <section class="section section--deep">
      <div class="protocol" style="padding:0;background:none">
        <div class="protocol__text">
          <p class="label">Partnerschaft</p>
          <h2 class="h2">Partner werden. <em class="serif">Nur auf Empfehlung.</em></h2>
          <p class="lead">Wir haben nur sehr ausgewählte Partner. Deshalb gibt es genau zwei Wege: Du hast einen Empfehlungscode. Oder du bewirbst dich, und wir melden uns, wenn es passt.</p>
          <div style="margin-top:34px;display:flex;gap:12px;flex-wrap:wrap"><a href="anfrage.html?typ=Partnerschaft" class="btn btn--peach">Empfehlungscode eingeben <span class="btn__arrow">→</span></a><a href="anfrage.html?problem=Bewerbung%20als%20Partner%3A%20" class="btn btn--ghost">Als Partner bewerben</a></div>
        </div>
        <div class="protocol__doc">
          <div class="protocol__top mono"><span>Partner</span><span>Bewerbung oder Code</span></div>
          <h3>Was Partner bekommen</h3>
          <ol>
            <li><span>Zugang zum Netzwerk für eigene Projekte</span></li>
            <li><span>Budgets unter 2.500 € für kleinere Aufgaben</span></li>
            <li><span>Gegenseitige Empfehlungen, ohne Provision-Theater</span></li>
            <li><span>Einen festen Ansprechpartner: <span class="redact">Name</span></span></li>
          </ol>
          <div class="protocol__foot mono"><span>Partnerprogramm</span><span>TAG</span></div>
          <span class="protocol__stamp">Auswahl</span>
        </div>
      </div>
    </section>
'''
part += cta('Passt ihr <em class="serif">zusammen</em>?', "Erzähl uns, wen du suchst. Wir sagen dir, ob wir jemanden kennen.")
page("partner.html", "Partner & Sponsoring — ThreeApesGroup", "Kunst mit dem Bunkerwest, Sponsoring, Firmen und Kulturförderung: wie die ThreeApesGroup Partner und Sponsoren zusammenbringt.", part)

# =================================================================
# ANFRAGE
# =================================================================
anf = phero("Anfrage", ["Erzähl uns", '<em class="serif">nicht alles</em>.'],
    "Nur das Problem. Wir veröffentlichen keine Preise, weil jedes Problem anders ist. Wähl deinen Budgetrahmen und wir melden uns innerhalb von 24 Stunden, sieben Tage die Woche.",
    ART_FORM, "ASK", facts="<span>Antwort in 24 h, 7 Tage</span><span>NDA auf Wunsch</span><span>Budget ab 2.500 €</span>", short=True)
anf += f'''
    <section class="inquiry" id="anfrage" style="padding-top:100px">
      <div class="probe probe--left" style="max-width:820px;margin-bottom:80px">
        <form data-probe="inquiry" autocomplete="off">
          <label class="mono" for="inqProbe">Schnellstart: Ein Satz, wir füllen den Rest vor.</label>
          <div class="probe__row">
            <input id="inqProbe" type="text" placeholder="z. B. „Wir suchen einen Sponsor für unsere Convention“" maxlength="140" />
            <button type="submit" class="btn btn--jungle">Übernehmen</button>
          </div>
          <div class="probe__result" aria-live="polite"></div>
        </form>
      </div>
      <div class="inquiry__layout">
        {FORM}
        <aside class="inquiry__side">
          <div><svg data-icon="lock"></svg><h4>Vertraulich</h4><p>Was du hier schreibst, liest nur dein Ansprechpartner. Niemand sonst.</p></div>
          <div><svg data-icon="doc"></svg><h4>NDA auf Wunsch</h4><p>Schreib es dazu. Wir unterschreiben vor dem ersten Gespräch.</p></div>
          <div><svg data-icon="talk"></svg><h4>24 Stunden</h4><p>So lange dauert es bis zur ersten Antwort, sieben Tage die Woche. Meistens kürzer.</p></div>
          <div><svg data-icon="eyeoff"></svg><h4>Nur das Nötigste</h4><p>Lass Namen weg, wenn du willst. Wir brauchen sie am Anfang nicht.</p></div>
        </aside>
      </div>
    </section>
'''
page("anfrage.html", "Anfrage — ThreeApesGroup", "Schildere dein Problem in ein paar Sätzen. Budget ab 2.500 €, Antwort innerhalb von 24 Stunden an sieben Tagen, Diskretion garantiert.", anf)

# =================================================================
# RECHTLICHES
# =================================================================
imp = '''    <section class="legal">
      <p class="label">Rechtliches</p>
      <h1>Impressum</h1>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>Nino Bornhäußer<br/>Einzelunternehmen, handelnd unter ThreeApesGroup<br/>Am Schlachtensee 122A<br/>14129 Berlin<br/>Deutschland</p>
      <h2>Kontakt</h2>
      <p>E-Mail: <a href="mailto:kontakt@threeapesgroup.com">kontakt@threeapesgroup.com</a></p>
      <h2>Umsatzsteuer</h2>
      <p>Kleinunternehmer im Sinne von § 19 UStG. Es wird keine Umsatzsteuer berechnet und ausgewiesen.</p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>Nino Bornhäußer, Anschrift wie oben</p>
      <h2>Verbraucherstreitbeilegung</h2>
      <p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      <h2>Haftung für Inhalte und Links</h2>
      <p>Die Inhalte dieser Seite wurden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität übernehmen wir keine Gewähr. Für Inhalte externer Seiten, auf die wir verlinken, sind ausschließlich deren Betreiber verantwortlich. Werden uns Rechtsverletzungen bekannt, entfernen wir die betreffenden Inhalte oder Links umgehend.</p>
      <h2>Urheberrecht</h2>
      <p>Texte, Gestaltung und Logo dieser Seite unterliegen dem deutschen Urheberrecht. Eine Verwendung außerhalb der Grenzen des Urheberrechts braucht unsere schriftliche Zustimmung.</p>
    </section>
'''
page("impressum.html", "Impressum — ThreeApesGroup", "Impressum der ThreeApesGroup, Berlin.", imp)
ds = '''    <section class="legal">
      <p class="label">Rechtliches</p>
      <h1>Daten&shy;schutz</h1>
      <p>Diskretion ist unser Geschäft. Deshalb erheben wir auf dieser Seite so wenig Daten wie möglich: keine Cookies, kein Tracking, keine Analyse-Tools, keine Werbung.</p>
      <h2>1. Verantwortlicher</h2>
      <p>Nino Bornhäußer, ThreeApesGroup<br/>Am Schlachtensee 122A, 14129 Berlin<br/>E-Mail: <a href="mailto:kontakt@threeapesgroup.com">kontakt@threeapesgroup.com</a></p>
      <h2>2. Hosting der Website</h2>
      <p>Die Website liegt bei GitHub Pages, einem Dienst der GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf verarbeitet GitHub technisch notwendige Daten wie deine IP-Adresse, Datum und Uhrzeit sowie die aufgerufene Seite, um die Seite auszuliefern und vor Angriffen zu schützen. Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und stabilen Website (Art. 6 Abs. 1 lit. f DSGVO). GitHub ist nach dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO).</p>
      <h2>3. Kontakt per E-Mail und Anfrageformular</h2>
      <p>Wenn du uns schreibst oder das Anfrageformular nutzt, verarbeiten wir deine Angaben (Name, E-Mail, freiwillig Unternehmen und Telefon, deine Nachricht, Budget und Bereiche), um deine Anfrage zu bearbeiten und dir zu antworten. Rechtsgrundlage ist die Anbahnung oder Durchführung eines Vertrags (Art. 6 Abs. 1 lit. b DSGVO) und deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du jederzeit für die Zukunft widerrufen kannst.</p>
      <p>E-Mail-Postfach und Formularversand laufen über Febas (febas.de) auf Servern in Deutschland. Mit Febas besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Nach dem Absenden bekommst du eine Eingangsbestätigung per E-Mail. Zum Schutz vor Spam speichern wir für höchstens zwei Stunden einen nicht rückverfolgbaren Hashwert deiner IP-Adresse (Art. 6 Abs. 1 lit. f DSGVO).</p>
      <p>Wir löschen deine Angaben, sobald deine Anfrage erledigt ist und keine gesetzlichen Aufbewahrungsfristen bestehen. Führt die Anfrage zu einem Auftrag, bewahren wir geschäftliche Korrespondenz nach Handels- und Steuerrecht bis zu sechs bzw. zehn Jahre auf.</p>
      <h2>4. Schriften, Skripte und Bilder</h2>
      <p>Schriften und Skripte sind direkt auf dieser Website eingebunden. Es wird dafür keine Verbindung zu Google oder anderen Drittanbietern aufgebaut. Einige Bilder werden derzeit von Unsplash geladen (Unsplash Inc., San Francisco, USA). Dabei wird deine IP-Adresse an Unsplash übertragen (Art. 6 Abs. 1 lit. f DSGVO).</p>
      <h2>5. Speicher im Browser</h2>
      <p>Für den Seitenübergang und damit die Startanimation pro Besuch nur einmal läuft, legen wir kurzzeitig einen Wert im Speicher deines Browsers ab (sessionStorage). Er enthält keine personenbezogenen Daten, verlässt dein Gerät nicht und ist technisch notwendig (§ 25 Abs. 2 TDDDG).</p>
      <h2>6. Deine Rechte</h2>
      <p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Eine Einwilligung kannst du jederzeit widerrufen (Art. 7 Abs. 3). Eine E-Mail an kontakt@threeapesgroup.com reicht.</p>
      <p>Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit.</p>
      <p class="mono" style="margin-top:40px;color:var(--steel)">Stand: November 2026</p>
    </section>
'''
page("datenschutz.html", "Datenschutz — ThreeApesGroup", "Datenschutzerklärung der ThreeApesGroup: keine Cookies, kein Tracking, Hosting und Mail transparent erklärt.", ds)
print("done")

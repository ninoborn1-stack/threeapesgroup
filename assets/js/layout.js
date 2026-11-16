/* =================================================================
   ThreeApesGroup — gemeinsamer Rahmen für alle Seiten
   Navigation, Menü und Footer stehen nur hier. Änderungen gelten sofort überall.
   ================================================================= */
(function () {
  const MAIL = "kontakt@threeapesgroup.de"; // PLATZHALTER
  const PAGES = [
    ["manifest.html", "Manifest"],
    ["netzwerk.html", "Netzwerk"],
    ["leistungen.html", "Leistungen"],
    ["projekte.html", "Projekte"],
    ["partner.html", "Partner"],
  ];
  const here = location.pathname.split("/").pop() || "index.html";
  const active = (h) => here === h || (h === "projekte.html" && here === "projekt.html");

  const nav = `
  <header class="nav" id="nav">
    <a href="index.html" class="nav__brand">
      <img src="assets/img/emblem.webp" alt="" width="44" height="30" />
      <span>ThreeApes<b>Group</b></span>
    </a>
    <nav class="nav__links" aria-label="Hauptnavigation">
      ${PAGES.map(([h, l]) => `<a href="${h}" data-scramble${active(h) ? ' class="is-active" aria-current="page"' : ""}>${l}</a>`).join("")}
    </nav>
    <a href="anfrage.html" class="btn btn--peach btn--sm">Anfrage</a>
    <button class="nav__burger" id="burger" aria-label="Menü öffnen" aria-expanded="false"><span></span><span></span></button>
  </header>
  <div class="menu" id="menu" aria-hidden="true">
    <div class="menu__bg"></div>
    <nav class="menu__links">
      <a href="index.html"><i class="mono">00</i>Start</a>
      ${PAGES.map(([h, l], i) => `<a href="${h}"><i class="mono">0${i + 1}</i>${l}</a>`).join("")}
      <a href="anfrage.html"><i class="mono">06</i>Anfrage</a>
    </nav>
    <p class="menu__foot mono">Berlin — diskret seit 2026<br/>${MAIL}</p>
  </div>`;

  const footer = `
  <footer class="footer">
    <div class="footer__top">
      <div>
        <p class="mono footer__label">Kontakt</p>
        <a href="mailto:${MAIL}" class="footer__mail">${MAIL}</a>
        <p class="footer__note">Wir antworten innerhalb von 48 Stunden. Was du schreibst, bleibt bei uns.</p>
      </div>
      <div class="footer__cols">
        <div><p class="mono footer__label">Seiten</p>
          <a href="index.html" data-scramble>Start</a>${PAGES.map(([h, l]) => `<a href="${h}" data-scramble>${l}</a>`).join("")}<a href="anfrage.html" data-scramble>Anfrage</a>
        </div>
        <div><p class="mono footer__label">Social</p><a href="#" data-scramble>Instagram</a><a href="#" data-scramble>LinkedIn</a><a href="#" data-scramble>TikTok</a></div>
        <div><p class="mono footer__label">Rechtliches</p><a href="impressum.html" data-scramble>Impressum</a><a href="datenschutz.html" data-scramble>Datenschutz</a></div>
      </div>
    </div>
    <div class="footer__giant" aria-hidden="true"><span>Three</span><span>Apes</span><span>Group</span></div>
    <div class="footer__bottom mono">
      <span>© 2026 ThreeApesGroup — Berlin</span>
      <span>Wir sehen nichts. Wir lösen alles.</span>
      <a href="#top" data-scramble>Nach oben ↑</a>
    </div>
  </footer>`;

  const put = (key, html) => {
    const slot = document.querySelector(`[data-include="${key}"]`);
    if (slot) slot.outerHTML = html;
  };
  put("nav", nav);
  put("footer", footer);

  /* ---------- Seitenwechsel: drei Panels decken ab und geben frei ---------- */
  const pt = document.querySelector(".pt");
  const root = document.documentElement;
  if (pt && root.classList.contains("pt-in")) {
    try { sessionStorage.removeItem("tag-pt"); } catch (e) {}
    window.TAG_PT_DELAY = 0.45;
    let left = false;
    const leave = () => {
      if (left) return; left = true;
      pt.classList.add("is-leave");
      root.classList.remove("pt-in");
      setTimeout(() => pt.classList.remove("is-leave"), 1300);
    };
    requestAnimationFrame(() => requestAnimationFrame(leave));
    setTimeout(leave, 700); // Sicherheitsnetz, falls der Tab im Hintergrund lädt
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || !pt || e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.hash) return; // Anker auf derselben Seite
    if (url.pathname === location.pathname && !url.search) return;
    e.preventDefault();
    try { sessionStorage.setItem("tag-pt", "1"); } catch (err) {}
    pt.classList.add("is-enter");
    setTimeout(() => { location.href = url.href; }, 620);
  });
  window.addEventListener("pageshow", (e) => { if (e.persisted && pt) pt.classList.remove("is-enter", "is-leave"); });
})();

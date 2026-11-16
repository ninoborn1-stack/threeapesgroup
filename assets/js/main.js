/* =================================================================
   ThreeApesGroup — Interaktion & Animation (alle Seiten)
   Benötigt: config.js, layout.js, network.js, GSAP 3 + ScrollTrigger, Lenis
   Jedes Modul prüft selbst, ob es auf der aktuellen Seite vorkommt.
   ================================================================= */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
const params = new URLSearchParams(location.search);

function cyrb53(str, seed = 7) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
window.TAG = { hash: (c) => cyrb53(String(c).trim().toUpperCase()) };

const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* egal */ } },
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* =================================================================
   Icons (Linien-Icons, werden in <svg data-icon="name"> eingesetzt)
   ================================================================= */
const ICONS = {
  strategie: '<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="2.5" class="f a-pulse"/><g class="a-nudge"><path d="M24 24 38 10M33 9h6v6"/></g>',
  organisation: '<rect x="18" y="5" width="12" height="9" rx="1"/><rect x="4" y="34" width="12" height="9" rx="1" class="a-blink"/><rect x="18" y="34" width="12" height="9" rx="1" class="a-blink a-d2"/><rect x="32" y="34" width="12" height="9" rx="1" class="a-blink a-d3"/><path d="M24 14v20M10 34v-6h28v6" class="a-flow"/>',
  it: '<rect x="7" y="6" width="34" height="14" rx="2"/><rect x="7" y="28" width="34" height="14" rx="2"/><path d="M13 13h3" class="a-blink"/><path d="M13 35h3" class="a-blink a-d2"/><path d="M24 20v8" class="a-flow"/><path d="M29 13h7M29 35h7"/>',
  ki: '<rect x="12" y="12" width="24" height="24" rx="3"/><path d="M18 5v7M24 5v7M30 5v7M18 36v7M24 36v7M30 36v7M5 18h7M5 24h7M5 30h7M36 18h7M36 24h7M36 30h7" class="a-flow"/><g class="a-spin"><path d="M24 17l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></g>',
  web: '<rect x="4" y="8" width="40" height="32" rx="2"/><path d="M4 16h40"/><circle cx="9" cy="12" r="1" class="f a-blink"/><g class="a-nudge-x"><path d="M19 24l-5 5 5 5"/></g><g class="a-nudge-x a-rev"><path d="M29 24l5 5-5 5"/></g><path d="M26 22l-4 14" class="a-blink a-d2"/>',
  coaching: '<circle cx="15" cy="13" r="6"/><path d="M4 40c0-7 5-12 11-12s11 5 11 12"/><g class="a-nudge"><path d="M28 28l6-8 5 4 5-9M38 14h6v6"/></g>',
  kunst: '<rect x="6" y="6" width="36" height="36" rx="1"/><rect x="11" y="11" width="26" height="26"/><path d="M11 32l8-9 6 6 4-4 8 8"/><g class="a-float"><circle cx="30" cy="18" r="3"/></g>',
  "foto-video": '<path d="M6 16h8l3-5h14l3 5h8v24H6z"/><circle cx="24" cy="27" r="8"/><circle cx="24" cy="27" r="3" class="a-pulse"/><circle cx="37" cy="21" r="1" class="f a-blink"/>',
  labels: '<g class="a-spin a-slow"><circle cx="22" cy="26" r="17"/><circle cx="22" cy="26" r="10"/><path d="M22 12v4"/></g><circle cx="22" cy="26" r="3"/><path d="M42 4v14l-8 7"/>',
  vermittlung: '<circle cx="12" cy="24" r="7"/><circle cx="36" cy="24" r="7"/><g class="a-nudge-x"><path d="M19 20h10l-3-3"/></g><g class="a-nudge-x a-rev"><path d="M29 28H19l3 3"/></g>',
  sponsoring: '<circle cx="24" cy="18" r="12"/><g class="a-spin a-slow"><path d="M24 11l2 4.5 5 .6-3.7 3.3 1 4.9L24 22l-4.3 2.3 1-4.9L17 16.1l5-.6z"/></g><path d="M16 27l-5 15 6-3 3 5 4-12M32 27l5 15-6-3-3 5-4-12"/>',
  eyeoff: '<path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z"/><g class="a-look"><circle cx="24" cy="24" r="6"/></g><path d="M8 40 40 8"/>',
  lock: '<rect x="10" y="22" width="28" height="20" rx="2"/><g class="a-bob"><path d="M16 22v-6a8 8 0 0 1 16 0v6"/></g><path d="M24 30v5" class="a-blink"/>',
  shield: '<path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z"/><path d="M17 24l5 5 9-10" class="a-flow"/>',
  doc: '<path d="M12 4h18l8 8v32H12z"/><path d="M30 4v8h8"/><path d="M17 20h16" class="a-blink"/><path d="M17 26h16" class="a-blink a-d2"/><path d="M17 32h9" class="a-blink a-d3"/>',
  mail: '<rect x="5" y="10" width="38" height="28" rx="2"/><path d="M5 12l19 14 19-14" class="a-flow"/>',
  talk: '<g class="a-bob"><path d="M6 8h24v16H16l-6 6v-6H6z"/></g><g class="a-bob a-d2"><path d="M34 16h8v16h-4v6l-6-6H20v-4"/></g>',
  nodes: '<circle cx="24" cy="24" r="5" class="a-pulse"/><circle cx="8" cy="10" r="3" class="a-blink"/><circle cx="40" cy="10" r="3" class="a-blink a-d2"/><circle cx="8" cy="38" r="3" class="a-blink a-d3"/><circle cx="40" cy="38" r="3" class="a-blink"/><path d="M20 21 10 12M28 21l10-9M20 27l-10 9M28 27l10 9" class="a-flow"/>',
  check: '<path d="M24 5l20 36H4z"/><path d="M16 27l6 6 10-12" class="a-flow"/>',
  bolt: '<path d="M27 4 10 27h12l-3 17 19-25H26z" class="a-blink"/>',
  business: '<rect x="5" y="15" width="38" height="26" rx="2"/><path d="M17 15v-5h14v5M5 26h38"/><rect x="21" y="23" width="6" height="6" rx="1" class="a-pulse"/>',
  kreativ: '<path d="M24 5C13 5 5 13 5 23s8 19 17 19c3 0 3-3 2-5s0-5 3-5h5c6 0 11-4 11-10C43 12 34 5 24 5z"/><circle cx="15" cy="20" r="2.5" class="a-blink"/><circle cx="22" cy="13" r="2.5" class="a-blink a-d2"/><circle cx="31" cy="14" r="2.5" class="a-blink a-d3"/><circle cx="35" cy="22" r="2.5" class="a-blink"/>',
};
$$("svg[data-icon]").forEach((s) => {
  s.setAttribute("viewBox", "0 0 48 48");
  s.setAttribute("aria-hidden", "true");
  s.classList.add("ic");
  s.innerHTML = ICONS[s.dataset.icon] || ICONS.nodes;
});

/* =================================================================
   Formular-Logik (funktioniert auch ohne GSAP)
   ================================================================= */
function initForm() {
  const form = $("#inquiryForm");
  if (!form) return;
  const codeToggle = $("#codeToggle"), codeField = $("#codeField"), codeInput = $("#codeInput");
  const codeBtn = $("#codeBtn"), codeMsg = $("#codeMsg"), codeBox = $("#codeBox");
  let activeCode = null;

  const openCode = (open) => {
    codeToggle.setAttribute("aria-expanded", open);
    if (hasGSAP) gsap.to(codeField, { height: open ? "auto" : 0, duration: .6, ease: "expo.out" });
    else codeField.style.height = open ? "auto" : "0";
    if (open) setTimeout(() => codeInput.focus({ preventScroll: true }), 200);
  };
  codeToggle.addEventListener("click", () => openCode(codeToggle.getAttribute("aria-expanded") !== "true"));

  const unlock = (what) => {
    const targets = [];
    if (what.includes("budget")) targets.push($('#budgetChips .chip[data-locked]'));
    if (what.includes("partner")) targets.push($('#typeChips .chip[data-locked]'));
    targets.filter(Boolean).forEach((chip) => {
      chip.classList.remove("chip--locked");
      chip.classList.add("is-unlocked");
      chip.removeAttribute("data-locked");
      chip.querySelector("input").disabled = false;
      const lock = chip.querySelector(".lock");
      if (hasGSAP) {
        gsap.fromTo(chip, { scale: .7 }, { scale: 1, duration: .9, ease: "elastic.out(1, .4)" });
        if (lock) gsap.to(lock, { rotate: -25, y: -4, opacity: 0, duration: .5, onComplete: () => lock.remove() });
      } else if (lock) lock.remove();
    });
    if (form.dataset.wantType === "Partnerschaft") {
      const r = $('#typeChips input[value="Partnerschaft"]'); if (r) r.checked = true;
    }
  };

  const checkCode = () => {
    const raw = codeInput.value.trim().toUpperCase();
    if (!raw) return;
    const entry = CONFIG.codes[cyrb53(raw)];
    codeBox.classList.remove("is-shake");
    if (entry) {
      activeCode = raw;
      codeMsg.className = "code__msg mono is-ok";
      codeMsg.textContent = "✓ Code akzeptiert. Budgets unter 2.500 € und Partnerschaftsanfragen sind jetzt freigeschaltet.";
      codeInput.disabled = true; codeBtn.disabled = true; codeBtn.textContent = "Aktiv";
      unlock(entry.unlock);
    } else {
      void codeBox.offsetWidth;
      codeBox.classList.add("is-shake");
      codeMsg.className = "code__msg mono is-err";
      codeMsg.textContent = "Dieser Code ist uns nicht bekannt.";
    }
  };
  codeBtn.addEventListener("click", checkCode);
  codeInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); checkCode(); } });

  form.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip[data-locked]");
    if (!chip) return;
    e.preventDefault();
    if (codeToggle.getAttribute("aria-expanded") !== "true") openCode(true);
    codeMsg.className = "code__msg mono is-err";
    codeMsg.textContent = "Dafür brauchst du einen Sondercode.";
  });

  // Vorbelegung über die Adresse: ?problem=…&bereich=KI,Web%20%26%20Software&typ=Partnerschaft
  window.prefillInquiry = (text, areas = [], type) => {
    const msg = $("#messageField");
    if (text && msg && !msg.value) msg.value = text;
    areas.forEach((v) => { const cb = $$('input[name="area"]', form).find((x) => x.value === v); if (cb) cb.checked = true; });
    if (type) {
      const r = $$('input[name="type"]', form).find((x) => x.value === type);
      if (r && !r.disabled) r.checked = true;
      else if (r && r.disabled) {
        form.dataset.wantType = type;
        openCode(true);
        codeMsg.className = "code__msg mono is-err";
        codeMsg.textContent = "Partnerschaften gibt es nur mit Sondercode.";
      }
    }
  };
  if (params.has("problem") || params.has("bereich") || params.has("typ")) {
    prefillInquiry(params.get("problem") || "", (params.get("bereich") || "").split(",").filter(Boolean), params.get("typ"));
  }

  const errorEl = $("#formError");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    $$(".is-invalid", form).forEach((el) => el.classList.remove("is-invalid"));
    const fd = new FormData(form);
    const errors = [];
    const req = (name, label) => {
      const v = (fd.get(name) || "").toString().trim();
      if (!v) { errors.push(label); form.elements[name]?.closest(".field, .consent")?.classList.add("is-invalid"); }
      return v;
    };
    req("name", "Name");
    const email = req("email", "E-Mail");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.push("gültige E-Mail"); form.elements.email.closest(".field").classList.add("is-invalid"); }
    req("message", "Problembeschreibung");
    if (!fd.get("budget")) errors.push("Budgetrahmen");
    if (!fd.get("consent")) { errors.push("Einwilligung"); form.querySelector(".consent").classList.add("is-invalid"); }
    if (errors.length) { errorEl.textContent = "Bitte noch ergänzen: " + errors.join(", ") + "."; return; }
    errorEl.textContent = "";

    const data = {
      Art: fd.get("type"), Budget: fd.get("budget"), Bereiche: fd.getAll("area").join(", ") || "–",
      Name: fd.get("name"), EMail: fd.get("email"), Unternehmen: fd.get("company") || "–", Telefon: fd.get("phone") || "–",
      Sondercode: activeCode ? "ja" : "nein", Problem: fd.get("message"),
    };

    try {
      if (CONFIG.formEndpoint) {
        const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } else {
        const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
        window.location.href = `mailto:${CONFIG.mailTo}?subject=${encodeURIComponent("Anfrage: " + data.Art + " / " + data.Budget)}&body=${encodeURIComponent(body)}`;
      }
      showSuccess();
    } catch (err) {
      errorEl.textContent = "Das hat leider nicht geklappt. Bitte versuch es noch einmal oder schreib uns direkt.";
    }
  });

  function showSuccess() {
    const s = $("#formSuccess");
    s.classList.add("is-visible");
    if (!hasGSAP) return;
    const tri = s.querySelector(".fs-tri"), chk = s.querySelector(".fs-check");
    [tri, chk].forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    gsap.timeline()
      .from(s, { clipPath: "inset(0 0 100% 0)", duration: .8, ease: "expo.inOut" })
      .to(tri, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, "-=.2")
      .to(chk, { strokeDashoffset: 0, duration: .6, ease: "power3.out" }, "-=.3")
      .from(s.querySelectorAll("h3, p"), { y: 40, opacity: 0, stagger: .1, duration: .8, ease: "expo.out" }, "-=.6");
  }
}

/* Menü (ohne GSAP lauffähig) */
function initMenu() {
  const burger = $("#burger"), menu = $("#menu");
  if (!burger || !menu) return;
  const set = (open) => {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", !open);
  };
  burger.addEventListener("click", () => set(burger.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
}

/* Projekt-Filter (projekte.html) */
function initFilter() {
  const shop = $("#shopFilter");
  if (shop) shop.addEventListener("change", () => {
    const v = $("input:checked", shop).value;
    $$(".prod").forEach((f) => f.classList.toggle("is-hidden", !(v === "alle" || f.dataset.world === v || f.dataset.world === "alle")));
    if (hasGSAP) { gsap.fromTo(".prod:not(.is-hidden)", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .04, duration: .6, ease: "expo.out" }); ScrollTrigger.refresh(); }
  });
  const bar = $("#fileFilter");
  if (!bar) return;
  bar.addEventListener("change", () => {
    const v = $("input:checked", bar).value;
    $$(".file").forEach((f) => {
      const show = v === "alle" || f.dataset.cat.split(" ").includes(v);
      f.classList.toggle("is-hidden", !show);
    });
    if (hasGSAP) {
      gsap.fromTo(".file:not(.is-hidden)", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: .05, duration: .6, ease: "expo.out" });
      ScrollTrigger.refresh();
    }
  });
}

/* Suchfelder — „Sag uns ein Stichwort“
   data-probe="network"  → leitet durch das Netzwerk auf derselben Seite
   data-probe="jump"     → springt zum Netzwerk-Abschnitt und startet dort
   data-probe="services" → markiert passende Leistungen
   data-probe="inquiry"  → füllt das Anfrageformular vor */
function initProbes() {
  $$("form[data-probe]").forEach((form) => {
    const input = $("input", form), result = $(".probe__result", form);
    const mode = form.dataset.probe;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) { input.focus(); form.classList.remove("is-shake"); void form.offsetWidth; form.classList.add("is-shake"); return; }

      if (mode === "jump") {
        const target = $("#netzwerk"), net = $("#probeInput");
        if (!target || !net) { location.href = "netzwerk.html?problem=" + encodeURIComponent(text); return; }
        net.value = text;
        const go = () => setTimeout(() => net.form.requestSubmit(), 150);
        // direkt zum Suchfeld im Netzwerk, damit die Einschätzung sichtbar ist
        const dest = net.form;
        if (window.lenisInstance) window.lenisInstance.scrollTo(dest, { offset: -110, duration: 1.4, onComplete: go });
        else { dest.scrollIntoView({ behavior: "smooth" }); setTimeout(go, 900); }
        return;
      }

      const m = matchProblem(text);
      let routed = null;
      if (mode === "network" && window.TAGNET) routed = window.TAGNET.route(text);
      const names = routed ? routed.hits.map((n) => n.l) : (m.all.length ? m.all.map((n) => n.l) : []);
      const guessed = routed ? routed.guessed : !m.all.length;
      const ax = window.ASSIST ? ASSIST.assess(text) : null;
      const areas = [...new Set([...(routed ? routed.inner : m.inner).map((n) => n.area), ...(ax ? ax.areas : [])])].filter((a) => a && a !== "Weiß nicht");

      if (mode === "services") {
        const keys = [...new Set([...m.inner.map((n) => n.slug), ...(window.NETWORK ? NETWORK.inner.filter((n) => areas.includes(n.area)).map((n) => n.slug) : [])])];
        $$(".svc, .prod[data-key]").forEach((s) => s.classList.toggle("is-match", keys.includes(s.dataset.key)));
        $$(".svc, .prod[data-key]").forEach((s) => s.classList.toggle("is-dim", keys.length > 0 && !keys.includes(s.dataset.key)));
      }
      const firstMatch = mode === "services" ? $(".svc.is-match, .prod.is-match") : null;
      const nMatch = $$(".prod.is-match, .svc.is-match").length;
      if (mode === "inquiry" && window.prefillInquiry) {
        const msg = $("#messageField"); if (msg) msg.value = text;
        prefillInquiry("", areas);
      }

      const chips = (guessed ? [] : names).slice(0, 6).map((n, i) => `<span class="hit" style="--i:${i}">${esc(n)}</span>`).join("");
      const heads = guessed ? 3 : names.length * 3 + 2;
      const action = mode === "inquiry"
        ? `<span class="probe__note">Ins Formular übernommen. Unten ergänzen und absenden.</span>`
        : `<a class="probe__take" href="${$("#inquiryForm") ? "#anfrage" : inquiryUrl(text, areas)}">Als Anfrage übernehmen →</a>`;
      const more = firstMatch ? `<a class="probe__more" href="#${firstMatch.id}">${nMatch === 1 ? "1 passende Leistung" : nMatch + " passende Leistungen"} unten markiert ↓</a>` : "";
      result.innerHTML = ax ? ASSIST.render(ax, { take: more + action }) : `<span class="probe__hits">${chips}</span>${more}${action}`;
      const moreA = $(".probe__more", result);
      if (moreA) moreA.addEventListener("click", (ev) => { ev.preventDefault(); window.lenisInstance ? lenisInstance.scrollTo(firstMatch, { offset: -120, duration: 1.4 }) : firstMatch.scrollIntoView({ behavior: "smooth" }); });
      void heads;
      result.classList.add("is-on");
      if (hasGSAP) gsap.from($$(".asx > *", result), { y: 10, opacity: 0, stagger: .06, duration: .6, ease: "power2.out", delay: mode === "network" ? .3 : 0 });

      const take = $(".probe__take", result);
      if (take && take.getAttribute("href") === "#anfrage") {
        take.addEventListener("click", (ev) => {
          ev.preventDefault();
          window.prefillInquiry && prefillInquiry(text, areas);
          const t = $("#anfrage");
          window.lenisInstance ? lenisInstance.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: "smooth" });
        });
      }
    });
    if (window.ASSIST) ASSIST.attach(input, () => form.requestSubmit());
    // Beispiel-Chips
    $$("[data-example]", form.parentElement).forEach((b) => b.addEventListener("click", () => { input.value = b.dataset.example; form.requestSubmit(); }));
  });
  // lange Platzhalter auf schmalen Bildschirmen kürzen
  const shortPh = () => $$("form[data-probe] input").forEach((i) => {
    i.dataset.ph = i.dataset.ph || i.placeholder;
    i.placeholder = window.innerWidth < 560 && i.dataset.ph.length > 28 ? "Dein Problem in einem Satz" : i.dataset.ph;
  });
  shortPh(); window.addEventListener("resize", shortPh);
  // Problem aus der Adresse übernehmen (z. B. netzwerk.html?problem=…)
  const pre = params.get("problem");
  const pf = $('form[data-probe="network"], form[data-probe="services"]');
  if (pre && pf) { $("input", pf).value = pre; setTimeout(() => pf.requestSubmit(), 1600); }
}

/* ---------- Text-Scramble ---------- */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>*+=?";
function scramble(el, opts = {}) {
  const orig = el.dataset.orig ?? el.textContent;
  el.dataset.orig = orig;
  cancelAnimationFrame(el._scr);
  let frame = 0;
  const speed = opts.speed || 2;
  const run = () => {
    el.textContent = orig.split("").map((c, i) => (c === " " || i < frame / speed ? orig[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
    frame++;
    if (frame / speed <= orig.length) el._scr = requestAnimationFrame(run);
    else { el.textContent = orig; opts.onDone && opts.onDone(); }
  };
  run();
}

initForm();
initMenu();
initFilter();

/* =================================================================
   Ab hier: Animationen (nur mit GSAP)
   ================================================================= */
if (!hasGSAP) {
  document.documentElement.classList.add("no-gsap");
  $("#loader")?.remove();
  document.body.classList.remove("is-loading");
  initProbes();
} else {
  gsap.registerPlugin(ScrollTrigger);
  initAnimations();
}

function initAnimations() {
  /* ---------- Smooth Scroll ---------- */
  let lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduceMotion) {
    lenis = new Lenis({ lerp: .09, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    if ($("#loader")) lenis.stop();
    window.lenisInstance = lenis;
  }
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const target = id === "#top" ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- Scramble beim Hover: Navigation, Links, Buttons, Kacheln ---------- */
  $$(".btn").forEach((b) => {
    if ($(".btn__t", b)) return;
    const tn = [...b.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    if (!tn) return;
    const span = document.createElement("span");
    span.className = "btn__t";
    span.textContent = tn.textContent.trim();
    b.replaceChild(span, tn);
    if (b.lastChild !== span) span.insertAdjacentText("afterend", " ");
  });
  const hoverScramble = (trigger, target) => trigger.addEventListener("mouseenter", () => scramble(target));
  void hoverScramble; // ruhig: kein Buchstaben-Flackern mehr

  /* ---------- Schwärzungen ---------- */
  $$(".redact:not([data-manual])").forEach((e) => e.classList.add("is-on"));

  /* ---------- Navigation ein-/ausblenden ---------- */
  const nav = $("#nav");
  if (nav) ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle("is-solid", y > 80);
      nav.classList.toggle("is-hidden", self.direction === 1 && y > 600 && !$("#menu").classList.contains("is-open"));
    },
  });

  /* ---------- Startseite: Loader + Hero ---------- */
  let heroLines, heroTri;
  const isHome = !!$(".hero");
  if (isHome) prepHero();
  runLoader().then(() => {
    document.body.classList.remove("is-loading");
    if (lenis) lenis.start();
    if (isHome) heroIntro(); else pageIntro();
    ScrollTrigger.refresh();
  });

  function runLoader() {
    return new Promise((resolve) => {
      const loader = $("#loader");
      if (!loader) return resolve();
      if (reduceMotion) { loader.remove(); return resolve(); }
      const fast = store.get("tag-seen") === "1";
      store.set("tag-seen", "1");

      const counter = { v: 0 }, countEl = $("#loaderCount");
      const loaded = new Promise((r) => {
        const done = () => (document.fonts ? document.fonts.ready.then(r) : r());
        if (document.readyState === "complete") done(); else window.addEventListener("load", done, { once: true });
        setTimeout(r, 5000);
      });
      gsap.set(".loader__line span", { yPercent: 110 });

      /* Das Logo aus Punkten: fliegt zusammen, leuchtet auf, landet im Hero */
      const cv = $(".loader__dots", loader), ctx = cv.getContext("2d");
      const dpr = Math.min(devicePixelRatio || 1, 2);
      let VW = innerWidth, VH = innerHeight;
      cv.width = VW * dpr; cv.height = VH * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const P = [];
      const st = { p: 0, sweep: -1, land: 0, fade: 1 };
      let box = null, dest = null, raf = 0;
      const img = new Image();
      img.src = "assets/img/emblem.webp";
      const ready = new Promise((r) => { img.onload = r; img.onerror = r; setTimeout(r, 2500); });
      ready.then(() => {
        if (!img.naturalWidth) return;
        const bw = Math.min(620, VW * .8), bh = bw * img.naturalHeight / img.naturalWidth;
        box = { x: (VW - bw) / 2, y: (VH - bh) / 2 - VH * .04, w: bw, h: bh };
        const sw = Math.round(bw), sh = Math.round(bh);
        const c2 = document.createElement("canvas"); c2.width = sw; c2.height = sh;
        const x2 = c2.getContext("2d", { willReadFrequently: true });
        x2.drawImage(img, 0, 0, sw, sh);
        let d; try { d = x2.getImageData(0, 0, sw, sh).data; } catch (e) { return; }
        const step = VW < 720 ? 4.6 : 5.6;
        for (let row = 0, y = 0; y < sh; y += step * .87, row++) {
          for (let x = row % 2 ? step / 2 : 0; x < sw; x += step) {
            const i = ((y | 0) * sw + (x | 0)) * 4;
            if (d[i + 3] < 128) continue;
            const lum = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255;
            if (lum < .1) continue;
            const ang = Math.random() * Math.PI * 2, rad = Math.max(VW, VH) * (.55 + Math.random() * .5);
            const r = Math.random();
            P.push({
              u: x / sw, v: y / sh, lum,
              sx: VW / 2 + Math.cos(ang) * rad, sy: VH / 2 + Math.sin(ang) * rad,
              spin: 0, del: Math.random() * .3,
              size: .8 + lum * (step * .5),
              col: lum > .78 && r > .6 ? (r > .9 ? "254,177,146" : "1,179,108") : "234,237,235",
              a: .4 + lum * .6,
            });
          }
        }
        const draw = () => {
          ctx.clearRect(0, 0, VW, VH);
          const B = dest ? { x: box.x + (dest.x - box.x) * st.land, y: box.y + (dest.y - box.y) * st.land, w: box.w + (dest.w - box.w) * st.land, h: box.h + (dest.h - box.h) * st.land } : box;
          const k = B.w / box.w;
          for (let n = 0; n < P.length; n++) {
            const q = P[n];
            let t = Math.min(1, Math.max(0, (st.p - q.del) / (1 - q.del)));
            t = 1 - Math.pow(1 - t, 3);
            const tx = B.x + q.u * B.w, ty = B.y + q.v * B.h;
            // Spirale hinein
            const sp = q.spin * (1 - t);
            const dx = q.sx - tx, dy = q.sy - ty;
            const cx = tx + (dx * Math.cos(sp) - dy * Math.sin(sp)) * (1 - t);
            const cy = ty + (dx * Math.sin(sp) + dy * Math.cos(sp)) * (1 - t);
            const glow = Math.max(0, 1 - Math.abs(q.u - st.sweep) * 7);
            ctx.globalAlpha = Math.min(1, (q.a * t + glow * .6) * st.fade);
            ctx.fillStyle = glow > .25 ? "rgba(1,179,108,1)" : "rgb(" + q.col + ")";
            const s = q.size * (1 + glow * .9) * Math.max(.55, k);
            ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
          }
          ctx.globalAlpha = 1;
          raf = requestAnimationFrame(draw);
        };
        draw();
      });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.timeScale(fast ? 2 : 1);
      tl.to(counter, { v: 100, duration: 1.7, ease: "power2.inOut", onUpdate: () => (countEl.textContent = String(Math.round(counter.v)).padStart(3, "0")) }, 0)
        .to(st, { p: 1, duration: 1.5, ease: "power2.out" }, .1)
        .to(".loader__line span", { yPercent: 0, duration: .8 }, .9);

      tl.eventCallback("onComplete", () => {
        Promise.all([loaded, ready]).then(() => {
          // Ziel: das Logo im Hero (ohne die Start-Skalierung)
          const hl = $(".hero__apes");
          if (hl && box) {
            const r = hl.getBoundingClientRect(), w = hl.offsetWidth, h = hl.offsetHeight;
            if (w > 0) dest = { x: r.left + r.width / 2 - w / 2, y: r.top + r.height / 2 - h / 2, w, h };
          }
          const out = gsap.timeline({ onComplete: () => { cancelAnimationFrame(raf); loader.remove(); resolve(); } });
          out.to(".loader__line span", { yPercent: -110, duration: .5, ease: "expo.in" }, 0)
            .to(".loader__meta", { opacity: 0, duration: .4 }, .1)
            .to(".loader__panel", { yPercent: -101, duration: 1.1, ease: "expo.inOut", stagger: { each: .1, from: "center" } }, .2);
          if (dest) {
            out.to(st, { land: 1, duration: 1.2, ease: "expo.inOut" }, .25)
              .to(".hero__apes", { opacity: 1, duration: .6, ease: "power2.out" }, 1.2)
              .to(st, { fade: 0, duration: .6, ease: "power2.in" }, 1.25);
          } else {
            out.to(st, { p: 0, duration: 1, ease: "expo.in" }, .1).to(st, { fade: 0, duration: .4 }, .7);
          }
          out.add(() => loader.classList.add("is-done"), .9);
        });
      });
    });
  }

  function prepHero() {
    heroLines = $$(".hero__title .line__inner");
    gsap.set(heroLines, { yPercent: 130 });
    gsap.set(".hero__apes", { opacity: 0 });
    gsap.set(".hero__ringwrap", { opacity: 0 });
    gsap.set([".kicker", ".hero__lead", ".hprobe", ".hprobe__tags", ".hero__facts", ".hero__scroll", ".nav"], { opacity: 0, y: 12 });
    gsap.set(".hg-lines line", { scale: 0, transformOrigin: "center" });
    heroTri = $(".hg-tri"); const triL = heroTri.getTotalLength();
    gsap.set(heroTri, { strokeDasharray: triL, strokeDashoffset: triL });
  }
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(".hg-lines line", { scale: 1, duration: 1.6, stagger: .08, ease: "expo.inOut" }, 0)
      .to(heroTri, { strokeDashoffset: 0, duration: 2.2, ease: "power3.inOut" }, .1)
      .to(".hero__apes", { opacity: 1, duration: 1 }, .1)
      .to(".hero__ringwrap", { opacity: 1, duration: 1.6, ease: "power1.out" }, .4)
      .to(heroLines, { yPercent: 0, duration: 1.3, stagger: .1 }, .2)
      .to([".nav", ".kicker", ".hero__lead", ".hprobe", ".hprobe__tags", ".hero__facts", ".hero__scroll"], { opacity: 1, y: 0, duration: 1.2, stagger: .06 }, .7)
      .add(() => gsap.set(".nav", { clearProps: "transform" }))
;

    // Platzhalter im Suchfeld tippt sich selbst
    const inp = $(".hprobe input");
    if (inp && false) {
      const ex = ["Unser Support ertrinkt in Anfragen", "Wir brauchen einen Sponsor für die Convention", "Die Website verkauft nicht", "Ein Werk diskret verkaufen", "Unser Team zerfällt"];
      let i = 0;
      const type = () => {
        if (document.activeElement === inp || inp.value) return setTimeout(type, 2000);
        const s = ex[i++ % ex.length]; let k = 0;
        const step = () => { inp.placeholder = s.slice(0, ++k) + (k < s.length ? "▍" : ""); if (k < s.length) setTimeout(step, 45); else setTimeout(type, 2600); };
        step();
      };
      setTimeout(type, 1800);
    }
  }

  if (isHome) {
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } })
      .to(".hero__content", { opacity: .4 }, 0)
      .to(".hero__emblem", { opacity: .35 }, 0);
  }

  /* ---------- Unterseiten: Seitenkopf ---------- */
  function pageIntro() {
    const d = window.TAG_PT_DELAY || .1;
    const ph = $(".phero");
    if (!ph) return;
    const tl = gsap.timeline({ delay: d, defaults: { ease: "expo.out" } });
    tl.from($$(".phero__title .line__inner", ph), { yPercent: 130, duration: 1.3, stagger: .1 }, 0)
      .from($$(".phero__lead, .phero__aside, .phero__actions", ph), { y: 30, opacity: 0, duration: 1.1, stagger: .08 }, .35);
    const art = $$(".phero__art path, .phero__art circle, .phero__art line", ph);
    art.forEach((p) => { if (p.getTotalLength) { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); } });
    tl.to(art, { strokeDashoffset: 0, duration: 2, stagger: .04, ease: "power3.inOut", onComplete: () => gsap.set(art, { clearProps: "strokeDasharray,strokeDashoffset" }) }, .1);
    const big = $(".phero__bg", ph);
    if (big) tl.from(big, { yPercent: 30, opacity: 0, duration: 2 }, 0);
  }

  /* ---------- Allgemeine Reveals ---------- */
  $$(".reveal-words").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="line" style="display:inline-block;vertical-align:top"><span class="line__inner">${w}</span></span>`).join(" ");
    gsap.from(el.querySelectorAll(".line__inner"), { yPercent: 130, duration: 1.1, ease: "expo.out", stagger: .05, scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  $$(".h2--xl").forEach((el) => {
    gsap.from(el.querySelectorAll(".line__inner"), { yPercent: 130, duration: 1.3, ease: "expo.out", stagger: .12, scrollTrigger: { trigger: el, start: "top 80%" } });
  });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%", once: true,
    onEnter: (els) => gsap.fromTo(els, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power2.out", stagger: .06 }),
  });
  gsap.set("[data-reveal]", { opacity: 0 });
  $$("[data-media]").forEach((m) => {
    const img = $("img", m);
    void img;
    gsap.from(m, { opacity: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: m, start: "top 88%" } });
  });
  // Icons zeichnen sich
  ScrollTrigger.batch(".ic", {
    start: "top 90%", once: true,
    onEnter: (els) => els.forEach((s, i) => drawIcon(s, i * .06)),
  });
  function drawIcon(s, delay = 0) {
    const parts = $$("path, circle, rect, line", s).filter((p) => !p.classList.contains("f"));
    parts.forEach((p) => { const L = p.getTotalLength ? p.getTotalLength() : 100; gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    s.classList.remove("is-live");
    gsap.to(parts, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: .07, delay,
      onComplete: () => { gsap.set(parts, { clearProps: "strokeDasharray,strokeDashoffset" }); s.classList.add("is-live"); } });
  }
  window.TAG_DRAW = drawIcon;
  $$("[data-redraw]").forEach((t) => t.addEventListener("mouseenter", () => { const s = $(".ic", t); if (s) drawIcon(s); }));

  $$("[data-count]").forEach((el) => {
    const target = +el.dataset.count; const o = { v: 0 };
    gsap.to(o, { v: target, duration: 2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => (el.textContent = el.hasAttribute("data-sep") ? Math.round(o.v).toLocaleString("de-DE") : Math.round(o.v)) });
  });

  initEye();
  initVault();
  initStats();
  initSvcx();

  /* ---------- Prinzipien ---------- */
  $$(".pcard, .vow").forEach((card, i) => {
    const strokes = $$(".pi-stroke", card);
    strokes.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    const tl = gsap.timeline({ scrollTrigger: { trigger: card.parentElement, start: "top 80%" } });
    tl.from(card, { y: 16, opacity: 0, duration: .9, ease: "power2.out", delay: (i % 3) * .1 })
      .to(strokes, { strokeDashoffset: 0, duration: 1.2, stagger: .12, ease: "power2.inOut" }, "-=.8")
      .from($$(".pi-fill", card), { scale: 0, transformOrigin: "center", duration: .8, ease: "back.out(2)" }, "-=.6")
      .add(() => { gsap.set(strokes, { clearProps: "strokeDasharray,strokeDashoffset" }); card.classList.add("is-live"); });
  });

  $$("svg[data-dots]").forEach(initDots);
  $$("svg[data-morph]").forEach(initMorph);

  /* ---------- Protokoll (Akte mit Schwärzungen) ---------- */
  const proto = $(".protocol__doc");
  if (proto) {
    gsap.from(proto, { y: 20, opacity: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: proto, start: "top 85%" } });
    const stamp = $(".protocol__stamp");
    if (stamp) gsap.fromTo(stamp, { opacity: 0 }, { opacity: 1, rotate: -12, duration: .8, scrollTrigger: { trigger: proto, start: "top 55%" } });
  }

  /* ---------- Netzwerk ---------- */
  const nsvg = $("#networkSvg");
  if (nsvg) window.TAGNET = initNetwork(nsvg);
  initProbes();

  /* ---------- Statement-Band (gerade, läuft mit dem Scrollen) ---------- */
  if ($(".statement")) {
    gsap.fromTo(".statement__row--a", { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: .5 } });
    gsap.fromTo(".statement__row--b", { xPercent: -35 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: .5 } });
  }

  /* ---------- Leistungs-Kacheln ---------- */
  $$(".shop").forEach((g) => gsap.fromTo($$(".prod", g), { opacity: 0 }, { opacity: 1, duration: .8, ease: "power2.out", stagger: .03, clearProps: "transform,opacity", scrollTrigger: { trigger: g, start: "top 88%" } }));
  $$(".tiles").forEach((g) => gsap.from($$(".tile", g), { y: 16, opacity: 0, duration: .9, ease: "power2.out", stagger: .05, scrollTrigger: { trigger: g, start: "top 85%" } }));
  $$(".worlds__head").forEach((h) => gsap.from(h, { clipPath: "inset(0 100% 0 0)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: h, start: "top 85%" } }));

  /* ---------- Akten (Projekte) ---------- */
  $$(".file").forEach((f) => {
    const stamp = $(".file__stamp", f);
    const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: "top 88%", once: true } });
    tl.fromTo(f, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "power2.out", clearProps: "transform,opacity" });
    if (stamp) tl.fromTo(stamp, { opacity: 0 }, { opacity: 1, duration: .6 }, .4);
  });

  /* ---------- Partner ---------- */
  if ($(".logos")) gsap.from(".logos__row", { opacity: 0, duration: 1, ease: "power2.out", stagger: .1, scrollTrigger: { trigger: ".logos", start: "top 85%" } });
  if ($(".sponsor")) gsap.from(".scase", { y: 16, opacity: 0, duration: .9, ease: "power2.out", stagger: .1, scrollTrigger: { trigger: ".sponsor", start: "top 80%" } });

  /* ---------- Prozess: Karten stapeln sich ---------- */
  const cards = $$(".stack__card");
  cards.forEach((card, i) => {
    const art = $(".stack__art", card);
    if (!art) return;
    const lines = $$("path, circle, rect, line", art).filter((p) => !p.classList.contains("sa-fill"));
    lines.forEach((p) => { const L = p.getTotalLength ? p.getTotalLength() : 200; gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 70%" } });
    tl.to(lines, { strokeDashoffset: 0, duration: 1.4, stagger: .05, ease: "power2.inOut" })
      .from($$(".sa-fill", art), { scale: 0, transformOrigin: "center", stagger: .08, duration: .6, ease: "back.out(2)" }, "-=.6")
      .from($$(".stack__num", card), { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out" }, 0);
    tl.add(() => { gsap.set(lines, { clearProps: "strokeDasharray,strokeDashoffset" }); art.classList.add("is-live"); });
  });

  /* ---------- Formular ---------- */
  $$(".form__block").forEach((b) => gsap.from(b, { y: 16, opacity: 0, duration: .8, ease: "power2.out", scrollTrigger: { trigger: b, start: "top 88%" } }));

  /* ---------- FAQ ---------- */
  $$(".faq details").forEach((d) => {
    const body = $(".faq__a", d);
    d.addEventListener("toggle", () => { if (d.open) gsap.from(body, { height: 0, opacity: 0, duration: .6, ease: "expo.out", clearProps: "height" }); });
  });

  /* ---------- Footer ---------- */
  if ($(".footer__giant")) gsap.from(".footer__giant span", { yPercent: 100, opacity: 0, duration: 1.4, ease: "expo.out", stagger: .1, scrollTrigger: { trigger: ".footer__giant", start: "top 95%" } });

  window.addEventListener("load", () => ScrollTrigger.refresh());
}

/* =================================================================
   Das Auge — öffnet sich, wird zugehalten, das Netzwerk übernimmt
   ================================================================= */
function initEye() {
  const svg = $("#eyeSvg");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const mk = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent && parent.appendChild(n); return n; };
  const fib = $("#irisFibers", svg), iris = $("#eyeIris", svg), pupil = $("#eyePupil", svg);
  const cols = ["#01B36C", "#0b7f50", "#2bd08a"];
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const r1 = 46 + Math.random() * 6, r2 = 96 + Math.random() * 28;
    mk("line", { x1: 500 + Math.cos(a) * r1, y1: 300 + Math.sin(a) * r1, x2: 500 + Math.cos(a) * r2, y2: 300 + Math.sin(a) * r2, stroke: cols[i % 3], "stroke-width": i % 4 ? 1 : 1.8, opacity: .5 }, fib);
  }
  const clip = $("#eyeClipShape", svg), lidU = $(".eye-lid--u", svg), lidL = $(".eye-lid--l", svg);
  const L = { x: 170, y: 300 }, R = { x: 830, y: 300 };
  const st = { o: reduceMotion || !hasGSAP ? 1 : 0, blink: 1 };
  const gz = { x: 0, y: 0 }, tg = { x: 0, y: 0 };
  function draw() {
    const o = Math.max(0, Math.min(1, st.o * st.blink));
    // das Oberlid folgt dem Blick ein wenig (schaut das Auge nach unten, senkt es sich)
    const uy = 300 - 280 * o + 40 * (1 - o) + gz.y * 26 * o, ly = 300 + 200 * o + 40 * (1 - o) + gz.y * 10 * o;
    clip.setAttribute("d", `M${L.x} ${L.y} Q500 ${uy} ${R.x} ${R.y} Q500 ${ly} ${L.x} ${L.y} Z`);
    lidU.setAttribute("d", `M${L.x - 6} ${L.y + 2} Q500 ${uy} ${R.x + 6} ${R.y + 2}`);
    lidL.setAttribute("d", `M${L.x} ${L.y} Q500 ${ly} ${R.x} ${R.y}`);
    iris.setAttribute("transform", `translate(${(gz.x * 78).toFixed(1)} ${(gz.y * 30).toFixed(1)})`);
  }
  draw();
  if (!hasGSAP || reduceMotion) return;
  let inView = false, lastPointer = 0;
  ScrollTrigger.create({ trigger: svg, start: "top 75%", once: true, onEnter: () => gsap.to(st, { o: 1, duration: 1.8, ease: "power2.inOut", onUpdate: draw }) });
  ScrollTrigger.create({ trigger: svg, start: "top bottom", end: "bottom top", onToggle: (self) => (inView = self.isActive) });

  // Blick folgt der Maus, sanft gedämpft
  const sec = svg.closest("section") || document;
  sec.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const b = svg.getBoundingClientRect();
    const dx = (e.clientX - (b.left + b.width / 2)) / (window.innerWidth * .45);
    const dy = (e.clientY - (b.top + b.height / 2)) / (window.innerHeight * .5);
    tg.x = Math.max(-1, Math.min(1, dx)); tg.y = Math.max(-1, Math.min(1, dy));
    lastPointer = performance.now();
  });
  // ohne Maus: schaut sich ruhig um, mit kurzen Pausen
  const LOOK = [[0, 0], [-.7, -.2], [.65, -.25], [.2, .55], [-.45, .4], [.8, .1], [0, -.35]];
  const wander = () => {
    if (inView && performance.now() - lastPointer > 2600) { const p = LOOK[(Math.random() * LOOK.length) | 0]; tg.x = p[0]; tg.y = p[1]; }
    setTimeout(wander, 1600 + Math.random() * 2000);
  };
  setTimeout(wander, 2400);
  gsap.ticker.add(() => {
    if (!inView) return;
    const ex = tg.x - gz.x, ey = tg.y - gz.y;
    if (Math.abs(ex) < .001 && Math.abs(ey) < .001) return;
    gz.x += ex * .07; gz.y += ey * .07;
    draw();
  });
  // Pupille atmet, Iris dreht sich ganz langsam
  gsap.to(pupil, { attr: { r: 47 }, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to(fib, { rotation: 360, svgOrigin: "500 300", duration: 140, ease: "none", repeat: -1 });
  // Blinzeln alle paar Sekunden, ab und zu doppelt
  const blinkOnce = (tl) => tl.to(st, { blink: .04, duration: .12, ease: "power1.in", onUpdate: draw }).to(st, { blink: 1, duration: .26, ease: "power1.out", onUpdate: draw });
  const blink = () => {
    if (inView && st.o > .95 && !document.hidden) {
      const tl = gsap.timeline();
      blinkOnce(tl);
      if (Math.random() < .25) { tl.to({}, { duration: .12 }); blinkOnce(tl); }
    }
    setTimeout(blink, 3800 + Math.random() * 3200);
  };
  setTimeout(blink, 3500);
}

/* =================================================================
   01 — Schutz-Dreieck: dein Problem in der Mitte, Fragen von außen prallen ab
   ================================================================= */
function initVault() {
  const svg = $("#vaultSvg");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); (p || svg).appendChild(e); return e; };
  const A = [400, 70], B = [128, 540], C = [672, 540], O = [400, 383];
  const P = [A, B, C];
  const gProbe = $(".vt-probes", svg), gEdge = $(".vt-edges", svg);
  const edges = [[A, B], [B, C], [C, A]].map(([p, q]) => mk("line", { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: "vt-edge" }, gEdge));
  const fill = $(".vt-fill", svg), core = $(".vt-core", svg), halo = $$(".vt-halo", svg), nodes = $$(".vt-node", svg), lab = $(".vt-label", svg);

  const final = () => { gsap.set(edges, { strokeDashoffset: 0 }); gsap.set([fill, core, lab, ...nodes], { opacity: 1, scale: 1 }); };
  edges.forEach((l) => { const L = Math.hypot(l.x2.baseVal.value - l.x1.baseVal.value, l.y2.baseVal.value - l.y1.baseVal.value); l.style.strokeDasharray = L; l.style.strokeDashoffset = L; });
  if (!hasGSAP || reduceMotion) { edges.forEach((l) => (l.style.strokeDashoffset = 0)); [fill, core, lab, ...nodes].forEach((e) => (e.style.opacity = 1)); return; }

  const halos = $(".vt-halos", svg), cap = $(".vt-cap", svg), corners = $$(".vt-corner", svg);
  gsap.set([fill, lab, halos, cap, ...corners, ...nodes], { opacity: 0 });
  gsap.set(nodes, { scale: 0, transformOrigin: "center" });
  gsap.set(core, { opacity: 0, attr: { cx: -40 } });
  let ready = false, inView = false;
  const intro = gsap.timeline({ paused: true, onComplete: () => (ready = true) })
    .to(core, { opacity: 1, duration: .3 })
    .to(core, { attr: { cx: O[0] }, duration: 1.4, ease: "power3.out" }, 0)
    .to(edges, { strokeDashoffset: 0, duration: 1.1, stagger: .12, ease: "power2.inOut" }, .9)
    .to(nodes, { opacity: 1, scale: 1, duration: .5, stagger: .1, ease: "back.out(2)" }, 1.8)
    .to(fill, { opacity: 1, duration: 1 }, 1.9)
    .to([lab, halos], { opacity: 1, duration: .6 }, 2.2)
    .to(corners, { opacity: 1, duration: .6, stagger: .12 }, 2)
    .to(cap, { opacity: 1, duration: .8 }, 2.6);
  ScrollTrigger.create({ trigger: svg, start: "top 75%", once: true, onEnter: () => intro.play() });
  ScrollTrigger.create({ trigger: svg, start: "top bottom", end: "bottom top", onToggle: (s) => (inView = s.isActive) });
  void final;

  // Problem atmet
  halo.forEach((h, i) => gsap.fromTo(h, { attr: { r: 16 }, opacity: .5 }, { attr: { r: 60 }, opacity: 0, duration: 3.2, ease: "power1.out", repeat: -1, delay: i * 1.6 }));

  // Fragen von außen
  const QS = ["Wer?", "Kunde?", "Name?", "Wie viel?", "Worum geht's?", "Für wen?", "Was genau?", "Wer noch?"];
  const hit = (s, d) => { // Strahl s→Mitte trifft Kante?
    let best = null;
    edges.forEach((l, i) => {
      const [p, q] = [P[i], P[(i + 1) % 3]];
      const r = [d[0] - s[0], d[1] - s[1]], e = [q[0] - p[0], q[1] - p[1]];
      const den = r[0] * e[1] - r[1] * e[0]; if (!den) return;
      const t = ((p[0] - s[0]) * e[1] - (p[1] - s[1]) * e[0]) / den, u = ((p[0] - s[0]) * r[1] - (p[1] - s[1]) * r[0]) / den;
      if (t > 0 && t < 1 && u >= 0 && u <= 1 && (!best || t < best.t)) best = { t, i, x: s[0] + r[0] * t, y: s[1] + r[1] * t };
    });
    return best;
  };
  const probe = () => {
    if (!ready || !inView || document.hidden) return;
    const side = (Math.random() * 3) | 0; // links, rechts, oben
    const s = side === 0 ? [-10, 60 + Math.random() * 500] : side === 1 ? [810, 60 + Math.random() * 500] : [60 + Math.random() * 680, -10];
    const h = hit(s, O); if (!h) return;
    const g = mk("g", { class: "vt-q" }, gProbe);
    const trail = mk("line", { x1: s[0], y1: s[1], x2: s[0], y2: s[1], class: "vt-trail" }, g);
    const dot = mk("circle", { cx: s[0], cy: s[1], r: 4.5, class: "vt-dot" }, g);
    const txt = mk("text", { x: s[0], y: s[1] - 12, class: "vt-qt", "text-anchor": side === 1 ? "end" : "start" }, g);
    txt.textContent = QS[(Math.random() * QS.length) | 0];
    const pos = { x: s[0], y: s[1] };
    const upd = () => { dot.setAttribute("cx", pos.x); dot.setAttribute("cy", pos.y); trail.setAttribute("x2", pos.x); trail.setAttribute("y2", pos.y); txt.setAttribute("x", pos.x + (side === 1 ? -10 : 10)); txt.setAttribute("y", pos.y - 12); };
    const back = [s[0] + (h.x - s[0]) * .82, s[1] + (h.y - s[1]) * .82];
    const ring = mk("circle", { cx: h.x, cy: h.y, r: 4, class: "vt-ripple", opacity: 0 }, gProbe);
    gsap.timeline({ onComplete: () => { g.remove(); ring.remove(); } })
      .to(pos, { x: h.x, y: h.y, duration: 2.2, ease: "power1.in", onUpdate: upd })
      .add(() => edges[h.i].classList.add("is-hit"))
      .to(ring, { attr: { r: 26 }, opacity: 0, duration: .9, ease: "power2.out", startAt: { opacity: .9 } })
      .to(pos, { x: back[0], y: back[1], duration: .8, ease: "power2.out", onUpdate: upd }, "<")
      .to(g, { opacity: 0, duration: .7 }, "<.1")
      .add(() => edges[h.i].classList.remove("is-hit"), "-=.2");
  };
  setInterval(probe, 1500);
  // die drei Ecken halten nacheinander kurz Wache
  let k = 0;
  setInterval(() => { if (!ready || !inView) return; const n = nodes[k++ % 3]; gsap.fromTo(n, { scale: 1 }, { scale: 1.35, duration: .35, yoyo: true, repeat: 1, ease: "power1.inOut" }); }, 2200);
}

/* =================================================================
   Punkte aus dem Logo — data-dots="mid" (mittlerer Affe) oder "full" (ganzes Logo)
   ================================================================= */
function initDots(svg) {
  const NS = "http://www.w3.org/2000/svg";
  const full = svg.dataset.dots === "full";
  const vb = svg.viewBox.baseVal, W = vb.width, H = vb.height;
  const trig = svg.closest("[data-dots-trigger]") || svg.parentElement;
  const img = new Image();
  img.src = "assets/img/emblem.webp";
  img.onload = () => {
    const sx = full ? 0 : img.width * .335, sw = full ? img.width : img.width * .33;
    const sy = full ? 0 : img.height * .1, sh = full ? img.height : img.height * .84;
    const scale = Math.min((W - 20) / sw, (H - 10) / sh);
    const cw = Math.round(sw * scale), ch = Math.round(sh * scale);
    const cv = document.createElement("canvas");
    cv.width = cw; cv.height = ch;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    let data;
    try { data = ctx.getImageData(0, 0, cw, ch).data; } catch (e) { return; }
    const ox = (W - cw) / 2, oy = (H - ch) / 2;
    const step = full ? 9.5 : 9;
    const pts = [];
    for (let row = 0, y = 0; y < ch; y += step * .87, row++) {
      for (let x = row % 2 ? step / 2 : 0; x < cw; x += step) {
        const i = ((y | 0) * cw + (x | 0)) * 4;
        if (data[i + 3] / 255 < .5) continue;
        const lum = (data[i] * .3 + data[i + 1] * .59 + data[i + 2] * .11) / 255;
        if (lum < .12) continue;                                   // die Form entsteht aus dem Licht
        if (!full) {
          const ex = (x - cw / 2) / (cw * .5), ey = (y - ch * .56) / (ch * .56);
          if (ex * ex + ey * ey > 1) continue;                     // nur der mittlere Affe
        }
        pts.push([ox + x, oy + y, lum]);
      }
    }
    const frag = document.createDocumentFragment();
    const dots = pts.map(([x, y, lum]) => {
      const c = document.createElementNS(NS, "circle");
      const r = Math.random();
      const accent = lum > .78 && r > .55;
      c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1));
      c.setAttribute("r", (accent ? 3 : .6 + lum * 3.4).toFixed(2));
      c.setAttribute("class", "cr-dot" + (accent ? (r > .85 ? " cr-dot--p" : " cr-dot--g") : "") + (r < .1 ? " cr-tw" : ""));
      c.dataset.o = (accent ? 1 : .25 + lum * .75).toFixed(2);
      if (r < .1) c.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
      frag.appendChild(c);
      return c;
    });
    const gLinks = document.createElementNS(NS, "g");
    svg.appendChild(gLinks);
    svg.appendChild(frag);
    const hubs = dots.filter((d) => d.classList.contains("cr-dot--p") || d.classList.contains("cr-dot--g"));

    // Punkte fliegen aus allen Richtungen zusammen
    const spread = full ? 1300 : 900;
    gsap.set(dots, { x: () => (Math.random() - .5) * spread, y: () => (Math.random() - .5) * spread, opacity: 0 });
    if (svg.hasAttribute("data-dots-intro")) {
      // im Seitenkopf: läuft beim Laden ab, nicht mit dem Scrollen
      gsap.to(dots, { x: 0, y: 0, opacity: (i, el) => el.dataset.o, duration: 2.2, ease: "expo.out", stagger: { amount: 1, from: "random" }, delay: .3 });
    } else {
      gsap.timeline({ scrollTrigger: { trigger: trig, start: "top 85%", end: "center 55%", scrub: 1 } })
        .to(dots, { x: 0, y: 0, opacity: (i, el) => el.dataset.o, duration: 1, ease: "power3.out", stagger: { amount: .6, from: "random" } });
    }
    ScrollTrigger.refresh();

    if (reduceMotion || hubs.length < 2) return;
    let live = false;
    ScrollTrigger.create({ trigger: trig, start: "top 60%", end: "bottom top", onToggle: (self) => (live = self.isActive) });
    setInterval(() => {
      if (!live) return;
      const a = hubs[(Math.random() * hubs.length) | 0], b = hubs[(Math.random() * hubs.length) | 0];
      if (a === b) return;
      const l = document.createElementNS(NS, "line");
      l.setAttribute("x1", a.getAttribute("cx")); l.setAttribute("y1", a.getAttribute("cy"));
      l.setAttribute("x2", b.getAttribute("cx")); l.setAttribute("y2", b.getAttribute("cy"));
      l.setAttribute("class", "cr-link");
      gLinks.appendChild(l);
      const len = l.getTotalLength ? l.getTotalLength() : 200;
      gsap.timeline({ onComplete: () => l.remove() })
        .fromTo(l, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: .7, ease: "power2.out" })
        .to([a, b], { attr: { r: 4.5 }, duration: .25, yoyo: true, repeat: 1 }, .5)
        .to(l, { opacity: 0, duration: .6 }, "+=.3");
    }, full ? 420 : 520);
  };
}

/* =================================================================
   Kennzahlen — jede Zahl bekommt ein kleines Bild
   ================================================================= */
function initStats() {
  $$(".stat__viz").forEach((v) => {
    const n = +v.dataset.n, kind = v.dataset.viz;
    v.classList.add("stat__viz--" + kind);
    v.innerHTML = Array.from({ length: n }, () => "<i></i>").join("");
    const els = $$("i", v);
    if (!hasGSAP) { els.forEach((e) => e.classList.add("is-on")); return; }
    ScrollTrigger.create({ trigger: v, start: "top 92%", once: true, onEnter: () => {
      els.forEach((e, i) => setTimeout(() => e.classList.add("is-on"), (i / n) * 1800));
    } });
  });
}

/* =================================================================
   03 — Leistungen als Klick-Galerie
   ================================================================= */
function initSvcx() {
  const box = $("[data-svcx]");
  if (!box) return;
  const btns = $$(".svcx__btn", box), items = $$(".svcx__item", box), bar = $(".svcx__bar span", box);
  let cur = 0, timer = null, auto = false, inView = false;
  const DUR = 5200;
  const show = (i) => {
    if (i === cur) return;
    btns[cur].classList.remove("is-on"); items[cur].classList.remove("is-on");
    cur = i;
    btns[cur].classList.add("is-on"); items[cur].classList.add("is-on");
    const ic = $(".ic", items[cur]);
    if (ic && window.TAG_DRAW) window.TAG_DRAW(ic);
    if (hasGSAP) gsap.fromTo($$(".svcx__body > *", items[cur]), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .05, ease: "expo.out" });
    const list = $(".svcx__list", box);
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: btns[cur].offsetLeft - 16, behavior: "smooth" });
  };
  const tick = () => {
    clearTimeout(timer);
    if (bar) { bar.style.transition = "none"; bar.style.transform = "scaleX(0)"; void bar.offsetWidth; }
    if (!auto || !inView || reduceMotion) return;
    if (bar) { bar.style.transition = `transform ${DUR}ms linear`; bar.style.transform = "scaleX(1)"; }
    timer = setTimeout(() => { show((cur + 1) % items.length); tick(); }, DUR);
  };
  btns.forEach((b, i) => b.addEventListener("click", () => { auto = false; show(i); tick(); }));
  if (hasGSAP) ScrollTrigger.create({ trigger: box, start: "top 75%", end: "bottom 25%", onToggle: (self) => { inView = self.isActive; tick(); } });
}

/* =================================================================
   Seitenkopf der Unterseiten — Punkte formen nacheinander Symbole
   ================================================================= */
function initMorph(svg) {
  const NS = "http://www.w3.org/2000/svg";
  const W = 400, H = 320, N = window.innerWidth < 720 ? 480 : 760;
  const keys = svg.dataset.morph.split(","), caps = (svg.dataset.cap || "").split("|");
  const mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const gL = mk("g", { class: "pd-links" }, svg);
  const gD = mk("g", {}, svg);
  const cap = mk("text", { x: W / 2, y: H - 4, "text-anchor": "middle", class: "pd-cap" }, svg);
  const rnd = () => [20 + Math.random() * (W - 40), 10 + Math.random() * (H - 50)];
  const dots = Array.from({ length: N }, (_, i) => {
    const [x, y] = rnd(), r = Math.random();
    return mk("circle", { cx: x, cy: y, r: r > .975 ? 2.6 : .9 + Math.random() * 1.1, class: "pd-dot" + (r > .975 ? " pd-dot--p" : r > .8 ? " pd-dot--g" : ""), opacity: 0 }, gD);
  });

  // Symbol als Punktwolke: Icon auf Canvas zeichnen und abtasten
  const sample = (key) => new Promise((res) => {
    if (key === "scatter") {
      const C = [[200, 140], [90, 70], [310, 70], [70, 210], [330, 210], [200, 260], [200, 40]];
      return res(Array.from({ length: N }, (_, i) => { const c = C[i % C.length], a = Math.random() * 6.28, d = Math.pow(Math.random(), 1.6) * (i % C.length ? 30 : 44); return [c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d]; }));
    }
    const src = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="280" height="280" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><style>.f{fill:#fff;stroke:none}</style>${ICONS[key] || ""}</svg>`;
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, (W - 280) / 2, 2, 280, 280);
      let d; try { d = ctx.getImageData(0, 0, W, H).data; } catch (e) { return res(null); }
      const pts = [];
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 120) pts.push([x, y]);
      if (!pts.length) return res(null);
      for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
      res(Array.from({ length: N }, (_, i) => { const q = pts[i % pts.length]; return [q[0] + (Math.random() - .5) * 1.6, q[1] + (Math.random() - .5) * 1.6]; }));
    };
    img.onerror = () => res(null);
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(src);
  });

  Promise.all(keys.map(sample)).then((shapes) => {
    const list = shapes.map((s, i) => ({ s, c: caps[i] || "" })).filter((o) => o.s);
    if (!list.length) return;
    let cur = 0;
    const go = (i, first) => {
      const { s, c } = list[i];
      gsap.to(cap, { opacity: 0, duration: .25, onComplete: () => { cap.textContent = c; gsap.to(cap, { opacity: 1, duration: .5, delay: .6 }); } });
      dots.forEach((d, k) => {
        gsap.to(d, { attr: { cx: s[k][0], cy: s[k][1] }, opacity: d.classList.contains("pd-dot--p") || d.classList.contains("pd-dot--g") ? 1 : .75,
          duration: first ? 1.8 : 1.3, ease: "expo.inOut", delay: Math.random() * (first ? .8 : .45) });
      });
    };
    go(0, true);
    if (reduceMotion || list.length < 2) return;
    let inView = true;
    if (hasGSAP) ScrollTrigger.create({ trigger: svg, start: "top bottom", end: "bottom top", onToggle: (self) => (inView = self.isActive) });
    setInterval(() => { if (!inView || document.hidden) return; cur = (cur + 1) % list.length; go(cur); }, 5200);

    // Netzwerk: feine Linien zwischen Knoten, die mitwandern
    if (svg.hasAttribute("data-links")) {
      const hubs = dots.filter((d) => d.classList.contains("pd-dot--p"));
      const pairs = [];
      hubs.forEach((a, i) => hubs.slice(i + 1).forEach((b) => pairs.push([a, b, mk("line", { class: "pd-link" }, gL)])));
      gsap.ticker.add(() => {
        if (!inView) return;
        pairs.forEach(([a, b, l]) => {
          const x1 = +a.getAttribute("cx"), y1 = +a.getAttribute("cy"), x2 = +b.getAttribute("cx"), y2 = +b.getAttribute("cy");
          const dist = Math.hypot(x2 - x1, y2 - y1);
          l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
          l.setAttribute("opacity", Math.max(0, 1 - dist / 170) * .6);
        });
      });
    }
  });
  // leichtes Atmen der Punkte
  if (!reduceMotion) dots.filter((_, i) => i % 6 === 0).forEach((d) => d.classList.add("pd-tw"));
}

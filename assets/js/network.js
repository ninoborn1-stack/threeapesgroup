/* =================================================================
   ThreeApesGroup — Netzwerk
   - matchProblem(text): findet passende Knoten zu einer Problembeschreibung
   - initNetwork(svg):   kreisendes Netzwerk mit Signalen (braucht GSAP + ScrollTrigger)
   ================================================================= */

window.matchProblem = function (text) {
  const t = " " + String(text).toLowerCase() + " ";
  const test = (k) => (k.length <= 3 ? new RegExp(`(^|[^a-zäöüß])${k}([^a-zäöüß]|$)`).test(t) : t.includes(k));
  const inner = NETWORK.inner.filter((n) => n.k.some(test));
  const outer = NETWORK.outer.filter((n) => n.k.some(test));
  return { inner, outer, all: [...inner, ...outer] };
};

/* Link zur Anfrage (auf der Startseite: Abschnitt, sonst Unterseite) mit vorausgefülltem Problem */
window.inquiryUrl = function (text, areas = []) {
  const p = new URLSearchParams();
  if (text) p.set("problem", text);
  if (areas.length) p.set("bereich", areas.join(","));
  return "anfrage.html?" + p.toString();
};

window.initNetwork = function (svg, opts = {}) {
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let S = null;          // aktueller Aufbau
  let reveal = opts.reveal ?? 0;
  let inView = false, mobileBuilt = null;
  let speed = 1, speedTarget = 1;
  const pulses = [];

  function build() {
    const mobile = innerWidth < 720;
    if (mobileBuilt === mobile && S) return;
    mobileBuilt = mobile;
    svg.innerHTML = "";
    const W = mobile ? 600 : 1200, H = mobile ? 900 : 780;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const cx = W / 2, cy = H / 2;
    const rI = mobile ? { x: 175, y: 250 } : { x: 300, y: 205 };
    const rO = mobile ? { x: 268, y: 400 } : { x: 555, y: 340 };

    const defs = el("defs", {}, svg);
    defs.innerHTML = `
      <radialGradient id="nwGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#01B36C" stop-opacity=".35"/><stop offset="100%" stop-color="#01B36C" stop-opacity="0"/>
      </radialGradient>
      <filter id="nwBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>`;

    el("ellipse", { cx, cy, rx: rO.x * 1.15, ry: rO.y * 1.15, fill: "url(#nwGlow)", class: "nw-glow" }, svg);
    const gOrbits = el("g", { class: "nw-orbits" }, svg);
    el("ellipse", { cx, cy, rx: rI.x, ry: rI.y }, gOrbits);
    el("ellipse", { cx, cy, rx: rO.x, ry: rO.y }, gOrbits);
    el("ellipse", { cx, cy, rx: (rI.x + rO.x) / 2, ry: (rI.y + rO.y) / 2, class: "nw-orbit--dash" }, gOrbits);
    const gWaves = el("g", {}, svg);
    const gLinks = el("g", {}, svg), gPulse = el("g", {}, svg), gNodes = el("g", {}, svg), gCore = el("g", {}, svg);

    const center = { x: cx, y: cy, z: 1, center: true, links: [] };
    const mk = (arr, ring, offset) => arr.map((d, i) => ({
      ...d, ring, a0: (i / arr.length) * Math.PI * 2 - Math.PI / 2 + offset, links: [], x: cx, y: cy, z: 0,
      seed: Math.random() * Math.PI * 2,
    }));
    const inner = mk(NETWORK.inner, "inner", 0);
    const outer = mk(NETWORK.outer, "outer", Math.PI / NETWORK.outer.length);

    const links = [];
    const addLink = (a, b, cls = "") => {
      const path = el("path", { class: "nw-link " + cls }, gLinks);
      const link = { a, b, path, bend: (Math.random() - .5) * .25 };
      links.push(link); a.links.push(link); b.links.push(link);
    };
    inner.forEach((n) => addLink(center, n, "nw-link--spoke"));
    inner.forEach((n, i) => addLink(n, inner[(i + 1) % inner.length]));
    const angDist = (p, q) => Math.abs(Math.atan2(Math.sin(p - q), Math.cos(p - q)));
    outer.forEach((o, j) => {
      const sorted = [...inner].sort((p, q) => angDist(p.a0, o.a0) - angDist(q.a0, o.a0));
      o.parent = sorted[0];
      addLink(sorted[0], o);
      if (j % 2 === 0) addLink(sorted[1], o);
      if (j % 3 === 0) addLink(o, outer[(j + 1) % outer.length]);
    });

    const drawNode = (n) => {
      const g = el("g", { class: `nw-node nw-node--${n.ring}` }, gNodes);
      const big = n.ring === "inner";
      n.halo = el("circle", { class: "nw-halo", r: big ? 22 : 14 }, g);
      el("circle", { class: "nw-dot", r: big ? (mobile ? 11 : 9) : (mobile ? 6 : 5) }, g);
      const t = el("text", { "text-anchor": "middle", y: big ? (mobile ? 40 : 30) : (mobile ? 26 : 22) }, g);
      t.textContent = mobile && big ? (n.s || n.l) : n.l;
      n.g = g;
    };
    inner.forEach(drawNode); outer.forEach(drawNode);

    const coreR = mobile ? 86 : 78;
    const ring1 = el("circle", { class: "nw-core-ring", cx, cy, r: coreR + 16, "stroke-dasharray": "3 9" }, gCore);
    const ring2 = el("circle", { class: "nw-core-ring nw-core-ring--b", cx, cy, r: coreR + 34, "stroke-dasharray": "40 14 4 14" }, gCore);
    el("circle", { class: "nw-core-bg", cx, cy, r: coreR }, gCore);
    el("image", { href: window.BASE + "assets/img/emblem.webp", x: cx - coreR * .8, y: cy - coreR * .56, width: coreR * 1.6, height: coreR * 1.1, preserveAspectRatio: "xMidYMid meet" }, gCore);
    gsap.to(ring1, { rotate: 360, svgOrigin: `${cx} ${cy}`, duration: 26, repeat: -1, ease: "none" });
    gsap.to(ring2, { rotate: -360, svgOrigin: `${cx} ${cy}`, duration: 40, repeat: -1, ease: "none" });

    S = { W, H, cx, cy, rI, rO, inner, outer, nodes: [...inner, ...outer], links, center, gPulse, gCore, gWaves, coreR, rotI: 0, rotO: 0, mobile };
    pulses.length = 0;
    render(0);
  }

  /* ---------- Position und Tiefe je Frame ---------- */
  function layout(dt) {
    S.rotI += dt * 0.025 * speed;
    S.rotO -= dt * 0.016 * speed;
    const place = (n, r, rot) => {
      const a = n.a0 + rot;
      const wob = Math.sin(performance.now() / 1400 + n.seed) * 6;
      n.x = S.cx + Math.cos(a) * (r.x + wob);
      n.y = S.cy + Math.sin(a) * (r.y + wob * .6);
      n.z = (Math.sin(a) + 1) / 2; // 0 = hinten, 1 = vorne
    };
    S.inner.forEach((n) => place(n, S.rI, S.rotI));
    S.outer.forEach((n) => place(n, S.rO, S.rotO));
  }

  const qPoint = (a, q, b, t) => ({
    x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * q.x + t * t * b.x,
    y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * q.y + t * t * b.y,
  });

  function render(dt) {
    layout(dt);
    const N = S.nodes.length;
    S.nodes.forEach((n, i) => {
      // Aufbau beim Scrollen: Knoten fliegen nacheinander ein
      const local = Math.min(1, Math.max(0, (reveal * 1.7) - (i / N) * .7));
      const e = 1 - Math.pow(1 - local, 3);
      const x = S.cx + (n.x - S.cx) * e, y = S.cy + (n.y - S.cy) * e;
      n.rx = x; n.ry = y;
      const sc = (.7 + .5 * n.z) * (n.isHot ? 1.35 : 1) * e;
      n.g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc.toFixed(3)})`);
      n.g.style.opacity = (e * (.35 + .65 * n.z)).toFixed(3);
    });
    const lr = Math.min(1, Math.max(0, reveal * 1.6 - .25));
    S.links.forEach((l) => {
      const a = l.a.center ? l.a : { x: l.a.rx, y: l.a.ry }, b = { x: l.b.rx, y: l.b.ry };
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const nx = -(b.y - a.y) * l.bend, ny = (b.x - a.x) * l.bend;
      l.q = { x: mx + nx, y: my + ny }; l.pa = a; l.pb = b;
      l.path.setAttribute("d", `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${l.q.x.toFixed(1)} ${l.q.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
      const depth = l.a.center ? l.b.z : (l.a.z + l.b.z) / 2;
      l.path.style.opacity = (lr * (.25 + .75 * depth)).toFixed(3);
    });
    // Signale
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += dt * p.v;
      while (p.t >= 1 && p.seg < p.chain.length - 2) { p.t -= 1; p.seg++; }
      if (p.t >= 1 && p.seg >= p.chain.length - 2) {
        p.dot.remove(); p.tail.remove();
        p.onEnd && p.onEnd();
        pulses.splice(i, 1);
        continue;
      }
      const A = p.chain[p.seg], B = p.chain[p.seg + 1];
      const l = S.links.find((x) => (x.a === A && x.b === B) || (x.a === B && x.b === A));
      let pa, pb, q;
      if (l) { const fwd = l.a === A; pa = fwd ? l.pa : l.pb; pb = fwd ? l.pb : l.pa; q = l.q; }
      else { pa = { x: A.rx ?? A.x, y: A.ry ?? A.y }; pb = { x: B.rx ?? B.x, y: B.ry ?? B.y }; q = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 }; }
      const head = qPoint(pa, q, pb, p.t), tail = qPoint(pa, q, pb, Math.max(0, p.t - .22));
      p.dot.setAttribute("cx", head.x.toFixed(1)); p.dot.setAttribute("cy", head.y.toFixed(1));
      p.tail.setAttribute("x1", tail.x.toFixed(1)); p.tail.setAttribute("y1", tail.y.toFixed(1));
      p.tail.setAttribute("x2", head.x.toFixed(1)); p.tail.setAttribute("y2", head.y.toFixed(1));
    }
  }

  function pulse(chain, o = {}) {
    if (!S || chain.length < 2) return;
    const color = o.color || "#FEB192";
    const tail = el("line", { class: "nw-tail", stroke: color, "stroke-width": o.w || 3 }, S.gPulse);
    const dot = el("circle", { class: "nw-pulse", r: o.r || 4, fill: color }, S.gPulse);
    pulses.push({ chain, seg: 0, t: 0, v: o.v || 1.4, dot, tail, onEnd: o.onEnd });
  }

  function wave(strong) {
    if (!S) return;
    const c = el("circle", { class: "nw-wave" + (strong ? " is-strong" : ""), cx: S.cx, cy: S.cy, r: S.coreR }, S.gWaves);
    gsap.to(c, { attr: { r: S.mobile ? 520 : 700 }, opacity: 0, duration: strong ? 2.2 : 3, ease: "power2.out", onComplete: () => c.remove() });
  }

  build();
  let rT;
  window.addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => { const was = mobileBuilt; build(); if (was !== mobileBuilt) ScrollTrigger.refresh(); }, 250); });

  // Render-Schleife nur, solange sichtbar
  let last = performance.now();
  const tick = () => {
    const now = performance.now();
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    speed += (speedTarget - speed) * Math.min(1, dt * 3);
    if (inView && S && !document.hidden) render(reduce ? 0 : dt);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  ScrollTrigger.create({ trigger: svg, start: "top bottom", end: "bottom top", onToggle: (s) => (inView = s.isActive) });
  if (opts.scrub !== false) {
    ScrollTrigger.create({
      trigger: svg, start: "top 85%", end: "center 55%", scrub: 1,
      onUpdate: (s) => { reveal = s.progress; },
      onLeave: () => { reveal = 1; },
    });
  } else reveal = 1;

  // Kern bei Aufbau einmal kräftig
  ScrollTrigger.create({ trigger: svg, start: "center 60%", once: true, onEnter: () => { wave(true); setTimeout(() => wave(true), 350); } });

  // Leise Grundaktivität
  setInterval(() => {
    if (!inView || !S || document.hidden || reveal < .6 || S.focus) return;
    const n = S.inner[(Math.random() * S.inner.length) | 0];
    const kids = S.outer.filter((o) => o.parent === n);
    const chain = [S.center, n];
    if (kids.length && Math.random() > .35) chain.push(kids[(Math.random() * kids.length) | 0]);
    pulse(chain, { r: 3, w: 2, v: .8 + Math.random() * .3, color: "#01B36C" });
  }, 1800);

  /* ---------- Problem routen ---------- */
  function route(text) {
    if (!S) return { hits: [], guessed: true };
    const m = matchProblem(text);
    let hits = m.all.map((d) => S.nodes.find((n) => n.l === d.l)).filter(Boolean);
    const guessed = !hits.length;
    if (guessed) hits = [...S.inner].sort(() => Math.random() - .5).slice(0, 3);
    hits = hits.slice(0, 6);

    S.nodes.forEach((n) => { n.isHot = false; n.g.classList.remove("is-hot"); });
    S.links.forEach((l) => l.path.classList.remove("is-hot"));
    svg.classList.add("is-focus");
    S.focus = true;
    speedTarget = .12;
    gsap.fromTo(S.gCore, { scale: 1 }, { scale: 1.18, yoyo: true, repeat: 1, duration: .22, svgOrigin: `${S.cx} ${S.cy}` });
    wave(true); setTimeout(() => wave(true), 200); setTimeout(() => wave(true), 400);

    hits.forEach((n, i) => {
      const chain = n.ring === "inner" ? [S.center, n] : [S.center, n.parent, n];
      setTimeout(() => {
        for (let j = 1; j < chain.length; j++) {
          const l = S.links.find((x) => (x.a === chain[j - 1] && x.b === chain[j]) || (x.b === chain[j - 1] && x.a === chain[j]));
          if (l) l.path.classList.add("is-hot");
          chain[j].isHot = true; chain[j].g.classList.add("is-hot");
        }
        pulse(chain, { r: 8, w: 6, v: 1.6, color: "#FEB192", onEnd: () => gsap.fromTo(n.halo, { attr: { r: 10 } }, { attr: { r: 38 }, opacity: 0, duration: .9, ease: "expo.out", clearProps: "opacity" }) });
        // Nebenäste: das Netzwerk fragt herum
        for (let k = 0; k < 3; k++) {
          const any = S.inner[(Math.random() * S.inner.length) | 0];
          setTimeout(() => pulse([S.center, any], { r: 3, w: 2, v: 2.2, color: "#A9AFB2" }), k * 90);
        }
      }, i * 260);
    });
    clearTimeout(route.t);
    route.t = setTimeout(() => { speedTarget = 1; S.focus = false; svg.classList.remove("is-focus"); }, 9000);
    return { hits, guessed, inner: hits.filter((n) => n.ring === "inner") };
  }

  return { route, pulse, wave };
};

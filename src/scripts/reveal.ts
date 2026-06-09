import { inView, scroll, animate } from "motion";

// js-reveal is set pre-paint by the inline script in BaseLayout's <head>;
// re-assert here in case this module runs in a context without it.
const root = document.documentElement;
root.classList.add("js-reveal");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Restrained ease-out (easeOutQuint-ish) for the on-load sequence.
const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];
// Restrained settle for the hero type-assembly — a barely-there overshoot, not
// a bounce/elastic (honors the motion law).
const easeSettle: [number, number, number, number] = [0.2, 1.1, 0.3, 1];

// Each init is isolated so a throw in one can't abort the others (or the debug
// overlay). Errors are recorded for the overlay readout.
function safe(label: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[reveal] ${label} threw`, err);
  }
}

// NOTE: the orchestration (reduce-motion branch + safe(init…) calls) lives at the
// BOTTOM of this module, after every function is declared.

// Hero on-load: headline words stagger in, then subhead / principle / CTAs
// cascade. ~1.2s total. Guarded by the headline's presence (shared script).
function initHeroOnLoad(): void {
  const headline = document.querySelector<HTMLElement>("[data-hero-headline]");
  if (!headline) return;

  // Type assembly: each word starts scattered (random translate + rotate, faint)
  // and settles into place. JS owns the scatter transform so no-JS/crawlers never
  // see it. Transform + opacity only (compositor/INP-safe).
  const words = headline.querySelectorAll<HTMLElement>(".hero-word");
  if (words.length) {
    const capX = Math.min(window.innerWidth * 0.4, 320);
    const capY = Math.min(window.innerHeight * 0.4, 320);
    const rand = (m: number) => (Math.random() * 2 - 1) * m;
    words.forEach((w, i) => {
      const from = `translate(${Math.round(rand(capX))}px, ${Math.round(rand(capY))}px) rotate(${Math.round(rand(25))}deg)`;
      w.style.transform = from;
      animate(
        w,
        { transform: [from, "translate(0px, 0px) rotate(0deg)"], opacity: [0.3, 1] },
        { duration: 1.2, delay: i * 0.05, ease: easeSettle },
      );
    });
  }

  // Subhead / principle / CTAs cascade in after the assembly (~0.9s onward).
  const base = 0.9;
  const cascade = (sel: string, extra: number) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) animate(el, { opacity: [0, 1], y: [10, 0] }, { duration: 0.5, delay: base + extra, ease: easeOut });
  };
  cascade("[data-hero-sub]", 0);
  cascade("[data-hero-principle]", 0.2);
  cascade("[data-hero-cta]", 0.4);
}

// Hero scroll parallax: hills SVG drifts up slowly (depth), hero text pulls
// back (subtle scale + fade) as the hero scrolls out. Identity at scroll 0
// (LCP-safe). The dashboard mock scales up on entry (initHeroDashboardScale).
function initHeroParallax(): void {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  const hills = hero.querySelector<HTMLElement>(".hills__svg");
  const content = hero.querySelector<HTMLElement>(".hero-content");
  const range = { target: hero, offset: ["start start", "end start"] } as const;

  if (hills) {
    scroll(animate(hills, { y: [0, 60], scale: [1, 1.06] }, { ease: "linear" }), range);
  }
  if (content) {
    scroll(animate(content, { scale: [1, 0.96], opacity: [1, 0.5] }, { ease: "linear" }), range);
  }
}

// Hero dashboard mock: scales up subtly as you scroll into the hero, then
// pulls back as the hero scrolls out. Constant scale near scroll 0 so the
// initial frame matches the SSR layout (no CLS/LCP shift).
function initHeroDashboardScale(): void {
  const wrap = document.querySelector<HTMLElement>("[data-hero-dash-wrap]");
  if (!wrap) return;
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  // Scroll range: from when the hero top is at the viewport top, to when the
  // hero bottom is at the viewport top (end start). Across that range we lift
  // the dashboard up slightly so the chassis pulls into frame, then push it
  // back as the next section enters.
  const range = { target: hero, offset: ["start start", "end start"] } as const;
  scroll(animate(wrap, { y: [0, -40], scale: [1, 1.02] }, { ease: "linear" }), range);
}

// Testimonial card: lime SVG outline runs around the perimeter on an infinite
// loop. The rect uses pathLength="100", so animating stroke-dashoffset 0→100
// against a fixed dasharray of 30/70 draws a 30%-length lime "head" travelling
// around the edge with a 70% gap behind it. Paused on reduce-motion.
function initTestimonialLoadingBar(): void {
  const rect = document.querySelector<SVGRectElement>("[data-tm-loader-rect]");
  if (!rect) return;
  rect.setAttribute("stroke-dasharray", "30 70");
  animate(
    rect,
    { strokeDashoffset: [100, 0] },
    { duration: 6, ease: "linear", repeat: Infinity },
  );
}

// Bento grid: tiles fade + slide in with a small stagger as the grid enters
// view. One-shot — uses inView so it doesn't re-fire on scrollback.
function initBentoReveal(): void {
  const grid = document.querySelector<HTMLElement>("[data-bento-grid]");
  if (!grid) return;
  const tiles = Array.from(grid.querySelectorAll<HTMLElement>(".bento-tile"));
  if (!tiles.length) return;
  // Pre-hide before the trigger.
  tiles.forEach((t) => {
    t.style.opacity = "0";
    t.style.transform = "translateY(18px)";
  });
  inView(
    grid,
    () => {
      tiles.forEach((t, i) => {
        animate(
          t,
          { opacity: [0, 1], y: [18, 0] },
          { duration: 0.7, delay: i * 0.08, ease: easeOut },
        );
      });
    },
    { amount: 0.15 },
  );
}

// Pinned passage: phrases activate in reading order as the section is scroll-pinned
// (controlled ~160vh travel → a deliberate, slow reveal). CLS/INP-safe — toggles a
// class (color + opacity only), no per-frame layout. The visible text block stays the
// same size and dead-centre throughout. Element-guarded so the shared script no-ops
// elsewhere. Mobile / reduced-motion drop the pin (CSS) and render every phrase active.
function initPinnedPassage(): void {
  const section = document.querySelector<HTMLElement>("[data-pinned]");
  if (!section) return;
  const spans = Array.from(section.querySelectorAll<HTMLElement>(".activate"));
  if (!spans.length) return;
  const thresholds = spans.map((s) => parseFloat(s.dataset.activateAt ?? "0"));

  // Section is taller than the viewport, so edge offsets map progress 0->1 across the
  // full sticky-pinned hold (start start = pin begins, end end = pin releases).
  scroll(
    (progress: number) => {
      for (let i = 0; i < spans.length; i++) {
        spans[i].classList.toggle("is-active", progress >= thresholds[i]);
      }
    },
    { target: section, offset: ["start start", "end end"] },
  );
}

// /services index strip — scroll-spy. Observes each [data-svc-section] in
// the page and toggles `.is-active` on the matching `a[data-svc-index]`
// link, so the index numeral lifts and a top accent rule draws in as you
// scroll the corresponding section into view. Class-toggle only — no
// motion, so reduced-motion is unaffected.
function initServicesIndex(): void {
  const links = Array.from(
    document.querySelectorAll<HTMLElement>("a[data-svc-index]"),
  );
  if (!links.length) return;
  const linkById = new Map(links.map((a) => [a.dataset.svcIndex ?? "", a]));

  const setActive = (id: string) => {
    for (const link of links) {
      link.classList.toggle("is-active", (link.dataset.svcIndex ?? "") === id);
    }
  };

  inView(
    "[data-svc-section]",
    (target) => {
      const el =
        target instanceof Element
          ? target
          : (target as IntersectionObserverEntry).target;
      const id = (el as HTMLElement).id;
      if (id && linkById.has(id)) setActive(id);
    },
    { amount: 0.4 },
  );
}

// "What we build" — pinned scroll-collapse. Runs on BOTH desktop and mobile (one
// shared clock, so the pace matches). Each service shows its three subs (Challenge /
// Offer / Outcome) at rest; as the service scrolls, the earlier subs collapse their
// HEIGHT and fade, so the survivors flow UP and the block shrinks from the bottom —
// ending on the Outcome hugging the top. The stage height tracks the active service's
// live content, so the frame hugs it; the heading + service name are top-anchored, so
// they stay fixed (no drift). Services cross-fade, and the incoming one is reset to
// fully-expanded before it shows, so there's no reload flash on swap. Reduced-motion
// (handled upstream) keeps the static interleaved list.
const WWB_PER_VH = 130; // scroll distance per service (×vh); shared by desktop + mobile
// Two dwells per service: hold the fully-expanded service (all 3 subs incl. Challenge) at
// the start, and the collapsed Outcome at the end, before the index advances — so neither
// the next Challenge nor the Outcome is scrolled straight past. Collapse runs in the middle
// window only. The denominator (1 - START - END) must stay positive.
const WWB_HOLD_START = 0.18;
const WWB_HOLD_END = 0.15;
function initWhatWeBuild(): void {
  const section = document.querySelector<HTMLElement>("[data-wwb]");
  if (!section) return;
  const outer = section.querySelector<HTMLElement>("[data-wwb-outer]");
  const stage = section.querySelector<HTMLElement>("[data-wwb-stage]");
  const groups = Array.from(section.querySelectorAll<HTMLElement>("[data-wwb-group]"));
  const N = groups.length;
  if (!outer || !stage || N === 0) return;

  section.setAttribute("data-wwb-active", "");
  // Guarantee the scroll distance in JS (don't rely on the CSS height resolving).
  outer.style.height = `${100 + N * WWB_PER_VH}vh`;

  const NAV_CLEAR = 16; // min gap above the centred pin so it never tucks under the nav

  // Desktop: the service names accumulate down the left column (each positioned via the
  // per-article --svc-y set in measure()). Mobile stacks name-above-subs instead.
  const mq = window.matchMedia("(max-width: 768px)");
  let isMobile = mq.matches;

  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const eo = (t: number) => 1 - Math.pow(1 - t, 4); // easeOutQuart

  // Per-service layout, re-measured on resize / fonts.ready. subH = each sub's full border-
  // box height (getBoundingClientRect includes the padding-bottom, so the stage sum and the
  // collapse interpolation cover the whole box — a collapsed sub then leaves zero residual);
  // padB = each sub's natural padding-bottom, animated to 0 alongside max-height. nameH
  // floors the stage so it never collapses shorter than the service name. Inline collapse
  // styles are cleared before measuring.
  type SvcMetric = { subs: HTMLElement[]; subH: number[]; padB: number[]; nameH: number };
  let metrics: SvcMetric[] = [];
  const pin = section.querySelector<HTMLElement>(".wwb__pin");
  // Desktop centres the fixed-height pin: the large index numeral fills the void below the
  // collapsed Outcome, and the modest dead-scroll before the sticky pin releases reads as
  // intentional. Mobile hides the numeral, so that void reads as an empty gap — bottom-anchor
  // the pin there instead. A sticky pin at top=T releases after scrolling (H − T − pinH),
  // while collapse progress hits 1 after span = (H − innerHeight); the handoff is flush iff
  // those coincide ⇒ T = innerHeight − pinH. So on mobile we set top to that, making
  // SelectedWork climb up flush exactly as the last Outcome completes. Clamped to NAV_CLEAR so
  // a pin taller than the viewport still clears the nav.
  const placePin = () => {
    if (!pin) return;
    const pinH = pin.getBoundingClientRect().height;
    const vh = window.innerHeight;
    const top = isMobile
      ? Math.max(NAV_CLEAR, Math.round(vh - pinH))
      : Math.max(NAV_CLEAR, Math.round((vh - pinH) / 2));
    pin.style.top = `${top}px`;
  };
  const measure = () => {
    isMobile = mq.matches;
    metrics = groups.map((el) => {
      const subs = Array.from(el.querySelectorAll<HTMLElement>("[data-wwb-sub]"));
      subs.forEach((s) => {
        s.style.maxHeight = "";
        s.style.opacity = "";
        s.style.overflow = "";
        s.style.paddingBottom = "";
      });
      const name = el.querySelector<HTMLElement>(".wwb-service__name");
      return {
        subs,
        subH: subs.map((s) => s.getBoundingClientRect().height),
        padB: subs.map((s) => parseFloat(getComputedStyle(s).paddingBottom) || 0),
        nameH: name ? name.getBoundingClientRect().height : 0,
      };
    });
    // Fixed stage = tallest entry-state across all services. A constant stage ⇒ constant pin
    // height ⇒ the heading never drifts on a swap.
    const fixedStage = Math.round(
      metrics.reduce((mx, m) => Math.max(mx, m.nameH, m.subH.reduce((a, b) => a + b, 0)), 0),
    );
    stage.style.height = `${fixedStage}px`;
    placePin();
    // Desktop: position the accumulating name stack. Each name sits in its CUMULATIVE slot
    // (sum of preceding actual nameH + a fixed gap, so single-line names don't inherit a
    // wrapped name's slot height), read by the desktop CSS as translateY(var(--svc-y)).
    if (!isMobile) {
      const GAP = 32;
      let acc = 0;
      metrics.forEach((m, i) => {
        groups[i].style.setProperty("--svc-y", `${acc}px`);
        acc += m.nameH + GAP;
      });
    }
  };

  // Collapse the earlier subs (keep the LAST one — the Outcome — always full). lp 0→1
  // drives cf 0→collapsible; sub k collapses over its own unit slice. maxHeight → 0 lets
  // the survivors flow up naturally (no transform, no clip mask). Returns the live total
  // height of the subs column so the stage can hug it.
  const applyCollapse = (m: SvcMetric, lp: number): number => {
    const collapsible = m.subs.length - 1;
    const cf = lp * Math.max(collapsible, 0);
    let subsH = 0;
    for (let k = 0; k < m.subs.length; k++) {
      const sub = m.subs[k];
      const local = k < collapsible ? clamp01(cf - k) : 0;
      if (local <= 0) {
        // not collapsing (survivor, or not reached yet): fully expanded
        sub.style.maxHeight = "";
        sub.style.opacity = "1";
        sub.style.overflow = "";
        sub.style.paddingBottom = "";
        subsH += Number.isFinite(m.subH[k]) ? m.subH[k] : 0;
        delete sub.dataset.wwbCh;
        delete sub.dataset.wwbLh;
        delete sub.dataset.wwbFb;
        delete sub.dataset.wwbH;
        continue;
      }
      const p = eo(local);
      // ── Diagnostic: capture the CACHED value entering this branch, before any heal. ──
      const cachedH = m.subH[k];
      sub.dataset.wwbCh =
        cachedH === undefined ? "u" : Number.isNaN(cachedH) ? "NaN" : `${Math.round(cachedH)}`;
      // Live fallback: if the cached natural height/padding is missing (mobile measured
      // before layout/fonts settled, so the array entry is undefined or 0), read the live
      // value from the DOM now and cache it back. Without this, `subH[k] * (1-p)` would be
      // NaN, the browser silently rejects `"NaNpx"`, and the sub stays at full height even
      // though opacity animates fine (the bug the overlay caught on mobile).
      let baseH = m.subH[k];
      let fb = "0";
      if (!Number.isFinite(baseH) || baseH <= 0) {
        baseH = sub.getBoundingClientRect().height;
        if (Number.isFinite(baseH) && baseH > 0) m.subH[k] = baseH;
        fb = "1";
      }
      sub.dataset.wwbFb = fb;
      sub.dataset.wwbLh = Number.isFinite(baseH) ? `${Math.round(baseH)}` : "NaN";
      let basePB = m.padB[k];
      if (!Number.isFinite(basePB)) {
        basePB = parseFloat(getComputedStyle(sub).paddingBottom) || 0;
        m.padB[k] = basePB;
      }
      const h = baseH * (1 - p);
      sub.dataset.wwbH = Number.isFinite(h) ? h.toFixed(1) : "NaN";
      sub.style.overflow = "hidden";
      sub.style.maxHeight = `${h.toFixed(1)}px`;
      sub.style.opacity = (1 - p).toFixed(3);
      // Animate the padding-bottom to 0 in lockstep, so a fully-collapsed sub leaves zero
      // residual space and the surviving Outcome sits flush with the service-name top.
      sub.style.paddingBottom = `${(basePB * (1 - p)).toFixed(1)}px`;
      subsH += h;
    }
    return subsH;
  };

  // Progress 0..1 from the outer's viewport-relative position (works whatever the real
  // scroller is). prog splits into the active service index + its local 0..1 (lp), with
  // a short hold before the collapse begins.
  const render = () => {
    const span = outer.offsetHeight - window.innerHeight;
    const top = outer.getBoundingClientRect().top;
    const q = span > 0 ? clamp01(-top / span) : 0;
    const prog = q * N;
    const active = Math.min(N - 1, Math.floor(prog));
    const lpRaw = clamp01(prog - active);
    // Piecewise: dwell expanded over [0, START], collapse across the middle window, dwell
    // collapsed over [1 - END, 1]. Pure function of scroll position, so desktop and mobile
    // share one clock and pace identically.
    const lp =
      lpRaw <= WWB_HOLD_START
        ? 0
        : lpRaw >= 1 - WWB_HOLD_END
          ? 1
          : (lpRaw - WWB_HOLD_START) / (1 - WWB_HOLD_START - WWB_HOLD_END);

    for (let i = 0; i < N; i++) {
      const m = metrics[i];
      groups[i].classList.toggle("is-active", i === active);
      // .is-passed marks services scrolled past — drives the dimmed-name state in the
      // desktop accumulating name stack. Auto-toggles back off on backward scroll.
      groups[i].classList.toggle("is-passed", i < active);
      // Non-active services reset to fully expanded, so the incoming one cross-fades in
      // already-open (no reload flash); the active one collapses by its own progress.
      if (m && i !== active) applyCollapse(m, 0);
    }

    const m = metrics[active];
    if (!m) return;
    applyCollapse(m, lp); // stage height is fixed; the collapse animates within it
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      render();
    });
  };

  const remeasure = () => { measure(); render(); };

  measure();
  render();
  // Listen broadly: window covers document scroll; document capture-phase covers
  // scroll on ANY ancestor/sub-container, so progress updates whatever the real
  // scroller turns out to be.
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", remeasure);
  // Post-layout settle: the initial measure can fire before fonts apply (heights wrong)
  // and even before the first paint on mobile (heights briefly 0). Wait for fonts, then
  // two animation frames so the browser has fully reflowed with the resolved metrics
  // before we cache subH/padB.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => requestAnimationFrame(remeasure));
    });
  }
  // Live re-measure on layout change without recursing into the JS-driven collapse:
  // observe the service NAME (never animated), not the subs (animated). When a name
  // height changes — webfont swap, mobile orientation, dynamic UA chrome — re-measure
  // so subH stays in sync with reality.
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(remeasure);
    groups.forEach((g) => {
      const name = g.querySelector<HTMLElement>(".wwb-service__name");
      if (name) ro.observe(name);
    });
  }
}

// Debug overlay — only when the URL contains `?debug`. Outlines the WWB pin and the passage
// panel and prints their live heights / positions / margins so the geometry can be verified
// on-device (heading top must stay constant across WWB swaps; passage inner margin ≈ outer).
function initDebugOverlay(): void {
  const pin = document.querySelector<HTMLElement>(".wwb__pin");
  const heading = document.querySelector<HTMLElement>(".wwb__heading");
  const stage = document.querySelector<HTMLElement>("[data-wwb-stage]");
  const panel = document.querySelector<HTMLElement>(".pinned-content");
  if (!pin && !panel) return;

  const readout = document.createElement("div");
  readout.setAttribute(
    "style",
    "position:fixed;left:8px;bottom:8px;z-index:9999;font:10px/1.4 ui-monospace,monospace;" +
      "background:rgba(0,0,0,.82);color:#fff;padding:8px 10px;border-radius:6px;white-space:pre;" +
      "pointer-events:none;max-width:92vw",
  );
  document.body.appendChild(readout);
  if (pin) pin.style.outline = "1px solid #ee1133";
  if (panel) panel.style.outline = "1px solid #11aadd";

  const px = (n: number) => `${Math.round(n)}px`;
  const update = () => {
    const lines: string[] = [];
    if (pin) {
      const r = pin.getBoundingClientRect();
      lines.push(`WWB pin   h=${px(r.height)} top=${px(r.top)} (vh=${px(window.innerHeight)})`);
      if (stage) lines.push(`WWB stage h=${px(stage.getBoundingClientRect().height)}`);
      if (heading) lines.push(`WWB headY ${px(heading.getBoundingClientRect().top)}`);
      // Per-sub diagnostic for the ACTIVE service: confirms whether max-height /
      // padding-bottom / opacity reach 0 and whether the rect actually collapses,
      // so we can root-cause the mobile broken-merge symptom without guessing.
      const activeSvc = document.querySelector<HTMLElement>("[data-wwb-group].is-active");
      if (activeSvc) {
        const groups = document.querySelectorAll<HTMLElement>("[data-wwb-group]");
        const activeIdx = Array.from(groups).indexOf(activeSvc);
        lines.push(`WWB subs (active=${activeIdx})`);
        const subs = activeSvc.querySelectorAll<HTMLElement>("[data-wwb-sub]");
        subs.forEach((sub, k) => {
          const rh = sub.getBoundingClientRect().height;
          const mh = sub.style.maxHeight || "—";
          const pb = sub.style.paddingBottom || "—";
          const op = sub.style.opacity || "—";
          // Read what applyCollapse SAW + WROTE this tick (set on the sub as dataset).
          // cH = cached subH[k] at branch entry; lH = baseH after the live-fallback;
          // fb = whether the fallback fired; h = the px value passed to style.maxHeight.
          const cH = sub.dataset.wwbCh ?? "—";
          const lH = sub.dataset.wwbLh ?? "—";
          const fb = sub.dataset.wwbFb ?? "—";
          const hh = sub.dataset.wwbH ?? "—";
          lines.push(
            `  k${k} rect=${px(rh)} cH=${cH} lH=${lH} fb=${fb} h=${hh} mh=${mh} pb=${pb} op=${op}`,
          );
          // Direct read of what the browser CURRENTLY thinks max-height is. If the JS wrote
          // "105.0px" but the engine resolved it to "none", a stylesheet is winning. If the
          // JS wrote "—" but cmH is a real px, the overlay's style.maxHeight read is lying.
          const cmH = getComputedStyle(sub).maxHeight;
          lines.push(`     cmH=${cmH}`);
        });
      }
    }
    if (panel) {
      const r = panel.getBoundingClientRect();
      const txt = panel.querySelector<HTMLElement>(".pinned-passage");
      const inner = txt ? (r.height - txt.getBoundingClientRect().height) / 2 : 0;
      lines.push(`Passage   box h=${px(r.height)} top=${px(r.top)} innerMargin≈${px(inner)}`);
    }
    readout.textContent = lines.join("\n");
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  document.addEventListener("scroll", update, { passive: true, capture: true });
  window.addEventListener("resize", update);
}

// ─── Orchestration (runs last, after all declarations above) ───
if (reduceMotion) {
  document
    .querySelectorAll<HTMLElement>(".reveal, .reveal-stagger")
    .forEach((el) => el.classList.add("is-in"));
} else {
  // Scroll-in reveals — CSS transitions + nth-child delays do the animation.
  inView(
    ".reveal, .reveal-stagger",
    (target) => {
      const el = target instanceof Element ? target : (target as IntersectionObserverEntry).target;
      el.classList.add("is-in");
    },
    { amount: 0.15 },
  );

  safe("initHeroOnLoad", initHeroOnLoad);
  safe("initHeroParallax", initHeroParallax);
  safe("initHeroDashboardScale", initHeroDashboardScale);
  safe("initPinnedPassage", initPinnedPassage);
  safe("initServicesIndex", initServicesIndex);
  safe("initWhatWeBuild", initWhatWeBuild);
  safe("initTestimonialLoadingBar", initTestimonialLoadingBar);
  safe("initBentoReveal", initBentoReveal);
  if (location.search.includes("debug")) safe("initDebugOverlay", initDebugOverlay);
}

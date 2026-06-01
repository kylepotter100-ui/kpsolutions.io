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

// Hero scroll parallax: background gradient lags (depth), hero content pulls
// back (scale + fade) as the hero scrolls out. Identity at scroll 0 (LCP-safe).
function initHeroParallax(): void {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  const field = hero.querySelector<HTMLElement>(".hero-bg-field");
  const content = hero.querySelector<HTMLElement>(".hero-content");
  const range = { target: hero, offset: ["start start", "end start"] } as const;

  if (field) {
    scroll(animate(field, { y: [0, 80] }, { ease: "linear" }), range);
  }
  if (content) {
    scroll(animate(content, { scale: [1, 0.95], opacity: [1, 0.7] }, { ease: "linear" }), range);
  }
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

  // Desktop stacked-tunnel: cache the decorative SVG + polylines that frame the active
  // service's name → subs box. Coords are computed once in measure() against the FIXED
  // stage so the outline never moves while the subs collapse inside. Hidden on mobile via
  // CSS (display:none); render()'s tunnel block is also gated on !isMobile.
  const mq = window.matchMedia("(max-width: 768px)");
  let isMobile = mq.matches;
  const tunnelSvg = section.querySelector<SVGSVGElement>("[data-wwb-tunnels]");
  const tunnelEls = tunnelSvg
    ? Array.from(tunnelSvg.querySelectorAll<SVGPolylineElement>(".wwb__tunnel-line"))
    : [];
  let lastActive = -1;

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
  // Bottom-anchor the fixed-height pin on every viewport. A sticky pin at top=T releases
  // after scrolling (H − T − pinH); collapse progress hits 1 after span = (H − innerHeight).
  // The handoff is flush iff those coincide ⇒ T = innerHeight − pinH, so the pin releases
  // exactly as the last Outcome finishes collapsing and SelectedWork climbs up with no
  // dead-scroll gap. (Desktop previously centred the pin at (vh − pinH)/2, which left
  // ≈(vh − pinH)/2 of empty bone before SelectedWork — the inter-section gap.) The trade is
  // that the pinned card's slack now sits above the heading rather than split above/below.
  // Clamped to NAV_CLEAR so a pin taller than the viewport still clears the nav.
  const placePin = () => {
    if (!pin) return;
    const pinH = pin.getBoundingClientRect().height;
    const vh = window.innerHeight;
    const top = Math.max(NAV_CLEAR, Math.round(vh - pinH));
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
    // Desktop tunnel frame adds PAD breathing room above + below the subs box, so grow the
    // fixed stage by 2×PAD: content is offset down by PAD (via --wwb-frame-pad on the subs),
    // leaving PAD below even for the tallest service. Mobile re-hugs the stage per-frame in
    // render(), so it ignores the extra height.
    const FRAME_PAD = 14;
    const useTunnel = !isMobile && !!tunnelSvg && tunnelEls.length > 0;
    const fixedStage =
      Math.round(
        metrics.reduce((mx, m) => Math.max(mx, m.nameH, m.subH.reduce((a, b) => a + b, 0)), 0),
      ) + (useTunnel ? 2 * FRAME_PAD : 0);
    stage.style.height = `${fixedStage}px`;
    placePin();
    // Desktop only: compute the tunnel polyline coords from the FIXED stage dimensions.
    // Each service gets one top + one bottom polyline forming an open-right funnel from
    // its name (in its CUMULATIVE left-column slot — sum of preceding actual nameH +
    // gaps, NOT a uniform max-row height, so single-line names don't inherit the slot of
    // a wrapped name) to the subs box (full right column, Y = 0 .. stageH). colX matches
    // the CSS 38%/62% grid split, so the bend in the hairline sits exactly on the
    // column boundary. JS writes --svc-y per article; the desktop CSS reads it to
    // translateY each name into its slot.
    if (useTunnel && tunnelSvg) {
      const stageW = stage.getBoundingClientRect().width;
      const stageH = fixedStage;
      const colX = Math.round(stageW * 0.38);
      const GAP = 32; // tight fixed gap between rows; tune live on preview if needed
      // PAD does three things, all at the same magnitude as the 2×PAD stage growth above:
      //  • offsets the whole name stack + the subs content down by PAD (subs via the
      //    --wwb-frame-pad var below), so the frame's top edge (y=0) sits PAD above the
      //    content instead of hugging the first sub-header / the Outcome;
      //  • pulls the column-boundary bend inboard of the subs box (bendX = colX − PAD);
      //  • brackets each name by ±PAD. Starting the stack at PAD also lifts service 0's top
      //    bracket from y = −PAD (above the viewBox → clipped → invisible) to y = 0 (on the
      //    frame edge → visible, matching the right-side top line).
      const PAD = FRAME_PAD;
      section.style.setProperty("--wwb-frame-pad", `${PAD}px`);
      const nameY: number[] = new Array(metrics.length);
      let acc = PAD;
      metrics.forEach((m, i) => {
        nameY[i] = acc;
        acc += m.nameH + GAP;
      });
      groups.forEach((g, i) => g.style.setProperty("--svc-y", `${nameY[i]}px`));
      tunnelSvg.setAttribute("viewBox", `0 0 ${stageW} ${stageH}`);
      const bendX = colX - PAD;
      metrics.forEach((m, i) => {
        const yTop = nameY[i] - PAD;
        const yBot = nameY[i] + m.nameH + PAD;
        const topEl = tunnelEls.find(
          (el) => el.dataset.tunnelIdx === String(i) && el.dataset.tunnelEdge === "top",
        );
        const botEl = tunnelEls.find(
          (el) => el.dataset.tunnelIdx === String(i) && el.dataset.tunnelEdge === "bot",
        );
        if (topEl)
          topEl.setAttribute("points", `0,${yTop} ${bendX},${yTop} ${bendX},0 ${stageW},0`);
        if (botEl)
          botEl.setAttribute(
            "points",
            `0,${yBot} ${bendX},${yBot} ${bendX},${stageH} ${stageW},${stageH}`,
          );
      });
      // Force a fresh draw-on the next time `active` changes (covers the case where
      // measure runs after a service was already active — e.g. fonts.ready re-measure).
      lastActive = -1;
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
      // desktop stacked-tunnel layout. Auto-toggles back off on backward scroll.
      groups[i].classList.toggle("is-passed", i < active);
      // Non-active services reset to fully expanded, so the incoming one cross-fades in
      // already-open (no reload flash); the active one collapses by its own progress.
      if (m && i !== active) applyCollapse(m, 0);
    }

    // Desktop tunnel swap: on active-index change, fade out the old tunnel + draw on the
    // new one (stroke-dashoffset: length → 0). The coords are fixed (set in measure), so
    // this is a CSS class toggle + one animate() call per polyline per swap. Mobile skips.
    if (active !== lastActive) {
      lastActive = active;
      if (!isMobile && tunnelEls.length) {
        tunnelEls.forEach((el) => {
          const idx = Number(el.dataset.tunnelIdx);
          const nowActive = idx === active;
          el.classList.toggle("is-active", nowActive);
          if (nowActive) {
            const len = el.getTotalLength();
            if (Number.isFinite(len) && len > 0) {
              // WAAPI: motion's animate() doesn't recognise strokeDashoffset as an animatable
              // property, so the offset stays at `len` and the stroke renders permanently off
              // the path (invisible). el.animate() is browser-native, handles SVG presentation
              // attributes that have CSS mappings, and fill:forwards keeps the final offset
              // (0) after the animation ends so the stroke stays drawn until the next swap.
              el.style.strokeDasharray = String(len);
              el.style.strokeDashoffset = String(len);
              el.animate(
                { strokeDashoffset: [String(len), "0"] },
                { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
              );
            }
          }
        });
      }
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
      // ── Desktop tunnel diagnostics: surface why the hairlines render (or don't). ──
      // For each polyline (4 services × {top,bot} = 8 lines): the points attribute count
      // (0 ⇒ JS setAttribute never fired), the polyline's bounding rect (0×0 ⇒ the SVG
      // sized to zero or coords are off-canvas), getTotalLength (0 ⇒ degenerate
      // geometry), the .is-active class membership, and the COMPUTED opacity (vs the
      // CSS toggle). For the active polylines we also surface computed stroke + width
      // so we can confirm the cascade reached the element. Gated to desktop by checking
      // computed display:none on the SVG (mobile hides it via CSS).
      const tsvg = document.querySelector<SVGSVGElement>("[data-wwb-tunnels]");
      if (tsvg && getComputedStyle(tsvg).display !== "none") {
        const tlines = Array.from(tsvg.querySelectorAll<SVGPolylineElement>(".wwb__tunnel-line"));
        const sr = tsvg.getBoundingClientRect();
        lines.push(`WWB tunnels svg=${px(sr.width)}×${px(sr.height)}`);
        tlines.forEach((poly) => {
          const idx = poly.dataset.tunnelIdx ?? "?";
          const edge = poly.dataset.tunnelEdge ?? "?";
          const ptsAttr = poly.getAttribute("points") ?? "";
          const ptsN = ptsAttr.trim() === "" ? 0 : ptsAttr.trim().split(/\s+/).length;
          const r = poly.getBoundingClientRect();
          let len = NaN;
          try { len = poly.getTotalLength(); } catch { /* ignore */ }
          const cs = getComputedStyle(poly);
          const opa = cs.opacity;
          const act = poly.classList.contains("is-active") ? "1" : "0";
          // dasharray / dashoffset — the round-4 smoking gun: if `do` stays at `len` on an
          // active polyline post-activation, the WAAPI draw-on didn't run and the stroke is
          // rendering off the path. `do=0` post-activation means the draw-on completed.
          const da = cs.strokeDasharray;
          const dof = cs.strokeDashoffset;
          const tag = `T${idx}${edge === "top" ? "t" : "b"}`;
          const lenStr = Number.isFinite(len) ? `${Math.round(len)}` : "NaN";
          let line = `  ${tag} pts=${ptsN} rect=${px(r.width)}×${px(r.height)} len=${lenStr} opa=${opa} act=${act} da=${da} do=${dof}`;
          if (act === "1") {
            line += ` stroke=${cs.stroke} sw=${cs.strokeWidth}`;
          }
          lines.push(line);
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
  safe("initPinnedPassage", initPinnedPassage);
  safe("initWhatWeBuild", initWhatWeBuild);
  if (location.search.includes("debug")) safe("initDebugOverlay", initDebugOverlay);
}

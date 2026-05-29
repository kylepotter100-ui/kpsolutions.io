import { inView, scroll, animate } from "motion";

// Debug instrumentation (surfaced only via the ?debug overlay below). The error
// listener is registered FIRST so it catches exceptions thrown by any init.
let __wwbLastError = "none";
let __wwbActive = -1;
let __wwbDriverRunning = false;
let __wwbContentH = 0; // active service's natural content height (px)
let __wwbStageH = 0; // stage height currently applied to the active service (px)
window.addEventListener("error", (e) => {
  __wwbLastError = e.message ?? String((e as ErrorEvent).error ?? "error");
});

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
    __wwbLastError = `${label}: ${(err as Error)?.message ?? String(err)}`;
    // eslint-disable-next-line no-console
    console.error(`[reveal] ${label} threw`, err);
  }
}

// NOTE: the actual orchestration (the reduce-motion branch + safe(init…) calls)
// lives at the BOTTOM of this module, after every function and const is declared.
// Running it here would call inits before module-level consts like WWB_PER_VH /
// WWB_HOLD are initialized → a temporal-dead-zone throw inside initWhatWeBuild.

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

// Pinned passage: phrases activate in reading order as the 200vh section is
// scroll-pinned. CLS/INP-safe — toggles a class (color + opacity only), no
// per-frame layout. Element-guarded so the shared script no-ops elsewhere.
function initPinnedPassage(): void {
  const section = document.querySelector<HTMLElement>("[data-pinned]");
  if (!section) return;
  const spans = Array.from(section.querySelectorAll<HTMLElement>(".activate"));
  if (!spans.length) return;
  const thresholds = spans.map((s) => parseFloat(s.dataset.activateAt ?? "0"));

  scroll(
    (progress: number) => {
      for (let i = 0; i < spans.length; i++) {
        spans[i].classList.toggle("is-active", progress >= thresholds[i]);
      }
    },
    // Section is taller than the viewport again, so edge offsets map progress
    // 0->1 across the full sticky-pinned hold (start start = pin begins,
    // end end = pin releases).
    { target: section, offset: ["start start", "end end"] },
  );
}

// "What we build" — pinned collapse scrollytelling. Fresh, dependency-free driver:
// a plain window scroll listener computes progress from the section's own position
// in the document (window.scrollY vs. the section's offsetTop / scroll span), so it
// does NOT depend on the outer's rendered height being right — and the outer height
// is FORCED in JS as a guarantee of scroll distance. As progress advances, the
// active service swaps and its three subs collapse upward (transform translateY on
// the track + per-sub opacity ONLY; the last sub stays). Stage height is measured
// from the tallest service and capped to the viewport. Desktop-only; the pin CSS is
// gated on data-wwb-active, so mobile / reduced-motion / no-JS keep the static list.
const WWB_PER_VH = 180; // scroll distance per service (×vh); 4 services → 820vh total
const WWB_HOLD = 0.2; // fraction of each service fully visible before collapse begins
function initWhatWeBuild(): void {
  const section = document.querySelector<HTMLElement>("[data-wwb]");
  if (!section) return;
  // Guard: desktop only — below this the static interleaved list is the right UX.
  if (!window.matchMedia("(min-width: 769px)").matches) return;
  const outer = section.querySelector<HTMLElement>("[data-wwb-outer]");
  const stage = section.querySelector<HTMLElement>("[data-wwb-stage]");
  const groups = Array.from(section.querySelectorAll<HTMLElement>("[data-wwb-group]"));
  const N = groups.length;
  if (!outer || !stage || N === 0) return;

  section.setAttribute("data-wwb-active", "");
  // Guarantee the scroll distance in JS (don't rely on the CSS height resolving).
  outer.style.height = `${100 + N * WWB_PER_VH}vh`;

  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const eo = (t: number) => 1 - Math.pow(1 - t, 4); // easeOutQuart (matches reference)

  // Cached layout, re-measured on resize / fonts.ready. Each service sizes its OWN
  // clip box to its OWN natural subs height (capped to the viewport); the stage is
  // sized per active service in render() so it ends right after that service's last
  // sub. Top-anchored pin → only the bottom edge moves, so no heading shift on swap.
  let metrics: { subs: HTMLElement[]; track: HTMLElement | null; offs: number[]; h: number; hCapped: number }[] = [];
  let lastStageH = -1;
  const measure = () => {
    const wraps = groups.map((g) => g.querySelector<HTMLElement>("[data-wwb-subs]"));
    stage.style.height = "auto";
    wraps.forEach((w) => {
      if (w) {
        w.style.height = "auto";
        w.style.overflow = "visible";
      }
    });
    const cap = Math.max(300, window.innerHeight - 260);
    metrics = groups.map((el) => {
      const subs = Array.from(el.querySelectorAll<HTMLElement>("[data-wwb-sub]"));
      const track = el.querySelector<HTMLElement>("[data-wwb-track]");
      const h = track ? track.scrollHeight : 0;
      return { subs, track, offs: subs.map((s) => s.offsetTop), h, hCapped: Math.min(h + 16, cap) };
    });
    // Each clip box gets its own service's height; the stage gets the active one.
    wraps.forEach((w, i) => {
      if (w) {
        w.style.height = `${metrics[i].hCapped}px`;
        w.style.overflow = "hidden";
      }
    });
    lastStageH = -1; // force render() to re-apply the stage height after re-measure
  };

  // Progress 0..1 from the outer's viewport-relative position (reference formula):
  // when the outer top is at the viewport top, top=0 → 0; when its bottom reaches
  // the viewport bottom, top=-span → 1. Viewport-relative, so it's correct no
  // matter which element is the scroller.
  const render = () => {
    const span = outer.offsetHeight - window.innerHeight;
    const top = outer.getBoundingClientRect().top;
    const q = span > 0 ? clamp01(-top / span) : 0;
    const prog = q * N;
    const active = Math.min(N - 1, Math.floor(prog));
    const lpRaw = clamp01(prog - active);
    const lp = lpRaw < WWB_HOLD ? 0 : (lpRaw - WWB_HOLD) / (1 - WWB_HOLD);

    __wwbActive = active;
    for (let i = 0; i < N; i++) groups[i].classList.toggle("is-active", i === active);

    const m = metrics[active];
    if (!m || !m.track || m.subs.length === 0) return;
    // Size the stage to the ACTIVE service's content so it ends right after its last
    // sub — written only on change (top-anchored pin: bottom edge moves, heading stays).
    if (m.hCapped !== lastStageH) {
      stage.style.height = `${m.hCapped}px`;
      lastStageH = m.hCapped;
    }
    __wwbContentH = m.h;
    __wwbStageH = m.hCapped;
    const collapsible = m.subs.length - 1; // keep the LAST sub — never empty
    if (collapsible < 1) {
      m.track.style.transform = "translateY(0px)";
      m.subs.forEach((s) => (s.style.opacity = "1"));
      return;
    }
    const cf = lp * collapsible;
    const idx = Math.min(collapsible - 1, Math.floor(cf));
    const ty = -(m.offs[idx] + eo(cf - idx) * (m.offs[idx + 1] - m.offs[idx]));
    m.track.style.transform = `translateY(${ty.toFixed(1)}px)`;
    for (let k = 0; k < m.subs.length; k++) {
      m.subs[k].style.opacity = (k < collapsible ? 1 - eo(clamp01(cf - k)) : 1).toFixed(3);
    }
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

  measure();
  render();
  // Listen broadly: window covers document scroll; document capture-phase covers
  // scroll on ANY ancestor/sub-container, so progress updates whatever the real
  // scroller turns out to be.
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", () => {
    measure();
    render();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); render(); });

  __wwbDriverRunning = true; // reached only if every guard passed + listeners bound
}

// On-page diagnostic overlay, gated on ?debug so it never ships to real visitors.
// Reads live runtime state for the "What we build" pin so it can be screenshotted
// without DevTools. Called unconditionally (works in every motion branch).
const WWB_DEBUG_ALWAYS = false; // overlay is ?debug-gated only — never shown to real visitors
function initWwbDebug(): void {
  if (!WWB_DEBUG_ALWAYS && !new URLSearchParams(location.search).has("debug")) return;

  const strip = document.createElement("div");
  strip.style.cssText =
    "position:fixed;top:8px;right:8px;z-index:99999;background:rgba(10,6,6,0.86);" +
    "color:#fff;font:11px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;" +
    "padding:10px 12px;border-radius:6px;max-width:360px;white-space:pre;" +
    "pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,0.4);";
  document.body.appendChild(strip);

  const shortSel = (el: Element): string => {
    const cls = (el as HTMLElement).className?.toString().trim().split(/\s+/)[0];
    return el.tagName.toLowerCase() + (cls ? "." + cls : "");
  };
  const overflowAncestor = (): string => {
    let el: Element | null = document.querySelector(".wwb__pin");
    while (el && el.parentElement && el !== document.documentElement) {
      el = el.parentElement;
      const cs = getComputedStyle(el);
      if (![cs.overflow, cs.overflowX, cs.overflowY].every((v) => v === "visible")) {
        return `${shortSel(el)} (${cs.overflowX}/${cs.overflowY})`;
      }
    }
    return "none";
  };

  const render = () => {
    const wwb = document.querySelector(".wwb");
    const outer = document.querySelector(".wwb__outer");
    const pin = document.querySelector<HTMLElement>(".wwb__pin");
    const inner = document.querySelector<HTMLElement>(".wwb__inner");
    const psec = document.querySelector<HTMLElement>(".pinned");
    const pcon = document.querySelector<HTMLElement>(".pinned-content");
    strip.textContent =
      "WWB DEBUG\n" +
      `sticky support: ${CSS.supports("position", "sticky") ? "yes" : "no"}\n` +
      `data-wwb-active: ${wwb?.hasAttribute("data-wwb-active") ? "set" : "missing"}\n` +
      `.wwb__outer height: ${outer ? getComputedStyle(outer).height : "?"}\n` +
      `.wwb__pin position: ${pin ? getComputedStyle(pin).position : "?"}\n` +
      `.wwb__pin computed height: ${pin?.offsetHeight ?? "?"}px\n` +
      `.wwb__inner content height: ${inner?.offsetHeight ?? "?"}px\n` +
      `services found: ${document.querySelectorAll("[data-wwb-group]").length}\n` +
      `sub elements found: ${document.querySelectorAll("[data-wwb-sub]").length}\n` +
      `active service: ${__wwbActive}\n` +
      `active content height: ${__wwbContentH}px\n` +
      `stage height: ${__wwbStageH}px\n` +
      `driver running: ${__wwbDriverRunning ? "yes" : "no"}\n` +
      `last JS error: ${__wwbLastError}\n` +
      `matchMedia(>=769): ${window.matchMedia("(min-width: 769px)").matches}\n` +
      `.pinned section height: ${psec?.offsetHeight ?? "?"}px\n` +
      `.pinned-content height: ${pcon?.offsetHeight ?? "?"}px\n` +
      `.pinned-content min-height: ${pcon ? getComputedStyle(pcon).minHeight : "?"}\n` +
      `overflow ancestor: ${overflowAncestor()}`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

// ─── Orchestration (runs last, after all declarations above are initialized) ───
// Kept at the bottom on purpose: function declarations are hoisted so these calls
// resolve, but the inits read module-level consts (WWB_PER_VH, WWB_HOLD, …). Calling
// them before those consts' declaration lines execute would throw a TDZ error.
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
}

// Diagnostic overlay runs regardless of the above, in every motion branch.
safe("initWwbDebug", initWwbDebug);

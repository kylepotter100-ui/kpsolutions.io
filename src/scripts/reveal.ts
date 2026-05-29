import { inView, scroll, animate } from "motion";

// Debug instrumentation (surfaced only via the ?debug overlay below). The error
// listener is registered FIRST so it catches exceptions thrown by any init.
let __wwbLastError = "none";
let __wwbActive = -1;
let __wwbDriverRunning = false;
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

  initHeroOnLoad();
  initHeroParallax();
  initPinnedPassage();
  initWhatWeBuild();
}

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
const WWB_PER_VH = 125; // scroll distance per service (×vh); 4 services → 600vh total
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

  // Cached layout, re-measured on resize / fonts.ready. Size the stage + each clip
  // box to the tallest service's natural subs height (capped to the viewport).
  let metrics: { subs: HTMLElement[]; track: HTMLElement | null; offs: number[] }[] = [];
  const measure = () => {
    const wraps = groups.map((g) => g.querySelector<HTMLElement>("[data-wwb-subs]"));
    stage.style.height = "auto";
    wraps.forEach((w) => {
      if (w) {
        w.style.height = "auto";
        w.style.overflow = "visible";
      }
    });
    let maxH = 0;
    metrics = groups.map((el) => {
      const subs = Array.from(el.querySelectorAll<HTMLElement>("[data-wwb-sub]"));
      const track = el.querySelector<HTMLElement>("[data-wwb-track]");
      if (track) maxH = Math.max(maxH, track.scrollHeight);
      return { subs, track, offs: subs.map((s) => s.offsetTop) };
    });
    const stageH = Math.min(maxH + 8, Math.max(300, window.innerHeight - 260));
    stage.style.height = `${stageH}px`;
    wraps.forEach((w) => {
      if (w) {
        w.style.height = `${stageH}px`;
        w.style.overflow = "hidden";
      }
    });
  };

  // Progress 0..1 from the document scroll position over the section's span. Uses
  // pageYoffset + the outer's offset within the document (not getBoundingClientRect
  // height), so it's robust to layout quirks and matches when the pin is engaged.
  const progress = (): number => {
    const top = outer.getBoundingClientRect().top + window.scrollY; // outer's doc Y
    const span = outer.offsetHeight - window.innerHeight; // scrollable distance
    if (span <= 0) return 0;
    return clamp01((window.scrollY - top) / span);
  };

  const render = () => {
    const prog = progress() * N;
    const active = Math.min(N - 1, Math.floor(prog));
    const lpRaw = clamp01(prog - active);
    const lp = lpRaw < WWB_HOLD ? 0 : (lpRaw - WWB_HOLD) / (1 - WWB_HOLD);

    __wwbActive = active;
    for (let i = 0; i < N; i++) groups[i].classList.toggle("is-active", i === active);

    const m = metrics[active];
    if (!m || !m.track || m.subs.length === 0) return;
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
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    render();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); render(); });

  __wwbDriverRunning = true; // reached only if every guard passed + listener bound
}

// On-page diagnostic overlay, gated on ?debug so it never ships to real visitors.
// Reads live runtime state for the "What we build" pin so it can be screenshotted
// without DevTools. Called unconditionally (works in every motion branch).
const WWB_DEBUG_ALWAYS = true; // TEMP: show the overlay without ?debug while diagnosing
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
    const pin = document.querySelector(".wwb__pin");
    strip.textContent =
      "WWB DEBUG\n" +
      `sticky support: ${CSS.supports("position", "sticky") ? "yes" : "no"}\n` +
      `data-wwb-active: ${wwb?.hasAttribute("data-wwb-active") ? "set" : "missing"}\n` +
      `.wwb__outer height: ${outer ? getComputedStyle(outer).height : "?"}\n` +
      `.wwb__pin position: ${pin ? getComputedStyle(pin).position : "?"}\n` +
      `services found: ${document.querySelectorAll("[data-wwb-group]").length}\n` +
      `sub elements found: ${document.querySelectorAll("[data-wwb-sub]").length}\n` +
      `active service: ${__wwbActive}\n` +
      `driver running: ${__wwbDriverRunning ? "yes" : "no"}\n` +
      `last JS error: ${__wwbLastError}\n` +
      `matchMedia(>=769): ${window.matchMedia("(min-width: 769px)").matches}\n` +
      `overflow ancestor: ${overflowAncestor()}`;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}
initWwbDebug();

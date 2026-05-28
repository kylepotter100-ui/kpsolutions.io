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

// "What we build" paired pinned scrollytelling. Services are chunked into groups
// of two (data-wwb-group); each group pins independently and runs the collapse-
// from-top mechanic over its own scroll range: every sub starts expanded, then
// collapses one at a time (top to bottom) via the [data-collapsed] max-height
// transition, names stacking. Once a group's subs are collapsed its pin releases
// and the page scrolls on to the next group's pin. Per-phase work is attribute
// writes on change only. Desktop-only for now (mobile handled later); the pin CSS
// is gated on data-wwb-active set here, so reduced-motion/no-JS and the
// WWB_COLLAPSE=false escape hatch fall back to the static, fully-expanded list.
const WWB_COLLAPSE = true;
function initWhatWeBuild(): void {
  const section = document.querySelector<HTMLElement>("[data-wwb]");
  if (!section) return;
  // Escape hatch / guards: bail BEFORE opting into the pin so the section keeps
  // the static expanded layout (all content visible, normal scroll).
  if (!WWB_COLLAPSE) return;
  if (!window.matchMedia("(min-width: 769px)").matches) return;
  const groups = Array.from(section.querySelectorAll<HTMLElement>("[data-wwb-group]"));
  if (groups.length === 0) return;

  section.setAttribute("data-wwb-active", "");
  const c01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

  for (const group of groups) {
    const subs = Array.from(group.querySelectorAll<HTMLElement>("[data-wwb-sub]"));
    if (subs.length === 0) continue;
    const total = subs.length;
    let last = -1;
    scroll(
      (p: number) => {
        // total + 1 states: state 0 = all expanded; each later state collapses
        // one more sub from the top, ending with all collapsed to names.
        const n = Math.min(total, Math.floor(c01(p) * (total + 1)));
        if (n === last) return;
        last = n;
        for (let i = 0; i < subs.length; i++) {
          subs[i].setAttribute("data-collapsed", i < n ? "true" : "false");
        }
      },
      { target: group, offset: ["start start", "end end"] },
    );
  }
}

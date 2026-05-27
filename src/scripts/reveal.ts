import { inView, scroll, animate, stagger } from "motion";

// js-reveal is set pre-paint by the inline script in BaseLayout's <head>;
// re-assert here in case this module runs in a context without it.
const root = document.documentElement;
root.classList.add("js-reveal");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Restrained ease-out (easeOutQuint-ish) for the on-load sequence.
const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
  initCapabilityPinned();
}

// Hero on-load: headline words stagger in, then subhead / principle / CTAs
// cascade. ~1.2s total. Guarded by the headline's presence (shared script).
function initHeroOnLoad(): void {
  const headline = document.querySelector<HTMLElement>("[data-hero-headline]");
  if (!headline) return;

  const words = headline.querySelectorAll<HTMLElement>(".hero-word");
  if (words.length) {
    animate(
      words,
      { opacity: [0, 1], y: [14, 0] },
      { duration: 0.4, delay: stagger(0.06), ease: easeOut },
    );
  }

  const cascade = (sel: string, delay: number) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) animate(el, { opacity: [0, 1], y: [10, 0] }, { duration: 0.5, delay, ease: easeOut });
  };
  cascade("[data-hero-sub]", 0.6);
  cascade("[data-hero-principle]", 0.8);
  cascade("[data-hero-cta]", 1.0);
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

// "What we build" pinned choreography (desktop only): as the 200vh section
// scrolls, the 3 tiles hand off prominence (1 → 0.4) and the pinned image
// drifts a 5% zoom. Opacity/transform only. Mobile (≤960px) and reduced-motion
// skip this and use the standard .reveal fade-in.
function initCapabilityPinned(): void {
  const pinned = document.querySelector<HTMLElement>("[data-cap-pinned]");
  if (!pinned) return;
  if (!window.matchMedia("(min-width: 961px)").matches) return;

  const tiles = Array.from(pinned.querySelectorAll<HTMLElement>("[data-cap-tile]"));
  if (!tiles.length) return;
  const image = pinned.querySelector<HTMLElement>("[data-cap-image]");
  const range = { target: pinned, offset: ["start start", "end end"] } as const;

  // JS owns the tiles' opacity now — neutralise the .reveal hide-state.
  tiles.forEach((t) => t.classList.add("is-in"));

  const curves = [
    [1, 0.4, 0.4],
    [0.4, 1, 0.4],
    [0.4, 0.4, 1],
  ];
  tiles.forEach((tile, i) => {
    scroll(animate(tile, { opacity: curves[i] ?? [0.4, 1, 0.4] }, { ease: "linear" }), range);
  });
  if (image) {
    scroll(animate(image, { scale: [1, 1.05] }, { ease: "linear" }), range);
  }
}

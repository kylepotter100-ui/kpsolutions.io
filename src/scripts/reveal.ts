import { inView, scroll, animate } from "motion";

// Gate reveals on JS so the no-JS path keeps every .reveal at opacity:1
// (crawler-safe). Adding js-reveal is what activates the hide-then-reveal CSS.
const root = document.documentElement;
root.classList.add("js-reveal");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  document
    .querySelectorAll<HTMLElement>(".reveal, .reveal-stagger")
    .forEach((el) => el.classList.add("is-in"));
} else {
  inView(
    ".reveal, .reveal-stagger",
    (target) => {
      // motion passes the Element; guard in case an IntersectionObserverEntry is passed.
      const el = target instanceof Element ? target : (target as IntersectionObserverEntry).target;
      el.classList.add("is-in");
    },
    { amount: 0.15 },
  );

  // Hero parallax — as the hero scrolls out, the whole hero (background +
  // content) recedes like a camera pulling back: scales down, lags upward
  // (slower than the page, so the next section rises over it), and fades.
  // Transform + opacity only — compositor-driven, INP-safe. At scroll
  // progress 0 the transform is identity, so the LCP headline paints
  // untouched. This branch is reduce-gated, so reduced motion skips it.
  const hero = document.querySelector<HTMLElement>(".hero");
  if (hero) {
    const layers = hero.querySelectorAll<HTMLElement>(".hero-bg, .hero-content");
    if (layers.length) {
      scroll(
        animate(
          layers,
          { scale: [1, 0.92], y: [0, 90], opacity: [1, 0.7] },
          { ease: "linear" },
        ),
        { target: hero, offset: ["start start", "end start"] },
      );
    }
  }
}

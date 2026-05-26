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

  // Hero parallax — translate only the background field, never the LCP headline.
  const hero = document.querySelector<HTMLElement>(".hero");
  const heroField = document.querySelector<HTMLElement>(".hero-bg-field");
  if (hero && heroField) {
    scroll(animate(heroField, { y: [0, 80] }, { ease: "linear" }), {
      target: hero,
      offset: ["start start", "end start"],
    });
  }
}

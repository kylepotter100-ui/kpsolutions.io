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
    { target: section, offset: ["start start", "end end"] },
  );
}

// "What we build" scrollytelling accordion: 3 services pinned across 450vh; each
// service's sub-sections collapse per phase (Challenge -> Offer; Outcome stays).
// Discrete class toggles only — no per-frame layout (the collapse is a CSS
// grid-rows transition). Desktop-only; mobile/reduced-motion render static via CSS.
// Flip WWB_COLLAPSE to drop the per-sub-section collapse (escape hatch) while
// keeping service pinning + slide.
const WWB_COLLAPSE = true;
function initWhatWeBuild(): void {
  const section = document.querySelector<HTMLElement>("[data-wwb]");
  if (!section) return;
  const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-wwb-service]"));
  if (cards.length !== 3) return;
  if (!window.matchMedia("(min-width: 769px)").matches) return;

  const subs = cards.map((c) => ({
    challenge: c.querySelector<HTMLElement>('[data-sub="challenge"]'),
    offer: c.querySelector<HTMLElement>('[data-sub="offer"]'),
  }));

  let activeIdx = -1;
  let activePhase = -1;

  scroll(
    (p: number) => {
      const raw = Math.min(0.99999, Math.max(0, p)) * 3;
      const idx = Math.floor(raw);
      const local = raw - idx;
      const phase = local < 1 / 3 ? 0 : local < 2 / 3 ? 1 : 2;

      if (idx !== activeIdx) {
        cards.forEach((c, i) => {
          c.classList.toggle("is-active", i === idx);
          c.classList.toggle("is-prev", i < idx);
          c.setAttribute("aria-hidden", i === idx ? "false" : "true");
        });
        activeIdx = idx;
        activePhase = -1;
      }

      if (WWB_COLLAPSE && phase !== activePhase) {
        const s = subs[idx];
        s.challenge?.classList.toggle("is-collapsed", phase >= 1);
        s.offer?.classList.toggle("is-collapsed", phase >= 2);
        activePhase = phase;
      }
    },
    { target: section, offset: ["start start", "end end"] },
  );
}

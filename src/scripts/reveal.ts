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

// "What we build" — left/right pinned scrollytelling (Darktrace-style). The
// section pins; one service is active at a time (left name cross-fades via CSS),
// and the active service's three sub-sections collapse upward in the right column
// via transform: translateY + opacity ONLY — never max-height/height/margin, so
// nothing reflows and the scroll stays smooth. Sub offsets are measured once (and
// on resize / fonts ready) and cached, so per frame we only WRITE transform +
// opacity, never read layout. Data-driven (count = number of [data-wwb-group]).
// Desktop-only for now; the pin CSS is gated on data-wwb-active set here, so
// reduced-motion/no-JS/mobile fall back to the static, fully-expanded list.
const WWB_COLLAPSE = true;
function initWhatWeBuild(): void {
  const section = document.querySelector<HTMLElement>("[data-wwb]");
  if (!section) return;
  // Guards: bail BEFORE opting into the pin so the section keeps the static list.
  if (!WWB_COLLAPSE) return;
  if (!window.matchMedia("(min-width: 769px)").matches) return;
  const groups = Array.from(section.querySelectorAll<HTMLElement>("[data-wwb-group]"));
  const wraps = groups.map((g) => g.querySelector<HTMLElement>("[data-wwb-subs]"));
  const subsByGroup = groups.map((g) =>
    Array.from(g.querySelectorAll<HTMLElement>("[data-wwb-sub]")),
  );
  const N = groups.length;
  if (N === 0) return;

  section.setAttribute("data-wwb-active", "");

  // Cached layout: per group, the offsetTop of each sub plus the wrapper's total
  // height. Re-measured only on resize / once fonts settle — never per frame.
  let offsets: number[][] = [];
  const measure = () => {
    offsets = subsByGroup.map((subs, gi) => {
      const tops = subs.map((s) => s.offsetTop);
      const last = subs[subs.length - 1];
      tops.push(last ? last.offsetTop + last.offsetHeight : 0);
      return tops;
    });
  };
  measure();
  window.addEventListener("resize", measure, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  const c01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
  const eo = (t: number) => 1 - Math.pow(1 - t, 5); // easeOutQuint ≈ cubic-bezier(0.22,1,0.36,1)
  let lastActive = -1;

  scroll(
    (p: number) => {
      const prog = c01(p) * N; // 0..N
      const active = Math.min(N - 1, Math.floor(prog));
      const w = prog - active; // within-act 0..1

      if (active !== lastActive) {
        for (let i = 0; i < N; i++) groups[i].classList.toggle("is-active", i === active);
        lastActive = active;
      }

      const off = offsets[active];
      const wrap = wraps[active];
      const subs = subsByGroup[active];
      const nSub = subs.length;
      if (!off || !wrap || nSub === 0) return;

      const cf = w * nSub; // collapsed-float 0..nSub
      const idx = Math.min(nSub - 1, Math.floor(cf));
      const frac = cf - idx;
      const ty = -(off[idx] + eo(frac) * (off[idx + 1] - off[idx]));
      wrap.style.transform = `translateY(${ty.toFixed(1)}px)`;
      for (let k = 0; k < nSub; k++) {
        subs[k].style.opacity = (1 - eo(c01(cf - k))).toFixed(3);
      }
    },
    { target: section, offset: ["start start", "end end"] },
  );
}

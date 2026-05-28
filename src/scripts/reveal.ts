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

// "What we build" — content-height centred pinned scrollytelling, ported from
// docs/references/what-we-build-collapse.html. The outer (data-wwb-outer) is pure
// scroll distance: 60vh entry buffer + 180vh per service + 60vh exit buffer, so
// the pin engages/releases fully clear of neighbours. The driver math matches the
// reference exactly: remap past the buffers, a per-service entry HOLD (first 28%
// fully visible → fresh start), then collapse the first nSub-1 subs (keep the last
// visible) via transform: translateY on the track + per-sub opacity ONLY. Offsets
// cached on init + resize + fonts.ready. Desktop-only; the pin CSS is gated on
// data-wwb-active, so mobile / reduced-motion / no-JS keep the static list.
const WWB_PER_VH = 180;
const WWB_BUFFER_VH = 60;
const WWB_HOLD = 0.28;
function initWhatWeBuild(): void {
  const section = document.querySelector<HTMLElement>("[data-wwb]");
  if (!section) return;
  // Guards: bail BEFORE opting into the pin so the section keeps the static list.
  if (!window.matchMedia("(min-width: 769px)").matches) return;
  const outer = section.querySelector<HTMLElement>("[data-wwb-outer]");
  const groups = Array.from(section.querySelectorAll<HTMLElement>("[data-wwb-group]"));
  const N = groups.length;
  if (!outer || N === 0) return;

  section.setAttribute("data-wwb-active", "");

  // Cached layout: per service, the offsetTop of each sub within its track. Never
  // read per frame — only re-measured on resize / once fonts settle.
  let metrics: { subs: HTMLElement[]; track: HTMLElement | null; offs: number[] }[] = [];
  const measure = () => {
    metrics = groups.map((el) => {
      const subs = Array.from(el.querySelectorAll<HTMLElement>("[data-wwb-sub]"));
      return {
        subs,
        track: el.querySelector<HTMLElement>("[data-wwb-track]"),
        offs: subs.map((s) => s.offsetTop),
      };
    });
  };
  measure();
  window.addEventListener("resize", measure, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const eo = (t: number) => 1 - Math.pow(1 - t, 4); // easeOutQuart (matches reference)
  const total = WWB_BUFFER_VH + N * WWB_PER_VH + WWB_BUFFER_VH;
  const bufFrac = WWB_BUFFER_VH / total;
  let lastActive = -1;

  // q = motion's progress over the outer (start start → end end) === the
  // reference's -rect.top / (outerHeight - innerHeight).
  scroll(
    (q: number) => {
      const p = clamp01((q - bufFrac) / (1 - 2 * bufFrac)); // strip entry/exit buffers
      const prog = p * N;
      const active = Math.min(N - 1, Math.floor(prog));
      const lpRaw = clamp01(prog - active);
      // Entry hold: first HOLD fraction stays fully expanded, then collapse.
      const lp = lpRaw < WWB_HOLD ? 0 : (lpRaw - WWB_HOLD) / (1 - WWB_HOLD);

      if (active !== lastActive) {
        for (let i = 0; i < N; i++) groups[i].classList.toggle("is-active", i === active);
        lastActive = active;
      }

      const m = metrics[active];
      if (!m || !m.track || m.subs.length === 0) return;
      const nSub = m.subs.length;
      const collapsible = nSub - 1; // keep the LAST sub — never empty, never a lone title
      const cf = lp * collapsible;
      const idx = Math.min(collapsible - 1, Math.floor(cf));
      const frac = cf - idx;
      const ty = -(m.offs[idx] + eo(frac) * (m.offs[idx + 1] - m.offs[idx]));
      m.track.style.transform = `translateY(${ty.toFixed(1)}px)`;
      for (let k = 0; k < nSub; k++) {
        m.subs[k].style.opacity = (k < collapsible ? 1 - eo(clamp01(cf - k)) : 1).toFixed(3);
      }
    },
    { target: outer, offset: ["start start", "end end"] },
  );
}

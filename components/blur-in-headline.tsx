"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const defaultHeadline =
  "KP Solutions builds bespoke software for businesses that want their tools to fit how they actually work — whether you're just starting out, growing fast, or finally moving on from off-the-shelf SaaS. Custom platforms, internal tools, integrations, and AI-visible web presence.";

type BlurInHeadlineProps = {
  text?: string;
  ssrVisible?: boolean;
};

// useScroll polls scroll position via rAF (not the scroll event), so the
// reveal stays in sync during iOS Safari momentum scrolls and under Lenis.
function Word({
  progress,
  start,
  end,
  ssrStatic,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  ssrStatic: boolean;
  children: string;
}): ReactNode {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const filter = useTransform(
    progress,
    [start, end],
    ["blur(8px)", "blur(0px)"]
  );

  return (
    <motion.span
      className="mr-2 inline-block lg:mr-3"
      style={{
        opacity: ssrStatic ? 1 : opacity,
        filter: ssrStatic ? "blur(0px)" : filter,
      }}
    >
      {children}
    </motion.span>
  );
}

export function BlurInHeadline({
  text = defaultHeadline,
  ssrVisible = false,
}: BlurInHeadlineProps = {}): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);

  // 0.85 → 0.15: word 0 starts transitioning while the first line is at 85%
  // of viewport height (clearly visible near the bottom) and the last word
  // completes at 15%, so the entire reveal plays on screen at close to a full
  // viewport-height of scroll. A full-traversal window ("start end" →
  // "start start") lets the opening words finish while the text is still
  // entering the bottom edge, which reads as "pre-revealed".
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "start 0.15"],
  });

  // Inner pages mount the section partway into this window (a compact hero
  // above puts it at ~0.5–0.85 of viewport height), so progress must be
  // re-baselined to 0 from wherever the page loads. A single mount-time
  // snapshot is unreliable — motion's target measurement can settle a frame
  // or two later (priority image, LogoLoop ResizeObserver, Lenis), and a
  // stale baseline delays the start and compresses the reveal. Instead,
  // keep re-baselining while the page is still at the top; the baseline
  // freezes naturally the moment real scrolling starts. Mid-page loads
  // (anchor links, scroll restoration) never re-baseline, so the raw
  // window applies and an already-passed section reads as revealed.
  const baselineRef = useRef(0);
  const progress = useTransform(scrollYProgress, (v) => {
    if (typeof window !== "undefined" && window.scrollY <= 1) {
      baselineRef.current = v;
      return 0;
    }
    const p0 = baselineRef.current;
    if (p0 >= 1) return 1;
    return Math.max(0, (v - p0) / (1 - p0));
  });

  // ssrVisible only affects server/no-JS output: words render fully legible
  // in the HTML, then MotionValues take over before the first client paint.
  const [hydrated, setHydrated] = useState(false);
  useLayoutEffect(() => {
    setHydrated(true);
  }, []);
  const ssrStatic = ssrVisible && !hydrated;

  const words = text.split(" ");

  return (
    <section
      ref={containerRef}
      className="w-full bg-background px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-3xl font-medium text-left leading-snug tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-snug">
          {words.map((word, index) => (
            <Word
              key={index}
              progress={progress}
              start={index / words.length}
              end={(index + 1) / words.length}
              ssrStatic={ssrStatic}
            >
              {word}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

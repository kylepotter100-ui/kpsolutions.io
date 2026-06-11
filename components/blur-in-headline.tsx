"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const defaultHeadline =
  "KP Solutions builds bespoke software for businesses that want their tools to fit how they actually work — whether you're just starting out, growing fast, or finally moving on from off-the-shelf SaaS. Custom platforms, internal tools, integrations, and AI-visible web presence.";

type BlurInHeadlineProps = {
  text?: string;
  ssrVisible?: boolean;
};

// useScroll polls scroll position via rAF (not the scroll event), so the
// reveal stays in sync during iOS Safari momentum scrolls and under Lenis.
// Element-relative offsets also avoid the stale-mountTop / viewport-height /
// address-bar math the previous implementation got wrong on the homepage.
function Word({
  progress,
  start,
  end,
  ssrVisible,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  ssrVisible: boolean;
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
        opacity: ssrVisible ? 1 : opacity,
        filter: ssrVisible ? "blur(0px)" : filter,
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
  // 0.9 → 0.25 is the window the original implementation used: word 0 starts
  // transitioning when the first line is at 90% of viewport height (already
  // visible at the bottom edge) and the last word completes at 25% — so the
  // whole reveal plays on screen. A full-traversal window ("start end" →
  // "start start") lets the first third of the words finish while the text is
  // still entering the bottom of the viewport, which reads as "pre-revealed".
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
  });

  // Inner pages mount the section partway into this window (a compact hero
  // above puts it at ~0.5–0.85 of viewport height). Renormalise from the
  // mount-time value so progress is exactly 0 wherever the page loads and the
  // reveal compresses into the remaining scroll. p0 ≥ 1 (loaded past the
  // section, e.g. anchor link or scroll restore) → fully revealed.
  const initialProgress = useRef<number | null>(null);
  useEffect(() => {
    initialProgress.current = scrollYProgress.get();
  }, [scrollYProgress]);
  const progress = useTransform(scrollYProgress, (v) => {
    const p0 = initialProgress.current ?? 0;
    if (p0 >= 1) return 1;
    return Math.max(0, (v - p0) / (1 - p0));
  });

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
              ssrVisible={ssrVisible}
            >
              {word}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

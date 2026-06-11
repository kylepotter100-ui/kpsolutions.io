"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
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
              progress={scrollYProgress}
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

"use client";

import { useRef, useEffect, useState } from "react";
import type { ReactNode } from "react";

const headline =
  "KP Solutions builds bespoke software for businesses that want their tools to fit how they actually work — whether you're just starting out, growing fast, or finally moving on from off-the-shelf SaaS. Custom platforms, internal tools, integrations, and AI-visible web presence.";

export function BlurInHeadline(): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(1);
  const words = headline.split(" ");

  // Phase 8's rAF poll froze on iOS Safari during touch momentum scroll
  // (the OS suspends rAF callbacks). Scroll/touchmove events still fire,
  // so we drive progress off those and use a single rAF per burst to
  // collapse multi-event frames.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    setScrollProgress(0);

    let pending = false;

    const compute = () => {
      pending = false;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight * 0.9;
      const endOffset = windowHeight * 0.25;
      const progress = Math.min(
        1,
        Math.max(0, (startOffset - rect.top) / (startOffset - endOffset))
      );
      setScrollProgress(progress);
    };

    const schedule = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(compute);
    };

    document.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("touchmove", schedule, { passive: true });

    compute();

    return () => {
      document.removeEventListener("scroll", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("touchmove", schedule);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-background px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-3xl font-medium text-left leading-snug tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-snug">
          {words.map((word, index) => {
            const wordStart = index / words.length;
            const wordEnd = wordStart + 1 / words.length;

            const wordProgress = Math.min(
              1,
              Math.max(0, (scrollProgress - wordStart) / (wordEnd - wordStart))
            );
            const opacity = 0.15 + wordProgress * 0.85;
            const blur = (1 - wordProgress) * 8;

            return (
              <span
                key={index}
                className="mr-2 inline-block lg:mr-3"
                style={{
                  opacity,
                  filter: `blur(${blur}px)`,
                  transition: "opacity 75ms, filter 75ms",
                }}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}

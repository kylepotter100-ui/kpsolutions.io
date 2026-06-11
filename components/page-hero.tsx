"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type PageHeroProps = {
  eyebrow?: string;
  leadingTitle: string;
  italicTitle: string;
  trailingTitle?: string;
  subtitle: string;
};

export function PageHero({
  eyebrow,
  leadingTitle,
  italicTitle,
  trailingTitle,
  subtitle,
}: PageHeroProps): ReactNode {
  return (
    <section className="relative overflow-hidden px-6 pt-40 pb-20 max-[850px]:pt-28 max-[850px]:pb-14">
      <div
        className="absolute inset-0 bg-center bg-no-repeat brightness-110 blur-3xl scale-125 opacity-60"
        style={{ backgroundImage: "url(/BG.jpg)", backgroundSize: "cover" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        {eyebrow ? (
          <motion.div
            className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-black"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease }}
          >
            {eyebrow}
            <span className="text-accent" aria-hidden="true">
              ✦
            </span>
          </motion.div>
        ) : null}

        <motion.h1
          className="text-7xl max-[850px]:text-5xl font-medium tracking-tight leading-[1.1] text-foreground"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.1, ease }}
        >
          {leadingTitle}
          {leadingTitle ? " " : ""}
          <span className="italic font-serif text-accent">{italicTitle}</span>
          {trailingTitle ? ` ${trailingTitle}` : ""}.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-3xl text-lg text-muted-foreground"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}

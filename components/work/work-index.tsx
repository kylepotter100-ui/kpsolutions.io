"use client";

import { ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { PageHero } from "@/components/page-hero";
import { ScrollingThumbnail } from "@/components/scrolling-thumbnail";
import { caseStudies } from "@/lib/work";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export function WorkIndex(): ReactNode {
  return (
    <>
      <PageHero
        leadingTitle="Selected"
        italicTitle="work"
        subtitle="A small, growing catalogue. Each one shipped on a fixed fee, on an agreed timeline, with the code owned entirely by the client."
      />

      <motion.div
        className="mx-auto max-w-5xl px-6 pb-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        {caseStudies.map((cs) => (
          <motion.article
            key={cs.id}
            className="rounded-2xl bg-frame p-8 shadow-sm"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease }}
          >
            <a
              href={`/work/${cs.id}`}
              className="block rounded-xl"
              aria-label={`${cs.title} ${cs.accent} case study`}
            >
              <ScrollingThumbnail
                src={cs.scrollingThumbnail}
                alt={`The ${cs.title} ${cs.accent} homepage, scrolling`}
                className="h-80 w-full rounded-xl max-[850px]:h-64"
              />
            </a>
            <h2 className="mt-8 text-4xl max-[850px]:text-3xl font-medium tracking-tight leading-[1.15] text-foreground">
              {cs.title}{" "}
              <span className="italic font-serif text-accent">
                {cs.accent}
              </span>
              .
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              {cs.tagline}
            </p>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cs.meta.map((row) => (
                <div key={row.label}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="mt-2 text-sm text-foreground">{row.value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Live
                </dt>
                <dd className="mt-2 text-sm">
                  <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {cs.liveLabel}
                  </a>
                </dd>
              </div>
            </dl>

            <motion.a
              href={`/work/${cs.id}`}
              className="group relative cursor-pointer inline-flex items-center mt-10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute right-0 inset-y-0 w-[calc(100%-2rem)] rounded-xl bg-accent" />
              <span className="relative z-10 px-6 py-3 rounded-xl bg-foreground text-background font-medium">
                Read the story
              </span>
              <span className="relative -left-px z-10 w-11 h-11 rounded-xl flex items-center justify-center text-foreground">
                <ArrowDownRight className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45" />
              </span>
            </motion.a>
          </motion.article>
        ))}
      </motion.div>
    </>
  );
}

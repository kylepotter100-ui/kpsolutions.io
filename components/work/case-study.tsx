"use client";

import { ArrowDownRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { BlurInHeadline } from "@/components/blur-in-headline";
import type { CaseStudy } from "@/lib/work";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export function CaseStudyDetail({ study }: { study: CaseStudy }): ReactNode {
  return (
    <>
      <section className="relative px-6 pt-40 pb-20 max-[850px]:pt-28 max-[850px]:pb-14">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[56rem] overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 bg-center bg-no-repeat brightness-110 blur-3xl scale-125 opacity-60"
            style={{ backgroundImage: "url(/BG.jpg)", backgroundSize: "cover" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <motion.a
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All work
          </motion.a>

          <motion.h1
            className="mt-8 text-7xl max-[850px]:text-5xl font-medium tracking-tight leading-[1.1] text-foreground"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8, ease }}
          >
            {study.title}{" "}
            <span className="italic font-serif text-accent">
              {study.accent}
            </span>
            .
          </motion.h1>

          <motion.p
            className="mt-6 max-w-3xl text-lg text-muted-foreground"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.15, ease }}
          >
            {study.tagline}
          </motion.p>
        </div>
      </section>

      <motion.section
        className="px-6 pb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.dl
          className="mx-auto grid max-w-5xl gap-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4"
          variants={fadeInUp}
          transition={{ duration: 0.6, ease }}
        >
          {study.meta.map((row) => (
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
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {study.liveLabel}
              </a>
            </dd>
          </div>
        </motion.dl>
      </motion.section>

      <motion.section
        className="px-6 pb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        transition={{ duration: 0.8, ease }}
      >
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-sm">
          <picture>
            <source media="(max-width: 850px)" srcSet={study.imageMobile} />
            <img
              src={study.image}
              alt={`The ${study.title} ${study.accent} homepage`}
              className="max-h-[36rem] w-full object-cover object-top"
              loading="lazy"
            />
          </picture>
        </div>
      </motion.section>

      <BlurInHeadline text={study.body[0] ?? ""} ssrVisible pinned />

      <section className="px-6 pb-24">
        <motion.div
          className="mx-auto max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease }}
        >
          {study.body.slice(1).map((para, i) => (
            <p
              key={i}
              className="mt-6 text-lg leading-relaxed text-foreground first:mt-0"
            >
              {para}
            </p>
          ))}
        </motion.div>
      </section>

      <section className="px-6 pb-32">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease }}
        >
          <h2 className="text-4xl max-[850px]:text-3xl font-medium tracking-tight text-foreground">
            Something{" "}
            <span className="italic font-serif text-accent">similar</span> on
            your mind?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            A 30-minute call to see if we can help. A written proposal within
            48 hours.
          </p>
          <motion.a
            href="/contact"
            className="group relative cursor-pointer inline-flex items-center mt-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute right-0 inset-y-0 w-[calc(100%-2rem)] rounded-xl bg-accent" />
            <span className="relative z-10 px-6 py-3 rounded-xl bg-foreground text-background font-medium">
              Start a conversation
            </span>
            <span className="relative -left-px z-10 w-11 h-11 rounded-xl flex items-center justify-center text-foreground">
              <ArrowDownRight className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45" />
            </span>
          </motion.a>
        </motion.div>
      </section>
    </>
  );
}

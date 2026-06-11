"use client";

import { ArrowDownRight, Check } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { BlurInHeadline } from "@/components/blur-in-headline";
import { PageHero } from "@/components/page-hero";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const principles = [
  {
    title: "One fee for the agreed scope",
    body: "Scoped in discovery, proposed within 48 hours, signed before a line of code is written.",
  },
  {
    title: "Timeline agreed up front",
    body: "You know the date the build is live before the build starts. The schedule is set together in discovery, with milestones written into the proposal.",
  },
  {
    title: "Code owned by you, from day one",
    body: "The source repository transfers to your organisation as part of handover. No licence dependency on us, no vendor lock-in.",
  },
  {
    title: "No per-seat fees",
    body: "Add as many users as the business needs. No vendor charging you for the people who do the actual work.",
  },
  {
    title: "No lock-in",
    body: "Standard tooling, your hosting, your domain, your data. If you ever want another team to take over, everything they need is already in your hands.",
  },
  {
    title: "Optional post-launch retainers",
    body: "No scope-creep clauses on the build itself. If you want a long-term partner for changes and updates after launch, a retainer is available — never a precondition.",
  },
];

export function PricingContent(): ReactNode {
  return (
    <>
      <PageHero
        leadingTitle="How we"
        italicTitle="price"
        subtitle="A consultative model: we scope the work together, agree one fixed fee for it, and everything we ship is yours."
      />

      <BlurInHeadline
        text="Pricing starts with a conversation. We talk through what you need, agree exactly what we'll build, and put one fee on it — you pay for the work we agree, and everything we ship belongs to you. If you'd like a partner beyond launch, a retainer is there when you want it."
        ssrVisible
      />

      <section className="px-6 py-16">
        <motion.div
          className="relative mx-auto max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease }}
        >
          <div
            className="absolute -inset-1 rounded-[1.2em] bg-accent"
            aria-hidden="true"
          />
          <div className="relative rounded-2xl bg-frame p-8 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Every engagement includes
            </h2>
            <ul className="mt-8 space-y-6">
              {principles.map((p) => (
                <li key={p.title} className="flex items-start gap-4">
                  <Check
                    className="mt-1 h-5 w-5 shrink-0 text-foreground"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-base font-medium text-foreground">
                      {p.title}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-24">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease }}
        >
          <h2 className="text-4xl max-[850px]:text-3xl font-medium tracking-tight text-foreground">
            Want a{" "}
            <span className="italic font-serif text-accent">number</span>?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            A 30-minute call, a written proposal within 48 hours, no obligation
            either way.
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

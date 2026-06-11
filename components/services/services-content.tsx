"use client";

import { ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { BlurInHeadline } from "@/components/blur-in-headline";
import { PageHero } from "@/components/page-hero";
import { illustrationsById } from "@/components/services/illustrations";
import { capabilities } from "@/lib/capabilities";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export function ServicesContent(): ReactNode {
  return (
    <>
      <PageHero
        leadingTitle="What we"
        italicTitle="build"
        subtitle="Four shapes of bespoke work — picked apart so you can see exactly where each one fits. Most engagements blend more than one."
      />

      <BlurInHeadline
        text="Software built around how your business actually works — not how a vendor assumed it should. Code owned entirely by you, scoped comprehensively, delivered on a timeline agreed up front."
        ssrVisible
        pinned
      />

      <div className="mx-auto max-w-5xl px-6 pb-24">
        {capabilities.map((capability) => {
          const Illustration = illustrationsById[capability.id];
          return (
          <motion.section
            key={capability.id}
            id={capability.id}
            className="scroll-mt-24 py-16 border-t border-border first:border-t-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="flex items-center gap-6 max-[850px]:flex-col max-[850px]:items-start max-[850px]:gap-4">
              {Illustration ? (
                <motion.div
                  className="shrink-0 rounded-2xl bg-frame p-3 shadow-sm"
                  variants={fadeInUp}
                  transition={{ duration: 0.6, ease }}
                >
                  <Illustration className="h-24 w-24 max-[850px]:h-20 max-[850px]:w-20" />
                </motion.div>
              ) : null}
              <motion.h2
                className="text-4xl max-[850px]:text-3xl font-medium tracking-tight leading-[1.15] text-foreground"
                variants={fadeInUp}
                transition={{ duration: 0.6, ease }}
              >
                {capability.lead}{" "}
                <span className="italic font-serif text-accent">
                  {capability.accent}
                </span>
                .
              </motion.h2>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {capability.subs.map((sub) => (
                <motion.article
                  key={sub.label}
                  className="rounded-2xl bg-frame p-6 shadow-sm"
                  variants={fadeInUp}
                  transition={{ duration: 0.6, ease }}
                >
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {sub.label}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-foreground">
                    {sub.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.section>
          );
        })}
      </div>

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
            Sounds like your{" "}
            <span className="italic font-serif text-accent">situation</span>?
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

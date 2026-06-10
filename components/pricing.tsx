"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

const principles = [
  "Fixed fee, scoped up front and agreed before any build work begins",
  "Timeline agreed up front — you know the date before we start",
  "Code 100% owned by you, from day one",
  "No per-seat fees, ever",
  "No scope-creep clauses on the fixed-fee build",
  "Zero vendor lock-in — the source repository transfers to your organisation",
  "Optional retainers afterwards if you want a long-term partner for changes and updates",
];

const ease = [0.23, 1, 0.32, 1] as const;

export function Pricing(): ReactNode {
  return (
    <section id="pricing" className="w-full bg-background px-6 py-20 sm:py-28 scroll-mt-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="text-sm font-medium text-muted-foreground">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How we price
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            One fixed fee, agreed before any build work begins. Every engagement
            is scoped comprehensively, so the number you sign is the number you pay.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease }}
          className="relative mx-auto max-w-2xl"
        >
          <div className="absolute -inset-1 rounded-[1.2em] bg-accent" aria-hidden="true" />

          <div className="relative flex h-full flex-col rounded-2xl bg-frame p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-foreground">Fixed fee</h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Scoped in discovery, proposed within forty-eight hours, agreed
              before a line of code is written.
            </p>

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full rounded-xl bg-foreground py-3 text-center text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              Start a conversation
            </motion.a>

            <div className="mt-8">
              <p className="text-sm font-medium text-muted-foreground">
                Every engagement includes:
              </p>
              <ul className="mt-4 space-y-3">
                {principles.map((principle) => (
                  <li key={principle} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-foreground">{principle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

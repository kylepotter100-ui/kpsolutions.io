"use client";

import { ArrowDownRight, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { BlurInHeadline } from "@/components/blur-in-headline";
import { PageHero } from "@/components/page-hero";
import { processFaqs } from "@/lib/faq-data";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

type Phase = {
  marker: string;
  name: string;
  italicWord: string;
  description: string;
  outcomes: string[];
};

const phases: Phase[] = [
  {
    marker: "01",
    name: "Discovery & Architecture",
    italicWord: "Architecture",
    description:
      "A 30-minute call to understand the shape of the work. The brief is written in your words and signed off, the data model drafted on paper, and a fixed-fee proposal lands inside 48 hours. Scope is set together before any build starts.",
    outcomes: [
      "Signed brief in your words",
      "Data model on paper",
      "Fixed fee agreed",
    ],
  },
  {
    marker: "02",
    name: "Design",
    italicWord: "Design",
    description:
      "Real screens, not wireframes. Brand, identity, and the editorial register come together alongside the schema, authentication, and any risky integrations. A live staging URL goes up early so you watch the build as it happens.",
    outcomes: [
      "Real screens, not wireframes",
      "Walking skeleton",
      "Staging URL live",
    ],
  },
  {
    marker: "03",
    name: "Build",
    italicWord: "Build",
    description:
      "The operator UI gets its keyboard shortcuts, bulk actions, and the screens the vendor refused to give you. Error paths, edge cases, and the boring ones are handled, not skipped. The AEO layer goes in: schema graph, llms.txt, direct-answer markup.",
    outcomes: [
      "Operator UI complete",
      "AEO layer wired",
      "Feature-complete build",
    ],
  },
  {
    marker: "04",
    name: "Launch & Handover",
    italicWord: "Handover",
    description:
      "Production cutover with you on the call. The source repo transfers to your organisation if it isn't already there. A runbook lands in your inbox alongside a Loom walkthrough, and the ninety-day post-launch guarantee starts the moment the site is live.",
    outcomes: [
      "Production cutover",
      "Source transferred",
      "90-day guarantee active",
    ],
  },
];

function renderPhaseName(name: string, italicWord: string): ReactNode {
  const idx = name.indexOf(italicWord);
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <span className="italic font-serif text-accent">{italicWord}</span>
      {name.slice(idx + italicWord.length)}
    </>
  );
}

function FaqRow({
  question,
  answer,
}: {
  question: string;
  answer: string;
}): ReactNode {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className="text-lg font-medium text-foreground">{question}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-frame text-foreground">
          {open ? (
            <Minus className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 text-base leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProcessContent(): ReactNode {
  return (
    <>
      <PageHero
        leadingTitle="Our"
        italicTitle="process"
        subtitle="Consultative from the first call. Scope set together. Fixed fee agreed before any build work begins. Code owned by you from day one."
      />

      <BlurInHeadline
        text="Every engagement starts with a conversation, not a contract. We talk through what you're working with, agree what the build needs to do, and write the brief in your words before anything is committed."
        ssrVisible
        pinned
      />

      <div className="mx-auto max-w-5xl px-6 pb-24">
        {phases.map((phase) => (
          <motion.section
            key={phase.marker}
            id={`phase-${phase.marker}`}
            className="scroll-mt-24 py-16 border-t border-border first:border-t-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              variants={fadeInUp}
              transition={{ duration: 0.5, ease }}
            >
              Phase {phase.marker}
            </motion.div>
            <motion.h2
              className="mt-3 text-4xl max-[850px]:text-3xl font-medium tracking-tight leading-[1.15] text-foreground"
              variants={fadeInUp}
              transition={{ duration: 0.6, ease }}
            >
              {renderPhaseName(phase.name, phase.italicWord)}.
            </motion.h2>
            <motion.p
              className="mt-5 max-w-3xl text-lg leading-relaxed text-foreground"
              variants={fadeInUp}
              transition={{ duration: 0.6, ease }}
            >
              {phase.description}
            </motion.p>
            <motion.ul
              className="mt-8 space-y-2"
              variants={fadeInUp}
              transition={{ duration: 0.6, ease }}
            >
              {phase.outcomes.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-3 text-base text-muted-foreground"
                >
                  <span aria-hidden="true">—</span>
                  <span>{o}</span>
                </li>
              ))}
            </motion.ul>
          </motion.section>
        ))}
      </div>

      <section id="faq" className="px-6 py-20 bg-frame scroll-mt-24">
        <motion.div
          className="mx-auto max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease }}
        >
          <h2 className="text-4xl max-[850px]:text-3xl font-medium tracking-tight text-foreground">
            Common{" "}
            <span className="italic font-serif text-accent">questions</span>.
          </h2>
          <div className="mt-10">
            {processFaqs.map((item) => (
              <FaqRow
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
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
            Start a{" "}
            <span className="italic font-serif text-accent">conversation</span>
            .
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            A 30-minute call. A written proposal within 48 hours.
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

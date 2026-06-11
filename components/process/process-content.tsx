"use client";

import { ArrowDownRight, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { BlurInHeadline } from "@/components/blur-in-headline";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

type Week = {
  marker: string;
  name: string;
  italicWord: string;
  description: string;
  outcomes: string[];
};

const weeks: Week[] = [
  {
    marker: "01",
    name: "Discovery & Architecture",
    italicWord: "Architecture",
    description:
      "A 30-minute discovery call. The brief is written in your words, signed off, and the data model is drafted on paper before the contract is final. A fixed-fee proposal lands inside 48 hours.",
    outcomes: ["Signed brief", "Data model on paper", "Fixed fee agreed"],
  },
  {
    marker: "02",
    name: "Design",
    italicWord: "Design",
    description:
      "Real screens, not wireframes. Brand, identity, and the editorial register land in week two, alongside the schema, authentication, and the risky integrations. A live staging URL goes up on day three so you watch the build as it happens.",
    outcomes: ["Real screens", "Walking skeleton", "Staging URL live"],
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

const includedGroups = [
  {
    label: "Strategy",
    items: [
      "Written brief",
      "Data model on paper",
      "Architecture & schema",
      "Fixed-fee proposal",
    ],
  },
  {
    label: "Build",
    items: [
      "Brand identity",
      "Editorial design",
      "Full-stack development",
      "Operator UI",
      "AEO content layer",
      "Schema.org markup",
      "llms.txt directive",
    ],
  },
  {
    label: "Launch",
    items: [
      "Production deployment",
      "Source repo transfer",
      "Runbook documentation",
      "Loom walkthrough",
      "90-day post-launch guarantee",
    ],
  },
];

const faqItems = [
  {
    q: "What happens in the first week?",
    a: "Discovery and architecture. A 30-minute call, the brief written in your words and signed off, the data model drafted on paper, and a fixed-fee proposal within 48 hours.",
  },
  {
    q: "When do I see something real?",
    a: "By day three of week two a live staging URL goes up, and you watch the build as it happens. Real screens, not wireframes.",
  },
  {
    q: "What do I get at handover?",
    a: "Production cutover with you on the call, the source repository transferred to your organisation, a runbook, a Loom walkthrough, and a ninety-day post-launch guarantee that starts the moment you are live.",
  },
  {
    q: "How is it priced?",
    a: "Every engagement is a fixed fee, scoped in week one and agreed before week two begins. No scope-creep clauses on the fixed-fee build; optional retainers afterwards if you want a long-term partner for changes and updates.",
  },
  {
    q: "Why four weeks?",
    a: "The constraint is the point. It rules out the discovery phase that produces nothing and the replatform that ships eighteen months late, and it forces scope to be set in week one and respected throughout.",
  },
  {
    q: "Who actually does the work?",
    a: "One person, operator to operator. Decisions are made on the call, not in a status report, with no account managers or hand-offs in between.",
  },
];

function renderWeekName(name: string, italicWord: string): ReactNode {
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
      <section className="px-6 pt-40 pb-16 max-[850px]:pt-28">
        <div className="mx-auto max-w-5xl">
          <motion.h1
            className="text-7xl max-[850px]:text-5xl font-medium tracking-tight leading-[1.1] text-foreground"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8, ease }}
          >
            The Four Week{" "}
            <span className="italic font-serif text-accent">Build</span>.
          </motion.h1>
          <motion.p
            className="mt-6 max-w-3xl text-lg text-muted-foreground"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.15, ease }}
          >
            Brief on Monday. Live four Fridays later. Fixed fee. Code owned by
            you.
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        {weeks.map((week) => (
          <motion.section
            key={week.marker}
            id={`week-${week.marker}`}
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
              Week {week.marker}
            </motion.div>
            <motion.h2
              className="mt-3 text-4xl max-[850px]:text-3xl font-medium tracking-tight leading-[1.15] text-foreground"
              variants={fadeInUp}
              transition={{ duration: 0.6, ease }}
            >
              {renderWeekName(week.name, week.italicWord)}.
            </motion.h2>
            <motion.p
              className="mt-5 max-w-3xl text-lg leading-relaxed text-foreground"
              variants={fadeInUp}
              transition={{ duration: 0.6, ease }}
            >
              {week.description}
            </motion.p>
            <motion.ul
              className="mt-8 space-y-2"
              variants={fadeInUp}
              transition={{ duration: 0.6, ease }}
            >
              {week.outcomes.map((o) => (
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

      <section className="px-6 py-16 bg-frame">
        <motion.div
          className="mx-auto max-w-5xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-4xl max-[850px]:text-3xl font-medium tracking-tight text-foreground"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease }}
          >
            What&apos;s{" "}
            <span className="italic font-serif text-accent">included</span>.
          </motion.h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {includedGroups.map((g) => (
              <motion.div
                key={g.label}
                variants={fadeInUp}
                transition={{ duration: 0.6, ease }}
              >
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {g.label}
                </div>
                <ul className="mt-4 space-y-2">
                  {g.items.map((it) => (
                    <li key={it} className="text-base text-foreground">
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-20">
        <motion.div
          className="mx-auto max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease }}
        >
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            What it costs
          </div>
          <p className="mt-4 text-3xl max-[850px]:text-2xl font-medium tracking-tight leading-[1.2] text-foreground">
            Costs are scoped in week one and agreed{" "}
            <span className="italic font-serif text-accent">before</span> week
            two begins.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Every engagement is fixed-fee. No scope-creep clauses on the
            fixed-fee build; optional retainers afterwards if you want a
            long-term partner for changes and updates.
          </p>
        </motion.div>
      </section>

      <BlurInHeadline
        text="Four weeks is the constraint that makes the rest of it possible. It rules out the long discovery phase that produces nothing. It rules out the multi-stage replatform that ships eighteen months late. It rules out the agency dance — three account managers, two project managers, four developers nobody talked to."
        ssrVisible
      />

      <section className="px-6 pb-20">
        <motion.div
          className="mx-auto max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-4xl max-[850px]:text-3xl font-medium tracking-tight text-foreground"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease }}
          >
            Why it{" "}
            <span className="italic font-serif text-accent">works</span>.
          </motion.h2>
          <motion.p
            className="mt-6 text-lg leading-relaxed text-foreground"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease }}
          >
            What&apos;s left is the build. Operator on operator. One person
            doing the work, one person ringing them on Tuesday morning.
            Decisions made in the call, not in a status report.
          </motion.p>
          <motion.p
            className="mt-6 text-lg leading-relaxed text-foreground"
            variants={fadeInUp}
            transition={{ duration: 0.6, ease }}
          >
            The constraint is also a forcing function. When the cycle is four
            weeks, scope is set in week one and respected throughout. When the
            cycle is open-ended, scope drifts and the project is what pays for
            it.
          </motion.p>
        </motion.div>
      </section>

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
            {faqItems.map((item) => (
              <FaqRow key={item.q} question={item.q} answer={item.a} />
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
            <span className="italic font-serif text-accent">build</span>.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            A 30-minute conversation. A written proposal within 48 hours.
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

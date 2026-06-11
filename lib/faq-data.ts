// Plain data modules (no "use client") so server pages can reuse the same
// items for FAQPage JSON-LD that the client components render visually.

export type FaqItem = {
  question: string;
  answer: string;
};

export const homeFaqs: FaqItem[] = [
  {
    question: "What happens first?",
    answer:
      "Discovery and architecture. A 30-minute call to see if we can help, then the brief written in your words and signed off, the data model drafted on paper, and a fixed-fee proposal within 48 hours.",
  },
  {
    question: "When do I see something real?",
    answer:
      "Early on. A live staging URL goes up so you watch the build as it happens — real screens, not wireframes.",
  },
  {
    question: "What do I get at handover?",
    answer:
      "Production cutover with you on the call, the source repository transferred to your organisation, a runbook, a Loom walkthrough, and a ninety-day post-launch guarantee that starts the moment you are live.",
  },
  {
    question: "How is it priced?",
    answer:
      "Every build is a fixed fee, scoped up front and agreed before any work begins, with no scope-creep clauses. After launch, optional retainers are available if you want a long-term partner for changes, updates, and ongoing support.",
  },
  {
    question: "Why a fixed scope?",
    answer:
      "A tight, fixed scope is the constraint that makes the rest possible. It rules out the discovery phase that produces nothing and the replatform that ships eighteen months late, and it keeps scope set up front and respected throughout.",
  },
  {
    question: "Who actually does the work?",
    answer:
      "One person, operator to operator. Decisions are made on the call, not in a status report, with no account managers or hand-offs in between.",
  },
];

export const processFaqs: FaqItem[] = [
  {
    question: "What happens in the first week?",
    answer:
      "Discovery and architecture. A 30-minute call, the brief written in your words and signed off, the data model drafted on paper, and a fixed-fee proposal within 48 hours.",
  },
  {
    question: "When do I see something real?",
    answer:
      "By day three of week two a live staging URL goes up, and you watch the build as it happens. Real screens, not wireframes.",
  },
  {
    question: "What do I get at handover?",
    answer:
      "Production cutover with you on the call, the source repository transferred to your organisation, a runbook, a Loom walkthrough, and a ninety-day post-launch guarantee that starts the moment you are live.",
  },
  {
    question: "How is it priced?",
    answer:
      "Every engagement is a fixed fee, scoped in week one and agreed before week two begins. No scope-creep clauses on the fixed-fee build; optional retainers afterwards if you want a long-term partner for changes and updates.",
  },
  {
    question: "Why four weeks?",
    answer:
      "The constraint is the point. It rules out the discovery phase that produces nothing and the replatform that ships eighteen months late, and it forces scope to be set in week one and respected throughout.",
  },
  {
    question: "Who actually does the work?",
    answer:
      "One person, operator to operator. Decisions are made on the call, not in a status report, with no account managers or hand-offs in between.",
  },
];

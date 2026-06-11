export type CapabilitySub = {
  label: string;
  body: string;
};

export type Capability = {
  id: string;
  lead: string;
  accent: string;
  subs: CapabilitySub[];
};

export const capabilities: Capability[] = [
  {
    id: "bespoke",
    lead: "Bespoke",
    accent: "software",
    subs: [
      {
        label: "The Challenge",
        body: "You're running your business on tools built for someone else. The important work lives in spreadsheets, in apps nobody quite remembers setting up, and in steps your team just has to know to do. Every workaround is a small tax you pay every single day.",
      },
      {
        label: "What We Offer",
        body: "Software built around how your business actually works — not how a vendor assumed it should. Custom platforms and internal tools designed for your operation, with the code owned entirely by you. Your data, your process, your terms.",
      },
      {
        label: "The Outcome",
        body: "A system that does exactly what you need and nothing you don't. No per-seat fees for features you'll never touch, no waiting on someone else's roadmap. When something needs to change, it changes — because it's yours.",
      },
    ],
  },
  {
    id: "modernization",
    lead: "Modernization &",
    accent: "replacement",
    subs: [
      {
        label: "The Challenge",
        body: "Legacy systems and a patchwork of disconnected apps quietly slow everything down. Data is trapped in silos, simple reports take hours to assemble, and nobody's entirely sure which system holds the truth. The cost of keeping it all limping along grows every year.",
      },
      {
        label: "What We Offer",
        body: "We replace the tangle with a single platform built around how your business runs today. One system, one source of truth, one team on the hook for it — instead of five vendors pointing at each other when something breaks.",
      },
      {
        label: "The Outcome",
        body: "The daily friction disappears. Your team stops fighting the tools and starts using them. One place to look, one place to trust, and a foundation you can actually build on.",
      },
    ],
  },
  {
    id: "integrations",
    lead: "Integrations &",
    accent: "automation",
    subs: [
      {
        label: "The Challenge",
        body: "Your tools don't talk to each other, so your team becomes the integration — copying data between systems, re-keying the same numbers, holding workflows together by hand. It's slow, it's error-prone, and it gets worse as you grow.",
      },
      {
        label: "What We Offer",
        body: "We connect what's broken and automate what's manual. The spreadsheets, the copy-paste, the processes held together with string — replaced with systems that simply run. Where AI genuinely earns its keep — drafting, triage, lookups, follow-ups — we weave it in quietly. The rest stays human.",
      },
      {
        label: "The Outcome",
        body: "Hours of repetitive work disappear every week. Information moves itself, accurately, without anyone thinking about it. Your team spends its time on the decisions that actually need a person.",
      },
    ],
  },
  {
    id: "aeo",
    lead: "AI-visible",
    accent: "web presence",
    subs: [
      {
        label: "The Challenge",
        body: "Your customers have started asking AI who to hire. They ask ChatGPT, Claude, or Perplexity for recommendations — and increasingly they act on the answer. If those tools can't read and understand your site, you simply aren't part of that conversation.",
      },
      {
        label: "What We Offer",
        body: "Websites engineered to be found, understood, and recommended by AI — not just listed in traditional search. We build the structure and clarity these systems rely on, so when someone asks about what you do, your business is the answer that comes back.",
      },
      {
        label: "The Outcome",
        body: "You show up where your competitors don't — in the AI-driven recommendations your future customers already trust. New traffic from a channel most businesses haven't even noticed yet.",
      },
    ],
  },
];

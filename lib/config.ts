/**
 * ============================================================================
 * KP SOLUTIONS — site configuration
 * ============================================================================
 *
 * Copy lives here where possible. Some sections still hold their copy inside
 * the component file (hero, faq, testimonials, how-it-works) — Phase 1 edits
 * both this file and those component constants. A later refactor could
 * centralise everything; out of scope for the content migration.
 */

export const siteConfig = {
  // Brand
  name: "KP Solutions",
  tagline: "Software that fits how you work",
  description:
    "KP Solutions builds bespoke software for established businesses that have outgrown off-the-shelf SaaS. Custom platforms, internal tools, integrations, and AI-visible web presence, scoped comprehensively with code owned by the client from day one.",

  // URLs
  url: "https://kpsolutions.io",
  twitter: "@kpsolutions",

  // Navigation — restructured fully in Phase 3
  nav: {
    cta: {
      text: "Start a conversation",
      href: "/contact",
    },
    signIn: {
      text: "Sign in",
      href: "#",
    },
  },
};

export const heroConfig = {
  badge: "Now booking",
  headline: {
    line1: "Software that fits",
    line2: "how you",
    accent: "work",
  },
  subheadline:
    "Bespoke platforms, internal tools, and integrations — plus web presence engineered to be found by AI. Built around you, owned entirely by you.",
  cta: {
    text: "Start a conversation",
    href: "/contact",
  },
};

export const blurHeadlineConfig = {
  text: "KP Solutions builds bespoke software for businesses that want their tools to fit how they actually work — whether you're just starting out, growing fast, or finally moving on from off-the-shelf SaaS. Custom platforms, internal tools, integrations, and AI-visible web presence.",
};

export const testimonialsConfig = {
  // One real client today; plural phrasing would read dishonest.
  title: "Client story",
  autoplayInterval: 10000, // unused once Phase 2b removes autorotation
};

export const howItWorksConfig = {
  title: "How it works",
  description:
    "Scoped comprehensively. Fixed fee. Code owned by you, from day one.",
  cta: {
    text: "Start a conversation",
    href: "/contact",
  },
};

export const pricingConfig = {
  // Section is replaced by a single "How we price" panel in Phase 2c.
  title: "How we price",
  description:
    "One fixed fee, scoped up front and agreed before any build work begins. No scope-creep clauses on the build. Optional retainers afterwards if you want a long-term partner.",
  billingNote: "",
};

export const faqConfig = {
  title: "Questions, answered",
  description:
    "If something here doesn't cover what you need, the fastest answer is a thirty-minute call.",
  cta: {
    primary: {
      text: "Start a conversation",
      href: "/contact",
    },
    secondary: {
      text: "Read the process",
      href: "#how-it-works",
    },
  },
};

export const footerConfig = {
  // Waitlist form is removed in Phase 3b; copy here describes the replacement.
  cta: {
    headline: "Tell us about the work that doesn't fit the tools you have.",
    placeholder: "",
    button: "Start a conversation",
  },
  copyright: `© ${new Date().getFullYear()} KP Solutions · Loughborough, UK`,
};

/**
 * ============================================================================
 * FEATURE FLAGS
 * ============================================================================
 */

export const features = {
  smoothScroll: true,
  // Disabled once Phase 2b reduces the testimonial carousel to a single entry.
  testimonialAutoplay: false,
  parallaxHero: true,
  blurInHeadline: true,
};

/**
 * ============================================================================
 * THEME CONFIGURATION
 * ============================================================================
 */

export const themeConfig = {
  defaultTheme: "system" as "light" | "dark" | "system",
  enableSystemTheme: true,
};

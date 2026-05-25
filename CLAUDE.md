# KP Solutions — Engineering Standards

This file is the source of truth for how every page, component, and feature is built. Defer to it on every decision. If it conflicts with a default, the file wins.

## Project context

- **Project:** kpsolutions.io — marketing site for KP Solutions, a one-person bespoke software studio.
- **Stack:** Astro 6 + Tailwind + Cloudflare Workers, deployed via the `@astrojs/cloudflare` adapter.
- **Domain:** kpsolutions.io (production), kpsolutions.workers.dev (staging).
- **Positioning:** Custom software for established operators. Websites are one deliverable shape among many; the product is software that solves operational problems. Tone is operator-to-operator, never agency-to-procurement.

## Hard rules (never violate)

- **Never use Next.js for this project or any marketing/content site.** Astro 6 is mandatory.
- **No client-side JavaScript on content pages unless an island genuinely needs it.** Forms, interactive widgets, and animated state are islands. Everything else is `.astro`.
- **No Inter, Roboto, Arial, or generic system-font defaults for display type.** Pair a distinctive display font with a refined body font.
- **No purple-to-blue gradients.** No card-in-card layouts. No icon-tile-above-heading patterns. Impeccable's anti-pattern rules apply.
- **All hero copy and primary value props must be in the server-rendered HTML.** Never gate critical content behind hydration — LLM crawlers don't execute JavaScript.
- **TypeScript strict mode.** No `any` without a comment explaining why.

## Performance budgets (contractual)

- Lighthouse Performance ≥ 95 on mobile
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- Total JS payload < 50KB on marketing pages
- Total CSS < 30KB after purge
- All images served as AVIF or WebP, with width/height attributes set

## AEO / GEO requirements (every page)

- Server-rendered HTML for all primary content above the fold.
- **JSON-LD structured data on every page.** Organization schema sitewide via the root layout. Page-specific schemas as appropriate: Service (service pages), Article (insights), FAQPage (any page with a FAQ block), BreadcrumbList (deep pages).
- **40-60 word direct answer near the top of every page.** This is the AI-extractable summary.
- **Strict heading hierarchy.** One H1 per page; H2 for major sections; H3 for sub-sections. Never skip levels.
- **FAQ block on at least the homepage and every service page**, marked up with FAQPage schema.
- **llms.txt at root** — concise, under 5KB, leads with brand summary, links to canonical pages.
- **robots.txt allows** GPTBot, ClaudeBot, PerplexityBot, Google-Extended, BingBot, and Googlebot. Do not block AI crawlers.

## Image and asset strategy

- Use `<Image>` from `astro:assets` for all images, never raw `<img>`.
- Hero images: `loading="eager"`, `fetchpriority="high"`. Everything else lazy.
- Higgsfield MCP is available for stylised brand imagery only. Never use it for "real photography" simulations — abstract, atmospheric, or branded-character work only. AI-generated faces or fake team photos are forbidden.
- All OG images dynamically generated, 1200x630, with the brand mark.

## Motion

- Use the `motion` package (vanilla) for all `.astro` component animations: scroll reveals, fade-ins, page-load staggers.
```ts
  import { animate, inView } from "motion";
```
- Use `motion/react` only inside React islands when animation must respond to component state.
- One well-orchestrated page-load animation beats scattered micro-interactions. Match intensity to the aesthetic — restraint wins for premium positioning.

## Forms and email

- Contact form submits to a Cloudflare Worker function that calls **Resend** to send the email.
- Never use Next.js API routes, Vercel Functions, or roll-your-own SMTP.
- Form is a React island only because it needs validation state; everything around it is `.astro`.

## Accessibility

- WCAG 2.2 AA minimum on every component.
- Real focus states (not removed, not invisible). Tab order matches visual order.
- Colour contrast checked: 4.5:1 minimum for body text, 3:1 for large text and UI components.
- All interactive elements reachable by keyboard. No mouse-only patterns.

## Forbidden patterns

- "AI-slop" aesthetics: purple gradients on white, Inter everywhere, card-in-card nesting, icon tile above heading, grey text on coloured backgrounds, generic stock photo of "diverse team smiling at laptop."
- Sticker AI: chat bubbles, "Powered by AI" badges, sparkle icons.
- Vague claims without specifics: "we deliver quality solutions" — replaced with concrete process language.
- Agency clichés: "passionate team," "innovative thinking," "tailored approach." Operator-to-operator language only.

## When to invoke Impeccable

- `/impeccable audit` before merging any new page.
- `/impeccable polish` on any component that feels close-but-not-quite.
- `/impeccable critique` for an LLM critique pass on the design.
- The deterministic CLI runs in CI: `npx impeccable detect src/`.

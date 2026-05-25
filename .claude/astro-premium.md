# Astro 6 Stack Conventions

## File structure

```
src/
  components/        # .astro components (default), .tsx for islands only
  layouts/
    BaseLayout.astro # JSON-LD, OG tags, meta, theme — every page extends this
  pages/             # File-based routing
  content/           # Content collections (insights, case-studies)
  styles/            # Global Tailwind, fonts
  lib/               # Utilities, schema generators
public/
  llms.txt
  robots.txt
  fonts/             # Self-hosted, never Google Fonts CDN
```

## Component conventions

- Default to `.astro` components. Reach for React (`.tsx`) only when the component requires client-side state that survives interaction.
- Mark React islands with the appropriate directive: `client:load` only when truly needed, prefer `client:idle` or `client:visible`.
- Never use `client:only` on critical content — it will be invisible to crawlers.

## Content collections

Use Astro's `content/` directory with type-safe schemas for:
- Insights / blog posts
- Case studies
- Service definitions (if you want them content-driven)

Define schemas in `src/content/config.ts` with Zod. All content gets typed at build time.

## JSON-LD pattern

Define schemas as TypeScript functions in `src/lib/schema.ts`:

```ts
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KP Solutions",
    "url": "https://kpsolutions.io",
    // ...
  };
}
```

Render in `BaseLayout.astro`:

```astro
<script type="application/ld+json" set:html={JSON.stringify(organizationSchema())} />
```

Page templates compose page-specific schemas on top of the base.

## llms.txt format

At `public/llms.txt`, lead with a single-paragraph brand summary, then list canonical pages with one-line descriptions. Keep under 5KB. Update on every meaningful page change.

## Server islands

Use server islands for content that's dynamic but not personalised — e.g. latest insight on the homepage, live booking count for case studies. Mark with `server:defer` and provide a fallback for the initial render.

## Cloudflare adapter specifics

- Sessions: Workers KV, auto-provisioned via the adapter
- Email: Resend, called from `pages/api/contact.ts` route handlers
- CRON: Workers Cron Triggers (separate worker, not Astro)
- Storage for uploaded assets (if needed): R2

## Tailwind setup

- Use Tailwind v4 syntax with CSS-first config.
- Define design tokens in `src/styles/tokens.css` as `@theme` variables.
- Custom font setup in tokens, not Tailwind config.
- Prefer arbitrary values for one-off cases over polluting the theme.

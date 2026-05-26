// ============================================================
// kpsolutions.io — /build · body sections
// BuildHero · CustomPlatforms · InternalTools · AIVisible ·
// AtmosphericBreak · Integrations · LegacyReplacement ·
// BuildClosing
//
// PlaceholderLabel + Icon + useReveal + Header + Footer come
// from core.jsx + sections.jsx so the system stays one piece.
// ============================================================

// ── Build hero — compressed type-only moment, ~55vh ─────────
function BuildHero() {
  return (
    <section className="build-hero">
      <div className="shell build-hero__inner">
        <h1 className="build-hero__title">
          Five shapes of{' '}
          <span className="build-hero__italic">bespoke software</span>.
        </h1>
        <p className="build-hero__sub">
          Software is the product. The shape it takes depends on what your
          operation actually needs.
        </p>
      </div>
    </section>
  );
}

// ── Shared layout helpers ───────────────────────────────────
function CategoryText({ eyebrow, title, body, example, alignment = 'left' }) {
  return (
    <div className={`build-cat__text build-cat__text--${alignment}`}>
      {eyebrow && (
        <div className="build-cat__eyebrow">{eyebrow}</div>
      )}
      <h2 className="build-cat__title">{title}</h2>
      <p className="build-cat__body">{body}</p>
      {example && (
        <p className="build-cat__example">
          <span className="build-cat__example-label">Example.</span> {example}
        </p>
      )}
    </div>
  );
}

function PlaceholderSurface({ variant, label, position = 'bottom-left' }) {
  // `variant` controls the warm tonal palette of the placeholder
  // surface. Each variant suggests a different real-world image
  // intent — see the label inside the region.
  return (
    <div className={`placeholder-surface placeholder-surface--${variant}`}>
      <svg className="placeholder-surface__grain" preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg">
        <filter id={`ps-grain-${variant}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2"
                        seed={variant.length * 3} stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0.95
                                 0 0 0 0 0.85
                                 0 0 0 0 0.75
                                 0 0 0 0.4 0"/>
        </filter>
        <rect width="100%" height="100%" filter={`url(#ps-grain-${variant})`}/>
      </svg>
      <div className="placeholder-surface__scrim"></div>
      <PlaceholderLabel tone="light" position={position}>
        {label}
      </PlaceholderLabel>
    </div>
  );
}

// ── Category 1 — Custom platforms (40/60, image right, sticky)
// Motion intent in chat: image (right column) has
// `position: sticky` so it stays fixed while the text column
// scrolls past it for the first ~70% of the section.
function CustomPlatforms() {
  const ref = useReveal();
  return (
    <section id="custom-platforms" className="build-cat build-cat--split-right">
      <div className="shell-wide build-cat__grid build-cat__grid--40-60">
        <div ref={ref} className="reveal build-cat__text-col">
          <CategoryText
            title={<>Custom <span className="build-cat__italic">platforms</span>.</>}
            body="Full applications for customer-facing workflows or revenue-generating operations — the system the business actually runs on. Built around how the work moves, not around what a vendor was willing to sell. Booking platforms, marketplaces, member portals, ops consoles, and the public-facing products you don't yet have."
            example="A residency-booking platform with integrated payments, customer accounts, and the admin tooling the studio runs from — built and shipped in four weeks for Potter Sanctuary."
          />
        </div>

        <div className="build-cat__image-col build-cat__image-col--sticky">
          <div className="build-cat__sticky">
            <PlaceholderSurface
              variant="platform"
              label="Custom platform — public-facing application in operational context · pinned while text scrolls"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Category 2 — Internal tools (full-bleed, text overlays L)
// Motion intent in chat: subtle parallax on the background
// image as the user scrolls past — image translates ~30%
// slower than the page.
function InternalTools() {
  return (
    <section id="internal-tools" className="build-cat build-cat--bleed">
      <div className="build-cat__bleed-surface build-cat__bleed-surface--internal">
        <svg className="build-cat__bleed-grain" preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">
          <filter id="bleed-grain-internal">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="29" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.95
                                   0 0 0 0 0.85
                                   0 0 0 0 0.75
                                   0 0 0 0.4 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#bleed-grain-internal)"/>
        </svg>
        <div className="build-cat__bleed-scrim"></div>
        <div ref={useReveal()} className="reveal build-cat__bleed-content">
          <CategoryText
            title={<>Internal <span className="build-cat__italic">tools</span>.</>}
            body="Admin systems, operations dashboards, purpose-built CRMs for how your team actually works. Keyboard shortcuts, bulk actions, and the screens that vendor software refuses to give you. Designed by an operator who has used the spreadsheet you're trying to replace."
            example="A renewal-quoting console that batches 3,200 quotes into one tabular view, with keyboard nudges that cut the controller's Monday from four hours to thirty minutes."
            alignment="left"
          />
        </div>
        <PlaceholderLabel tone="light" position="bottom-right">
          Internal tool — admin dashboard in back-office setting,
          slight overhead angle, warm light · parallax on scroll
        </PlaceholderLabel>
      </div>
    </section>
  );
}

// ── Category 3 — AI-visible web presence (centred, extra weight)
function AIVisible() {
  return (
    <section id="aeo" className="build-cat build-cat--centred">
      <div className="shell">
        <div ref={useReveal()} className="reveal build-cat__centred-head">
          <h2 className="build-cat__title build-cat__title--centred">
            AI-visible web <span className="build-cat__italic">presence</span>.
          </h2>
        </div>

        <div ref={useReveal()} className="reveal build-cat__editorial-image">
          <PlaceholderSurface
            variant="aeo"
            label="AI-visible web presence — quietly glowing screen in dark room, conceptual"
            position="bottom-left"
          />
        </div>

        <div ref={useReveal()} className="reveal build-cat__centred-body">
          <p className="build-cat__centred-desc">
            For businesses with no site, or whose current site is invisible
            to ChatGPT, Claude, Perplexity, and Google AI Overviews.
            Engineered to be cited by AI search engines, not just indexed by
            traditional ones. Schema.org graphs, llms.txt directive layers,
            direct-answer markup, and the editorial register that AI
            engines surface verbatim. Indexed by Google is a side effect,
            not the goal.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Atmospheric break between cats 3 and 4 ──────────────────
function AtmosphericBreak() {
  return (
    <section aria-label="Atmospheric break" className="build-break">
      <div className="build-break__surface">
        <svg className="build-break__grain" preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">
          <filter id="break-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="51" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.95
                                   0 0 0 0 0.85
                                   0 0 0 0 0.75
                                   0 0 0 0.42 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#break-grain)"/>
        </svg>
        <div className="build-break__scrim"></div>
        <PlaceholderLabel tone="light" position="bottom-left">
          Atmospheric break — operational scene at golden hour,
          warm tonal palette
        </PlaceholderLabel>
      </div>
    </section>
  );
}

// ── Category 4 — Integrations & automation (60/40, image left)
function Integrations() {
  return (
    <section id="integrations" className="build-cat build-cat--split-left">
      <div className="shell-wide build-cat__grid build-cat__grid--60-40">
        <div className="build-cat__image-col">
          <PlaceholderSurface
            variant="integrations"
            label="Integrations — structural connection metaphor, server cabinet cabling or structural joins"
            position="bottom-left"
          />
        </div>

        <div ref={useReveal()} className="reveal build-cat__text-col">
          <CategoryText
            title={<>Integrations &{' '}
              <span className="build-cat__italic">automation</span>.</>}
            body="Connecting the systems you already run so they behave like one. Webhook plumbing, state reconciliation, and the operator UI to fix things when they drift. ERP ↔ Stripe, CRM ↔ inbox, payment provider ↔ ledger — and the dashboard that tells you when something didn't line up."
            example="A nightly job that reconciles three subscription providers against a single customer ledger and surfaces the diffs in a Slack channel before the morning standup."
          />
        </div>
      </div>
    </section>
  );
}

// ── Category 5 — Legacy replacement (text-only, compressed) ─
function LegacyReplacement() {
  const ref = useReveal();
  return (
    <section id="legacy" className="build-cat build-cat--text-only">
      <div className="shell-tight">
        <div ref={ref} className="reveal">
          <CategoryText
            title={<>Legacy <span className="build-cat__italic">replacement</span>.</>}
            body="Retiring a fragmented SaaS stack or an aging custom system, in pieces, without a sixteen-month replatform. Cut over one workflow at a time. The old system stays live until the new one is honestly better. The first engagement targets the workflow with the worst fit and works outward from there."
            example="Replacing a $4k-a-month subscription with a custom internal tool, then absorbing the next two adjacent workflows in subsequent four-week engagements."
          />
        </div>
      </div>
    </section>
  );
}

// ── Closing — "Don't see your shape?" ───────────────────────
function BuildClosing() {
  return (
    <section id="closing" className="build-closing">
      <div className="shell">
        <div ref={useReveal()} className="reveal build-closing__inner">
          <h2 className="build-closing__title">
            Don't see your <span className="build-cat__italic">shape</span>?
          </h2>
          <p className="build-closing__body">
            If you have an operational problem and you're not sure what shape
            the answer takes, that's exactly the conversation worth having.
          </p>
          <a href="Contact.html"
             className="btn btn-primary"
             style={{ fontSize: 15, padding: '18px 28px' }}>
            Start a conversation <Icon name="arrow-right" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  BuildHero, CategoryText, PlaceholderSurface,
  CustomPlatforms, InternalTools, AIVisible,
  AtmosphericBreak, Integrations, LegacyReplacement,
  BuildClosing,
});

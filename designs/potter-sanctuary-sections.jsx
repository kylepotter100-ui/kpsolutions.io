// ============================================================
// kpsolutions.io — /work/potter-sanctuary · body sections
// CaseHero · CaseMeta · CaseChallenge · CaseApproach ·
// CaseGallery · CaseBreak · CaseOutcome · CaseStack · CaseClosing
//
// Reuses Icon, useReveal, PlaceholderLabel, Header, Footer
// from core.jsx + sections.jsx.
// ============================================================

// ── Hero — full-bleed image with text overlay bottom-left ──
// Motion intent (chat-only): staggered word reveal on page
// load; subtle parallax on the background as the user scrolls.
function CaseHero() {
  return (
    <section className="case-hero" id="top">
      <div className="case-hero__surface" aria-hidden="true">
        <svg className="case-hero__grain" preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">
          <filter id="case-hero-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="61" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.95
                                   0 0 0 0 0.85
                                   0 0 0 0 0.75
                                   0 0 0 0.45 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#case-hero-grain)"/>
        </svg>
        <div className="case-hero__scrim"></div>
      </div>

      <div className="case-hero__content">
        <div className="case-hero__inner">
          <h1 className="case-hero__title">
            Potter{' '}
            <span className="case-hero__italic">Sanctuary</span>.
          </h1>
          <p className="case-hero__sub">
            Brand, editorial site, integrated bookings, accounts, admin.
            Built in four weeks. Live.
          </p>
        </div>
      </div>

      <PlaceholderLabel tone="light" position="top-right">
        Potter Sanctuary atmospheric — physical sanctuary in Yorkshire dales,
        golden hour, or evocative pottery still · parallax on scroll
      </PlaceholderLabel>
    </section>
  );
}

// ── Project meta strip — 4 columns under the hero ──────────
function CaseMeta() {
  const cols = [
    { label: 'Client',   value: 'Potter Sanctuary', kind: 'value' },
    { label: 'Scope',    value: 'Brand · editorial site · booking · accounts · admin · AEO layer', kind: 'value' },
    { label: 'Timeline', value: '4 weeks · shipped Feb 2026', kind: 'value' },
    { label: 'Live',     value: 'pottersanctuary.co.uk', kind: 'link' },
  ];
  return (
    <section aria-label="Project meta" className="case-meta">
      <div className="shell-wide case-meta__grid">
        {cols.map((c) => (
          <div key={c.label} className={`case-meta__col case-meta__col--${c.kind}`}>
            <div className="case-meta__label">{c.label}</div>
            {c.kind === 'link' ? (
              <a href="https://pottersanctuary.co.uk"
                 target="_blank" rel="noopener noreferrer"
                 className="case-meta__link">
                {c.value} <Icon name="link-external" size={14} />
              </a>
            ) : (
              <div className="case-meta__value">{c.value}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── The challenge — narrow centred prose ───────────────────
function CaseChallenge() {
  const ref = useReveal();
  return (
    <section className="case-challenge">
      <div className="shell-tight">
        <div ref={ref} className="reveal case-challenge__inner">
          <h2 className="case-section-title">The challenge.</h2>
          <p className="case-prose">
            An established UK pottery retreat in the Yorkshire dales had
            been running for eleven years on word of mouth, paper diaries,
            and a Squarespace page that hadn't been touched since 2019.
            Residency enquiries were arriving through email and Instagram
            DMs. The diary lived on the studio kitchen wall.
          </p>
          <p className="case-prose">
            In late 2025 something shifted. The operators noticed enquiries
            trailing off. Ceramicists searching for a retreat were finding
            it not through Google but through ChatGPT and Claude — neither
            of which could see the existing site at all. The studio had
            become invisible to the engines that were increasingly
            answering the question <em>where should I go to throw pots for
            a fortnight?</em>
          </p>
          <p className="case-prose">
            The brief was clean: build the brand, build the site, build the
            booking and admin underneath, engineer the whole thing to be
            cited by AI search — and ship it before the spring residency
            season opened in March.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── The approach — asymmetric 50/50, sticky image ──────────
// Motion intent: image column has `position: sticky` so it
// stays visible while the text column scrolls past.
function CaseApproach() {
  return (
    <section className="case-approach">
      <div className="shell-wide case-approach__grid">
        <div ref={useReveal()} className="reveal case-approach__text">
          <h2 className="case-section-title">
            Build the system the studio{' '}
            <span className="case-italic">actually runs on</span>.
          </h2>
          <p className="case-prose">
            The work started with the data model, not the design.
            Residencies, makers, deposits, refund windows, kiln schedules.
            Once that was on paper, the rest of the architecture fell out:
            a single source of truth in Cloudflare D1, a thin operator UI
            for the studio, a customer-facing site that talked to the same
            booking core.
          </p>
          <p className="case-prose">
            The brand was built alongside the architecture, not after it.
            Editorial type pairing, a single oxblood-and-bone palette,
            photography that prioritised the work over the place. The site
            reads like a journal because the studio is a place where
            attention is the actual product.
          </p>
          <p className="case-prose">
            The AEO layer went in from day one. A structured data graph
            naming the studio, the residencies, the dates and prices. An
            llms.txt directive layer. Direct-answer content blocks
            engineered to be cited verbatim by ChatGPT and Claude.
            Schema.org <code>Person</code>, <code>Place</code>,{' '}
            <code>Event</code>, and <code>Reservation</code> graphs threaded
            through every page that mattered.
          </p>
          <p className="case-prose">
            The admin tooling did the unglamorous job. Bulk waitlist
            messaging when a residency oversubscribed. A keyboard-driven
            dispatcher for the studio operator to confirm, reschedule, or
            refund. Six weeks of accounting reconciliation that used to
            be three Sunday nights, condensed into a single Tuesday
            morning.
          </p>
        </div>

        <div className="case-approach__image">
          <div className="case-approach__sticky">
            <div className="placeholder-surface placeholder-surface--architecture">
              <svg className="placeholder-surface__grain" preserveAspectRatio="none"
                   xmlns="http://www.w3.org/2000/svg">
                <filter id="case-arch-grain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="73" stitchTiles="stitch"/>
                  <feColorMatrix values="0 0 0 0 0.95
                                         0 0 0 0 0.85
                                         0 0 0 0 0.75
                                         0 0 0 0.4 0"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#case-arch-grain)"/>
              </svg>
              <div className="placeholder-surface__scrim"></div>
              <PlaceholderLabel tone="light" position="bottom-left">
                System architecture — abstract structural composition,
                oxblood and bone, no software UI · pinned while text scrolls
              </PlaceholderLabel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── The build — visual gallery, full-bleed sequence ─────────
function CaseGallery() {
  const items = [
    {
      id: 'home',
      surface: 'screen-home',
      label: 'Homepage screenshot — Potter Sanctuary live site',
      url: 'pottersanctuary.co.uk',
      caption: 'The site reads like a journal. Residency listings sit alongside short essays from the studios.',
    },
    {
      id: 'booking',
      surface: 'screen-booking',
      label: 'Booking flow screenshot — multi-step calendar and payment',
      url: 'pottersanctuary.co.uk/book',
      caption: 'Five steps, no friction. Deposits taken via Stripe, balance settled four weeks before arrival.',
    },
    {
      id: 'admin',
      surface: 'screen-admin',
      label: 'Admin dashboard screenshot — operator view',
      url: 'pottersanctuary.co.uk/admin',
      caption: 'What the studio sees on a Tuesday morning. Keyboard-first.',
    },
    {
      id: 'brand',
      surface: 'screen-brand',
      label: 'Brand application — wordmark on kiln-fired tile, set above the studio door',
      url: null,
      caption: 'The wordmark fired into a tile, set above the studio door. The studio is the product; the brand earns its place quietly.',
    },
  ];

  return (
    <section aria-label="The build — visual gallery" className="case-gallery">
      <div className="shell-wide">
        <h2 ref={useReveal()} className="reveal case-section-title case-gallery__head">
          The build.
        </h2>
      </div>

      {items.map((it) => (
        <CaseGalleryItem key={it.id} item={it} />
      ))}
    </section>
  );
}

// Motion intent (chat-only): each gallery item fades + translates
// up on scroll-into-view, with subtle scale (1.02 → 1.0).
function CaseGalleryItem({ item }) {
  const ref = useReveal(0.15);
  return (
    <div className="case-gallery__item">
      <div ref={ref} className="reveal case-gallery__image-wrap">
        <div className={`placeholder-surface placeholder-surface--${item.surface}`}>
          <svg className="placeholder-surface__grain" preserveAspectRatio="none"
               xmlns="http://www.w3.org/2000/svg">
            <filter id={`gallery-grain-${item.id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"
                            seed={item.id.length * 7} stitchTiles="stitch"/>
              <feColorMatrix values="0 0 0 0 0.95
                                     0 0 0 0 0.85
                                     0 0 0 0 0.75
                                     0 0 0 0.42 0"/>
            </filter>
            <rect width="100%" height="100%" filter={`url(#gallery-grain-${item.id})`}/>
          </svg>
          <div className="placeholder-surface__scrim"></div>
          {item.url && (
            <div className="case-gallery__url">{item.url}</div>
          )}
          <PlaceholderLabel tone="light" position="bottom-left">
            {item.label}
          </PlaceholderLabel>
        </div>
      </div>

      <div className="shell case-gallery__caption-row">
        <p className="case-gallery__caption">{item.caption}</p>
      </div>
    </div>
  );
}

// ── Atmospheric break ───────────────────────────────────────
function CaseBreak() {
  return (
    <section aria-label="Atmospheric break" className="case-break">
      <div className="case-break__surface">
        <svg className="case-break__grain" preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">
          <filter id="case-break-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="89" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.95
                                   0 0 0 0 0.85
                                   0 0 0 0 0.75
                                   0 0 0 0.4 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#case-break-grain)"/>
        </svg>
        <div className="case-break__scrim"></div>
        <PlaceholderLabel tone="light" position="bottom-left">
          Atmospheric — physical Potter Sanctuary detail or process moment
        </PlaceholderLabel>
      </div>
    </section>
  );
}

// ── The outcome — narrow centred text ───────────────────────
function CaseOutcome() {
  const ref = useReveal();
  return (
    <section className="case-outcome">
      <div className="shell-tight">
        <div ref={ref} className="reveal case-outcome__inner">
          <h2 className="case-section-title">The outcome.</h2>
          <p className="case-prose">
            Booking went live in week four. The first spring residency
            sold out before the announcement email finished sending.
          </p>
          <p className="case-prose">
            In the months since launch, ChatGPT, Claude, and Perplexity
            have all begun citing the studio's residency pages directly.
            Where the previous site was invisible to AI search, the new
            one shows up in answers to questions the studio didn't even
            know it had been losing.
          </p>
          <p className="case-prose">
            The studio operator no longer runs the diary off the kitchen
            wall. Tuesday morning takes forty minutes instead of four
            hours. The next twelve residencies are already on the
            calendar.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── The stack — refined disclosure block ────────────────────
function CaseStack() {
  const items = [
    'Astro',
    'Cloudflare Workers',
    'Cloudflare D1',
    'Cloudflare R2',
    'Stripe',
    'Schema.org JSON-LD',
    'llms.txt',
  ];
  return (
    <section className="case-stack">
      <div className="shell-tight">
        <div ref={useReveal()} className="reveal case-stack__inner">
          <h3 className="case-stack__label">The stack.</h3>
          <ul className="case-stack__list">
            {items.map((tech) => (
              <li key={tech} className="case-stack__item">{tech}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Closing — single CTA ────────────────────────────────────
function CaseClosing() {
  return (
    <section className="case-closing">
      <div className="shell">
        <div ref={useReveal()} className="reveal case-closing__inner">
          <h2 className="case-closing__title">
            Four weeks. Brief to live.{' '}
            <span className="case-italic">Yours next.</span>
          </h2>
          <a href="Contact.html"
             className="btn btn-primary"
             style={{ fontSize: 15, padding: '18px 28px', marginTop: 48 }}>
            Start a conversation <Icon name="arrow-right" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  CaseHero, CaseMeta, CaseChallenge, CaseApproach,
  CaseGallery, CaseGalleryItem,
  CaseBreak, CaseOutcome, CaseStack, CaseClosing,
});

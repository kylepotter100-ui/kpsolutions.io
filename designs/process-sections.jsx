// ============================================================
// kpsolutions.io — /process · body sections
// ProcessHero · ProcessWeek (alt L/R, sticky image) ·
// ProcessIncluded · ProcessCost · ProcessWhy ·
// ProcessBreak · ProcessClosing
//
// Reuses Icon, useReveal, PlaceholderLabel, Header, Footer.
// ============================================================

// ── Hero — compressed (~70vh), image-led split 50/50 ────────
// Motion intent (chat-only): staggered text reveal left;
// image fades in slightly delayed.
function ProcessHero() {
  return (
    <section className="process-hero" id="top">
      <div className="shell-wide process-hero__grid">
        <div className="process-hero__text">
          <h1 className="process-hero__title">
            The Four Week{' '}
            <span className="process-hero__italic">Build</span>.
          </h1>
          <p className="process-hero__sub">
            Brief on Monday. Live four Fridays later. Fixed fee. Code
            owned by you.
          </p>
        </div>

        <div className="process-hero__image">
          <div className="placeholder-surface placeholder-surface--process-hero">
            <svg className="placeholder-surface__grain" preserveAspectRatio="none"
                 xmlns="http://www.w3.org/2000/svg">
              <filter id="process-hero-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="103" stitchTiles="stitch"/>
                <feColorMatrix values="0 0 0 0 0.95
                                       0 0 0 0 0.85
                                       0 0 0 0 0.75
                                       0 0 0 0.42 0"/>
              </filter>
              <rect width="100%" height="100%" filter="url(#process-hero-grain)"/>
            </svg>
            <div className="placeholder-surface__scrim"></div>
            <PlaceholderLabel tone="light" position="bottom-left">
              Process — architectural structure mid-build, scaffolding or
              structural beams, warm light
            </PlaceholderLabel>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── ProcessWeek — single week, alternating image side ───────
// Motion intent (chat-only): the image column has
// `position: sticky` and stays fixed while the text column
// scrolls past for the first ~60% of the section. At ≤960px
// the sticky behaviour collapses (intentional mobile override).
function ProcessWeek({ marker, name, description, outcomes, surface, label, imageLeft, italicWord }) {
  const titleParts = italicWord ? name.split(italicWord) : null;

  return (
    <section className={`process-week ${imageLeft ? 'process-week--image-left' : 'process-week--image-right'}`}>
      <div className="shell-wide process-week__grid">
        {imageLeft && (
          <ProcessWeekImage surface={surface} label={label} variant={marker} />
        )}

        <div ref={useReveal()} className="reveal process-week__text">
          <div className="process-week__marker">Week {marker}</div>
          <h2 className="process-week__name">
            {titleParts ? (
              <>
                {titleParts[0]}
                <span className="process-week__italic">{italicWord}</span>
                {titleParts[1]}
              </>
            ) : name}
            .
          </h2>
          <p className="process-week__body">{description}</p>
          <ul className="process-week__outcomes">
            {outcomes.map((o) => (
              <li key={o} className="process-week__outcome">
                <span className="process-week__outcome-mark">—</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        {!imageLeft && (
          <ProcessWeekImage surface={surface} label={label} variant={marker} />
        )}
      </div>
    </section>
  );
}

function ProcessWeekImage({ surface, label, variant }) {
  return (
    <div className="process-week__image">
      <div className="process-week__sticky">
        <div className={`placeholder-surface placeholder-surface--${surface}`}>
          <svg className="placeholder-surface__grain" preserveAspectRatio="none"
               xmlns="http://www.w3.org/2000/svg">
            <filter id={`pw-grain-${variant}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2"
                            seed={variant.length * 13} stitchTiles="stitch"/>
              <feColorMatrix values="0 0 0 0 0.95
                                     0 0 0 0 0.85
                                     0 0 0 0 0.75
                                     0 0 0 0.4 0"/>
            </filter>
            <rect width="100%" height="100%" filter={`url(#pw-grain-${variant})`}/>
          </svg>
          <div className="placeholder-surface__scrim"></div>
          <PlaceholderLabel tone="light" position="bottom-left">
            {label} · pinned while text scrolls
          </PlaceholderLabel>
        </div>
      </div>
    </div>
  );
}

// Composer for the four weeks
function ProcessWeeks() {
  const weeks = [
    {
      marker: '01',
      name: 'Discovery & Architecture',
      italicWord: 'Architecture',
      description: 'A ninety-minute discovery call with no slides and no discovery deck. The brief is written in your words, signed off, and the data model is drafted on paper before the contract is final. A fixed-fee proposal lands inside forty-eight hours.',
      outcomes: ['Signed brief', 'Data model on paper', 'Fixed fee agreed'],
      surface: 'week-01',
      label: 'Week 1 — foundation, raw site, surveying',
      imageLeft: true,
    },
    {
      marker: '02',
      name: 'Design',
      italicWord: 'Design',
      description: 'Real screens, not wireframes. Brand, identity, and the editorial register land in week two, alongside the schema, authentication, and the risky integrations. A live staging URL goes up on day three so you watch the build as it happens.',
      outcomes: ['Real screens', 'Walking skeleton', 'Staging URL live'],
      surface: 'week-02',
      label: 'Week 2 — frame, structural lines, geometry being defined',
      imageLeft: false,
    },
    {
      marker: '03',
      name: 'Build',
      italicWord: 'Build',
      description: 'The operator UI gets its keyboard shortcuts, bulk actions, and the screens the vendor refused to give you. Error paths, edge cases, and the boring ones are handled, not skipped. The AEO layer goes in: schema graph, llms.txt, direct-answer markup.',
      outcomes: ['Operator UI complete', 'AEO layer wired', 'Feature-complete build'],
      surface: 'week-03',
      label: 'Week 3 — finish, surfaces being applied, detail work',
      imageLeft: true,
    },
    {
      marker: '04',
      name: 'Launch & Handover',
      italicWord: 'Handover',
      description: 'Production cutover with you on the call. The source repo transfers to your organisation if it isn\u2019t already there. A runbook lands in your inbox alongside a Loom walkthrough, and the ninety-day post-launch guarantee starts the moment the site is live.',
      outcomes: ['Production cutover', 'Source transferred', '90-day guarantee active'],
      surface: 'week-04',
      label: 'Week 4 — completed structure, handover, doors open',
      imageLeft: false,
    },
  ];

  return (
    <>
      {weeks.map((w) => (
        <ProcessWeek key={w.marker} {...w} />
      ))}
    </>
  );
}

// ── What's included — clean grid, no images, tight padding ──
function ProcessIncluded() {
  const groups = [
    {
      label: 'Strategy',
      items: ['Written brief', 'Data model on paper', 'Architecture & schema', 'Fixed-fee proposal'],
    },
    {
      label: 'Build',
      items: ['Brand identity', 'Editorial design', 'Full-stack development', 'Operator UI', 'AEO content layer', 'Schema.org markup', 'llms.txt directive'],
    },
    {
      label: 'Launch',
      items: ['Production deployment', 'Source repo transfer', 'Runbook documentation', 'Loom walkthrough', '90-day post-launch guarantee'],
    },
  ];

  return (
    <section className="process-included">
      <div className="shell">
        <h2 ref={useReveal()} className="reveal process-section-title">
          What's included.
        </h2>
        <div ref={useReveal()} className="reveal process-included__grid">
          {groups.map((g) => (
            <div key={g.label} className="process-included__col">
              <div className="process-included__label">{g.label}</div>
              <ul className="process-included__list">
                {g.items.map((it) => (
                  <li key={it} className="process-included__item">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What it costs — single restrained moment ────────────────
function ProcessCost() {
  return (
    <section className="process-cost">
      <div className="shell-tight">
        <div ref={useReveal()} className="reveal process-cost__inner">
          <div className="process-cost__label">What it costs.</div>
          <p className="process-cost__statement">
            Costs are scoped in week one and agreed{' '}
            <span className="process-italic">before</span> week two begins.
          </p>
          <p className="process-cost__note">
            Every engagement is fixed-fee. No retainers, no monthly invoices,
            no scope-creep clauses to renegotiate at week three.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Why it works — narrow centred prose ─────────────────────
function ProcessWhy() {
  return (
    <section className="process-why">
      <div className="shell-tight">
        <div ref={useReveal()} className="reveal process-why__inner">
          <h2 className="process-section-title">
            Why it{' '}
            <span className="process-italic">works</span>.
          </h2>
          <p className="process-prose">
            Four weeks is the constraint that makes the rest of it possible.
            It rules out the long discovery phase that produces nothing. It
            rules out the multi-stage replatform that ships eighteen months
            late. It rules out the agency dance — three account managers,
            two project managers, four developers nobody talked to.
          </p>
          <p className="process-prose">
            What's left is the build. Operator on operator. One person
            doing the work, one person ringing them on Tuesday morning.
            Decisions made in the call, not in a status report.
          </p>
          <p className="process-prose">
            The constraint is also a forcing function. When the cycle is
            four weeks, scope is set in week one and respected throughout.
            When the cycle is open-ended, scope drifts and the project is
            what pays for it.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Atmospheric break ───────────────────────────────────────
function ProcessBreak() {
  return (
    <section aria-label="Atmospheric break" className="process-break">
      <div className="process-break__surface">
        <svg className="process-break__grain" preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">
          <filter id="process-break-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="151" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.95
                                   0 0 0 0 0.85
                                   0 0 0 0 0.75
                                   0 0 0 0.4 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#process-break-grain)"/>
        </svg>
        <div className="process-break__scrim"></div>
        <PlaceholderLabel tone="light" position="bottom-left">
          Atmospheric — completed work in operational use, golden hour
        </PlaceholderLabel>
      </div>
    </section>
  );
}

// ── Closing CTA ─────────────────────────────────────────────
function ProcessClosing() {
  return (
    <section className="process-closing">
      <div className="shell">
        <div ref={useReveal()} className="reveal process-closing__inner">
          <h2 className="process-closing__title">
            Start a{' '}
            <span className="process-italic">build</span>.
          </h2>
          <p className="process-closing__body">
            A 90-minute conversation. No slides, no discovery deck. A
            written proposal within 48 hours.
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
  ProcessHero, ProcessWeek, ProcessWeekImage, ProcessWeeks,
  ProcessIncluded, ProcessCost, ProcessWhy,
  ProcessBreak, ProcessClosing,
});

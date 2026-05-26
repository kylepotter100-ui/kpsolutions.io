// ============================================================
// kpsolutions.io — /about · body sections
// AboutHero · AboutFounder · AboutWhy · AboutBreak ·
// AboutPrinciples · AboutNotDo · AboutClosing
//
// Reuses Icon, useReveal, PlaceholderLabel, Header, Footer.
// ============================================================

// ── Hero — compressed (~50vh), type-only ────────────────────
function AboutHero() {
  return (
    <section className="about-hero" id="top">
      <div className="shell about-hero__inner">
        <h1 className="about-hero__title">
          Built by someone who's seen{' '}
          <span className="about-italic">what gets in the way</span>.
        </h1>
        <p className="about-hero__sub">
          One person, end-to-end. No agency overhead. No handoff theatre.
        </p>
      </div>
    </section>
  );
}

// ── Founder block — asymmetric 40/60 split, sticky image ────
// Motion intent (chat-only): image column has
// `position: sticky` and stays fixed while the text scrolls
// past for the first portion of the section.
function AboutFounder() {
  return (
    <section className="about-founder">
      <div className="shell-wide about-founder__grid">
        <div className="about-founder__image">
          <div className="about-founder__sticky">
            <div className="placeholder-surface placeholder-surface--portrait">
              <svg className="placeholder-surface__grain" preserveAspectRatio="none"
                   xmlns="http://www.w3.org/2000/svg">
                <filter id="about-portrait-grain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="173" stitchTiles="stitch"/>
                  <feColorMatrix values="0 0 0 0 0.95
                                         0 0 0 0 0.85
                                         0 0 0 0 0.75
                                         0 0 0 0.42 0"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#about-portrait-grain)"/>
              </svg>
              <div className="placeholder-surface__scrim"></div>
              <PlaceholderLabel tone="light" position="bottom-left">
                Founder portrait — Kyle in real working context, warm light,
                environmental not posed corporate, no plain studio background ·
                pinned while text scrolls
              </PlaceholderLabel>
            </div>
          </div>
        </div>

        <div ref={useReveal()} className="reveal about-founder__text">
          <div className="about-founder__name">Kyle Potter</div>
          <p className="about-founder__role">
            Founder, KP Solutions. Fifteen years building software inside
            the businesses that ran it — first as a developer, later as a
            CTO, and most recently as the founder who got tired of buying
            tools that almost worked.
          </p>
          <p className="about-founder__body">
            I started KP Solutions because the kind of work I cared about —
            software built around how a business actually works, shipped in
            weeks rather than quarters, owned by the people paying for it —
            was something the industry had quietly stopped offering. Most
            of what I do now is what I wish I could have hired someone to
            do, back when I was on the other side of the table.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Why this exists — narrow centred first-person prose ─────
function AboutWhy() {
  return (
    <section className="about-why">
      <div className="shell-tight">
        <div ref={useReveal()} className="reveal about-why__inner">
          <h2 className="about-section-title">
            Why this{' '}
            <span className="about-italic">exists</span>.
          </h2>
          <p className="about-prose">
            I spent the first decade of my career writing software for
            businesses that already had it. Some of them paid hundreds of
            thousands a year for a SaaS stack that nearly fit. A few paid
            me to build the bridges between systems that should have just
            talked to each other. None of them — not one — was paying for
            the thing they actually needed.
          </p>
          <p className="about-prose">
            That's the pattern that drove me out of consulting. A business
            with twenty staff and a real product, paying eight times what
            its software was worth, plus a person whose whole job was
            working around the parts that didn't fit. I'd watch them lose
            Tuesday mornings to reconciliation, Friday afternoons to
            manual exports, a whole quarter to a roadmap promise that
            never landed.
          </p>
          <p className="about-prose">
            The shape of the answer was always the same. Software built
            for the actual business, not the imaginary one a vendor sold
            to a hundred imaginary versions of it. Software you could
            change because you owned the code. Software that didn't bill
            monthly for the rest of your life.
          </p>
          <p className="about-prose">
            I started KP Solutions to build exactly that. One person, four
            weeks, fixed fee. The code commits to your repository from day
            one. There is no service desk to call, no account manager to
            chase, no roadmap to wait on. There's a build, and then
            there's the thing you own at the end of it.
          </p>
          <p className="about-prose about-prose--emphasis">
            Most businesses don't need bigger software.{' '}
            <span className="about-italic">They need software built for
            how they actually work.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Atmospheric break ───────────────────────────────────────
function AboutBreak() {
  return (
    <section aria-label="Atmospheric break" className="about-break">
      <div className="about-break__surface">
        <svg className="about-break__grain" preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">
          <filter id="about-break-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="197" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.95
                                   0 0 0 0 0.85
                                   0 0 0 0 0.75
                                   0 0 0 0.4 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#about-break-grain)"/>
        </svg>
        <div className="about-break__scrim"></div>
        <PlaceholderLabel tone="light" position="bottom-left">
          Atmospheric — workshop or operational space, warm tonal, no faces
        </PlaceholderLabel>
      </div>
    </section>
  );
}

// ── How I work — clean grid of principles ───────────────────
// 5 principles, 2-col grid, principle 5 spans full width for
// closer weight. No imagery — pure typographic moment.
function AboutPrinciples() {
  const principles = [
    'Operator-to-operator, never agency-to-procurement.',
    'Fixed fees. Real timelines. Code you own.',
    'One person, end to end. No handoff theatre.',
    'AI used quietly where it earns its keep, never as a sticker.',
    "I'll tell you when off-the-shelf is the right answer, even if it costs me the build.",
  ];

  return (
    <section className="about-principles">
      <div className="shell">
        <h2 ref={useReveal()} className="reveal about-section-title">
          How I{' '}
          <span className="about-italic">work</span>.
        </h2>
        <div ref={useReveal()} className="reveal about-principles__grid">
          {principles.map((p, i) => (
            <div key={i}
                 className={`about-principle${i === 4 ? ' about-principle--span' : ''}`}>
              <span className="about-principle__mark"></span>
              <p className="about-principle__text">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What I don't do — compressed anti-positioning ──────────
function AboutNotDo() {
  return (
    <section className="about-notdo">
      <div className="shell-tight">
        <div ref={useReveal()} className="reveal about-notdo__inner">
          <h3 className="about-notdo__label">What I don't do.</h3>
          <p className="about-notdo__text">
            I don't pitch to procurement teams. I don't build chat-bubble
            AI features that nobody asked for. I don't take on
            eighteen-month replatforms.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Closing CTA ─────────────────────────────────────────────
function AboutClosing() {
  return (
    <section className="about-closing">
      <div className="shell">
        <div ref={useReveal()} className="reveal about-closing__inner">
          <h2 className="about-closing__title">
            Start a{' '}
            <span className="about-italic">conversation</span>.
          </h2>
          <p className="about-closing__body">
            A 90-minute call. No slides, no discovery deck. A written
            proposal within 48 hours.
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
  AboutHero, AboutFounder, AboutWhy, AboutBreak,
  AboutPrinciples, AboutNotDo, AboutClosing,
});

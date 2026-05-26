// ============================================================
// kpsolutions.io — Homepage · body sections
// DirectAnswer · WhoeverYouAre · AtmosphericInterlude ·
// CapabilityTiles (asymmetric) · SelectedWork (full-width
// screenshot placeholder) · PinnedBuildMoment · ProcessCallout
// · ClosingCTA · Footer
//
// PlaceholderLabel lives in core.jsx now — shared with /Build.
// ============================================================

// ── AEO direct-answer paragraph ──────────────────────────────────
// Single 40–60 word paragraph. Pure typography. Tightened
// vertical rhythm so this section breathes against the
// generous Whoever block below.
function DirectAnswer() {
  const ref = useReveal();
  return (
    <section aria-label="Summary" style={{ background: 'var(--bone-0)' }}>
      <div className="shell" style={{ padding: '88px 32px 56px' }}>
        <p ref={ref} className="reveal" style={{
          fontSize: 'clamp(1.375rem, 0.95rem + 1.1vw, 1.875rem)',
          lineHeight: 1.4,
          color: 'var(--ox-900)',
          margin: 0,
          maxWidth: '38ch',
          letterSpacing: '-0.018em',
          fontWeight: 400,
        }}>
          KP Solutions builds bespoke software for businesses that want their
          tools to fit how they actually work — whether you're just starting
          out, growing fast, or finally moving on from off-the-shelf SaaS.
          Custom platforms, internal tools, integrations, and AI-visible web
          presence. Fixed four-week builds. Code owned by you from day one.
        </p>
      </div>
    </section>
  );
}

// ── "Whoever you are" framing block ─────────────────────────
function WhoeverYouAre() {
  const items = [
    {
      hook: 'Just starting out?',
      body: 'Get the software and the AI-visible web presence that actually puts you in front of customers from day one.',
    },
    {
      hook: 'Growing fast?',
      body: 'Replace the spreadsheets and stitched-together SaaS before they slow you down.',
    },
    {
      hook: 'Already running on systems that don’t fit?',
      body: 'Bespoke is the right answer, and it’s faster than you think.',
    },
  ];

  return (
    <section style={{ padding: '24px 0 120px', background: 'var(--bone-0)' }}>
      <div className="shell">
        <div className="whoever">
          {items.map((it, i) => (
            <WhoeverRow key={i} hook={it.hook} body={it.body} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoeverRow({ hook, body }) {
  const ref = useReveal(0.2);
  return (
    <div ref={ref} className="reveal whoever-row">
      <h3 className="whoever-hook">{hook}</h3>
      <p className="whoever-body">{body}</p>
    </div>
  );
}

// ── Atmospheric interlude #1 — full-bleed image placeholder ─
// Annotation in chat: full-bleed atmospheric still that breaks
// up the run of text-heavy sections. Image spans 100vw with
// off-centre overlay text. Real photography lands later;
// placeholder is a clearly-labelled image region.
function AtmosphericInterludeStudio() {
  return (
    <section aria-label="Studio interior" className="interlude interlude--studio">
      <div className="interlude-surface">
        <svg className="interlude-grain" preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">
          <filter id="ia-studio-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="13" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.95
                                   0 0 0 0 0.85
                                   0 0 0 0 0.75
                                   0 0 0 0.4 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#ia-studio-grain)"/>
        </svg>
        <div className="interlude-scrim"></div>

        {/* Off-centre overlay quote — sits in lower-right column */}
        <div ref={useReveal()} className="reveal interlude-quote">
          <p className="interlude-quote__body">
            Built once, around the way{' '}
            <span style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 300,
            }}>
              you actually work
            </span>{' '}— not the way a vendor sold it to you.
          </p>
        </div>

        <PlaceholderLabel tone="light" position="top-left">
          Atmospheric still&nbsp;&nbsp;·&nbsp;&nbsp;Studio interior, working
          surfaces, warm late-afternoon light
        </PlaceholderLabel>
      </div>
    </section>
  );
}

// ── Capability tiles — asymmetric 60 / 40 ───────────────────
// Left: a large feature image placeholder that anchors the
// section. Right: three stacked capability rows that route
// to /build anchors. Breaks the centred-shell rhythm and the
// previous 3-up tile grid.
function CapabilityTiles() {
  const tiles = [
    {
      id: 'bespoke',
      label: 'Bespoke software',
      copy: 'Custom platforms, internal tools, and integrations built around how your business actually works.',
      href: '/build#bespoke',
    },
    {
      id: 'aeo',
      label: 'AI-visible web presence',
      copy: 'Websites engineered to be found and cited by ChatGPT, Claude, Perplexity, and Google AI — not just indexed by traditional search.',
      href: '/build#aeo',
    },
    {
      id: 'ai-ops',
      label: 'AI built into your operations',
      copy: 'AI used quietly inside your workflows, where it earns its keep — never as a sticker on a homepage.',
      href: '/build#ai-ops',
    },
  ];

  return (
    <section id="capabilities" style={{
      background: 'var(--bone-50)',
      padding: '160px 0',
    }}>
      <div className="shell">
        <div ref={useReveal()} className="reveal" style={{ marginBottom: 64 }}>
          <h2 style={{
            fontSize: 'clamp(2.25rem, 1.4rem + 2.6vw, 3.25rem)',
            fontWeight: 500,
            letterSpacing: '-0.028em',
            lineHeight: 1.02,
            margin: 0,
            color: 'var(--ox-900)',
            maxWidth: '18ch',
          }}>
            What we build.
          </h2>
        </div>

        <div ref={useReveal()} className="reveal capability-split">
          {/* Left — large feature image placeholder */}
          <div className="capability-feature">
            <div className="capability-feature-surface" aria-hidden="true">
              <svg className="capability-feature-grain" preserveAspectRatio="none"
                   xmlns="http://www.w3.org/2000/svg">
                <filter id="cap-feat-grain">
                  <feTurbulence type="fractalNoise" baseFrequency="1.0" numOctaves="2" seed="21" stitchTiles="stitch"/>
                  <feColorMatrix values="0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0.5 0"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#cap-feat-grain)"/>
              </svg>
              <PlaceholderLabel tone="light" position="bottom-left">
                Capabilities feature image&nbsp;&nbsp;·&nbsp;&nbsp;Operator
                at-screen, calm focus, mid-build
              </PlaceholderLabel>
            </div>
          </div>

          {/* Right — three stacked capability rows */}
          <div className="capability-stack">
            {tiles.map((t, i) => (
              <a key={t.id} href={t.href}
                 onClick={(e) => e.preventDefault()}
                 className="capability-row"
                 style={{ borderTop: i === 0 ? '1px solid var(--bone-200)' : 'none' }}>
                <div className="capability-row__head">
                  <span className="capability-row__label">{t.label}</span>
                  <Icon name="arrow-right" size={16} />
                </div>
                <p className="capability-row__copy">{t.copy}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Selected work — Potter Sanctuary, full-width screenshot
//    placeholder (hand-drawn vessel + fake booking widget
//    removed; this is a clearly-marked image region for the
//    live homepage capture). ───────────────────────────────
function SelectedWork() {
  return (
    <section id="work" style={{ padding: '160px 0 140px', background: 'var(--bone-0)' }}>
      <div className="shell-wide">
        <div ref={useReveal()} className="reveal" style={{
          padding: '0 32px',
          marginBottom: 56,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 32,
        }}>
          <h2 style={{
            fontSize: 'clamp(2.25rem, 1.4rem + 2.6vw, 3.25rem)',
            fontWeight: 500,
            letterSpacing: '-0.028em',
            lineHeight: 1.02,
            margin: 0,
            color: 'var(--ox-900)',
            maxWidth: '20ch',
          }}>
            Selected work.
          </h2>
          <a href="/work" onClick={(e) => e.preventDefault()} className="link-arrow">
            All work <Icon name="arrow-right" size={14} />
          </a>
        </div>

        {/* Full-width screenshot placeholder region */}
        <div ref={useReveal()} className="reveal" style={{ padding: '0 32px' }}>
          <div className="screenshot-placeholder" aria-label="Potter Sanctuary homepage">
            <div className="screenshot-placeholder__surface">
              <svg className="screenshot-placeholder__grain" preserveAspectRatio="none"
                   xmlns="http://www.w3.org/2000/svg">
                <filter id="ss-grain-ps">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="33" stitchTiles="stitch"/>
                  <feColorMatrix values="0 0 0 0 0.16  0 0 0 0 0.07  0 0 0 0 0.05  0 0 0 0.45 0"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#ss-grain-ps)"/>
              </svg>
            </div>
            <PlaceholderLabel tone="light" position="bottom-left">
              Potter Sanctuary live homepage screenshot&nbsp;&nbsp;·&nbsp;&nbsp;
              To be wired by Code from the live URL
            </PlaceholderLabel>
            <div className="screenshot-placeholder__url">pottersanctuary.co.uk</div>
          </div>
        </div>

        <div ref={useReveal()} className="reveal" style={{
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'start',
          marginTop: 48,
          maxWidth: 1100,
        }}>
          <div>
            <a href="PotterSanctuary.html"
               className="work-title-link">
              Potter Sanctuary <Icon name="arrow-right" size={16} />
            </a>
          </div>
          <p style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--bone-500)',
            margin: 0,
            maxWidth: '44ch',
          }}>
            A UK business needing brand, editorial site, integrated bookings,
            customer accounts, and admin tooling. Built and shipped in four
            weeks.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── PinnedBuildMoment — pinned-scroll demonstration ─────────
// Annotation in chat: the left image is `position: sticky`,
// so it stays visible while the right column scrolls past
// it with three text moments. Image region is a clearly
// labelled placeholder for an atmospheric build still.
function PinnedBuildMoment() {
  const moments = [
    {
      heading: 'Brief on Monday.',
      body: 'A 90-minute call. No slides, no discovery deck. By the end, the brief is written in your words and signed off.',
    },
    {
      heading: 'Build through the week.',
      body: 'Real screens, not wireframes. Schema, auth, and the risky integrations land first. Staging URL on day three.',
    },
    {
      heading: 'Live on Friday week four.',
      body: 'Production cutover with you on call. Source repo transferred to your organisation. A runbook and a walkthrough.',
    },
  ];

  return (
    <section aria-label="How a build feels" className="pinned-section">
      <div className="shell-wide pinned-grid">
        {/* Left — sticky image region */}
        <div className="pinned-image">
          <div className="pinned-image__sticky">
            <div className="pinned-image__surface" aria-hidden="true">
              <svg className="pinned-image__grain" preserveAspectRatio="none"
                   xmlns="http://www.w3.org/2000/svg">
                <filter id="pin-grain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="41" stitchTiles="stitch"/>
                  <feColorMatrix values="0 0 0 0 0.95
                                         0 0 0 0 0.85
                                         0 0 0 0 0.75
                                         0 0 0 0.42 0"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#pin-grain)"/>
              </svg>
              <div className="pinned-image__scrim"></div>
            </div>
            <PlaceholderLabel tone="light" position="bottom-left">
              Build moment still&nbsp;&nbsp;·&nbsp;&nbsp;Terminal + notebook
              + cold coffee, warm window light&nbsp;&nbsp;·&nbsp;&nbsp;
              Pinned while text scrolls
            </PlaceholderLabel>
          </div>
        </div>

        {/* Right — scrolling text moments */}
        <div className="pinned-text">
          {moments.map((m, i) => (
            <PinnedMoment key={i} index={i} heading={m.heading} body={m.body} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PinnedMoment({ index, heading, body }) {
  const ref = useReveal(0.3);
  return (
    <div ref={ref} className="reveal pinned-moment">
      <h3 className="pinned-moment__heading">{heading}</h3>
      <p className="pinned-moment__body">{body}</p>
    </div>
  );
}

// ── Process callout — one confident sentence ────────────────
// Tightened vertical rhythm — sits as a quiet hairline-bound
// band between the pinned moment and the closing CTA.
function ProcessCallout() {
  return (
    <section style={{
      padding: '72px 0',
      background: 'var(--bone-50)',
      borderTop: '1px solid var(--bone-200)',
      borderBottom: '1px solid var(--bone-200)',
    }}>
      <div className="shell">
        <div ref={useReveal()} className="reveal" style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 48,
          flexWrap: 'wrap',
        }}>
          <p style={{
            fontSize: 'clamp(1.375rem, 1rem + 1.1vw, 1.875rem)',
            fontWeight: 500,
            letterSpacing: '-0.022em',
            lineHeight: 1.2,
            color: 'var(--ox-900)',
            margin: 0,
            maxWidth: '24ch',
          }}>
            Brief on Monday, live in four weeks.{' '}
            <span style={{ color: 'var(--bone-500)', fontWeight: 400 }}>
              Fixed fee. Your code.
            </span>
          </p>
          <a href="/process"
             onClick={(e) => e.preventDefault()}
             className="link-arrow">
            How the four weeks work <Icon name="arrow-right" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Closing CTA — calm, single button ───────────────────────
function ClosingCTA() {
  return (
    <section id="contact" style={{
      padding: '180px 0 160px',
      background: 'var(--bone-0)',
    }}>
      <div className="shell">
        <div ref={useReveal()} className="reveal" style={{ maxWidth: 880 }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 1.5rem + 3.4vw, 4.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.035em',
            lineHeight: 0.98,
            margin: 0,
            color: 'var(--ox-900)',
            maxWidth: '16ch',
          }}>
            Tell me what you{' '}
            <span style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 300,
            }}>need built</span>.
          </h2>

          <p style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: 'var(--bone-500)',
            margin: '32px 0 56px',
            maxWidth: '42ch',
          }}>
            A 90-minute conversation. No slides, no discovery deck. A written
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

// ── Footer — larger presence than nav ───────────────────────
function Footer() {
  const navLinks = [
    { label: 'Work',    href: '#' },
    { label: 'Build',   href: 'Build.html' },
    { label: 'Process', href: 'Process.html' },
    { label: 'About',   href: 'About.html' },
    { label: 'Contact', href: 'Contact.html' },
  ];

  return (
    <footer style={{ background: 'var(--ox-900)', color: 'var(--bone-0)' }}>
      <div className="shell" style={{ padding: '120px 32px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 64,
          alignItems: 'end',
          paddingBottom: 80,
          borderBottom: '1px solid oklch(98.5% 0.008 60 / 0.18)',
        }}>
          <div>
            <div style={{
              fontSize: 'clamp(3.5rem, 2rem + 5vw, 6.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              color: 'var(--bone-0)',
            }}>
              KP Solutions
            </div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.5rem, 1rem + 1.3vw, 2.25rem)',
              letterSpacing: '-0.022em',
              lineHeight: 1.15,
              color: 'oklch(96% 0.012 60 / 0.78)',
              margin: '24px 0 0',
              maxWidth: '24ch',
            }}>
              Bespoke software for how your business actually works.
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 22,
            paddingBottom: 8,
          }}>
            <a href="mailto:hello@kpsolutions.io"
               style={{
                 fontSize: 17,
                 fontWeight: 500,
                 color: 'var(--bone-0)',
                 textDecoration: 'underline',
                 textDecorationColor: 'oklch(96% 0.012 60 / 0.35)',
                 textUnderlineOffset: '0.3em',
                 textDecorationThickness: '1px',
               }}>
              hello@kpsolutions.io
            </a>
            <a href="Contact.html"
               className="btn btn-inverse"
               style={{ padding: '15px 24px', fontSize: 14 }}>
              Start a conversation <Icon name="arrow-right" size={14} />
            </a>
          </div>
        </div>

        <nav style={{
          padding: '48px 0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px 40px',
          borderBottom: '1px solid oklch(98.5% 0.008 60 / 0.18)',
        }}>
          {navLinks.map((l) => (
            <a key={l.label} href={l.href}
               onClick={(e) => { if (l.href === '#') e.preventDefault(); }}
               style={{
                 fontSize: 15,
                 fontWeight: 500,
                 color: 'var(--bone-0)',
                 textDecoration: 'none',
                 letterSpacing: '-0.005em',
                 transition: 'color 160ms var(--ease-out)',
               }}
               onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ochre-300)'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'var(--bone-0)'}>
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 28,
          gap: 24,
          flexWrap: 'wrap',
          fontSize: 13,
          color: 'oklch(96% 0.012 60 / 0.62)',
          letterSpacing: '-0.003em',
        }}>
          <span>© 2026 KP Solutions</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="/privacy" onClick={(e) => e.preventDefault()}
               style={{ color: 'inherit', textDecoration: 'none' }}>
              Privacy
            </a>
            <a href="/terms" onClick={(e) => e.preventDefault()}
               style={{ color: 'inherit', textDecoration: 'none' }}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  DirectAnswer, WhoeverYouAre, WhoeverRow,
  AtmosphericInterludeStudio,
  CapabilityTiles, SelectedWork,
  PinnedBuildMoment, PinnedMoment,
  ProcessCallout, ClosingCTA, Footer,
});

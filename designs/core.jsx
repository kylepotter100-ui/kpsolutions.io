// ============================================================
// kpsolutions.io — Homepage · core components
// Icon · useReveal · Header · Hero · HeroBackground
// ============================================================

// ── Icon — 24×24 viewBox, 1.25px stroke, square caps ──────────
const ICON_PATHS = {
  'arrow-right':       <><line x1="3" y1="12" x2="20" y2="12"/><polyline points="14,6 20,12 14,18"/></>,
  'arrow-down-right':  <><line x1="6" y1="6" x2="18" y2="18"/><polyline points="18,10 18,18 10,18"/></>,
  'arrow-up-right':    <><line x1="6" y1="18" x2="18" y2="6"/><polyline points="9,6 18,6 18,15"/></>,
  'chevron-right':     <polyline points="9,5 16,12 9,19"/>,
  'plus':              <><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></>,
  'minus':             <line x1="4" y1="12" x2="20" y2="12"/>,
  'check':             <polyline points="4,12 10,18 20,6"/>,
  'circle-dot':        <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/></>,
  'link-external':     <><polyline points="14,5 19,5 19,10"/><line x1="19" y1="5" x2="11" y2="13"/><polyline points="19,14 19,19 5,19 5,5 10,5"/></>,
  'menu':              <><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></>,
  'x':                 <><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></>,
};

function Icon({ name, size = 18, style = {} }) {
  const body = ICON_PATHS[name];
  if (!body) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'inline-block', ...style }}
    >
      {body}
    </svg>
  );
}

// ── useReveal — IO-driven fade-up, once per element ──────────
function useReveal(threshold = 0.1) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      requestAnimationFrame(() => el.classList.add('is-in'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add('is-in');
          obs.unobserve(el);
        }
      });
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

// ── PlaceholderLabel — designer annotation inside an image
//    or video region. Distinct from publication chrome. Bone
//    (light) or ink (dark) small-caps Switzer with dot leader.
function PlaceholderLabel({ children, tone = 'light', position = 'bottom-left' }) {
  return (
    <div className={`placeholder-label placeholder-label--${tone} placeholder-label--${position}`}>
      <span className="placeholder-label__dot"></span>
      <span>{children}</span>
    </div>
  );
}

// ── Header — refined nav, hero-aware ──────────────────────────
// heroMode='dark' (default): bone text on transparent over the
// hero, swaps to ink-on-bone-blur after scrolling past it.
// heroMode='light': stays in ink-on-bone mode from page load —
// for pages without a dark hero (Build, Process, About).
function Header({ heroMode = 'dark' }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [pastHero, setPastHero] = React.useState(heroMode !== 'dark');
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (heroMode !== 'dark') {
      // No dark hero to chase — always in ink mode, just track
      // the hairline / blur threshold for chrome.
      const onScroll = () => setScrolled(window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroMode]);

  const items = [
    { id: 'work',    label: 'Work',    href: '#' },
    { id: 'build',   label: 'Build',   href: 'Build.html' },
    { id: 'process', label: 'Process', href: 'Process.html' },
    { id: 'about',   label: 'About',   href: 'About.html' },
  ];

  const inertClick = (e, href) => {
    if (href === '#' || href === '') e.preventDefault();
  };

  const fg = pastHero ? 'var(--ox-900)' : 'var(--bone-0)';
  const muted = pastHero ? 'var(--bone-500)' : 'oklch(96% 0.012 60 / 0.78)';

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      background: pastHero
        ? 'oklch(98.5% 0.008 60 / 0.86)'
        : 'transparent',
      backdropFilter: scrolled && pastHero ? 'blur(12px) saturate(1.05)' : 'none',
      WebkitBackdropFilter: scrolled && pastHero ? 'blur(12px) saturate(1.05)' : 'none',
      borderBottom: pastHero ? '1px solid var(--bone-200)' : '1px solid transparent',
      transition: 'background 220ms var(--ease-out), border-color 220ms var(--ease-out), color 220ms var(--ease-out)',
      color: fg,
    }}>
      <div className="shell" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
      }}>
        <a href="Homepage.html"
           style={{
             fontSize: 17,
             fontWeight: 600,
             letterSpacing: '-0.025em',
             textDecoration: 'none',
             color: 'inherit',
           }}>
          KP Solutions
        </a>

        {/* Desktop nav */}
        <nav className="nav-desktop" style={{
          display: 'flex',
          gap: 36,
          alignItems: 'center',
        }}>
          {items.map((it) => (
            <a key={it.id} href={it.href}
               onClick={(e) => inertClick(e, it.href)}
               style={{
                 fontSize: 14,
                 fontWeight: 400,
                 textDecoration: 'none',
                 color: muted,
                 letterSpacing: '-0.003em',
                 transition: 'color 160ms var(--ease-out)',
               }}
               onMouseEnter={(e) => e.currentTarget.style.color = fg}
               onMouseLeave={(e) => e.currentTarget.style.color = muted}>
              {it.label}
            </a>
          ))}
          <span style={{
            width: 1, height: 14,
            background: pastHero ? 'var(--bone-200)' : 'oklch(96% 0.012 60 / 0.3)',
            display: 'inline-block',
          }}></span>
          <a href="Contact.html"
             style={{
               fontSize: 14,
               fontWeight: 500,
               textDecoration: 'none',
               color: fg,
               display: 'inline-flex',
               alignItems: 'center',
               gap: 8,
               letterSpacing: '-0.003em',
             }}>
            Start a conversation
            <Icon name="arrow-right" size={13} />
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button className="nav-mobile-btn"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  color: 'inherit',
                  display: 'none',
                  padding: 4,
                }}>
          <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
        </button>
      </div>

      {/* Mobile menu sheet */}
      {menuOpen && (
        <div className="nav-mobile-sheet" style={{
          background: 'var(--bone-0)',
          borderTop: '1px solid var(--bone-200)',
          color: 'var(--ox-900)',
        }}>
          <div className="shell" style={{
            padding: '24px 32px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}>
            {items.map((it) => (
              <a key={it.id} href={it.href}
                 onClick={(e) => { inertClick(e, it.href); setMenuOpen(false); }}
                 style={{
                   fontSize: 22,
                   fontWeight: 500,
                   textDecoration: 'none',
                   color: 'var(--ox-900)',
                   letterSpacing: '-0.018em',
                 }}>
                {it.label}
              </a>
            ))}
            <a href="Contact.html"
               onClick={() => setMenuOpen(false)}
               className="btn btn-primary"
               style={{ marginTop: 12, alignSelf: 'flex-start' }}>
              Start a conversation <Icon name="arrow-right" size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// ── HeroBackground — designed surface that stands in for the
//    looping atmospheric video (hands-at-craft in warm tonal
//    light). Annotated in chat, not on canvas. Provides scrim
//    so type stays legible regardless of frame. ───────────────
function HeroBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      {/* Base warm-dark tonal field — the "video region" */}
      <div className="hero-bg-field"></div>

      {/* Warm highlight pool — implied light source upper-right */}
      <div className="hero-bg-glow"></div>

      {/* Film grain */}
      <svg className="hero-bg-grain" preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg">
        <filter id="hero-grain-f">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0.95
                                 0 0 0 0 0.85
                                 0 0 0 0 0.75
                                 0 0 0 0.45 0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain-f)"/>
      </svg>

      {/* Vignette + bottom scrim for type legibility */}
      <div className="hero-bg-scrim"></div>

      {/* Placeholder annotation — visible inside the image region,
          subtle low-contrast Switzer small-caps. Tells anyone
          reviewing what real imagery will land here. */}
      <div className="placeholder-label placeholder-label--hero">
        <span className="placeholder-label__dot"></span>
        <span>
          Hero video loop&nbsp;&nbsp;·&nbsp;&nbsp;Hands at craft, warm tonal
          light&nbsp;&nbsp;·&nbsp;&nbsp;10–12 s seamless
        </span>
      </div>
    </div>
  );
}

// ── Hero — full viewport, video region behind, single CTA ────
//    Above-the-fold copy is static HTML (no animation-gated
//    reveals). Motion: staggered word reveal on page load,
//    looping atmospheric video, subtle parallax on scroll
//    (annotated in chat, not implemented as on-canvas labels).
function Hero({ onNavigate }) {
  return (
    <section id="top" className="hero">
      <HeroBackground />

      <div className="shell hero-content">
        <h1 className="hero-headline">
          Software that fits{' '}
          <span className="hero-italic">how you work</span>.
        </h1>

        <p className="hero-sub">
          Bespoke platforms, internal tools, and integrations — plus web
          presence engineered to be found by AI. Built in four weeks. Owned
          by you.
        </p>

        <div className="hero-cta-row">
          <a href="/contact"
             onClick={(e) => e.preventDefault()}
             className="btn btn-hero-primary">
            Start a conversation <Icon name="arrow-right" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Icon, useReveal, PlaceholderLabel, Header, Hero, HeroBackground });

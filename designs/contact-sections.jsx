// ============================================================
// kpsolutions.io — /contact · body sections
// ContactHero · ContactMain (form + alt paths) ·
// ContactBreak · ContactNext · ContactNote
//
// Reuses Icon, useReveal, PlaceholderLabel, Header, Footer.
// ============================================================

// ── Hero — minimal compressed (~40vh), type-only ────────────
function ContactHero() {
  return (
    <section className="contact-hero" id="top">
      <div className="shell contact-hero__inner">
        <h1 className="contact-hero__title">
          Start a{' '}
          <span className="contact-italic">conversation</span>.
        </h1>
        <p className="contact-hero__sub">
          A 90-minute call to understand what you're working with. No
          slides, no discovery deck. A written proposal within 48 hours.
        </p>
      </div>
    </section>
  );
}

// ── Main — asymmetric 55/45 (form left, alt paths right) ────
function ContactMain() {
  return (
    <section className="contact-main">
      <div className="shell-wide contact-main__grid">
        <div className="contact-main__form-col">
          <ContactForm />
        </div>
        <div className="contact-main__aside-col">
          <ContactAside />
        </div>
      </div>
    </section>
  );
}

// ── Contact form — accessible, controlled, designed states ─
function ContactForm() {
  const [values, setValues] = React.useState({
    name: '', business: '', email: '', problem: '', anything: '',
  });
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const validate = (vals) => {
    const e = {};
    if (!vals.name.trim()) e.name = 'Please tell me what to call you.';
    if (!vals.email.trim()) {
      e.email = 'I need an email address to reply.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(vals.email.trim())) {
      e.email = "That doesn't look like a valid email.";
    }
    if (!vals.problem.trim()) e.problem = "Tell me what you're working with — even a sentence.";
    return e;
  };

  const onChange = (field) => (ev) => {
    const next = { ...values, [field]: ev.target.value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const onBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    setTouched({ name: true, business: true, email: true, problem: true, anything: true });
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    // Simulate delivery — the real submit endpoint will be wired
    // in by Code (likely a Cloudflare Worker that emails the studio).
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="contact-form contact-form--success" role="status" aria-live="polite">
        <div className="contact-form__success-mark"><Icon name="check" size={32} /></div>
        <h2 className="contact-form__success-title">
          Brief{' '}
          <span className="contact-italic">received</span>.
        </h2>
        <p className="contact-form__success-body">
          I'll be in touch within 48 hours — Monday to Thursday, GMT.
          If your situation needs anything sooner, the direct email is
          hello@kpsolutions.io.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <ContactField
        id="name" label="Your name" required
        value={values.name} error={touched.name && errors.name}
        onChange={onChange('name')} onBlur={onBlur('name')}
        autoComplete="name"
      />

      <ContactField
        id="business" label="Business" hint="Optional — the company you're building or running."
        value={values.business} onChange={onChange('business')} onBlur={onBlur('business')}
        autoComplete="organization"
      />

      <ContactField
        id="email" label="Email" required type="email"
        value={values.email} error={touched.email && errors.email}
        onChange={onChange('email')} onBlur={onBlur('email')}
        autoComplete="email"
      />

      <ContactField
        id="problem" label="What's the operational problem?" required textarea rows={5}
        hint="Tell me what's broken, who's affected, and what you've already tried."
        value={values.problem} error={touched.problem && errors.problem}
        onChange={onChange('problem')} onBlur={onBlur('problem')}
      />

      <ContactField
        id="anything" label="Anything else?" textarea rows={3}
        hint="Optional — context, constraints, anything you'd want me to know before the call."
        value={values.anything} onChange={onChange('anything')} onBlur={onBlur('anything')}
      />

      <div className="contact-form__actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send brief'}
          {!submitting && <Icon name="arrow-right" size={14} />}
        </button>
        <span className="contact-form__small-note">
          I'll reply within 48 hours, Mon–Thu, GMT.
        </span>
      </div>
    </form>
  );
}

function ContactField({ id, label, hint, required, textarea, rows = 3, type = 'text',
                       value, error, onChange, onBlur, autoComplete }) {
  const InputTag = textarea ? 'textarea' : 'input';
  const inputProps = {
    id,
    name: id,
    value,
    onChange,
    onBlur,
    autoComplete,
    required: !!required,
    'aria-invalid': !!error,
    'aria-describedby': hint || error ? `${id}-hint` : undefined,
    className: `contact-field__input${error ? ' is-invalid' : ''}`,
  };
  if (!textarea) inputProps.type = type;
  if (textarea) inputProps.rows = rows;

  return (
    <div className="contact-field">
      <label htmlFor={id} className="contact-field__label">
        {label}
        {required && <span className="contact-field__required" aria-hidden="true">*</span>}
      </label>
      <InputTag {...inputProps} />
      {(hint || error) && (
        <div id={`${id}-hint`} className={`contact-field__hint${error ? ' is-error' : ''}`}>
          {error || hint}
        </div>
      )}
    </div>
  );
}

// ── Aside — alt paths (book a call, email, response time) ──
function ContactAside() {
  return (
    <aside className="contact-aside">
      <div className="contact-aside__block">
        <h2 className="contact-aside__label">Skip the form.</h2>
        <p className="contact-aside__body">
          If you'd rather talk first, put the 90-minute call straight on
          the calendar.
        </p>
        <a href="https://cal.com/kylepotter"
           onClick={(e) => e.preventDefault()}
           className="link-arrow">
          Book directly <Icon name="arrow-right" size={14} />
        </a>
      </div>

      <div className="contact-aside__block">
        <h2 className="contact-aside__label">Direct email.</h2>
        <p className="contact-aside__body">
          For shorter questions, or if a form feels like too much.
        </p>
        <a href="mailto:hello@kpsolutions.io" className="contact-aside__email">
          hello@kpsolutions.io
        </a>
      </div>

      <div className="contact-aside__block">
        <h2 className="contact-aside__label">When you'll hear back.</h2>
        <p className="contact-aside__body">
          Within 48 hours, Monday to Thursday. If you write on a Friday,
          the reply will land on Monday morning.
        </p>
      </div>
    </aside>
  );
}

// ── Atmospheric break ───────────────────────────────────────
function ContactBreak() {
  return (
    <section aria-label="Atmospheric break" className="contact-break">
      <div className="contact-break__surface">
        <svg className="contact-break__grain" preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">
          <filter id="contact-break-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="211" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0.95
                                   0 0 0 0 0.85
                                   0 0 0 0 0.75
                                   0 0 0 0.4 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#contact-break-grain)"/>
        </svg>
        <div className="contact-break__scrim"></div>
        <PlaceholderLabel tone="light" position="bottom-left">
          Atmospheric — quiet working moment, considered tools, warm light
        </PlaceholderLabel>
      </div>
    </section>
  );
}

// ── What happens next — three-step strip, tight ────────────
function ContactNext() {
  const steps = [
    {
      title: 'A quick call.',
      body: 'Ninety minutes, no slides. I listen to what you\u2019re working with and ask the operator questions that matter.',
    },
    {
      title: 'A short written response.',
      body: 'Inside 48 hours. What I think the right shape of the answer is, in plain language. No proposal-grade theatre.',
    },
    {
      title: 'If it\u2019s a fit, we scope Week One.',
      body: 'Fixed fee agreed before anything starts. If it isn\u2019t a fit, I\u2019ll tell you that too — and where to look instead.',
    },
  ];
  return (
    <section className="contact-next">
      <div className="shell">
        <h2 ref={useReveal()} className="reveal contact-next__title">
          What happens{' '}
          <span className="contact-italic">next</span>.
        </h2>
        <div ref={useReveal()} className="reveal contact-next__grid">
          {steps.map((s, i) => (
            <div key={i} className="contact-next__step">
              <div className="contact-next__mark"></div>
              <h3 className="contact-next__step-title">{s.title}</h3>
              <p className="contact-next__step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Quiet bottom note ──────────────────────────────────────
function ContactNote() {
  return (
    <section className="contact-note">
      <div className="shell">
        <p ref={useReveal()} className="reveal contact-note__text">
          If bespoke isn't the right answer for your situation,{' '}
          <span className="contact-italic">I'll tell you</span>.
        </p>
      </div>
    </section>
  );
}

Object.assign(window, {
  ContactHero, ContactMain, ContactForm, ContactField, ContactAside,
  ContactBreak, ContactNext, ContactNote,
});

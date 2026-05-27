import { useState } from "react";
import { ORG_EMAIL } from "../../lib/site";

interface Values {
  name: string;
  business: string;
  email: string;
  problem: string;
  anything: string;
}
type FieldKey = keyof Values;
type Errors = Partial<Record<FieldKey, string>>;
type Touched = Partial<Record<FieldKey, boolean>>;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validate(vals: Values): Errors {
  const e: Errors = {};
  if (!vals.name.trim()) e.name = "Please tell me what to call you.";
  if (!vals.email.trim()) {
    e.email = "I need an email address to reply.";
  } else if (!EMAIL_RE.test(vals.email.trim())) {
    e.email = "That doesn't look like a valid email.";
  }
  if (!vals.problem.trim()) e.problem = "Tell me what you're working with — even a sentence.";
  return e;
}

function Icon({ name, size = 14 }: { name: "arrow-right" | "check"; size?: number }) {
  const paths = {
    "arrow-right": '<line x1="3" y1="12" x2="20" y2="12"/><polyline points="14,6 20,12 14,18"/>',
    check: '<polyline points="4,12 10,18 20,6"/>',
  } as const;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      style={{ flexShrink: 0, display: "inline-block" }}
      dangerouslySetInnerHTML={{ __html: paths[name] }}
    />
  );
}

interface FieldProps {
  id: FieldKey;
  label: string;
  hint?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  type?: string;
  value: string;
  error?: string | false;
  autoComplete?: string;
  onValue: (value: string) => void;
  onBlur: () => void;
}

function ContactField(props: FieldProps) {
  const { id, label, hint, required, textarea, rows = 3, type = "text", value, error, autoComplete, onValue, onBlur } = props;
  const describedBy = hint || error ? `${id}-hint` : undefined;
  const inputClass = `contact-field__input${error ? " is-invalid" : ""}`;
  return (
    <div className="contact-field">
      <label htmlFor={id} className="contact-field__label">
        {label}
        {required && <span className="contact-field__required" aria-hidden="true">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          value={value}
          rows={rows}
          required={!!required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={inputClass}
          onInput={(e) => onValue(e.currentTarget.value)}
          onBlur={onBlur}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          required={!!required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={inputClass}
          onInput={(e) => onValue(e.currentTarget.value)}
          onBlur={onBlur}
        />
      )}
      {(hint || error) && (
        <div id={describedBy} className={`contact-field__hint${error ? " is-error" : ""}`}>
          {error || hint}
        </div>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", business: "", email: "", problem: "", anything: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = (field: FieldKey) => (value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const blurField = (field: FieldKey) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const submit = async () => {
    const e = validate(values);
    setErrors(e);
    setTouched({ name: true, business: true, email: true, problem: true, anything: true });
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubmitted(true);
    } catch {
      setSubmitError(`Something went wrong sending that. Please email ${ORG_EMAIL} directly.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="contact-form contact-form--success" role="status" aria-live="polite">
        <div className="contact-form__success-mark"><Icon name="check" size={32} /></div>
        <h2 className="contact-form__success-title">
          Brief <span className="contact-italic">received</span>.
        </h2>
        <p className="contact-form__success-body">
          I'll be in touch within 48 hours — Monday to Thursday, GMT. If your situation needs
          anything sooner, the direct email is {ORG_EMAIL}.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }}>
      <ContactField
        id="name" label="Your name" required
        value={values.name} error={touched.name && errors.name}
        onValue={setField("name")} onBlur={blurField("name")} autoComplete="name"
      />
      <ContactField
        id="business" label="Business" hint="Optional — the company you're building or running."
        value={values.business} onValue={setField("business")} onBlur={blurField("business")} autoComplete="organization"
      />
      <ContactField
        id="email" label="Email" required type="email"
        value={values.email} error={touched.email && errors.email}
        onValue={setField("email")} onBlur={blurField("email")} autoComplete="email"
      />
      <ContactField
        id="problem" label="What's the operational problem?" required textarea rows={5}
        hint="Tell me what's broken, who's affected, and what you've already tried."
        value={values.problem} error={touched.problem && errors.problem}
        onValue={setField("problem")} onBlur={blurField("problem")}
      />
      <ContactField
        id="anything" label="Anything else?" textarea rows={3}
        hint="Optional — context, constraints, anything you'd want me to know before the call."
        value={values.anything} onValue={setField("anything")} onBlur={blurField("anything")}
      />

      <div className="contact-form__actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Sending…" : "Send brief"}
          {!submitting && <Icon name="arrow-right" size={14} />}
        </button>
        <span className="contact-form__small-note">I'll reply within 48 hours, Mon–Thu, GMT.</span>
      </div>
      {submitError && <p className="contact-form__error" role="alert">{submitError}</p>}
    </form>
  );
}

"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const ORG_EMAIL = "kyle.potter@kpsolutions.io";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) {
    errors.name = "Please tell us what to call you.";
  }
  if (!email.trim()) {
    errors.email = "We need an email address to reply.";
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = "That doesn't look like a valid email.";
  }
  if (!message.trim()) {
    errors.message = "Tell us what you're working with — even a sentence.";
  }
  return errors;
}

const inputClasses =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-accent";

export function ContactForm(): ReactNode {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate(name, email, message);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center py-8 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
          <Check className="h-6 w-6 text-black" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-2xl font-medium tracking-tight text-foreground">
          Message <span className="italic font-serif text-accent">received</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          We&apos;ll be in touch within 48 hours, Monday to Sunday. If your
          situation needs anything sooner, the direct email is{" "}
          <a href={`mailto:${ORG_EMAIL}`} className="font-medium text-foreground underline-offset-4 hover:underline">
            {ORG_EMAIL}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 text-left">
      <div>
        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-foreground">
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClasses} min-h-24 resize-y`}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
        )}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          Something went wrong sending that. Please email{" "}
          <a href={`mailto:${ORG_EMAIL}`} className="font-medium underline underline-offset-4">
            {ORG_EMAIL}
          </a>{" "}
          directly.
        </p>
      )}

      <motion.button
        type="submit"
        disabled={status === "submitting"}
        {...(status !== "submitting" && {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        })}
        className="mt-1 w-full rounded-xl bg-foreground py-3.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </motion.button>
    </form>
  );
}

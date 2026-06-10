import { ContactForm } from "@/components/contact-form";
import { createMetadata } from "@/lib/metadata";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Start a conversation with KP Solutions. A 30-minute call to see if we can help — no slides, no discovery deck. A written proposal within 48 hours.",
  path: "/contact",
});

export default function ContactPage(): ReactNode {
  return (
    <main id="main-content" className="flex min-h-screen flex-1 flex-col items-center bg-background px-6 pb-24 pt-40">
      <div className="mx-auto w-full max-w-xl text-center">
        <h1 className="text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
          Start a{" "}
          <span className="italic font-serif text-accent">conversation</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A 30-minute call to see if we can help. No slides, no discovery
          deck. A written proposal within 48 hours.
        </p>

        <div className="mt-12 rounded-2xl bg-frame p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Prefer email?{" "}
          <a
            href="mailto:kyle.potter@kpsolutions.io"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            kyle.potter@kpsolutions.io
          </a>
        </p>

        <p className="mt-10 text-base text-muted-foreground">
          If bespoke isn&apos;t the right answer for your situation,{" "}
          <span className="italic font-serif text-foreground">
            we&apos;ll tell you
          </span>
          .
        </p>

        <a
          href="/"
          className="mt-14 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </a>
      </div>
    </main>
  );
}

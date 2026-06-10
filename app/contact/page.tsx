import { createMetadata } from "@/lib/metadata";
import { ArrowLeft, Mail } from "lucide-react";
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
    <main id="main-content" className="flex min-h-screen flex-1 flex-col items-center justify-center bg-background px-6 py-32">
      <div className="mx-auto w-full max-w-2xl text-center">
        <h1 className="text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
          Start a{" "}
          <span className="italic font-serif text-accent">conversation</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A 30-minute call to see if we can help. No slides, no discovery
          deck. A written proposal within 48 hours.
        </p>

        <a
          href="mailto:kyle.potter@kpsolutions.io"
          className="mt-10 inline-flex items-center gap-3 rounded-xl bg-foreground px-8 py-4 text-base font-semibold text-background transition-colors hover:bg-foreground/90"
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          kyle.potter@kpsolutions.io
        </a>

        <p className="mt-12 text-base text-muted-foreground">
          If bespoke isn&apos;t the right answer for your situation,{" "}
          <span className="italic font-serif text-foreground">
            we&apos;ll tell you
          </span>
          .
        </p>

        <a
          href="/"
          className="mt-16 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </a>
      </div>
    </main>
  );
}

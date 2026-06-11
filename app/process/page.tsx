import { ProcessContent } from "@/components/process/process-content";
import { createMetadata } from "@/lib/metadata";
import { processFaqs } from "@/lib/faq-data";
import { JsonLd, breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Process",
  description:
    "How KP Solutions works: discovery first, scope set together, fixed fee agreed before any build, code owned by you from day one.",
  path: "/process",
});

export default function ProcessPage(): ReactNode {
  return (
    <main id="main-content" className="flex-1">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Process", path: "/process" },
        ])}
      />
      <JsonLd
        schema={faqPageSchema(
          processFaqs.map((f) => ({ question: f.question, answer: f.answer }))
        )}
      />
      <ProcessContent />
    </main>
  );
}

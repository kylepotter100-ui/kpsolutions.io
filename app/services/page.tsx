import { ServicesContent } from "@/components/services/services-content";
import { createMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Services",
  description:
    "Four shapes of bespoke work: custom software, modernization and replacement of legacy systems, integrations and automation, and AI-visible web presence. Code owned entirely by you.",
  path: "/services",
});

export default function ServicesPage(): ReactNode {
  return (
    <main id="main-content" className="flex-1">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <ServicesContent />
    </main>
  );
}

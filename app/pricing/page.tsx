import { PricingContent } from "@/components/pricing/pricing-content";
import { createMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description:
    "How KP Solutions prices: a consultative model where we scope the work together, agree one fixed fee, and everything we ship is yours — with an optional retainer partnership beyond launch.",
  path: "/pricing",
});

export default function PricingPage(): ReactNode {
  return (
    <main id="main-content" className="flex-1">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <PricingContent />
    </main>
  );
}

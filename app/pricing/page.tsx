import { PricingContent } from "@/components/pricing/pricing-content";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description:
    "How KP Solutions prices: one fixed fee, agreed before any build work begins. Code owned by you from day one, no per-seat fees, no lock-in.",
  path: "/pricing",
});

export default function PricingPage(): ReactNode {
  return (
    <main id="main-content" className="flex-1">
      <PricingContent />
    </main>
  );
}

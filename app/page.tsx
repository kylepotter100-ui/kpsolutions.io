import { BlurInHeadline } from "@/components/blur-in-headline";
import { FAQ } from "@/components/faq";
import { FeaturesBento } from "@/components/features-bento";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";
import { homeFaqs } from "@/lib/faq-data";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { JsonLd, faqPageSchema } from "@/lib/schema";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Software that fits how you work",
  description: siteConfig.description,
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex-1">
      <JsonLd
        schema={faqPageSchema(
          homeFaqs.map((f) => ({ question: f.question, answer: f.answer }))
        )}
      />
      <Hero />
      <BlurInHeadline />
      <FeaturesBento />
      <Testimonials />
      <HowItWorks />
      <Pricing />
      <FAQ />
    </main>
  );
}

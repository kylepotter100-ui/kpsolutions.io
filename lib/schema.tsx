import { siteConfig } from "@/lib/metadata";
import type { ReactNode } from "react";

const SITE_URL = siteConfig.url;
const ORG_NAME = "KP Solutions";
const ORG_ID = `${SITE_URL}/#organization`;
const ORG_EMAIL = "kyle.potter@kpsolutions.io";

export type JsonLdSchema = Record<string, unknown>;

const orgRef = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: ORG_NAME,
  url: SITE_URL,
};

export function organizationSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: SITE_URL,
    description:
      "KP Solutions is a one-person bespoke software studio building software that fits how businesses actually work — custom platforms, internal tools, integrations, and AI-visible web presence.",
    email: ORG_EMAIL,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: ORG_EMAIL,
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Loughborough",
      addressRegion: "East Midlands",
      addressCountry: "GB",
    },
  };
}

export function professionalServiceSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: ORG_NAME,
    url: SITE_URL,
    description:
      "Bespoke software development: custom platforms, modernization and replacement of legacy systems, integrations and automation, and AI-visible web presence. Fixed fee, code owned by the client.",
    email: ORG_EMAIL,
    areaServed: "GB",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Loughborough",
      addressRegion: "East Midlands",
      addressCountry: "GB",
    },
    parentOrganization: orgRef,
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqPageSchema(
  items: { question: string; answer: string }[]
): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function JsonLd({ schema }: { schema: JsonLdSchema }): ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

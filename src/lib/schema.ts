const SITE_URL = "https://kpsolutions.io";
const ORG_NAME = "KP Solutions";
const ORG_ID = `${SITE_URL}/#organization`;

export type JsonLdSchema = Record<string, unknown>;

const toISO = (value: string | Date): string =>
  value instanceof Date ? value.toISOString() : value;

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
      "Custom software for established operators. KP Solutions is a one-person bespoke software studio building software that solves operational problems.",
    // logo, sameAs, and contactPoint pending brand assets and published profiles.
  };
}

export interface ServiceSchemaInput {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
}

export function serviceSchema(input: ServiceSchemaInput): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
    provider: orgRef,
  };
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  datePublished: string | Date;
  dateModified?: string | Date;
  author?: string;
}

export function articleSchema(input: ArticleSchemaInput): JsonLdSchema {
  const datePublished = toISO(input.datePublished);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished,
    dateModified: input.dateModified ? toISO(input.dateModified) : datePublished,
    author: {
      "@type": "Person",
      name: input.author ?? ORG_NAME,
    },
    publisher: orgRef,
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]): JsonLdSchema {
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

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

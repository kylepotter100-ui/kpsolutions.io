import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Markdown content collections (Astro 6 Content Layer API).
// Prose lives in the markdown body; `slug` is an optional override for the
// id derived from the filename.

const insights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/insights" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string(),
    slug: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    client: z.string(),
    problem: z.string(),
    approach: z.string(),
    outcome: z.string(),
    stack: z.array(z.string()),
    timeline: z.string(),
    slug: z.string().optional(),
  }),
});

export const collections = {
  insights,
  "case-studies": caseStudies,
};

import { CaseStudyDetail } from "@/components/work/case-study";
import { caseStudies } from "@/lib/work";
import { createMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

const study = caseStudies.find((cs) => cs.id === "potter-sanctuary");

export const metadata: Metadata = createMetadata({
  title: "Potter Sanctuary",
  description:
    "Potter Sanctuary — a new wellness practice given a complete foundation: a branded editorial website engineered to be cited by AI search, an integrated booking system wired into the site, client accounts, and a self-serve admin portal.",
  path: "/work/potter-sanctuary",
});

export default function PotterSanctuaryPage(): ReactNode {
  if (!study) notFound();

  return (
    <main id="main-content" className="flex-1">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: "Potter Sanctuary", path: "/work/potter-sanctuary" },
        ])}
      />
      <CaseStudyDetail study={study} />
    </main>
  );
}

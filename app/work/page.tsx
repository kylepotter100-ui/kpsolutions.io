import { WorkIndex } from "@/components/work/work-index";
import { createMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Work",
  description:
    "Selected work from KP Solutions. Each project shipped on a fixed fee, on an agreed timeline, with the code owned entirely by the client.",
  path: "/work",
});

export default function WorkPage(): ReactNode {
  return (
    <main id="main-content" className="flex-1">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ])}
      />
      <WorkIndex />
    </main>
  );
}

import { ProcessContent } from "@/components/process/process-content";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Process",
  description:
    "The Four Week Build. Brief on Monday. Live four Fridays later. Fixed fee. Code owned by you.",
  path: "/process",
});

export default function ProcessPage(): ReactNode {
  return (
    <main id="main-content" className="flex-1">
      <ProcessContent />
    </main>
  );
}

import { LegalPage } from "@/components/legal/legal-page";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const ORG_EMAIL = "kyle.potter@kpsolutions.io";

export const metadata: Metadata = createMetadata({
  title: "Terms",
  description:
    "The terms for using the KP Solutions website. Project work is governed by a separate written agreement.",
  path: "/terms",
});

export default function TermsPage(): ReactNode {
  return (
    <LegalPage
      title="Terms"
      updated="June 2026"
      lead={
        <>
          These terms cover your use of this website. They&apos;re deliberately
          short. Any actual project work is governed by a separate written
          proposal and agreement — not by this page.
        </>
      }
    >
      <section>
        <h2>The website</h2>
        <p>
          This site is informational. The descriptions of what KP Solutions
          builds, how the studio works, and the case study shown are provided
          to help you decide whether to get in touch. Nothing here is a
          binding offer, quote, or guarantee of a specific outcome.
        </p>
      </section>

      <section>
        <h2>Engagements</h2>
        <p>
          When we work together, the scope, fee, timeline, and terms are set
          out in a written proposal and agreement specific to your project.
          Those documents govern the engagement. A consistent principle across
          them: the source code we build for you is owned by you.
        </p>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          The content, design, and branding of this website are owned by KP
          Solutions. The Potter Sanctuary case study is published with the
          client&apos;s permission. Please don&apos;t reproduce the site&apos;s
          content without asking.
        </p>
      </section>

      <section>
        <h2>Third-party links</h2>
        <p>
          Where this site links out — for example to a live client site — we
          aren&apos;t responsible for the content or practices of those
          external pages.
        </p>
      </section>

      <section>
        <h2>Liability</h2>
        <p>
          The website is provided as-is. To the extent permitted by law, KP
          Solutions isn&apos;t liable for any loss arising from reliance on
          the informational content of this site. This doesn&apos;t limit
          anything that can&apos;t be limited by law.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms are welcome at{" "}
          <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}

import { LegalPage } from "@/components/legal/legal-page";
import { createMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const ORG_EMAIL = "kyle.potter@kpsolutions.io";

export const metadata: Metadata = createMetadata({
  title: "Cookies",
  description:
    "How KP Solutions uses cookies and local storage. Today the site sets none. If that ever changes, this page describes what we'd add and how you'd control it.",
  path: "/cookies",
});

export default function CookiesPage(): ReactNode {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Cookies", path: "/cookies" },
        ])}
      />
      <LegalPage
      title="Cookies"
      updated="June 2026"
      lead={
        <>
          Short version: as of today, kpsolutions.io sets no cookies and no
          tracking storage. The only client-side state the site can ever save
          is a preference you set yourself, the moment you set it. This page
          describes that in detail — and what would change if analytics were
          ever added later.
        </>
      }
    >
      <section>
        <h2>What&apos;s set right now</h2>
        <p>
          Nothing. No cookies. No advertising pixels. No first- or third-party
          analytics scripts. Loading the site involves no storage being written
          to your browser by us.
        </p>
      </section>

      <section>
        <h2>The one piece of local storage</h2>
        <p>
          If we ever switch on website analytics, a small consent banner will
          appear so you can accept or decline before any script loads. Your
          choice would be saved in <em>localStorage</em> under the key{" "}
          <code>kp-cookie-consent</code> with a value of <code>accepted</code>{" "}
          or <code>declined</code>. The banner is not active today; nothing is
          being written.
        </p>
      </section>

      <section>
        <h2>If analytics are added later</h2>
        <p>
          We&apos;d use a privacy-respecting product, gated behind the consent
          banner. Until you accept, no analytics script would load. If you
          accept, the chosen product&apos;s standard cookies would be set so
          we can understand which pages are visited and where visitors come
          from. If you decline, nothing extra is set, and the site keeps
          working normally.
        </p>
      </section>

      <section>
        <h2>How to clear your preference</h2>
        <p>
          You can clear it the same way you clear anything else in your
          browser&apos;s storage — usually under site settings or
          &ldquo;Clear cookies and site data&rdquo;. Removing the{" "}
          <code>kp-cookie-consent</code> entry resets the choice; the banner
          (if active at the time) would prompt again on your next visit.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          Anything unclear, or you spot something on the site that looks like
          it shouldn&apos;t be there — please email{" "}
          <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>.
        </p>
      </section>
      </LegalPage>
    </>
  );
}

import { LegalPage } from "@/components/legal/legal-page";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const ORG_EMAIL = "kyle.potter@kpsolutions.io";

export const metadata: Metadata = createMetadata({
  title: "Privacy",
  description:
    "How KP Solutions handles the information you share through the contact form. No analytics, no cookies, no tracking — only what you choose to send.",
  path: "/privacy",
});

export default function PrivacyPage(): ReactNode {
  return (
    <LegalPage
      title="Privacy"
      updated="June 2026"
      lead={
        <>
          KP Solutions is a one-person software studio. This site doesn&apos;t
          track you. There are no analytics, no advertising pixels, and no
          cookies. The only information collected is what you choose to send
          through the contact form.
        </>
      }
    >
      <section>
        <h2>What we collect</h2>
        <p>
          When you submit the contact form, we receive the details you enter:
          your name, your email address, and the message describing what
          you&apos;re working with. Nothing else is gathered, and we don&apos;t
          ask for anything we don&apos;t need to reply to you.
        </p>
      </section>

      <section>
        <h2>How it&apos;s used</h2>
        <p>
          Your submission is used for one purpose: to respond to your enquiry
          and, if it leads to work, to scope and run that engagement. It is
          never sold, rented, or shared for marketing.
        </p>
      </section>

      <section>
        <h2>Who processes it</h2>
        <p>
          The site is hosted on Cloudflare, and contact-form messages are
          delivered by email through Resend. Both act only as processors of the
          message in transit. Your enquiry then lives in our email inbox like
          any other message you&apos;d send us directly.
        </p>
      </section>

      <section>
        <h2>How long it&apos;s kept</h2>
        <p>
          Enquiries are kept only as long as needed to handle your request and
          any resulting project. If a conversation doesn&apos;t go anywhere,
          the message is deleted in the normal course of clearing the inbox.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can ask us what we hold about you, or ask us to delete it, at any
          time — just email{" "}
          <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a> and we&apos;ll handle
          it promptly.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          If this policy changes, the updated version will be posted here with a
          new date. Questions about any of it are welcome at{" "}
          <a href={`mailto:${ORG_EMAIL}`}>{ORG_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}

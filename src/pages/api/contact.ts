import type { APIRoute } from "astro";
import { ORG_EMAIL } from "../../lib/site";

export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

interface Payload {
  name?: string;
  business?: string;
  email?: string;
  problem?: string;
  anything?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const problem = (body.problem ?? "").trim();
  const business = (body.business ?? "").trim();
  const anything = (body.anything ?? "").trim();

  if (!name || !email || !problem || !EMAIL_RE.test(email)) {
    return json({ error: "Please complete the required fields." }, 422);
  }

  const apiKey = locals.runtime?.env?.RESEND_API_KEY;
  if (!apiKey) return json({ error: "Email service is not configured." }, 500);

  const parts = [`Name: ${name}`];
  if (business) parts.push(`Business: ${business}`);
  parts.push(`Email: ${email}`, "", "Operational problem:", problem);
  if (anything) parts.push("", "Anything else:", anything);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "KP Solutions <noreply@kpsolutions.io>",
      to: [ORG_EMAIL],
      reply_to: email,
      subject: `New enquiry — ${name}${business ? ` · ${business}` : ""}`,
      text: parts.join("\n"),
    }),
  });

  if (!res.ok) return json({ error: "Could not send your message." }, 502);
  return json({ ok: true });
};

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
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

export const POST: APIRoute = async ({ request }) => {
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

  const apiKey = (env as { RESEND_API_KEY?: string }).RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact: RESEND_API_KEY missing from runtime env");
    return json({ error: "Email service is not configured." }, 500);
  }

  const parts = [`Name: ${name}`];
  if (business) parts.push(`Business: ${business}`);
  parts.push(`Email: ${email}`, "", "Operational problem:", problem);
  if (anything) parts.push("", "Anything else:", anything);

  const from = "KP Solutions <noreply@kpsolutions.io>";
  const to = ORG_EMAIL;

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New enquiry — ${name}${business ? ` · ${business}` : ""}`,
        text: parts.join("\n"),
      }),
    });
  } catch (err) {
    console.error("contact: resend fetch threw", { from, to, err: String(err) });
    return json({ error: "Could not send your message." }, 502);
  }

  const bodyText = await res.text();
  if (!res.ok) {
    console.error("contact: resend send failed", { status: res.status, body: bodyText, from, to });
    return json({ error: "Could not send your message." }, 502);
  }

  let id: string | undefined;
  try { id = (JSON.parse(bodyText) as { id?: string }).id; } catch { /* non-JSON success body */ }
  console.log("contact: resend send ok", { id, to });
  return json({ ok: true });
};

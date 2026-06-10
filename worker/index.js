// Cloudflare Worker entry: handles POST /api/contact via Resend, serves the
// static Next.js export (./out) for everything else through the ASSETS binding.
// Ported from the Astro-era src/pages/api/contact.ts on main, reduced to the
// three-field form (name, email, message).

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const ORG_EMAIL = "kyle.potter@kpsolutions.io";
const FROM = "KP Solutions <noreply@kpsolutions.io>";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function handleContact(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return json({ error: "Please complete the required fields." }, 422);
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact: RESEND_API_KEY missing from runtime env");
    return json({ error: "Email service is not configured." }, 500);
  }

  const text = [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n");

  let res;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [ORG_EMAIL],
        reply_to: email,
        subject: `New enquiry — ${name}`,
        text,
      }),
    });
  } catch (err) {
    console.error("contact: resend fetch threw", { err: String(err) });
    return json({ error: "Could not send your message." }, 502);
  }

  const bodyText = await res.text();
  if (!res.ok) {
    console.error("contact: resend send failed", { status: res.status, body: bodyText });
    return json({ error: "Could not send your message." }, 502);
  }

  let id;
  try {
    id = JSON.parse(bodyText).id;
  } catch {
    // non-JSON success body
  }
  console.log("contact: resend send ok", { id, to: ORG_EMAIL });
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405);
      }
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

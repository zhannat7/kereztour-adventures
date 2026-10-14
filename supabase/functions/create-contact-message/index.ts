import { NOTIFY_EMAIL, sendKereztourMail } from "../_shared/kereztour-mail.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders as sdkCorsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Public form endpoint: protected by validation, not by origin (origin
// restrictions silently blocked some mobile browsers/webviews).
const corsHeaders = (_origin: string | null) => sdkCorsHeaders;

const json = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });


const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");


Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : null;

    if (name.length < 2 || name.length > 200) return json({ error: "Ungültiger Name." }, 400, origin);
    if (email.length < 3 || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Ungültige E-Mail-Adresse." }, 400, origin);
    }
    if (message && message.length > 5000) return json({ error: "Nachricht ist zu lang." }, 400, origin);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) return json({ error: "Serverkonfiguration fehlt." }, 500, origin);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await admin.from("contact_messages").insert({
      name,
      email,
      tour: typeof body.tour === "string" ? body.tour : null,
      date_from: typeof body.date_from === "string" ? body.date_from : null,
      date_to: typeof body.date_to === "string" ? body.date_to : null,
      persons: Number.isInteger(body.persons) ? body.persons : null,
      message,
    });

    if (error) throw error;

    const tour = typeof body.tour === "string" ? body.tour : "-";
    const dateFrom = typeof body.date_from === "string" ? body.date_from : "-";
    const dateTo = typeof body.date_to === "string" ? body.date_to : "-";
    const persons = Number.isInteger(body.persons) ? String(body.persons) : "-";
    const mailKey = crypto.randomUUID();
    await Promise.all([
      sendKereztourMail(NOTIFY_EMAIL, {
        subject: `Neue Kontaktanfrage von ${name}`,
        heading: "Neue Kontaktanfrage",
        rows: [
          { label: "Name", value: name },
          { label: "E-Mail", value: email },
          { label: "Reise", value: tour },
          { label: "Zeitraum", value: `${dateFrom} bis ${dateTo}` },
          { label: "Personen", value: persons },
          { label: "Nachricht", value: message ?? "-" },
        ],
      }, `contact-notify-${mailKey}`),
      sendKereztourMail(email, {
        subject: "Deine Anfrage bei Kereztour",
        heading: "Vielen Dank für deine Anfrage!",
        paragraphs: [
          `Hallo ${name},`,
          "vielen Dank für deine Anfrage bei Kereztour. Wir haben deine Nachricht erhalten und melden uns innerhalb von 24 Stunden bei dir.",
        ],
        rows: [
          { label: "Reise", value: tour },
          { label: "Zeitraum", value: `${dateFrom} bis ${dateTo}` },
          { label: "Personen", value: persons },
        ],
        closing: ["Herzliche Grüße", "Sarina & das Kereztour-Team"],
      }, `contact-confirm-${mailKey}`),
    ]);

    return json({ success: true }, 200, origin);
  } catch (error) {
    console.error("create-contact-message error:", error);
    return json({ error: "Anfrage konnte nicht gesendet werden." }, 500, origin);
  }
});

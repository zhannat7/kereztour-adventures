import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://kereztour.com",
  "https://www.kereztour.com",
]);

const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://kereztour.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
});

const json = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });

const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") ?? "sarinasadirovna@gmail.com";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured – skipping email.");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: Deno.env.get("RESEND_FROM_EMAIL") ?? "Kereztour <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`Resend error [${res.status}] for ${to}: ${await res.text()}`);
    }
  } catch (error) {
    console.error(`Email failed for ${to}:`, error);
  }
}

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

    await sendEmail(
      NOTIFY_EMAIL,
      `Neue Kontaktanfrage von ${name}`,
      `<h2>Neue Kontaktanfrage</h2>
       <table cellpadding="6" style="border-collapse:collapse">
         <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
         <tr><td><b>E-Mail</b></td><td>${escapeHtml(email)}</td></tr>
         <tr><td><b>Reise</b></td><td>${escapeHtml(typeof body.tour === "string" ? body.tour : "-")}</td></tr>
         <tr><td><b>Zeitraum</b></td><td>${escapeHtml(typeof body.date_from === "string" ? body.date_from : "-")} bis ${escapeHtml(typeof body.date_to === "string" ? body.date_to : "-")}</td></tr>
         <tr><td><b>Personen</b></td><td>${Number.isInteger(body.persons) ? body.persons : "-"}</td></tr>
       </table>
       <p><b>Nachricht:</b></p>
       <p>${escapeHtml(message ?? "-").replace(/\n/g, "<br>")}</p>
       <p>Details im Admin-Bereich: <a href="https://kereztour.com/admin">kereztour.com/admin</a></p>`,
    );

    await sendEmail(
      email,
      `Deine Anfrage bei Kereztour`,
      `<h2>Vielen Dank für deine Anfrage!</h2>
       <p>Hallo ${escapeHtml(name)},</p>
       <p>vielen Dank für deine Anfrage bei Kereztour. Wir haben deine Nachricht erhalten und melden uns innerhalb von 24 Stunden bei dir.</p>
       <p><b>Deine Anfrage:</b></p>
       <table cellpadding="6" style="border-collapse:collapse">
         <tr><td><b>Reise</b></td><td>${escapeHtml(typeof body.tour === "string" ? body.tour : "-")}</td></tr>
         <tr><td><b>Zeitraum</b></td><td>${escapeHtml(typeof body.date_from === "string" ? body.date_from : "-")} bis ${escapeHtml(typeof body.date_to === "string" ? body.date_to : "-")}</td></tr>
         <tr><td><b>Personen</b></td><td>${Number.isInteger(body.persons) ? body.persons : "-"}</td></tr>
       </table>
       <p>Liebe Grüße<br><b>Sarina &amp; Kereztour</b></p>`,
    );

    return json({ success: true }, 200, origin);
  } catch (error) {
    console.error("create-contact-message error:", error);
    return json({ error: "Anfrage konnte nicht gesendet werden." }, 500, origin);
  }
});

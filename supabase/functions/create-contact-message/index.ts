import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://kereztour.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : null;

    if (name.length < 2 || name.length > 200) return json({ error: "Ungültiger Name." }, 400);
    if (email.length < 3 || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Ungültige E-Mail-Adresse." }, 400);
    }
    if (message && message.length > 5000) return json({ error: "Nachricht ist zu lang." }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) return json({ error: "Serverkonfiguration fehlt." }, 500);

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
    return json({ success: true });
  } catch (error) {
    console.error("create-contact-message error:", error);
    return json({ error: "Anfrage konnte nicht gesendet werden." }, 500);
  }
});

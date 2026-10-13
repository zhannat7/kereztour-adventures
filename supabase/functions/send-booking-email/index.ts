import { sendKereztourMail } from "../_shared/kereztour-mail.ts";
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

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Nicht angemeldet." }, 401, origin);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Serverkonfiguration für E-Mail-Versand fehlt." }, 500, origin);
    }

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? serviceRoleKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Nicht angemeldet." }, 401, origin);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: isAdmin, error: roleError } = await admin.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) return json({ error: "Keine Admin-Berechtigung." }, 403, origin);

    const body = await req.json();
    const bookingId = typeof body.bookingId === "string" ? body.bookingId : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const confirmBooking = body.confirmBooking === true;

    if (!bookingId || !subject || !message) {
      return json({ error: "Buchung, Betreff und Nachricht sind erforderlich." }, 400, origin);
    }

    const { data: booking, error: bookingError } = await admin
      .from("bookings")
      .select("id, name, email, status")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) return json({ error: "Buchung nicht gefunden." }, 404, origin);

    const sent = await sendKereztourMail(booking.email, {
      subject,
      paragraphs: message.split("\n"),
    }, `booking-manual-${crypto.randomUUID()}`);

    if (!sent) {
      return json({ error: "E-Mail konnte nicht versendet werden." }, 502, origin);
    }

    const { error: logError } = await admin.from("booking_email_log").insert({
      booking_id: booking.id,
      sent_by: user.id,
      recipient: booking.email,
      subject,
      message,
    });
    if (logError) console.error("Booking email log error:", logError);

    if (confirmBooking && booking.status !== "confirmed") {
      const { error: updateError } = await admin
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);
      if (updateError) throw updateError;
    }

    return json({ success: true }, 200, origin);
  } catch (error) {
    console.error("send-booking-email error:", error);
    return json({ error: "E-Mail konnte nicht versendet werden." }, 500, origin);
  }
});

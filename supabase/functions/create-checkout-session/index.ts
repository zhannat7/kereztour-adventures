import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://kereztour.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      ...(origin === "https://www.kereztour.com" ? { "Access-Control-Allow-Origin": origin } : {}),
      "Content-Type": "application/json",
    },
  });

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  try {
    const { bookingId } = await req.json();
    if (typeof bookingId !== "string" || !bookingId) {
      return json({ error: "Buchungs-ID fehlt." }, 400, origin);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!stripeKey || !supabaseUrl || !serviceRoleKey) {
      return json({ error: "Stripe ist noch nicht konfiguriert." }, 500, origin);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: booking, error: bookingError } = await admin
      .from("bookings")
      .select("id, name, email, persons, travel_date, tour, total_price, payment_status, stripe_checkout_session_id")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) return json({ error: "Buchung nicht gefunden." }, 404, origin);
    if (booking.payment_status === "deposit_paid") {
      return json({ error: "Die Anzahlung wurde bereits bezahlt." }, 409, origin);
    }

    const total = Number(booking.total_price);
    if (!Number.isFinite(total) || total <= 150) {
      return json({ error: "Der Reisepreis ist für die Anzahlung ungültig." }, 400, origin);
    }

    const stripe = new Stripe(stripeKey);
    const originUrl = Deno.env.get("SITE_URL") ?? "https://kereztour.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: booking.email,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Kereztour – Anzahlung",
            description: `150 € Anzahlung für ${booking.tour} am ${booking.travel_date}`,
          },
          unit_amount: 15000,
        },
        quantity: 1,
      }],
      metadata: { booking_id: booking.id },
      payment_intent_data: {
        metadata: { booking_id: booking.id },
      },
      success_url: `${originUrl}/zahlung?status=success&booking_id=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${originUrl}/zahlung?status=cancelled&booking_id=${booking.id}`,
    });

    await admin.from("bookings").update({
      payment_status: "checkout_open",
      deposit_amount: 150,
      remaining_amount: Math.max(total - 150, 0),
      stripe_checkout_session_id: session.id,
    }).eq("id", booking.id);

    return json({ success: true, url: session.url }, 200, origin);
  } catch (error) {
    console.error("create-checkout-session error:", error);
    return json({ error: "Stripe-Zahlung konnte nicht gestartet werden." }, 500, origin);
  }
});

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17.7.0";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const signature = req.headers.get("stripe-signature");

    if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceRoleKey || !signature) {
      return new Response("Stripe webhook is not configured.", { status: 500 });
    }

    const payload = await req.text();
    const stripe = new Stripe(stripeKey);
    const event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;
      if (bookingId && session.payment_status === "paid") {
        const paymentIntentId =
          typeof session.payment_intent === "string" ? session.payment_intent : null;

        const { error } = await admin.from("bookings").update({
          payment_status: "deposit_paid",
          deposit_amount: 150,
          stripe_payment_intent_id: paymentIntentId,
          status: "confirmed",
        }).eq("id", bookingId);

        if (error) throw error;
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : null;
      if (paymentIntentId) {
        await admin.from("bookings")
          .update({ payment_status: "refunded", status: "cancelled" })
          .eq("stripe_payment_intent_id", paymentIntentId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("stripe-webhook error:", error);
    return new Response("Webhook signature or processing error.", { status: 400 });
  }
});

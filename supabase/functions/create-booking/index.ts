import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// This public booking endpoint is protected by server-side validation, not
// by origin. Restricting origins silently blocked some mobile browsers/webviews.
const getCorsHeaders = (_origin: string | null) => corsHeaders;

type BookingRequest = {
  name?: string;
  email?: string;
  phone?: string;
  persons?: number;
  travelDate?: string;
  tour?: string;
  tier?: string | null;
  paymentMode?: "request" | "deposit";
  notes?: string | null;
};

const json = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(origin), "Content-Type": "application/json" },
  });

const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") ?? "kereztour@hotmail.com";

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

const isDate = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  try {
    const body = (await req.json()) as BookingRequest;

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const phone = body.phone?.trim() ?? "";
    const persons = Number(body.persons);
    const travelDate = body.travelDate;
    const tour = body.tour?.trim() ?? "";
    // Kultur pricing is determined by the allowed group size, so never
    // reject a valid Kultur booking just because an older preview sends a
    // missing or differently named tier value.
    let tier = body.tier?.trim() || null;
    const paymentMode = body.paymentMode === "deposit" ? "deposit" : "request";
    if (tour === "kultur") {
      if (persons >= 2 && persons <= 4) tier = "comfort";
      else if (persons >= 5 && persons <= 20) tier = "economy";
    }
    const notes = body.notes?.trim() || null;

    if (name.length < 2 || name.length > 200) return json({ error: "Ungültiger Name." }, 400, origin);
    if (email.length < 3 || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Ungültige E-Mail-Adresse." }, 400, origin);
    }
    if (phone.length < 3 || phone.length > 50) return json({ error: "Ungültige Telefonnummer." }, 400, origin);
    if (!Number.isInteger(persons) || persons < 1 || persons > 20) {
      return json({ error: "Ungültige Personenanzahl." }, 400, origin);
    }
    if (!isDate(travelDate)) return json({ error: "Ungültiges Reisedatum." }, 400, origin);

    const tours: Record<string, { label: string; price: number; hasTiers: boolean }> = {
      kultur: { label: "Kultur Tour", price: 0, hasTiers: true },
      trekking: { label: "Intensiv-Trekking", price: 1200, hasTiers: false },
    };

    const selected = tours[tour];
    if (!selected) return json({ error: "Ungültige Reise." }, 400, origin);

    let price = selected.price;
    if (selected.hasTiers) {
      if (tier !== "economy" && tier !== "comfort") {
        return json({ error: "Bitte wähle eine Reiseoption." }, 400, origin);
      }

      if (tour === "kultur") {
        if (tier === "economy") {
          if (persons < 5 || persons > 20) {
            return json({ error: "Ab 5 Personen ist die Reise mit Minibus buchbar." }, 400, origin);
          }
          price = 1300;
        } else {
          if (persons < 2 || persons > 4) {
            return json({ error: "Für 2 bis 4 Personen ist die Reise mit Jeep buchbar." }, 400, origin);
          }
          price = persons === 2 ? 2700 : 1700;
        }
      }
    } else if (tour === "trekking") {
      // The database stores the booking option as a required text field.
      // Trekking has no tier, so "standard" is used consistently.
      if (tier !== "standard") {
        return json({ error: "Ungültige Reiseoption." }, 400, origin);
      }
      price = 1200;
    }

    const totalPrice = persons * price;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Serverkonfiguration fehlt." }, 500, origin);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    if (selected.hasTiers) {
      const { data: availability, error: availabilityError } = await admin.rpc(
        "get_tour_date_availability",
      );

      if (availabilityError) throw availabilityError;

      const selectedDate = (availability ?? []).find(
        (item: { tour: string; start_date: string }) =>
          item.tour === "Kultur Tour" && item.start_date === travelDate,
      );

      if (!selectedDate) {
        return json({ error: "Dieser Reisetermin ist nicht mehr verfügbar." }, 409, origin);
      }

      const availablePlaces = Number(selectedDate.available_places);

      if (availablePlaces <= 0 || persons > availablePlaces) {
        return json({
          error: availablePlaces > 0
            ? `Für diese Reisevariante sind aktuell nur noch ${availablePlaces} Plätze verfügbar.`
            : "Diese Reisevariante ist für den gewählten Termin bereits ausgebucht.",
        }, 409, origin);
      }
    }

    const { data: insertedBooking, error } = await admin.from("bookings").insert({
      name,
      email,
      phone,
      persons,
      travel_date: travelDate,
      tour: selected.label,
      tier,
      notes: notes && notes.length <= 1000 ? notes : null,
      total_price: totalPrice,
      status: "pending",
      payment_status: "unpaid",
      deposit_amount: 0,
      remaining_amount: totalPrice,
    }).select("id").single();

    if (error) {
      console.error("Booking insert failed:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      const diagnostic =
        error.code === "42703" || error.code === "42P01"
          ? "BOOKING_DATABASE_SCHEMA"
          : error.code === "23514"
            ? "BOOKING_DATABASE_CONSTRAINT"
            : error.code === "23502"
              ? "BOOKING_DATABASE_REQUIRED_FIELD"
              : "BOOKING_DATABASE_INSERT";

      return json({
        error: "Buchungsanfrage konnte nicht gespeichert werden.",
        diagnostic,
      }, 500, origin);
    }

    const emailTasks = Promise.all([sendEmail(
      NOTIFY_EMAIL,
      `Neue Buchungsanfrage: ${selected.label} (${name})`,
      `<h2>Neue Buchungsanfrage</h2>
       <table cellpadding="6" style="border-collapse:collapse">
         <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
         <tr><td><b>E-Mail</b></td><td>${escapeHtml(email)}</td></tr>
         <tr><td><b>Telefon</b></td><td>${escapeHtml(phone)}</td></tr>
         <tr><td><b>Reise</b></td><td>${escapeHtml(selected.label)}</td></tr>
         <tr><td><b>Option</b></td><td>${escapeHtml(tier ?? "-")}</td></tr>
         <tr><td><b>Reisedatum</b></td><td>${escapeHtml(travelDate)}</td></tr>
         <tr><td><b>Personen</b></td><td>${persons}</td></tr>
         <tr><td><b>Gesamtpreis</b></td><td>${totalPrice} &euro;</td></tr>
         <tr><td><b>Anmerkungen</b></td><td>${escapeHtml(notes ?? "-")}</td></tr>
       </table>
       <p>Details im Admin-Bereich: <a href="https://kereztour.com/admin">kereztour.com/admin</a></p>`,
    ),
    sendEmail(
      email,
      `Deine Buchungsanfrage bei Kereztour`,
      `<h2>Vielen Dank für deine Buchungsanfrage!</h2>
       <p>Hallo ${escapeHtml(name)},</p>
       <p>vielen Dank für deine Buchungsanfrage bei Kereztour. Wir haben deine Anfrage erhalten und prüfen jetzt den gewünschten Termin. Sarina meldet sich zur Bestätigung bei dir.</p>
       <table cellpadding="6" style="border-collapse:collapse">
         <tr><td><b>Reise</b></td><td>${escapeHtml(selected.label)}</td></tr>
         <tr><td><b>Reisedatum</b></td><td>${escapeHtml(travelDate)}</td></tr>
         <tr><td><b>Reisevariante</b></td><td>${escapeHtml(tier ?? "-")}</td></tr>
         <tr><td><b>Personen</b></td><td>${persons}</td></tr>
         <tr><td><b>Gesamtpreis</b></td><td>${totalPrice} &euro;</td></tr>
       </table>
       <p>Wenn du verbindlich buchen möchtest, kannst du die <b>150 € Anzahlung</b> online per Stripe bezahlen. Der Restbetrag wird vor Ort in Kirgistan bar bezahlt.</p>
       <p>Liebe Grüße<br><b>Sarina &amp; Kereztour</b></p>`,
    )]);

    // Send emails in the background so the customer gets an instant response.
    // deno-lint-ignore no-explicit-any
    const runtime = (globalThis as any).EdgeRuntime;
    if (runtime?.waitUntil) runtime.waitUntil(emailTasks);
    else await emailTasks;

    return json({ success: true, bookingId: insertedBooking?.id ?? null, paymentMode }, 200, origin);
  } catch (error) {
    console.error("create-booking error:", error);
    return json({ error: "Buchungsanfrage konnte nicht gespeichert werden." }, 500, origin);
  }
});

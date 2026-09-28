import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://kereztour.com",
  "https://www.kereztour.com",
]);

const isAllowedOrigin = (origin: string | null) =>
  !!origin && (allowedOrigins.has(origin) ||
    /^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin) ||
    /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin));

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": isAllowedOrigin(origin)
    ? origin!
    : "https://kereztour.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
});

type BookingRequest = {
  name?: string;
  email?: string;
  phone?: string;
  persons?: number;
  travelDate?: string;
  tour?: string;
  tier?: string | null;
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
    const tier = body.tier?.trim() || null;
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
          if (persons < 6 || persons > 8) {
            return json({ error: "Die Standardreise ist für 6 bis 8 Personen buchbar." }, 400, origin);
          }
          price = 1300;
        } else {
          if (persons !== 2 && persons !== 4) {
            return json({ error: "Das VIP-Paket ist für 2 oder 4 Personen buchbar." }, 400, origin);
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

      const availablePlaces =
        tier === "economy"
          ? Number(selectedDate.economy_available_places ?? selectedDate.available_places)
          : Number(selectedDate.comfort_available_places ?? selectedDate.available_places);

      if (availablePlaces <= 0 || persons > availablePlaces) {
        return json({
          error: availablePlaces > 0
            ? `Für diese Reisevariante sind aktuell nur noch ${availablePlaces} Plätze verfügbar.`
            : "Diese Reisevariante ist für den gewählten Termin bereits ausgebucht.",
        }, 409, origin);
      }
    }

    const { error } = await admin.from("bookings").insert({
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
    });

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

    await sendEmail(
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
    );

    await sendEmail(
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
       <p>Die Zahlung erfolgt erst, nachdem Sarina deinen Reisetermin bestätigt hat.</p>
       <p>Liebe Grüße<br><b>Sarina &amp; Kereztour</b></p>`,
    );

    return json({ success: true }, 200, origin);
  } catch (error) {
    console.error("create-booking error:", error);
    return json({ error: "Buchungsanfrage konnte nicht gespeichert werden." }, 500, origin);
  }
});

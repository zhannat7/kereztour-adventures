import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://kereztour.com",
  "https://www.kereztour.com",
]);

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin)
    ? origin
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

const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") ?? "sarinasadirovna@gmail.com";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

async function sendNotificationEmail(subject: string, html: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured – skipping notification email.");
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
        to: [NOTIFY_EMAIL],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`Resend error [${res.status}]: ${await res.text()}`);
    }
  } catch (error) {
    console.error("Notification email failed:", error);
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
      kyrchyn: { label: "Kyrchyn Tour", price: 1300, hasTiers: false },
    };

    const selected = tours[tour];
    if (!selected) return json({ error: "Ungültige Reise." }, 400, origin);

    let price = selected.price;
    if (selected.hasTiers) {
      if (tier !== "economy" && tier !== "comfort") {
        return json({ error: "Bitte wähle eine Reiseoption." }, 400, origin);
      }
      price = tier === "economy" ? 990 : 1490;
    } else if (tier !== "standard") {
      return json({ error: "Ungültige Reiseoption." }, 400, origin);
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
      if (selectedDate.status === "full" || persons > availablePlaces) {
        return json({
          error: availablePlaces > 0
            ? `Für diesen Termin sind aktuell nur noch ${availablePlaces} Plätze verfügbar.`
            : "Dieser Reisetermin ist bereits ausgebucht.",
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

    if (error) throw error;

    await sendNotificationEmail(
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

    return json({ success: true }, 200, origin);
  } catch (error) {
    console.error("create-booking error:", error);
    return json({ error: "Buchungsanfrage konnte nicht gespeichert werden." }, 500, origin);
  }
});

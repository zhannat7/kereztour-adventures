import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://kereztour.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isDate = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
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

    if (name.length < 2 || name.length > 200) return json({ error: "Ungültiger Name." }, 400);
    if (email.length < 3 || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Ungültige E-Mail-Adresse." }, 400);
    }
    if (phone.length < 3 || phone.length > 50) return json({ error: "Ungültige Telefonnummer." }, 400);
    if (!Number.isInteger(persons) || persons < 1 || persons > 20) {
      return json({ error: "Ungültige Personenanzahl." }, 400);
    }
    if (!isDate(travelDate)) return json({ error: "Ungültiges Reisedatum." }, 400);

    const tours: Record<string, { label: string; price: number; hasTiers: boolean }> = {
      kultur: { label: "Kultur Tour", price: 0, hasTiers: true },
      trekking: { label: "Intensiv-Trekking", price: 1200, hasTiers: false },
      kyrchyn: { label: "Kyrchyn Tour", price: 1300, hasTiers: false },
    };

    const selected = tours[tour];
    if (!selected) return json({ error: "Ungültige Reise." }, 400);

    let price = selected.price;
    if (selected.hasTiers) {
      if (tier !== "economy" && tier !== "comfort") {
        return json({ error: "Bitte wähle eine Reiseoption." }, 400);
      }
      price = tier === "economy" ? 990 : 1490;
    } else if (tier !== "standard") {
      return json({ error: "Ungültige Reiseoption." }, 400);
    }

    const totalPrice = persons * price;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Serverkonfiguration fehlt." }, 500);
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
        return json({ error: "Dieser Reisetermin ist nicht mehr verfügbar." }, 409);
      }

      const availablePlaces = Number(selectedDate.available_places);
      if (selectedDate.status === "full" || persons > availablePlaces) {
        return json({
          error: availablePlaces > 0
            ? `Für diesen Termin sind aktuell nur noch ${availablePlaces} Plätze verfügbar.`
            : "Dieser Reisetermin ist bereits ausgebucht.",
        }, 409);
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

    return json({ success: true });
  } catch (error) {
    console.error("create-booking error:", error);
    return json({ error: "Buchungsanfrage konnte nicht gesendet werden." }, 500);
  }
});

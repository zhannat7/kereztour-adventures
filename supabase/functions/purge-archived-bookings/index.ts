import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-purge-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  const purgeSecret = Deno.env.get("PURGE_SECRET");
  if (!purgeSecret || req.headers.get("x-purge-secret") !== purgeSecret) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    return new Response("Server configuration missing", { status: 500, headers: corsHeaders });
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  const { data: expired, error } = await supabase
    .from("bookings")
    .select("id, name, purge_after")
    .not("archived_at", "is", null)
    .lte("purge_after", new Date().toISOString())
    .limit(100);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const deleted: string[] = [];
  const failures: { bookingId: string; reason: string }[] = [];

  for (const booking of expired ?? []) {
    // Remove files through Storage API first. If removal fails, preserve the booking.
    const { data: files, error: listError } = await supabase.storage.from("booking-documents").list(booking.id, { limit: 1000 });
    if (listError) {
      failures.push({ bookingId: booking.id, reason: "Could not list booking documents: " + listError.message });
      continue;
    }

    const paths = (files ?? []).filter((file) => file.id != null).map((file) => booking.id + "/" + file.name);
    if (paths.length) {
      const { error: removeError } = await supabase.storage.from("booking-documents").remove(paths);
      if (removeError) {
        failures.push({ bookingId: booking.id, reason: "Could not remove documents: " + removeError.message });
        continue;
      }
    }

    const { error: deleteError } = await supabase.from("bookings").delete().eq("id", booking.id).not("archived_at", "is", null).lte("purge_after", new Date().toISOString());
    if (deleteError) {
      failures.push({ bookingId: booking.id, reason: "Could not delete archived booking: " + deleteError.message });
      continue;
    }
    deleted.push(booking.id);
  }

  return new Response(JSON.stringify({ deletedCount: deleted.length, deletedBookingIds: deleted, failures }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

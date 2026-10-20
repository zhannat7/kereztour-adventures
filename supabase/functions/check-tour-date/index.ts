import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const Body = z.object({
  tour: z.enum(["Kultur Tour", "Intensiv-Trekking"]),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  existing: z.array(z.object({ start_date: z.string(), end_date: z.string() })).max(50).default([]),
});

const EXPECTED_DAYS: Record<string, number> = { "Kultur Tour": 10, "Intensiv-Trekking": 11 };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["status", "summary", "issues", "suggested_end_date"],
  properties: {
    status: { type: "string", enum: ["ok", "warning", "error"] },
    summary: { type: "string" },
    issues: { type: "array", items: { type: "string" } },
    suggested_end_date: { type: ["string", "null"] },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: claims } = await sb.auth.getClaims(auth.replace("Bearer ", ""));
    const uid = claims?.claims?.sub;
    if (!uid) return json({ error: "Nicht angemeldet." }, 401);
    const { data: isAdmin } = await sb.rpc("has_role", { _user_id: uid, _role: "admin" });
    if (!isAdmin) return json({ error: "Keine Berechtigung." }, 403);

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Ungültige Eingabe." }, 400);
    const { tour, start_date, end_date, existing } = parsed.data;

    const start = new Date(`${start_date}T12:00:00Z`);
    const end = new Date(`${end_date}T12:00:00Z`);
    const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    const expected = EXPECTED_DAYS[tour];
    const weekday = (d: Date) => d.toLocaleDateString("de-DE", { weekday: "long", timeZone: "UTC" });

    const facts = {
      tour, start_date, end_date,
      start_weekday: weekday(start), end_weekday: weekday(end),
      days_inclusive: days, expected_days: expected,
      expected_end_date: new Date(start.getTime() + (expected - 1) * 86400000).toISOString().slice(0, 10),
      today: new Date().toISOString().slice(0, 10),
      other_dates_same_tour: existing,
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": Deno.env.get("LOVABLE_API_KEY")!,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        instructions:
          "Du prüfst Reisetermine eines Reiseveranstalters in Kirgisistan. Kultur Tour dauert 10 Tage, Intensiv-Trekking 11 Tage (inklusive An- und Abreisetag). Erkenne ungewöhnliche Abweichungen: falsche Dauer, Ende vor Beginn, Datum in der Vergangenheit, Tippfehler im Jahr, Überschneidungen mit anderen Terminen derselben Reise, Trekking außerhalb der Saison (ca. Juni bis September, Mai/Oktober grenzwertig wegen Schnee auf Pässen), Kultur Tour im Winter (Nov–März). Antworte auf Deutsch, kurz und verständlich für Nicht-Techniker. issues: konkrete Hinweise mit Korrekturvorschlag. suggested_end_date: korrektes Enddatum (YYYY-MM-DD) nur wenn die Dauer falsch ist, sonst null. status ok wenn alles passt.",
        input: [{ role: "user", content: JSON.stringify(facts) }],
        text: { format: { type: "json_schema", name: "date_check", strict: true, schema } },
      }),
    });

    if (!res.ok) {
      const msg = res.status === 402 ? "KI-Guthaben aufgebraucht." : res.status === 429 ? "Zu viele Anfragen, bitte kurz warten." : "KI-Prüfung fehlgeschlagen.";
      console.error("gateway", res.status, await res.text());
      return json({ error: msg }, res.status);
    }

    // Consume SSE stream
    const reader = res.body!.getReader();
    const dec = new TextDecoder();
    let buf = "", text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "response.output_text.delta") text += ev.delta;
        } catch { /* ignore */ }
      }
    }
    if (!text) return json({ error: "Keine Antwort von der KI." }, 502);
    return json({ ...JSON.parse(text), days_inclusive: days, expected_days: expected });
  } catch (e) {
    console.error(e);
    return json({ error: "Interner Fehler." }, 500);
  }
});

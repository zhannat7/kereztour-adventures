import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_PRICES, fetchTourPrices, setTourPricesCache, type TourPrices } from "@/lib/tourPrices";

const FIELDS: { key: keyof TourPrices; label: string; hint: string }[] = [
  { key: "kultur_2", label: "Kultur Tour · 2 Personen (Jeep)", hint: "Preis pro Person" },
  { key: "kultur_3_4", label: "Kultur Tour · 3–4 Personen (Jeep)", hint: "Preis pro Person" },
  { key: "kultur_5plus", label: "Kultur Tour · ab 5 Personen (Minibus)", hint: "Preis pro Person" },
  { key: "trekking", label: "Intensiv-Trekking", hint: "Preis pro Person" },
  { key: "trekking_original", label: "Intensiv-Trekking · durchgestrichener Preis", hint: "Wird als „statt“-Preis angezeigt" },
];

const TourPricesEditor = () => {
  const [values, setValues] = useState<Record<keyof TourPrices, string>>(
    Object.fromEntries(Object.entries(DEFAULT_PRICES).map(([k, v]) => [k, String(v)])) as any
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchTourPrices(true).then((p) =>
      setValues(Object.fromEntries(Object.entries(p).map(([k, v]) => [k, String(v)])) as any)
    );
  }, []);

  const save = async () => {
    const rows = FIELDS.map((f) => ({ price_key: f.key, amount: Number(values[f.key]), updated_at: new Date().toISOString() }));
    if (rows.some((r) => !Number.isInteger(r.amount) || r.amount <= 0 || r.amount > 100000)) {
      return toast.error("Bitte nur ganze Beträge zwischen 1 und 100.000 € eingeben.");
    }
    setBusy(true);
    const { error } = await (supabase as any).from("tour_prices").upsert(rows, { onConflict: "price_key" });
    if (error) { setBusy(false); return toast.error("Speichern fehlgeschlagen: " + error.message); }
    const fresh = await fetchTourPrices(true);
    setTourPricesCache(fresh);
    setValues(Object.fromEntries(Object.entries(fresh).map(([k, v]) => [k, String(v)])) as any);
    setBusy(false);
    toast.success("Preise gespeichert – sie gelten sofort für neue Buchungen.");
  };

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div>
        <h2 className="text-lg font-semibold">Tourpreise</h2>
        <p className="mt-1 text-sm text-muted-foreground">Änderungen erscheinen sofort auf der Website und im Buchungsformular. Bestehende Buchungen behalten ihren Preis.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="block rounded-lg border border-border p-3">
            <span className="block text-sm font-semibold">{f.label}</span>
            <span className="block text-xs text-muted-foreground">{f.hint}</span>
            <div className="mt-2 flex items-center gap-2">
              <input type="number" min={1} step={1} value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm" />
              <span className="text-sm">€</span>
            </div>
          </label>
        ))}
      </div>
      <button onClick={save} disabled={busy} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
        {busy ? "Wird gespeichert..." : "Preise speichern"}
      </button>
    </section>
  );
};

export default TourPricesEditor;

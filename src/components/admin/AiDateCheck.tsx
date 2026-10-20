import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";

type Result = {
  status: "ok" | "warning" | "error";
  summary: string;
  issues: string[];
  suggested_end_date: string | null;
  days_inclusive: number;
  expected_days: number;
};

type Props = {
  tour: string;
  startDate: string;
  endDate: string;
  existing: { tour: string; start_date: string; end_date: string; id?: string }[];
  excludeId?: string;
  onApplyEnd: (end: string) => void;
};

const tone: Record<Result["status"], string> = {
  ok: "border-primary/30 bg-primary/5 text-foreground",
  warning: "border-accent/50 bg-accent/10 text-foreground",
  error: "border-destructive/40 bg-destructive/10 text-foreground",
};
const label: Record<Result["status"], string> = { ok: "Alles plausibel", warning: "Bitte prüfen", error: "Wahrscheinlich fehlerhaft" };

const AiDateCheck = ({ tour, startDate, endDate, existing, excludeId, onApplyEnd }: Props) => {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!startDate || !endDate) return setError("Bitte zuerst Beginn und Ende eingeben.");
    setBusy(true); setError(null); setResult(null);
    const { data, error } = await supabase.functions.invoke("check-tour-date", {
      body: {
        tour, start_date: startDate, end_date: endDate,
        existing: existing.filter((d) => d.tour === tour && d.id !== excludeId).map(({ start_date, end_date }) => ({ start_date, end_date })),
      },
    });
    setBusy(false);
    if (error || data?.error) {
      let msg = data?.error;
      try { msg = msg ?? (await (error as any)?.context?.json())?.error; } catch { /* ignore */ }
      return setError(msg ?? "Prüfung fehlgeschlagen.");
    }
    setResult(data as Result);
  };

  return (
    <div className="space-y-2">
      <button type="button" onClick={run} disabled={busy} className="inline-flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary disabled:opacity-60">
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        {busy ? "Prüfe…" : "Mit KI prüfen"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {result && (
        <div className={`rounded-md border p-3 text-xs ${tone[result.status]}`}>
          <p className="font-semibold">{label[result.status]} · {result.days_inclusive} Tage (erwartet {result.expected_days})</p>
          <p className="mt-1">{result.summary}</p>
          {result.issues.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-4">{result.issues.map((i, k) => <li key={k}>{i}</li>)}</ul>}
          {result.suggested_end_date && result.suggested_end_date !== endDate && (
            <button type="button" onClick={() => { onApplyEnd(result.suggested_end_date!); setResult(null); }} className="mt-2 rounded-sm bg-primary px-3 py-1 font-semibold text-primary-foreground">
              Enddatum auf {new Date(`${result.suggested_end_date}T12:00:00`).toLocaleDateString("de-DE")} ändern
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AiDateCheck;

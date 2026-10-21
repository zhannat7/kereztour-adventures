type Props = {
  tour: string;
  startDate: string;
  endDate: string;
  existing?: unknown;
  excludeId?: string;
  onApplyEnd?: (end: string) => void;
};

const expectedDays = (tour: string) => (tour === "trekking" ? 11 : 10);

export default function AiDateCheck({ tour, startDate, endDate, onApplyEnd }: Props) {
  if (!startDate || !endDate) return null;
  const s = new Date(startDate + "T00:00:00Z");
  const e = new Date(endDate + "T00:00:00Z");
  const days = Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
  const exp = expectedDays(tour);
  if (days < 1) return <p className="text-xs font-semibold text-destructive">Ende liegt vor Beginn</p>;
  if (days === exp) return <p className="text-xs font-semibold text-primary">{days} Tage ✓</p>;
  const fixed = new Date(s.getTime() + (exp - 1) * 86400000).toISOString().slice(0, 10);
  return (
    <p className="flex items-center gap-2 text-xs font-semibold text-destructive">
      {days} Tage (erwartet {exp})
      {onApplyEnd && (
        <button type="button" onClick={() => onApplyEnd(fixed)} className="rounded-sm border border-border px-2 py-0.5 text-foreground">
          Auf {exp} Tage setzen
        </button>
      )}
    </p>
  );
}

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { de, enGB, it } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const toDisplay = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
};

const parseIso = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : undefined;
};

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Masks digits into TT.MM.JJJJ (max 8 digits → year is exactly 4 digits). */
const mask = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  let out = digits.slice(0, 2);
  if (digits.length > 2) out += "." + digits.slice(2, 4);
  if (digits.length > 4) out += "." + digits.slice(4, 8);
  return out;
};

const displayToIso = (display: string) => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(display);
  if (!m) return "";
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  if (d.getFullYear() !== +m[3] || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[1]) return "";
  return toIso(d);
};

interface Props {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  min?: string;
  lang?: string;
  invalid?: boolean;
}

export function DateField({ id, value, onChange, min, lang = "de", invalid }: Props) {
  const [text, setText] = useState(toDisplay(value));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value !== "invalid" && displayToIso(text) !== value) setText(toDisplay(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const minDate = min ? parseIso(min) : undefined;
  const maxYear = new Date().getFullYear() + 10;
  const locale = lang === "it" ? it : lang === "en" ? enGB : de;

  return (
    <div
      className={cn(
        "flex h-10 w-full items-center rounded-md border border-input bg-background pl-3 pr-1 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm",
        invalid && "border-destructive",
      )}
    >
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        placeholder={lang === "en" ? "DD.MM.YYYY" : lang === "it" ? "GG.MM.AAAA" : "TT.MM.JJJJ"}
        maxLength={10}
        value={text}
        onChange={(e) => {
          const next = mask(e.target.value);
          setText(next);
          const iso = displayToIso(next);
          const year = iso ? +iso.slice(0, 4) : 0;
          onChange(iso && year <= maxYear ? iso : next.length === 10 ? "invalid" : "");
        }}
        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Kalender öffnen"
            className="rounded p-2 text-muted-foreground hover:text-foreground"
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            locale={locale}
            weekStartsOn={1}
            selected={parseIso(value)}
            defaultMonth={parseIso(value) ?? minDate}
            fromDate={minDate}
            toYear={maxYear}
            disabled={minDate ? { before: minDate } : undefined}
            onSelect={(d) => {
              if (!d) return;
              const iso = toIso(d);
              setText(toDisplay(iso));
              onChange(iso);
              setOpen(false);
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

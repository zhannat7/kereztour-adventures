import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** Small "?" icon; tap or click shows a short explanation (works on touch devices). */
export const HelpTip = ({ text }: { text: string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button type="button" aria-label="Erklärung anzeigen" className="ml-1 inline-flex align-middle text-muted-foreground hover:text-primary">
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-64 text-xs font-normal normal-case leading-5 tracking-normal">{text}</PopoverContent>
  </Popover>
);

const sections: { title: string; items: [string, string][] }[] = [
  { title: "Ablauf einer Buchung", items: [
    ["1. Neue Anfrage", "Ein Gast hat das Formular ausgefüllt. Die Plätze sind noch nicht fest vergeben."],
    ["2. Anfrage prüfen", "Gast kontaktieren, Details klären und den Zahlungslink schicken."],
    ["3. Anzahlung bezahlt", "Die 150 € Anzahlung ist eingegangen – als bezahlt markieren."],
    ["4. Bestätigen", "Erst jetzt ist der Platz fest reserviert und wird von den freien Plätzen abgezogen."],
  ]},
  { title: "Status einer Buchung", items: [
    ["Offen", "Anfrage ist neu und noch nicht bestätigt."],
    ["Bestätigt", "Plätze sind fest für den Gast reserviert."],
    ["Storniert", "Gast fährt nicht mit. Die Plätze werden auf der Website wieder frei."],
  ]},
  { title: "Status eines Reisetermins", items: [
    ["Offen", "Auf der Website sichtbar und buchbar."],
    ["Ausgebucht", "Auf der Website als voll angezeigt, keine neuen Buchungen."],
    ["Abgesagt", "Auf der Website ausgeblendet. Termin und Buchungen bleiben hier gespeichert, damit Sie Gäste informieren können."],
  ]},
  { title: "Fahrzeuge (Kultur Tour)", items: [
    ["Jeep", "Für kleine Gruppen von 1 bis 4 Personen."],
    ["Minibus", "Für Gruppen ab 5 Personen bis zur eingestellten Höchstzahl."],
  ]},
  { title: "Termine ändern oder löschen", items: [
    ["Bearbeiten", "Datum ändern, z. B. bei einem Tippfehler. Gebuchte Gäste wandern automatisch mit."],
    ["Löschen", "Termin ist endgültig weg. Nur nutzen, wenn niemand gebucht hat – sonst lieber „Abgesagt“."],
    ["Tage-Anzeige", "Zeigt die Dauer. Grün = stimmt (Kultur 10, Trekking 11 Tage), Rot = bitte prüfen."],
  ]},
];

/** Button that opens a short guide/glossary for the admin dashboard. */
export const AdminHelpGuide = () => (
  <Sheet>
    <SheetTrigger asChild>
      <button type="button" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-primary hover:bg-muted/40">
        <HelpCircle className="h-4 w-4" /> Hilfe & Erklärungen
      </button>
    </SheetTrigger>
    <SheetContent className="w-full overflow-y-auto sm:max-w-md">
      <SheetHeader><SheetTitle className="font-display text-2xl text-primary">Hilfe & Erklärungen</SheetTitle></SheetHeader>
      <div className="mt-5 space-y-6">
        {sections.map((s) => (
          <section key={s.title}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{s.title}</h3>
            <dl className="space-y-2">
              {s.items.map(([term, desc]) => (
                <div key={term} className="rounded-md border border-border bg-muted/20 p-3">
                  <dt className="text-sm font-semibold text-foreground">{term}</dt>
                  <dd className="mt-0.5 text-sm leading-5 text-muted-foreground">{desc}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </SheetContent>
  </Sheet>
);

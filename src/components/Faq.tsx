import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Wie läuft die Buchung ab?",
    a: "Du sendest eine unverbindliche Anfrage mit deinem Wunschtermin. Ich melde mich innerhalb von 24 Stunden mit Verfügbarkeit und einem konkreten Vorschlag. Erst wenn alles passt, wird gebucht.",
  },
  {
    q: "Was ist im Preis enthalten?",
    a: "Alle Übernachtungen, Transfers im Land, Verpflegung nach Programm, Eintritte und die deutschsprachige Reiseleitung. Nicht enthalten sind der internationale Flug und persönliche Ausgaben.",
  },
  {
    q: "Brauche ich ein Visum?",
    a: "Für EU-Bürger, Schweizer und viele weitere Nationalitäten ist die Einreise nach Kirgisistan bis 60 Tage visumfrei. Du brauchst nur einen Reisepass, der noch mindestens sechs Monate gültig ist.",
  },
  {
    q: "Wie fit muss ich sein?",
    a: "Die Kultur Tour und die Nomadenspiele sind ohne besondere Kondition machbar. Für das Intensiv-Trekking solltest du mehrtägige Bergwanderungen und Höhen bis 3.900 m gewohnt sein.",
  },
  {
    q: "Wie sind die Unterkünfte?",
    a: "Eine Mischung aus geprüften Hotels in den Städten und Jurten oder Gästehäusern auf dem Land. Bei der Kultur Tour kannst du zwischen Economy und Comfort wählen.",
  },
  {
    q: "Kann ich als Einzelperson mitreisen?",
    a: "Ja, das ist der Normalfall. Du reist in einer kleinen Gruppe mit, teilst dir auf Wunsch ein Zimmer oder buchst gegen Aufpreis ein Einzelzimmer.",
  },
];

const Faq = () => {
  const ref = useScrollReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-24 bg-sand/60">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-5xl">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow mb-4 block">Häufige Fragen</span>
          <h2 className="font-display text-3xl md:text-[2.75rem] leading-tight text-foreground">
            Alles, was du vor der <span className="italic text-primary">Anfrage wissen willst</span>
          </h2>
        </div>

        <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-soft">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="font-display text-lg text-foreground">{f.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 -mt-1 text-sm leading-relaxed text-muted-foreground max-w-3xl">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;

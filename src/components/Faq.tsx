import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <section id="faq" className="border-y border-border bg-sand/50 py-12 md:py-16">
      <div ref={ref} className="section-reveal container mx-auto px-4 sm:px-6 max-w-[1400px]">
        <div className="max-w-2xl mb-8 md:mb-10">
          <span className="eyebrow mb-4 block">{t("Häufige Fragen")}</span>
          <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
            {t("Alles, was du vor der ")}<span className="italic text-primary">{t("Anfrage wissen willst")}</span>
          </h2>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={t(f.q)}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-1 py-4 sm:gap-6 sm:py-5 text-left transition-colors hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset sm:px-4"
                >
                  <span className="font-display text-base leading-snug text-foreground sm:text-lg">{t(f.q)}</span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/20 text-primary transition-colors">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="-mt-1 max-w-3xl px-1 pb-6 text-sm leading-relaxed text-muted-foreground sm:px-4 sm:text-base">
                    {t(f.a)}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-7 text-sm leading-relaxed text-muted-foreground sm:mt-8 sm:text-base">
          {t("Noch Fragen?")}{" "}
          <a
            href="/buchen"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {t("Stelle eine unverbindliche Anfrage")}
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default Faq;

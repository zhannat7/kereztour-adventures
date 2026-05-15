import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Maria S.",
    country: "Deutschland",
    rating: 5,
    text: "Eine unvergessliche Reise! Die Adlerjagd und die Jurtenübernachtung am Issyk-Kul waren absolute Highlights. Zarina hat alles perfekt organisiert – wir haben uns von Anfang an in besten Händen gefühlt.",
    tour: "Kultur Tour",
    initial: "M",
  },
  {
    name: "Marco R.",
    country: "Italien",
    rating: 5,
    text: "Der Ala-Köl Pass war körperlich fordernd aber die Aussicht auf die 5.000er Gipfel des Tienschan war schlicht atemberaubend. Professionelle Begleitung, authentische Erlebnisse – absolute Empfehlung!",
    tour: "Intensiv-Trekking",
    initial: "M",
  },
  {
    name: "Hans & Petra M.",
    country: "Österreich",
    rating: 5,
    text: "Kirgisistan hat uns völlig überrascht – die Herzlichkeit der Menschen, die unberührte Natur, das köstliche Essen. Wir kommen definitiv wieder! Danke KérezTour für diese wunderschöne Erfahrung.",
    tour: "Kultur Tour",
    initial: "H",
  },
];

const Testimonials = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-14 md:py-20 bg-muted/40">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-3 block">
            Gästestimmen
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Was unsere Reisenden <span className="italic text-primary">erleben</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Echte Erfahrungen von echten Menschen – das ist unser bestes Zeugnis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="stagger-child rounded-2xl bg-card border border-border p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <Quote className="h-8 w-8 text-primary/20" />
              <div className="flex gap-1">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                „{r.text}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  {r.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.country} · {r.tour}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-card border border-border px-6 py-3 shadow-sm">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="text-sm font-bold text-foreground">5.0 / 5.0</span>
            <span className="text-xs text-muted-foreground">· Alle Bewertungen verifiziert</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

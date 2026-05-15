import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Star } from "lucide-react";

import reviewHelmut from "@/assets/333.PNG";
import reviewHubert from "@/assets/666.PNG";

const reviews = [
  {
    name: "Helmut & Hannelore",
    country: "Deutschland",
    rating: 5,
    text: "Der Alltag hat zwar wieder begonnen, aber ich denke noch oft an die beinahe unendliche Weite von Kirgistan, an Pferde und Jurten, vor allem aber an die freundlichen Menschen. Du hast die Reise perfekt geplant und organisiert – danke!",
    tour: "Kultur Tour",
    initial: "H",
    screenshot: reviewHelmut,
  },
  {
    name: "Hubert",
    country: "Deutschland",
    rating: 5,
    text: "Es war sehr schön und beeindruckend Deine Heimat kennen zu lernen. Unsere Bekannten waren sehr begeistert. Eure Gastfreundschaft ist großartig und tut gut unserem Herzen. Nochmals vielen Dank!",
    tour: "Kultur Tour",
    initial: "H",
    screenshot: reviewHubert,
  },
  {
    name: "Maria S.",
    country: "Österreich",
    rating: 5,
    text: "Kirgisistan hat uns völlig überrascht – die Herzlichkeit der Menschen, die unberührte Natur, das köstliche Essen. Wir kommen definitiv wieder!",
    tour: "Kultur Tour",
    initial: "M",
    screenshot: null,
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
            Echte Nachrichten von echten Reisenden – das ist unser bestes Zeugnis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="stagger-child rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Screenshot falls vorhanden */}
              {r.screenshot && (
                <div className="border-b border-border">
                  <img
                    src={r.screenshot}
                    alt={`Bewertung von ${r.name}`}
                    className="w-full object-contain max-h-72"
                  />
                </div>
              )}

              {/* Bewertungstext */}
              <div className="p-6 flex flex-col gap-4 flex-1">
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

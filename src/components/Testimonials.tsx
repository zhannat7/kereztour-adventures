import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Star, Quote } from "lucide-react";

import reviewHelmut from "@/assets/333.png";
import reviewHubert from "@/assets/666.png";

const reviews = [
  {
    name: "Helmut & Hannelore",
    country: "Deutschland",
    text: "Der Alltag hat zwar wieder begonnen, aber ich denke noch oft an die beinahe unendliche Weite von Kirgistan, an Pferde und Jurten, vor allem aber an die freundlichen Menschen. Du hast die Reise perfekt geplant und organisiert – danke!",
    tour: "Kultur Tour",
    initial: "H",
    screenshot: reviewHelmut,
  },
  {
    name: "Hubert",
    country: "Deutschland",
    text: "Es war sehr schön und beeindruckend Deine Heimat kennen zu lernen. Unsere Bekannten waren sehr begeistert. Eure Gastfreundschaft ist großartig und tut gut unserem Herzen. Nochmals vielen Dank!",
    tour: "Kultur Tour",
    initial: "H",
    screenshot: reviewHubert,
  },
  {
    name: "Maria S.",
    country: "Österreich",
    text: "Kirgisistan hat uns völlig überrascht – die Herzlichkeit der Menschen, die unberührte Natur, das köstliche Essen. Wir kommen definitiv wieder!",
    tour: "Kultur Tour",
    initial: "M",
    screenshot: null,
  },
];

const Testimonials = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4 block">Gästestimmen</span>
            <h2 className="font-display text-3xl md:text-[2.75rem] leading-tight text-foreground">
              Was unsere Reisenden <span className="italic text-primary">zurückschreiben</span>
            </h2>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 shadow-soft">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">5,0 / 5,0</span>
            <span className="text-xs text-muted-foreground">· verifiziert</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="stagger-child flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 hover:shadow-lift"
            >
              {r.screenshot ? (
                <div className="border-b border-border bg-muted/40">
                  <img
                    src={r.screenshot}
                    alt={`Nachricht von ${r.name}`}
                    loading="lazy"
                    className="w-full max-h-72 object-contain"
                  />
                </div>
              ) : (
                <blockquote className="flex-1 p-7 pb-0">
                  <Quote className="h-6 w-6 text-secondary/40 mb-4" />
                  <p className="font-display text-lg leading-relaxed text-foreground/90">„{r.text}"</p>
                </blockquote>
              )}

              <figcaption className="mt-auto flex items-center gap-3 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-sm text-primary">
                  {r.initial}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{r.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {r.country} · {r.tour}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

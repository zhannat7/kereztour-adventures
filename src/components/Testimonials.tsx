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
    <section className="bg-background py-14 md:py-20">
      <div ref={ref} className="section-reveal container mx-auto px-4 sm:px-6 max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4 block">Gästestimmen</span>
            <h2 className="font-display text-4xl leading-tight text-foreground md:text-6xl">
              Was unsere Reisenden <span className="italic text-primary">zurückschreiben</span>
            </h2>
          </div>
          <div className="inline-flex items-center gap-3 border-y border-border px-1 py-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">5,0 / 5,0</span>
            <span className="text-xs text-muted-foreground">· verifiziert</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="stagger-child flex flex-col overflow-hidden border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
            >
              {r.screenshot ? (
                <div className="flex flex-1 items-center justify-center bg-secondary/10 p-5 sm:p-6">
                  <img
                    src={r.screenshot}
                    alt="WhatsApp-Bewertung"
                    loading="lazy"
                  className="max-h-[320px] w-auto max-w-full rounded-sm object-contain shadow-soft sm:max-h-[380px]"
                  />
                </div>
              ) : (
                <>
                  <blockquote className="flex-1 p-7 pb-0">
                    <Quote className="h-6 w-6 text-secondary/40 mb-4" />
                    <p className="font-display text-lg leading-relaxed text-foreground/90">„{r.text}"</p>
                  </blockquote>

                  <figcaption className="mt-auto flex items-center gap-3 p-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary-soft text-sm font-semibold text-primary">
                      {r.initial}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">{r.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {r.country} · {r.tour}
                      </span>
                    </span>
                  </figcaption>
                </>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

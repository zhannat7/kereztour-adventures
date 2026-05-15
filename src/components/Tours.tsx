import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trophy, Landmark, Mountain, ArrowRight, Clock, Users } from "lucide-react";

const tours = [
  {
    icon: Trophy,
    badge: "Einzigartiges Event",
    title: "Weltspiele der Nomaden 2026",
    desc: "Erlebe das spektakuläre Kulturfest am Issyk-Kul – traditionelle Reiterspiele, Adlerjagd-Wettbewerbe und internationale Atmosphäre. Ein Erlebnis das du nirgendwo sonst findest.",
    duration: "8 Tage",
    groupSize: "bis 12 Pers.",
    price: "1.200",
    to: "/reisen/nomaden",
    color: "bg-amber-50 border-amber-200",
  },
  {
    icon: Landmark,
    badge: "Bestseller",
    title: "Kultur Tour",
    desc: "10 Tage durch Kirgisistans schönste Orte – Adlerjagd, Jurtenaufbau, Thermalquellen und der türkisfarbene Issyk-Kul. Komplett organisiert, voll inklusiv.",
    duration: "10 Tage",
    groupSize: "bis 12 Pers.",
    price: "ab 990",
    to: "/reisen/kultur",
    color: "bg-primary/5 border-primary/20",
  },
  {
    icon: Mountain,
    badge: "Abenteuer",
    title: "Intensiv-Trekking",
    desc: "Für echte Naturfreunde: Song-Köl See, Ala-Köl Pass (3.911 m), heiße Thermalquellen und Übernachtungen in Jurten und Berghütten. Kirgisistan von seiner wildesten Seite.",
    duration: "10 Tage",
    groupSize: "bis 8 Pers.",
    price: "1.200",
    to: "/reisen/trekking",
    color: "bg-green-50 border-green-200",
  },
];

const Tours = () => {
  const ref = useScrollReveal();

  return (
    <section id="reisen" className="py-14 md:py-20 bg-muted/40 relative">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-3 block">
            Unsere Reisen
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Drei Wege <span className="italic text-primary">Kirgisistan zu entdecken</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Ob Kultur, Abenteuer oder einzigartiges Sportevent – wir haben die perfekte Reise für dich.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Link
              key={tour.to}
              to={tour.to}
              className="stagger-child group relative rounded-2xl bg-card border border-border flex flex-col cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 no-underline overflow-hidden"
            >
              {/* Badge */}
              <div className="p-6 pb-0">
                <span className="inline-flex self-start rounded-full bg-secondary/10 text-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4 block w-fit">
                  {tour.badge}
                </span>

                {/* Icon + Title */}
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                    <tour.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl text-foreground leading-snug pt-1">
                    {tour.title}
                  </h3>
                </div>

                {/* Desc */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {tour.desc}
                </p>
              </div>

              {/* Meta info */}
              <div className="px-6 pb-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {tour.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {tour.groupSize}
                </span>
              </div>

              {/* Footer */}
              <div className="mt-auto px-6 py-4 border-t border-border flex items-center justify-between bg-muted/30">
                <div>
                  <p className="text-xs text-muted-foreground">ab</p>
                  <p className="font-display text-2xl text-primary">{tour.price} €</p>
                  <p className="text-xs text-muted-foreground">pro Person</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all duration-300">
                  Entdecken <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tours;

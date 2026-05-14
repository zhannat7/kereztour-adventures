import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trophy, Landmark, Mountain } from "lucide-react";

const tours = [
  {
    icon: Trophy,
    badge: "Einzigartiges Event",
    title: "Weltspiele der Nomaden 2026",
    desc: "Erleben Sie das spektakuläre Kultur- und Sportevent am Issyk-Kul-See – Tradition, Abenteuer und internationale Atmosphäre.",
    price: "1.200",
    to: "/reisen/nomaden",
  },
  {
    icon: Landmark,
    badge: "Bestseller",
    title: "Kultur Tour",
    desc: "10 Tage durch Kirgisistans kulturelle Highlights – von Bischkek bis zum Issyk-Kul, mit authentischen Erlebnissen.",
    price: "ab 990",
    to: "/reisen/kultur",
  },
  {
    icon: Mountain,
    badge: "Abenteuer",
    title: "Intensiv-Trekking",
    desc: "Anspruchsvolle Wanderungen durch unberührte Berglandschaften, Thermalquellen und majestätische Schluchten.",
    price: "1.200",
    to: "/reisen/trekking",
  },
];

const Tours = () => {
  const ref = useScrollReveal();

  return (
    <section id="reisen" className="py-24 md:py-32 bg-muted/40 relative">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
            Entdecke unsere Touren
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground">
            Unsere <span className="italic text-primary">Reisen</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Link
              key={tour.to}
              to={tour.to}
              className="stagger-child group relative rounded-2xl bg-card border border-border p-8 flex flex-col cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 no-underline"
            >
              {/* Badge */}
              <span className="inline-flex self-start rounded-full bg-secondary/10 text-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-5">
                {tour.badge}
              </span>

              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-5 transition-transform duration-300 group-hover:scale-110">
                <tour.icon className="h-7 w-7" />
              </div>

              {/* Title & Desc */}
              <h3 className="font-display text-xl md:text-2xl text-foreground mb-3 leading-snug">
                {tour.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {tour.desc}
              </p>

              {/* Price */}
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Preis</p>
                  <p className="font-display text-2xl text-primary">{tour.price} €</p>
                  <p className="text-xs text-muted-foreground">pro Person</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all duration-300">
                  Mehr erfahren →
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

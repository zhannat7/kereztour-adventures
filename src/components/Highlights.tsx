import { CalendarDays, Mountain, Landmark, UtensilsCrossed } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  { icon: CalendarDays, title: "10 Tage Gruppenreise", desc: "Komplett organisiert und begleitet" },
  { icon: Mountain, title: "Natur & Abenteuer", desc: "Berge, Seen und atemberaubende Landschaften" },
  { icon: Landmark, title: "Kultur & Tradition", desc: "Authentische kirgisische Erlebnisse" },
  { icon: UtensilsCrossed, title: "Verpflegung inklusive", desc: "Traditionelle und moderne Küche" },
];

const Highlights = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div ref={ref} className="section-reveal container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
            Was dich erwartet
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground">
            Reise-<span className="italic text-primary">Highlights</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="stagger-child group relative rounded-2xl bg-card border border-border p-8 hover:border-secondary/40 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform duration-500 group-hover:scale-110">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;

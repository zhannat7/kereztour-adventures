import { CalendarDays, Mountain, Landmark, UtensilsCrossed } from "lucide-react";

const items = [
  { icon: CalendarDays, title: "10 Tage Gruppenreise", desc: "Komplett organisiert und begleitet" },
  { icon: Mountain, title: "Natur & Abenteuer", desc: "Berge, Seen und atemberaubende Landschaften" },
  { icon: Landmark, title: "Kultur & Tradition", desc: "Authentische kirgisische Erlebnisse" },
  { icon: UtensilsCrossed, title: "Verpflegung inklusive", desc: "Traditionelle und moderne Küche" },
];

const Highlights = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-14">
        Reise-Highlights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center text-center rounded-xl border border-border bg-background p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <item.icon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Highlights;

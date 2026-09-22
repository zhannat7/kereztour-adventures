import { Users, ShieldCheck, HandHeart, Sprout } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  {
    icon: Users,
    title: "Kleine Gruppen",
    desc: "Maximal 12 Reisende – für eine angenehme Atmosphäre und persönliche Begegnungen.",
  },
  {
    icon: ShieldCheck,
    title: "Persönlich betreut",
    desc: "Von der ersten Anfrage bis zur Reise haben Sie persönliche Ansprechpartner.",
  },
  {
    icon: HandHeart,
    title: "Echte Begegnungen",
    desc: "Lernen Sie Familien, Gastgeber und Menschen vor Ort kennen.",
  },
  {
    icon: Sprout,
    title: "Lokal verbunden",
    desc: "Wir arbeiten mit lokalen Partnern zusammen, die wir persönlich kennen.",
  },
];

const Highlights = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-16 md:py-24 bg-sand/60">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow mb-4 block">Warum Kereztour</span>
          <h2 className="font-display text-3xl md:text-[2.35rem] leading-tight text-foreground mb-4">
            Mehr als <span className="italic text-primary">eine Reise</span>
          </h2>
          <p className="text-foreground text-base md:text-lg leading-relaxed">
            Bei Kereztour geht es um persönliche Betreuung, kleine Gruppen und echte Nähe zu Land
            und Menschen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="stagger-child group rounded-2xl bg-card border border-border p-7 shadow-soft transition-all duration-500 hover:shadow-lift hover:-translate-y-1"
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-5 w-5" />
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

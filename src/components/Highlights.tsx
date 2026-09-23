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
    <section className="border-b border-border bg-sand/50 py-20 md:py-28">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
          <span className="eyebrow mb-4 block">Warum Kereztour</span>
          <h2 className="font-display text-4xl leading-tight text-foreground md:text-6xl">
            Mehr als <span className="italic text-primary">eine Reise</span>
          </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg lg:col-span-5 lg:pb-1">
            Bei Kereztour geht es um persönliche Betreuung, kleine Gruppen und echte Nähe zu Land
            und Menschen.
          </p>
        </div>

        <div className="grid grid-cols-1 border-y border-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="stagger-child group border-b border-border bg-transparent p-7 transition-colors duration-500 hover:bg-card sm:border-r lg:border-b-0"
            >
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-sm border border-primary/20 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-3 font-display text-2xl text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;

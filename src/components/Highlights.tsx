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
    <section className="border-b border-border bg-sand/50 pt-10 md:pt-14 pb-14 md:pb-20">
      <div ref={ref} className="section-reveal container mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-16 flex flex-col justify-between gap-8 px-0 md:flex-row md:items-end md:px-4">
          <div className="max-w-3xl">
            <span className="eyebrow mb-5 block">Warum Kereztour</span>
            <h2 className="font-display text-4xl font-normal sm:text-5xl leading-tight text-foreground md:text-6xl lg:text-7xl">
              Mehr als <span className="italic text-primary">eine Reise</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:pb-1 md:text-lg">
            Bei Kereztour geht es um persönliche Betreuung, kleine Gruppen und echte Nähe zu Land
            und Menschen.
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="stagger-child border-b border-border bg-transparent p-6 sm:p-8 md:p-10 sm:[&:nth-child(odd)]:border-r lg:border-r lg:[&:nth-child(4)]:border-r-0"
            >
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-sm border border-border text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-4 font-display text-2xl text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;

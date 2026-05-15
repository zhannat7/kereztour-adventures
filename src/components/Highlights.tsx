import { Shield, Users, Heart, Leaf } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  {
    icon: Users,
    title: "Kleine Gruppen",
    desc: "Maximal 12 Personen für ein intensives, persönliches Reiseerlebnis abseits des Massentourismus.",
  },
  {
    icon: Shield,
    title: "Rundum organisiert",
    desc: "Von Anreise bis Abreise – Unterkunft, Verpflegung und Programm sind vollständig inklusiv.",
  },
  {
    icon: Heart,
    title: "Authentisch & nah",
    desc: "Echte Begegnungen mit kirgisischen Nomaden, Adlerjägern und lokalen Familien.",
  },
  {
    icon: Leaf,
    title: "Nachhaltig reisen",
    desc: "Wir arbeiten mit lokalen Partnern und unterstützen die Gemeinschaften vor Ort direkt.",
  },
];

const Highlights = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-14 md:py-20 bg-background relative overflow-hidden">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-3 block">
            Warum KérezTour?
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Reisen, die <span className="italic text-primary">berühren</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Wir glauben, dass echtes Reisen bedeutet, eine Kultur wirklich zu erleben – nicht nur zu beobachten.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="stagger-child group rounded-2xl bg-card border border-border p-7 hover:border-primary/30 hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;

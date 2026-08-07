import { Users, ShieldCheck, HandHeart, Sprout } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const items = [
  {
    icon: Users,
    title: "Kleine Gruppen",
    desc: "Maximal 12 Reisende. Genug Nähe für echte Gespräche, klein genug für spontane Umwege.",
  },
  {
    icon: ShieldCheck,
    title: "Rundum organisiert",
    desc: "Unterkunft, Transfers, Verpflegung und Programm – ein Preis, keine versteckten Kosten.",
  },
  {
    icon: HandHeart,
    title: "Authentisch & nah",
    desc: "Begegnungen mit Nomadenfamilien, Adlerjägern und Gastgebern, die wir persönlich kennen.",
  },
  {
    icon: Sprout,
    title: "Faire Partnerschaft",
    desc: "Wir buchen ausschließlich lokal. Dein Reisegeld bleibt in den Dörfern vor Ort.",
  },
];

const Highlights = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-16 md:py-24 bg-sand/60">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow mb-4 block">Warum Kereztour</span>
          <h2 className="font-display text-3xl md:text-[2.75rem] leading-tight text-foreground mb-4">
            Reisen, bei denen du dich <span className="italic text-primary">gut aufgehoben</span> fühlst
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Kein Massentourismus, keine Callcenter. Du sprichst von Anfang bis Ende mit der Person,
            die deine Reise auch begleitet.
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

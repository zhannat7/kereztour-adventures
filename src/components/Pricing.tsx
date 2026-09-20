import { ArrowRight, Sparkles, Home, Hotel, Users, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const plans = [
  {
    name: "Economy",
    price: "990",
    featured: false,
    tagline: "Authentisch & erschwinglich",
    details: [
      { icon: Home, text: "Gästehaus & Jurte, Mehrbettzimmer" },
      { icon: Users, text: "Gruppe bis 12 Personen" },
      { icon: Star, text: "Standard-Service, volle Betreuung" },
    ],
  },
  {
    name: "Comfort",
    price: "1.490",
    featured: true,
    tagline: "Exklusiv & komfortabel",
    details: [
      { icon: Hotel, text: "Ausgewählte Hotels, Einzel-/Doppelzimmer" },
      { icon: Users, text: "Kleine Gruppe, max. 4 Personen" },
      { icon: Star, text: "Premium-Service & private Transfers" },
    ],
  },
];

const included = [
  "Alle Übernachtungen",
  "Transfers im Land",
  "Verpflegung nach Programm",
  "Deutschsprachige Reiseleitung",
];

const Pricing = () => {
  const ref = useScrollReveal();

  return (
    <section id="preise" className="py-16 md:py-24 bg-sand/60">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow mb-4 block">Kultur Tour · Pakete</span>
          <h2 className="font-display text-3xl md:text-[2.75rem] leading-tight text-foreground mb-4">
            Dasselbe Programm – <span className="italic text-primary">dein Komfort entscheidet</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Zehn Tage, identische Route. Du wählst nur, wie du übernachten und reisen möchtest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`stagger-child relative flex flex-col rounded-[1.5rem] p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 ${
                plan.featured
                  ? "bg-gradient-primary text-primary-foreground shadow-lift"
                  : "bg-card border border-border shadow-soft hover:shadow-lift"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground shadow-glow">
                  <Sparkles className="h-3 w-3" /> Beliebteste Wahl
                </span>
              )}

              <p className={`text-sm mb-2 ${plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {plan.tagline}
              </p>
              <h3 className="font-display text-2xl mb-6">{plan.name}</h3>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="font-display text-5xl md:text-[3.5rem] leading-none">{plan.price} €</span>
                <span className={`text-sm ${plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  / Person
                </span>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.details.map((d) => (
                  <li key={d.text} className="flex items-start gap-3 text-sm">
                    <d.icon className={`h-5 w-5 shrink-0 ${plan.featured ? "text-secondary" : "text-primary"}`} />
                    <span className={plan.featured ? "text-primary-foreground/90" : "text-foreground/85"}>{d.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/buchen?tour=kultur"
                className={`inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all duration-300 hover:brightness-105 ${
                  plan.featured
                    ? "bg-secondary text-secondary-foreground shadow-glow"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {plan.name} anfragen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card px-6 py-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
            In beiden Paketen enthalten
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {included.map((i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/85">
                <Check className="h-4 w-4 shrink-0 text-secondary" /> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const plans = [
  {
    name: "Economy",
    price: "990",
    perks: ["Hostel", "Mehrbettzimmer (2+ Personen)", "Standardservice"],
  },
  {
    name: "Comfort",
    price: "1.490",
    perks: ["Luxushotel", "Einzel-/Doppelzimmer", "Premium-Service"],
    featured: true,
  },
];

const Pricing = () => {
  const ref = useScrollReveal();

  return (
    <section id="preise" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div ref={ref} className="section-reveal container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
            Unsere Pakete
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Wähle dein <span className="italic text-primary">Abenteuer</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Zwei Pakete, ein unvergessliches Erlebnis – wähle, was am besten zu dir passt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`stagger-child relative rounded-3xl p-8 md:p-10 flex flex-col transition-all duration-500 hover:-translate-y-1 ${
                plan.featured
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 ring-1 ring-primary"
                  : "bg-card border border-border hover:border-primary/30 hover:shadow-xl"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground uppercase tracking-wider shadow-lg">
                  <Sparkles className="h-3 w-3" /> Empfohlen
                </div>
              )}

              <h3 className="font-display text-2xl md:text-3xl mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl md:text-6xl font-display">{plan.price}</span>
                <span className="text-lg">€</span>
              </div>
              <p className={`text-sm mb-8 ${plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                pro Person
              </p>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm">
                    <Check className={`h-5 w-5 shrink-0 mt-0.5 ${plan.featured ? "text-secondary" : "text-primary"}`} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/buchen"
                className={`inline-flex items-center justify-center gap-2 rounded-full py-4 font-semibold transition-all duration-300 hover:scale-105 ${
                  plan.featured
                    ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-secondary/40"
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/15 hover:shadow-primary/30"
                }`}
              >
                Jetzt buchen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

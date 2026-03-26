import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Economy",
    price: "990 €",
    perks: ["Hostel", "Mehrbettzimmer (2+ Personen)", "Standardservice"],
  },
  {
    name: "Comfort",
    price: "1.490 €",
    perks: ["Luxushotel", "Einzel-/Doppelzimmer", "Premium-Service"],
    featured: true,
  },
];

const Pricing = () => (
  <section id="preise" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
        Preise
      </h2>
      <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
        Wähle das Paket, das am besten zu dir passt
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 flex flex-col items-center text-center transition-shadow ${
              plan.featured
                ? "border-primary shadow-lg scale-[1.02]"
                : "border-border shadow-sm"
            }`}
          >
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
            <p className="text-4xl font-bold text-primary mb-1">{plan.price}</p>
            <p className="text-sm text-muted-foreground mb-6">pro Person</p>
            <ul className="space-y-3 mb-8 w-full">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-foreground text-sm">
                  <Check className="h-4 w-4 text-accent" />
                  {perk}
                </li>
              ))}
            </ul>
            <Link
              to="/buchen"
              className={`mt-auto inline-block w-full rounded-lg py-3 font-semibold transition-opacity hover:opacity-90 text-center ${
                plan.featured
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              Jetzt buchen
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;

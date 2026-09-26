import { ArrowRight, Sparkles, Home, Hotel, Users, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <section id="preise" className="border-y border-border bg-sand/50 py-14 md:py-20">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="eyebrow mb-4 justify-center before:hidden">{t("Kultur Tour · Pakete")}</span>
          <h2 className="mb-5 font-display text-4xl leading-tight text-foreground md:text-6xl">
            {t("Dasselbe Programm – ")}<span className="italic text-primary">{t("dein Komfort entscheidet")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("Zehn Tage, identische Route. Du wählst nur, wie du übernachten und reisen möchtest.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`stagger-child relative flex flex-col p-8 transition-all duration-500 hover:-translate-y-1 md:p-10 ${
                plan.featured
                  ? "bg-gradient-primary text-primary-foreground shadow-lift"
                  : "bg-card border border-border shadow-soft hover:shadow-lift"
              }`}
            >
              {plan.featured && (
                 <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-sm bg-secondary px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary-foreground shadow-glow">
                  <Sparkles className="h-3 w-3" /> {t("Beliebteste Wahl")}
                </span>
              )}

              <p className={`text-sm mb-2 ${plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {t(plan.tagline)}
              </p>
              <h3 className="font-display text-2xl mb-6">{plan.name}</h3>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="font-display text-5xl md:text-[3.5rem] leading-none">{plan.price} €</span>
                <span className={`text-sm ${plan.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  / {t("Person")}
                </span>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.details.map((d) => (
                  <li key={t(d.text)} className="flex items-start gap-3 text-sm">
                    <d.icon className={`h-5 w-5 shrink-0 ${plan.featured ? "text-secondary" : "text-primary"}`} />
                    <span className={plan.featured ? "text-primary-foreground/90" : "text-foreground/85"}>{d.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/buchen?tour=kultur"
                className={`inline-flex items-center justify-center gap-2 rounded-sm py-3.5 text-sm font-semibold transition-all duration-300 hover:brightness-105 ${
                  plan.featured
                    ? "bg-secondary text-secondary-foreground shadow-glow"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {t(plan.name + " anfragen")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 border-y border-border bg-card px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
            {t("In beiden Paketen enthalten")}
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

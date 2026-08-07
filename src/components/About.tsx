import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check } from "lucide-react";

const points = [
  "In Kirgisistan geboren, seit Jahren in Europa zuhause – ich kenne beide Erwartungen.",
  "Jede Route bin ich selbst gegangen, jeden Gastgeber kenne ich persönlich.",
  "Deutsch, Englisch und Kirgisisch – vor Ort und in der Planung.",
];

const About = () => {
  const ref = useScrollReveal();

  return (
    <section id="ueber-uns" className="py-16 md:py-24 bg-background">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-lift aspect-[4/3]">
              <img
                src="/about.jpg"
                alt="Weite Landschaft Kirgisistans"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="eyebrow mb-4 block">Über uns</span>
            <h2 className="font-display text-3xl md:text-[2.75rem] leading-tight text-foreground mb-6">
              Ein kleines Reisebüro – <span className="italic text-primary">und eine echte Ansprechpartnerin</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-5">
              Kereztour ist kein Konzern. Hinter jeder Reise stehe ich, Sarina, mit einem Netzwerk aus
              Familien, Fahrern und Bergführern, das über Jahre gewachsen ist. Genau deshalb kann ich
              versprechen, was große Anbieter nicht können: dass du nicht Nummer 400 in einem System bist.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Du schreibst mir, wir sprechen über deine Vorstellungen, und ich baue die Reise darum herum.
              Ohne Verkaufsdruck, ohne Anzahlung bei der Anfrage.
            </p>

            <ul className="space-y-3.5">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

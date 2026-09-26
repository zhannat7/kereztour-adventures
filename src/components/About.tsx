import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const points = [
  "Unser Ziel ist einfach: Wir möchten Ihnen Kirgisistan persönlich zeigen – mit beeindruckenden Landschaften, echten Begegnungen und einer Reise, die zu Ihren Wünschen passt.",
  "Wir kümmern uns persönlich um die Planung und Organisation und arbeiten dabei mit unseren lokalen Kontakten in Kirgisistan zusammen. So können Sie das Land entspannt entdecken und seine Menschen und Kultur näher kennenlernen.",
];

const About = () => {
  const ref = useScrollReveal();
  const { t } = useLanguage();

  return (
    <section id="ueber-uns" className="border-y border-border bg-sand/35 py-14 md:py-20">
      <div ref={ref} className="section-reveal container mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <div className="relative aspect-[5/4] overflow-hidden shadow-lift">
              <img
                src="/about.jpg"
                alt="Weite Landschaft Kirgisistans"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 lg:max-w-2xl">
            <span className="eyebrow mb-4 block">{t("Über uns")}</span>
            <h2 className="mb-8 font-display text-4xl leading-tight sm:text-5xl text-foreground md:text-6xl">
              {t("Kirgisistan")} <span className="italic text-primary">{t("persönlich erleben")}</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-5">
              {t("Kereztour ist ein kleines Familienunternehmen aus Kirgisistan, das von meiner Mutter geführt wird. Sie kennt das Land, die Menschen und viele besondere Orte aus eigener Erfahrung.")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5">
              {t("Ich bin Sarina und lebe in Völs am Schlern in Südtirol. Ich unterstütze meine Mutter bei der Kommunikation und bei der Planung unserer Reisen für Gäste aus Europa. Ich spreche Deutsch, Italienisch und Kirgisisch.")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("Gemeinsam haben wir bereits mehrere Reisen für Gäste organisiert. Dabei sind schöne Erlebnisse und persönliche Begegnungen entstanden. Genau diese Erfahrungen möchten wir immer wieder mit unseren Gästen teilen.")}
            </p>

            <ul className="space-y-3.5">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  {t(p)}
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

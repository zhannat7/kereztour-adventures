import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MapPin,
  Users,
  CalendarDays,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/i18n/LanguageContext";
import Footer from "@/components/Footer";

const highlights = [
  "Kyrchyn Jailoo und die Welt der kirgisischen Nomaden",
  "Traditionelle Kultur und lokale Begegnungen",
  "Nomadische Lebensweise hautnah erleben",
  "Landschaft rund um den Issyk-Kul",
  "Authentische kirgisische Küche und Gastfreundschaft",
  "Zeit für persönliche Erlebnisse und Entdeckungen",
];

const Kyrchyn = () => {\n  const { t } = useLanguage();
  return (
    <>
      <Navbar />

      <main className="bg-background pb-24 pt-24 md:pt-32">

        {/* HEADER */}
        <section className="container mx-auto px-6 max-w-5xl">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("Zurück")}
          </Link>

          <div className="mb-16">

            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
              Kultur · Nomaden · Issyk-Kul
            </span>

            <h1 className="mb-7 font-display text-5xl leading-tight text-foreground md:text-7xl lg:text-8xl">
              Kyrchyn Tour
              <span className="block text-2xl md:text-3xl italic text-primary mt-3">
                Kirgisistan erleben, wie es wirklich ist
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl leading-relaxed">
              Entdecke das Kyrchyn Jailoo und erlebe die Kultur,
              Traditionen und Lebensweise der kirgisischen Nomaden
              aus nächster Nähe.
            </p>

          </div>

        </section>

        {/* INFO CARDS */}
        <section className="container mx-auto px-6 max-w-5xl mb-20">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="border-y border-border bg-card p-6">
              <MapPin className="h-5 w-5 text-primary mb-4" />

              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Reiseziel
              </p>

              <p className="font-semibold text-foreground">
                Kyrchyn Jailoo
              </p>
            </div>

            <div className="border-y border-border bg-card p-6">
              <CalendarDays className="h-5 w-5 text-primary mb-4" />

              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {t("Reise")}
              </p>

              <p className="font-semibold text-foreground">
                Kultur & Nomaden
              </p>
            </div>

            <div className="border-y border-border bg-card p-6">
              <Users className="h-5 w-5 text-primary mb-4" />

              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Preis
              </p>

              <p className="font-semibold text-foreground">
                1.300 € pro Person
              </p>
            </div>

          </div>

        </section>

        {/* INTRO */}
        <section className="container mx-auto px-6 max-w-5xl mb-20">

          <div className="max-w-3xl">

            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
              Eine {t("Reise")} in die Welt der{" "}
              <span className="italic text-primary">
                Nomaden
              </span>
            </h2>

            <div className="space-y-5 text-muted-foreground leading-relaxed">

              <p>
                Kyrchyn ist ein besonderer Ort, um die kirgisische
                Kultur und nomadischen Traditionen kennenzulernen.
                Auf dem Jailoo treffen Natur, Geschichte,
                Handwerk und gelebte Tradition aufeinander.
              </p>

              <p>
                Die {t("Reise")} verbindet kulturelle Erlebnisse mit
                der beeindruckenden Landschaft rund um den
                Issyk-Kul. Dabei geht es nicht nur darum,
                Sehenswürdigkeiten zu besuchen, sondern
                Kirgisistan persönlich kennenzulernen.
              </p>

              <p>
                Du bekommst Einblicke in traditionelle
                Lebensweisen und erlebst die besondere
                Atmosphäre des Landes aus nächster Nähe.
              </p>

            </div>

          </div>

        </section>

        {/* HIGHLIGHTS */}
        <section className="container mx-auto px-6 max-w-5xl mb-20">

          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8">
            Was dich{" "}
            <span className="italic text-primary">
              erwartet
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-start gap-3 border-b border-border bg-card p-5"
              >
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />

                <p className="text-sm md:text-base text-foreground leading-relaxed">
                  {highlight}
                </p>
              </div>
            ))}

          </div>

        </section>

        {/* BOOKING */}
        <section className="container mx-auto px-6 max-w-5xl">

          <div className="border-y border-gold/30 bg-primary p-8 text-primary-foreground md:p-12">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

              <div>

                <p className="text-primary-foreground/70 text-sm mb-2">
                  Kyrchyn Tour
                </p>

                <h2 className="font-display text-3xl md:text-4xl mb-4">
                  Deine {t("Reise")} nach Kyrchyn
                </h2>

                <p className="text-primary-foreground/80 max-w-xl leading-relaxed">
                  1.300 € pro Person. Wähle dein {t("Reisedatum")}
                  und sende uns deine Buchungsanfrage.
                </p>

              </div>

              <div className="shrink-0">

                <p className="font-display text-4xl mb-4">
                  1.300 €
                </p>

                <Link
                  to="/buchen?tour=kyrchyn"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-secondary px-7 py-4 font-semibold text-secondary-foreground transition-all duration-300 hover:-translate-y-0.5"
                >
                  Reise buchen
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Kyrchyn;

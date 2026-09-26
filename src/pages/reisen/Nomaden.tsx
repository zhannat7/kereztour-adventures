import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const Nomaden = () => {
  const { t } = useLanguage();
  return (
  <>
    <Navbar />
    <main className="bg-background pb-24 pt-24 md:pt-32">
      <div className="container mx-auto max-w-5xl px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> {t("Zurück")}
        </Link>

        <h1 className="mb-10 font-display text-5xl leading-tight text-foreground md:text-7xl lg:text-8xl">
          {t("Weltspiele der Nomaden 2026")}
          <span className="block text-2xl md:text-3xl italic text-primary mt-2">
            {t("Ein unvergessliches Abenteuer")}
          </span>
        </h1>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p>{t("Erleben Sie eines der faszinierendsten Kultur- und Sportevents der Welt: die VI. Weltspiele der Nomaden in Kirgisistan. Tauchen Sie ein in die jahrhundertealte Tradition der Nomaden und entdecken Sie eine einzigartige Mischung aus spektakulären Wettkämpfen, beeindruckender Natur und lebendiger Kultur.")}</p>
          <p>
            {t("Die feierliche Eröffnung erwartet Sie in Bischkek, während das Herz")}
            {t("der Spiele am traumhaften Ufer des Issyk-Kul-See schlägt – umgeben")}
            {t("von majestätischen Bergen und unberührter Landschaft.")}
          </p>

          <h2 className="font-display text-2xl md:text-3xl text-foreground mt-10 mb-4">
            {t("Freuen Sie sich auf:")}
          </h2>
          <ul className="space-y-3">
            <li>{t("Spannende Wettbewerbe wie Kok Boru, Pferderennen und traditionelle Kämpfe")}</li>
            <li>{t("Authentische Nomadenkultur hautnah erleben")}</li>
            <li>{t("Internationale Atmosphäre mit Gästen aus über 80 Ländern")}</li>
            <li>{t("Atemberaubende Natur und unvergessliche Erlebnisse")}</li>
          </ul>

          <p className="text-foreground font-semibold text-xl mt-8">
            {t("Diese Reise ist mehr als nur ein Urlaub – sie ist eine Reise in eine andere Welt.")}
          </p>
          <div className="mt-10 pt-8 border-t border-border text-center">
            <Link
              to="/buchen"
              className="inline-flex items-center gap-2 text-primary font-bold text-lg md:text-xl hover:underline underline-offset-4 decoration-2 transition-all duration-300 hover:gap-3"
            >
              {t("Sichern Sie sich jetzt Ihren Platz für die Weltspiele der Nomaden 2026!")} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* ADD PHOTOS HERE */}
        <div className="mt-14 border-y border-border bg-muted/60 p-12 text-center">
          <p className="text-muted-foreground text-sm">{t("Bildergalerie – demnächst verfügbar")}</p>
        </div>
      </div>
    </main>
    <Footer />
  </>
  );
};

export default Nomaden;

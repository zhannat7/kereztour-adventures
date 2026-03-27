import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Nomaden = () => (
  <>
    <Navbar />
    <main className="pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
          Weltspiele der Nomaden 2026
          <span className="block text-2xl md:text-3xl italic text-primary mt-2">
            Ein unvergessliches Abenteuer
          </span>
        </h1>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p>
            Erleben Sie eines der faszinierendsten Kultur- und Sportevents der
            Welt: die VI. Weltspiele der Nomaden in Kirgisistan. Tauchen Sie ein
            in die jahrhundertealte Tradition der Nomaden und entdecken Sie eine
            einzigartige Mischung aus spektakulären Wettkämpfen, beeindruckender
            Natur und lebendiger Kultur.
          </p>
          <p>
            Die feierliche Eröffnung erwartet Sie in Bischkek, während das Herz
            der Spiele am traumhaften Ufer des Issyk-Kul-See schlägt – umgeben
            von majestätischen Bergen und unberührter Landschaft.
          </p>

          <h2 className="font-display text-2xl md:text-3xl text-foreground mt-10 mb-4">
            Freuen Sie sich auf:
          </h2>
          <ul className="space-y-3">
            <li>Spannende Wettbewerbe wie Kok Boru, Pferderennen und traditionelle Kämpfe</li>
            <li>Authentische Nomadenkultur hautnah erleben</li>
            <li>Internationale Atmosphäre mit Gästen aus über 80 Ländern</li>
            <li>Atemberaubende Natur und unvergessliche Erlebnisse</li>
          </ul>

          <p className="text-foreground font-semibold text-xl mt-8">
            Diese Reise ist mehr als nur ein Urlaub – sie ist eine Reise in eine
            andere Welt.
          </p>
          <Link
            to="/buchen"
            className="text-primary font-bold text-lg hover:underline transition-colors"
          >
            Sichern Sie sich jetzt Ihren Platz für die Weltspiele der Nomaden
            2026!
          </Link>
        </div>

        {/* ADD PHOTOS HERE */}
        <div className="mt-12 rounded-2xl bg-muted/60 border border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">Bildergalerie – demnächst verfügbar</p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Nomaden;

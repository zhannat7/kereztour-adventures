import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Trekking = () => (
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

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
          🥾 Intensiv-Trekking
          <span className="block text-2xl md:text-3xl italic text-primary mt-2">
            Für echte Naturfreunde
          </span>
        </h1>

        <p className="text-muted-foreground text-lg mb-6 max-w-2xl">
          Detaillierte Informationen zu dieser Tour folgen in Kürze. Freuen Sie sich auf anspruchsvolle
          Wanderungen durch unberührte Berglandschaften Kirgisistans.
        </p>

        {/* ADD PHOTOS HERE */}
        <div className="mt-12 rounded-2xl bg-muted/60 border border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">Bildergalerie – demnächst verfügbar</p>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/buchen"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/15 hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            Jetzt buchen <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Trekking;

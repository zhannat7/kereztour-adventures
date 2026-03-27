import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tiers = [
  {
    name: "Economy",
    price: "990",
    details: [
      "👥 Gruppengröße: 10–12 Personen",
      "🏠 Unterkunft: Hostel, Jurte (2+ Personen pro Zimmer)",
      "⭐ Standard Service",
    ],
  },
  {
    name: "Comfort",
    price: "1.490",
    featured: true,
    details: [
      "👥 Gruppengröße: max. 4 Personen",
      "🏨 Unterkunft: Luxushotel, Einzel-/Doppelzimmer",
      "⭐⭐⭐ Premium Service",
    ],
  },
];

const Kultur = () => (
  <>
    <Navbar />
    <main className="pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
          🏛️ Kultur Tour
        </h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Entdecken Sie Kirgisistans kulturelle Schätze – wählen Sie das Paket, das am besten zu Ihnen passt.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-8 md:p-10 flex flex-col transition-all duration-500 hover:-translate-y-1 ${
                tier.featured
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 ring-1 ring-primary"
                  : "bg-card border border-border hover:border-primary/30 hover:shadow-xl"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground uppercase tracking-wider shadow-lg">
                  <Sparkles className="h-3 w-3" /> Empfohlen
                </div>
              )}

              <h3 className="font-display text-2xl md:text-3xl mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl md:text-6xl font-display">{tier.price}</span>
                <span className="text-lg">€</span>
                <span className={`text-sm ml-1 ${tier.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  pro Person
                </span>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {tier.details.map((d) => (
                  <li key={d} className="text-sm leading-relaxed">{d}</li>
                ))}
              </ul>

              <Link
                to="/buchen"
                className={`inline-flex items-center justify-center gap-2 rounded-full py-4 font-semibold transition-all duration-300 hover:scale-105 ${
                  tier.featured
                    ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-secondary/40"
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/15 hover:shadow-primary/30"
                }`}
              >
                Jetzt buchen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* ADD PHOTOS HERE */}
        <div className="mt-16 rounded-2xl bg-muted/60 border border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">Bildergalerie – demnächst verfügbar</p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Kultur;

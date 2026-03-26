import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      /* ADD YOUR OWN IMAGE HERE */
      style={{
        backgroundColor: "#1a3a2a",
        backgroundImage: "var(--hero-overlay)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-2 mb-8 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <MapPin className="h-4 w-4 text-secondary" />
            <span className="text-white/90 text-sm font-medium tracking-wide">Zentralasien · Kirgisistan</span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-6 opacity-0 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            Kereztour
            <br />
            <span className="italic text-secondary">Kirgisistan</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-4 font-light opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            10 Tage unvergessliches Abenteuer durch Berge, Seen und
            jahrtausendealte Nomadenkultur
          </p>

          {/* Rating */}
          <div
            className="flex items-center justify-center gap-1 mb-10 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
            ))}
            <span className="text-white/60 text-sm ml-2">Gruppenreise · Natur, Kultur & Tradition</span>
          </div>

          {/* CTA */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1s" }}
          >
            <Link
              to="/buchen"
              className="inline-flex items-center gap-3 rounded-full bg-secondary px-10 py-4 text-lg font-semibold text-secondary-foreground shadow-2xl shadow-secondary/30 hover:shadow-secondary/50 hover:scale-105 transition-all duration-300"
            >
              Jetzt buchen <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#reiseplan"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-white/90 text-lg font-medium hover:bg-white/10 transition-all duration-300"
            >
              Reiseplan ansehen
            </a>
          </div>

          {/* Stats */}
          <div
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto opacity-0 animate-fade-in"
            style={{ animationDelay: "1.2s" }}
          >
            {[
              { value: "10", label: "Tage" },
              { value: "15+", label: "Erlebnisse" },
              { value: "100%", label: "Unvergesslich" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-display text-white">{s.value}</div>
                <div className="text-sm text-white/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1.5s" }}>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-3 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

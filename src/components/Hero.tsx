import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";

import hero1 from "@/assets/hero/hero1.jpg";
import hero2 from "@/assets/hero/hero2.jpg";
import hero3 from "@/assets/hero/hero3.jpg";

const images = [hero1, hero2, hero3];
const INTERVAL = 5000;
const FADE_DURATION = 2000;

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    const id = setInterval(advance, INTERVAL);
    return () => clearInterval(id);
  }, [advance]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow background – NO overlay, bright & clear */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Kirgisistan Landschaft ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === currentIndex ? 1 : 0,
            transition: `opacity ${FADE_DURATION}ms ease-in-out`,
            zIndex: 1,
          }}
        />
      ))}

      {/* Subtle bottom-only scrim so text stays readable */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 backdrop-blur-md px-5 py-2 mb-8 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <MapPin className="h-4 w-4 text-secondary" />
            <span className="text-white text-sm font-medium tracking-wide drop-shadow-sm">
              Zentralasien · Kirgisistan
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-6 opacity-0 animate-slide-up drop-shadow-lg"
            style={{ animationDelay: "0.3s" }}
          >
            Kereztour
            <br />
            <span className="italic text-secondary drop-shadow-md">Kirgisistan</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-4 font-light opacity-0 animate-fade-in-up drop-shadow-sm"
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
            <span className="text-white/80 text-sm ml-2 drop-shadow-sm">
              Gruppenreise · Natur, Kultur & Tradition
            </span>
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
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-8 py-4 text-white text-lg font-medium hover:bg-white/20 transition-all duration-300"
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
                <div className="text-3xl md:text-4xl font-display text-white drop-shadow-md">
                  {s.value}
                </div>
                <div className="text-sm text-white/70 mt-1 drop-shadow-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 opacity-0 animate-fade-in" style={{ animationDelay: "1.5s" }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i === currentIndex
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Bild ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

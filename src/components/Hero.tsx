import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";

const landscapes = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    location: "Tian Shan Gebirge",
    description: "Majestätische Berggipfel und alpine Seen"
  },
  {
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    location: "Kirgisische Hochebene",
    description: "Weite Steppen und traditionelle Jurten"
  },
  {
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80",
    location: "Issyk-Kul Region",
    description: "Kristallklare Bergseen und Wasserfälle"
  }
];

const INTERVAL = 6000;

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % landscapes.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + landscapes.length) % landscapes.length);
  }, []);

  useEffect(() => {
    const id = setInterval(nextSlide, INTERVAL);
    return () => clearInterval(id);
  }, [nextSlide]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {landscapes.map((landscape, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={landscape.image}
              alt={landscape.location}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Vorheriges Bild"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Nächstes Bild"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 backdrop-blur-md px-5 py-2 mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <MapPin className="h-4 w-4 text-secondary" />
            <span className="text-white text-sm font-medium tracking-wide drop-shadow-sm">
              Zentralasien · Kirgisistan
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-4 opacity-0 animate-slide-up drop-shadow-lg"
            style={{ animationDelay: "0.3s" }}
          >
            Kereztour
            <br />
            <span className="italic text-secondary drop-shadow-md">Kirgisistan</span>
          </h1>

          {/* Dynamic subtitle based on current landscape */}
          <p
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-3 font-light opacity-0 animate-fade-in-up drop-shadow-sm"
            style={{ animationDelay: "0.6s" }}
          >
            {landscapes[currentIndex].description}
          </p>
          <p
            className="text-sm md:text-base text-white/80 mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            {landscapes[currentIndex].location}
          </p>

          {/* Rating */}
          <div
            className="flex items-center justify-center gap-1 mb-8 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
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
            className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto opacity-0 animate-fade-in"
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

      {/* Slide indicators and landscape info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        {/* Landscape labels */}
        <div className="flex gap-2 opacity-0 animate-fade-in" style={{ animationDelay: "1.4s" }}>
          {landscapes.map((landscape, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white text-black"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {landscape.location.split(" ")[0]}
            </button>
          ))}
        </div>
        
        {/* Dot indicators */}
        <div className="flex gap-2 opacity-0 animate-fade-in" style={{ animationDelay: "1.5s" }}>
          {landscapes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Folie ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

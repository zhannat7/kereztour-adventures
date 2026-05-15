import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, ChevronLeft, ChevronRight, Users, Award, Heart } from "lucide-react";

const landscapes = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    location: "Tian Shan Gebirge",
    description: "Wo Berge den Himmel berühren",
    sub: "Unberührte Natur, endlose Weite"
  },
  {
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    location: "Kirgisische Hochebene",
    description: "Das Land der Nomaden",
    sub: "Jahrtausendealte Kultur hautnah erleben"
  },
  {
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80",
    location: "Issyk-Kul Region",
    description: "Das Perle Zentralasiens",
    sub: "Kristallklare Seen und majestätische Gipfel"
  },
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
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {landscapes.map((landscape, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-10" />
      </div>

      {/* Arrows */}
      <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300">
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 backdrop-blur-md px-5 py-2 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <MapPin className="h-4 w-4 text-secondary" />
            <span className="text-white text-sm font-medium tracking-wide">Zentralasien · Kirgisistan</span>
          </div>

          {/* Dynamic title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-4 opacity-0 animate-slide-up drop-shadow-lg" style={{ animationDelay: "0.3s" }}>
            {landscapes[currentIndex].description}
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-2 font-light opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            {landscapes[currentIndex].sub}
          </p>

          <p className="text-sm text-white/60 mb-10 tracking-widest uppercase opacity-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            {landscapes[currentIndex].location}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up mb-14" style={{ animationDelay: "0.9s" }}>
            <Link
              to="/reisen/kultur"
              className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-4 text-base font-semibold text-gray-900 shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Unsere Reisen entdecken <ArrowRight className="h-5 w-5" />
            </Link>
            
             <a
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-8 py-4 text-white text-base font-medium hover:bg-white/20 transition-all duration-300"
            >
              Mehr erfahren
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-fade-in" style={{ animationDelay: "1.1s" }}>
            <div className="flex items-center gap-2 text-white/80">
              <Users className="h-5 w-5 text-secondary" />
              <span className="text-sm">Kleine Gruppen · max. 12 Personen</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 text-white/80">
              <Award className="h-5 w-5 text-secondary" />
              <span className="text-sm">Persönliche Reiseleitung</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 text-white/80">
              <Heart className="h-5 w-5 text-secondary" />
              <span className="text-sm">Authentische Erlebnisse</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {landscapes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

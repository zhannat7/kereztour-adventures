import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full h-[82vh] sm:h-[85vh] lg:h-[88vh] lg:max-h-[900px] lg:min-h-[600px] flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-wide.jpg"
          alt="Jurten-Lager im Tian Shan Gebirge von Kirgisistan"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
        />
        {/* Sanfte, cinematische Abdunklung nur für Lesbarkeit */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,30,26,0.55)_0%,rgba(5,30,26,0.28)_45%,rgba(5,30,26,0.5)_100%)]" />
        <div className="absolute inset-0 bg-gradient-vignette" />
      </div>


      <div className="relative z-10 w-full h-full flex items-start">
        <div className="w-full px-6 pt-24 sm:pt-28">
          <div className="max-w-[560px] lg:max-w-[820px] mx-auto text-center lg:mx-0 lg:ml-[38%] lg:text-left">
            <p
              className="font-semibold uppercase text-white/90 animate-fade-in-up text-[15px] sm:text-[17px] lg:text-[19px] tracking-[0.22em] mb-8 sm:mb-10 lg:mb-12"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
            >
              Kleine Gruppenreisen ins Herz Zentralasiens
            </p>


            <h1
              className="font-display font-normal text-white animate-slide-up text-[46px] sm:text-[62px] md:text-[76px] lg:text-[min(7.6vw,118px)] leading-[1.2] tracking-[-0.015em] mb-12 sm:mb-14 lg:mb-16"
              style={{ textShadow: "0 4px 28px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.5)" }}
            >
              Kirgisistan
              <span
                className="block lg:whitespace-nowrap"
                style={{ color: "hsl(var(--gold))", textShadow: "0 4px 28px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.5)" }}
              >
                Authentisch erleben
              </span>
            </h1>


            <div
              className="flex justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: "0.25s" }}

            >
              <Link
                to="/buchen"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/10 backdrop-blur-md border-2 border-white px-10 py-[18px] font-semibold text-white text-[15px] sm:text-[16px] lg:text-[17px] tracking-wide shadow-lift transition-all duration-500 hover:bg-white/20 hover:shadow-glow"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="relative z-10 flex items-center gap-3">
                  Beginne Deine Reise
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-10 flex justify-center px-6">
        <p
          className="flex items-center gap-2 text-white/85 tracking-wide animate-fade-in-up text-[13px] sm:text-[15px] lg:text-[16px]"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)", animationDelay: "0.35s" }}
        >
          <Star className="h-4 w-4 fill-gold text-gold" />
          5,0 / 5,0 · Kleine Gruppen · Lokale Gastgeber
        </p>
      </div>
    </section>
  );
};

export default Hero;

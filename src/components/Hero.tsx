import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full h-[78vh] sm:h-[80vh] lg:h-[84vh] lg:max-h-[820px] lg:min-h-[600px] flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-wide.jpg"
          alt="Jurten-Lager im Tian Shan Gebirge von Kirgisistan"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,30,26,0.42)_0%,rgba(5,30,26,0.18)_42%,rgba(5,30,26,0.72)_100%)]" />
        <div className="absolute inset-0 bg-gradient-vignette" />
      </div>

      <div className="relative z-10 flex h-full w-full items-start">
        <div className="w-full px-6 pt-[132px] sm:px-10 sm:pt-[110px] lg:px-16 lg:pt-[calc(24vh-68px)] xl:px-24">
          <div className="mx-auto max-w-[620px] text-center lg:max-w-[900px]">
            <h1 className="mb-7 animate-slide-up font-display text-[42px] font-normal leading-[0.98] tracking-[0.015em] text-primary-foreground drop-shadow-lg sm:text-[58px] md:text-[68px] lg:mb-9 lg:text-[clamp(68px,6vw,92px)]">
              <span className="block">Kirgisistan</span>
              <span className="mt-2 block text-gold sm:mt-3 lg:whitespace-nowrap">
                Authentisch erleben
              </span>
            </h1>

            <div className="mb-8 flex animate-fade-in items-center justify-center gap-4 px-6 sm:mb-10 lg:mb-12">
              <span className="hidden h-px w-12 bg-gold sm:block" aria-hidden="true" />
              <p className="text-[12px] font-semibold uppercase leading-relaxed tracking-[0.22em] text-primary-foreground/90 sm:text-[13px] lg:text-[16px]">
                Kleine Gruppenreisen ins Herz Zentralasiens
              </p>
              <span className="hidden h-px w-12 bg-gold sm:block" aria-hidden="true" />
            </div>

            <div
              className="flex animate-fade-in-up flex-col items-center justify-center gap-5 sm:flex-row sm:items-stretch sm:gap-6"
              style={{ animationDelay: "0.25s" }}
            >
              <Link
                to="/buchen"
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-md border border-gold bg-gold/20 px-8 py-4 text-[15px] font-semibold uppercase tracking-[0.12em] text-white shadow-lift backdrop-blur-sm transition-all duration-500 hover:bg-gold/35 hover:shadow-glow sm:px-9"
              >
                <span className="absolute inset-0 translate-y-full bg-gold/25 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center gap-3 whitespace-nowrap">
                  Beginne Deine Reise
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 sm:bottom-8">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary-foreground/90">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span>5,0 / 5,0</span>
          <span className="text-primary-foreground/50">·</span>
          <span>Kleine Gruppen</span>
          <span className="text-primary-foreground/50">·</span>
          <span>Lokale Gastgeber</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

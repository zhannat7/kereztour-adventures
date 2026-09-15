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


      {/* Eyebrow frei im Himmel über den Bergen */}
      <div className="absolute left-0 right-0 top-20 z-10 flex items-center justify-center gap-4 px-6 sm:top-24 lg:top-[8vh]">
        <span className="hidden h-px w-12 bg-gold sm:block" aria-hidden="true" />
        <p className="animate-fade-in-up text-[12px] font-semibold uppercase leading-relaxed tracking-[0.22em] text-primary-foreground/90 sm:text-[14px] lg:text-[15px]">
          Kleine Gruppenreisen ins Herz Zentralasiens
        </p>
        <span className="hidden h-px w-12 bg-gold sm:block" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex h-full w-full items-start">
        <div className="w-full px-6 pt-44 sm:px-10 sm:pt-32 lg:px-16 lg:pt-[15vh] xl:px-24">
          <div className="mx-auto max-w-[620px] text-center lg:max-w-[900px]">

            <h1 className="mb-9 animate-slide-up font-display text-[48px] font-normal leading-[0.98] text-primary-foreground drop-shadow-lg sm:text-[68px] md:text-[82px] lg:mb-11 lg:text-[clamp(82px,7vw,112px)]">
              <span className="block">Kirgisistan</span>
              <span className="mt-2 block text-gold sm:mt-3 lg:whitespace-nowrap">
                Authentisch erleben
              </span>
            </h1>

            <div
              className="flex animate-fade-in-up flex-col items-center justify-center gap-5 sm:flex-row sm:items-stretch sm:gap-6"

              style={{ animationDelay: "0.25s" }}
            >
              <Link
                to="/buchen"
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-md border border-gold bg-transparent px-8 py-4 text-[15px] font-semibold uppercase tracking-[0.12em] text-white shadow-lift backdrop-blur-sm transition-all duration-500 hover:bg-gold/15 hover:shadow-glow sm:px-9"
              >
                <span className="absolute inset-0 translate-y-full bg-gold/15 transition-transform duration-500 ease-out group-hover:translate-y-0" />

                <span className="relative z-10 flex items-center gap-3 whitespace-nowrap">
                  Beginne Deine Reise
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>

            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-0 right-0 z-10 px-6 sm:bottom-7">
        <p className="flex flex-wrap items-center justify-center gap-2 text-[13px] font-medium tracking-wide text-primary-foreground/90 sm:text-[14px]">
          <Star className="h-4 w-4 shrink-0 fill-gold text-gold" />
          <span className="font-semibold text-gold">5,0 / 5,0</span>
          <span>· Kleine Gruppen · Lokale Gastgeber</span>
        </p>
      </div>

    </section>
  );
};

export default Hero;

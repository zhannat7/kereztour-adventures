import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full h-[85vh] sm:h-[88vh] lg:h-[90vh] lg:max-h-[980px] lg:min-h-[620px] flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        {/* Blurred full-bleed background so the hero never looks empty on the sides */}
        <img
          src="/hero.jpg"
          alt=""
          loading="eager"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center blur-xl scale-110 opacity-90"
        />
        <div className="absolute inset-0 bg-background/40" />
        {/* Sharp, complete image centered without cropping */}
        <img
          src="/hero.jpg"
          alt="Jurten-Lager im Tian Shan Gebirge von Kirgisistan"
          loading="eager"
          className="relative h-full w-full object-contain object-center animate-[scale-in_1.5s_ease-out_forwards]"
          style={{ transform: "scale(1.02)" }}
        />
        <div className="absolute inset-0 bg-gradient-cinematic" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,30,26,0.45)] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full px-6 pt-20 lg:pt-24">
          <div className="max-w-[560px] lg:max-w-[760px] mx-auto text-center">
            <p
              className="font-semibold uppercase text-white/90 animate-fade-in-up text-[13px] sm:text-[15px] lg:text-[17px] tracking-[0.24em] mb-7 sm:mb-8 lg:mb-10"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
            >
              Kleine Gruppenreisen ins Herz Zentralasiens
            </p>

            <h1
              className="font-display font-normal text-white animate-slide-up text-[56px] sm:text-[72px] md:text-[88px] lg:text-[104px] xl:text-[116px] leading-[0.94] tracking-[-0.015em] mb-8 sm:mb-9 lg:mb-10"
              style={{ textShadow: "0 4px 28px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.5)" }}
            >
              Kirgisistan.
              <span
                className="block lg:whitespace-nowrap"
                style={{ color: "hsl(var(--gold))", textShadow: "0 4px 28px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.5)" }}
              >
                Authentisch erleben.
              </span>
            </h1>

            <p
              className="font-sans text-white/90 animate-fade-in-up leading-[1.55] max-w-[520px] lg:max-w-[600px] text-[17px] sm:text-[19px] lg:text-[22px] mb-9 sm:mb-10 lg:mb-12"
              style={{ animationDelay: "0.15s", textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
            >
              Abseits des Massentourismus: echte Nomadenkultur, wilde Berglandschaften und
              herzliche Gastfreundschaft – persönlich geplant von Anfang bis Ende.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 animate-fade-in-up mb-8 sm:mb-9 lg:mb-10 justify-center items-center"
              style={{ animationDelay: "0.25s" }}
            >
              <Link
                to="/buchen"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 shadow-lift hover:shadow-glow text-[14px] sm:text-[15px] lg:text-[16px]"
              >
                Reise finden <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/#reisen"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:border-white/50 text-[14px] sm:text-[15px] lg:text-[16px]"
              >
                Unverbindlich anfragen
              </Link>
            </div>

            <p
              className="flex items-center justify-center gap-2 text-white/80 tracking-wide animate-fade-in-up text-[13px] sm:text-[15px] lg:text-[17px]"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)", animationDelay: "0.35s" }}
            >
              <Star className="h-4 w-4 fill-gold text-gold" />
              5,0 / 5,0 · Kleine Gruppen · Lokale Gastgeber
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

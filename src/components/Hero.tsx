import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex h-[700px] w-full items-center overflow-hidden bg-primary sm:h-[720px] lg:h-[74vh] lg:min-h-[620px] lg:max-h-[700px]">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-wide.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-45 blur-xl"
        />
        <img
          src="/hero-wide.jpg"
          alt="Jurten-Lager im Tian Shan Gebirge von Kirgisistan"
          loading="eager"
          className="absolute inset-0 h-full w-full object-contain"
        />
        {/* Sehr sanfte Abdunklung, damit das Foto lebendig bleibt */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,30,26,0.42)_0%,rgba(5,30,26,0.18)_40%,rgba(5,30,26,0.35)_100%)]" />
        <div className="absolute inset-0 bg-gradient-vignette" />
      </div>

      {/* Lokaler Lesbarkeits-Verlauf direkt hinter dem Text-Block */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[85%] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,30,26,0.72) 0%, rgba(5,30,26,0.45) 42%, rgba(5,30,26,0.18) 68%, transparent 78%)",
        }}
      />

      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full px-6 pt-20 lg:pt-24">
          <div className="max-w-[600px] lg:max-w-[780px] mx-auto text-center">
            <p
              className="font-semibold uppercase text-white animate-fade-in-up text-[13px] sm:text-[15px] lg:text-[17px] tracking-[0.24em] mb-7 sm:mb-8 lg:mb-10"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.65)" }}
            >
              Kleine Gruppenreisen ins Herz Zentralasiens
            </p>

            <h1
              className="font-display font-normal text-white animate-slide-up text-[56px] sm:text-[72px] md:text-[88px] lg:text-[104px] xl:text-[116px] leading-[0.94] tracking-[-0.015em] mb-8 sm:mb-9 lg:mb-10"
              style={{ textShadow: "0 6px 36px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.55)" }}
            >
              Kirgisistan.
              <span
                className="block lg:whitespace-nowrap"
                style={{ color: "hsl(var(--gold))", textShadow: "0 6px 36px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.55)" }}
              >
                Authentisch erleben.
              </span>
            </h1>

            <p
              className="font-sans text-white animate-fade-in-up leading-[1.65] max-w-[520px] lg:max-w-[620px] text-[17px] sm:text-[19px] lg:text-[22px] mb-9 sm:mb-10 lg:mb-12"
              style={{ animationDelay: "0.15s", textShadow: "0 3px 22px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.6)" }}
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
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-md px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/60 text-[14px] sm:text-[15px] lg:text-[16px]"
              >
                Unverbindlich anfragen
              </Link>
            </div>

            <p
              className="flex items-center justify-center gap-2 text-white tracking-wide animate-fade-in-up text-[13px] sm:text-[15px] lg:text-[17px]"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.65)", animationDelay: "0.35s" }}
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

import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-[760px] sm:h-[820px] lg:h-[92vh] lg:min-h-[640px] flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.jpg"
          alt="Jurten-Lager im Tian Shan Gebirge von Kirgisistan"
          loading="eager"
          className="h-full w-full object-cover animate-[scale-in_1.5s_ease-out_forwards]"
          style={{ transform: "scale(1.05)" }}
        />
        <div className="absolute inset-0 bg-gradient-cinematic" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,30,26,0.4)] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full px-6 lg:pl-[19vw] lg:pr-6">
          <div className="max-w-[560px] lg:max-w-[700px] lg:-mt-[3vh]">
            <p
              className="font-semibold uppercase text-white/90 animate-fade-in-up text-[12px] sm:text-[14px] lg:text-[16px] tracking-[0.24em] mb-8 sm:mb-9 lg:mb-10"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
            >
              Persönliche Reisen durch Kirgisistan
            </p>

            <h1
              className="font-display font-normal text-white animate-slide-up text-[52px] sm:text-[68px] md:text-[80px] lg:text-[96px] leading-[0.94] tracking-[-0.015em] mb-9 sm:mb-10 lg:mb-12"
              style={{ textShadow: "0 4px 28px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.5)" }}
            >
              Kirgisistan.
              <span
                className="block"
                style={{ color: "hsl(var(--gold))", textShadow: "0 4px 28px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.5)" }}
              >
                Anders erleben.
              </span>
            </h1>

            <p
              className="font-sans text-white/90 animate-fade-in-up leading-[1.5] max-w-[560px] text-[16px] sm:text-[18px] lg:text-[22px] mb-8 sm:mb-9 lg:mb-11"
              style={{ animationDelay: "0.15s", textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
            >
              Kleine Gruppen, lokale Gastgeber und persönlich geplante Reisen – von der ersten
              Anfrage bis zur Heimreise.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in-up mb-7 sm:mb-8 lg:mb-9"
              style={{ animationDelay: "0.25s" }}
            >
              <Link
                to="/buchen"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 shadow-lift hover:shadow-glow text-[14px] sm:text-[15px] lg:text-[16px]"
              >
                Reise entdecken <ArrowRight className="h-4 w-4" />
              </Link>
              
                href="#reisen"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:border-white/50 text-[14px] sm:text-[15px] lg:text-[16px]"
              >
                Persönliche Reise anfragen
              </a>
            </div>

            <p
              className="flex items-center gap-2 text-white/70 tracking-wide animate-fade-in-up text-[12px] sm:text-[14px] lg:text-[16px]"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)", animationDelay: "0.35s" }}
            >
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              5,0 / 5,0 · Kleine Gruppen · Persönlich geplant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

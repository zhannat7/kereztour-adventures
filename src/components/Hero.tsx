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
              className="font-semibold uppercase text-white animate-fade-in-up"
              style={{ fontSize: "16px", letterSpacing: "0.26em", marginBottom: "36px", textShadow: "0 2px 18px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.65)" }}
            >
              Persönliche Reisen durch Kirgisistan
            </p>

            <h1
              className="font-display font-normal text-white animate-slide-up"
              style={{
                fontSize: "clamp(58px, 6.8vw, 96px)",
                lineHeight: 0.96,
                letterSpacing: "-0.015em",
                textShadow: "0 4px 32px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.55)",
                marginBottom: "46px",
              }}
            >
              Kirgisistan.
              <span
                className="block"
                style={{ color: "hsl(var(--gold))", textShadow: "0 4px 32px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.55)" }}
              >
                Anders erleben.
              </span>
            </h1>

            <p
              className="font-sans text-white/95 animate-fade-in-up"
              style={{
                fontSize: "22px",
                lineHeight: 1.65,
                maxWidth: "600px",
                marginBottom: "52px",
                animationDelay: "0.15s",
                textShadow: "0 3px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.55)",
              }}
            >
              Kleine Gruppen, lokale Gastgeber und persönlich geplante Reisen – von der ersten
              Anfrage bis zur Heimreise.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-6 animate-fade-in-up"
              style={{ animationDelay: "0.25s", marginBottom: "44px" }}
            >
              <Link
                to="/buchen"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-10 py-[18px] text-lg font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 shadow-lift hover:shadow-glow"
              >
                Reise entdecken <ArrowRight className="h-6 w-6" />
              </Link>
              
              <a
                href="#reisen"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/45 bg-white/12 backdrop-blur-sm px-10 py-[18px] text-lg font-semibold text-white transition-all duration-300 hover:bg-white/18 hover:border-white/65"
              >
                Persönliche Reise anfragen
              </a>
            </div>

            <p
              className="flex items-center gap-3 text-white/90 tracking-wide animate-fade-in-up"
              style={{ fontSize: "16px", lineHeight: 1.6, textShadow: "0 2px 18px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.65)", animationDelay: "0.35s" }}
            >
              <Star className="h-5 w-5 fill-gold text-gold" />
              5,0 / 5,0 · Kleine Gruppen · Persönlich geplant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

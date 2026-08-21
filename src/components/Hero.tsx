import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-[92vh] min-h-[640px] flex items-center overflow-hidden bg-background">
      {/* Background image — rich, cinematic, no pale wash */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.jpg"
          alt="Jurten-Lager im Tian Shan Gebirge von Kirgisistan"
          loading="eager"
          className="h-full w-full object-cover animate-[scale-in_1.5s_ease-out_forwards]"
          style={{ transform: "scale(1.05)" }}
        />
        <div className="absolute inset-0 bg-gradient-cinematic" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsla(168,45%,6%,0.55)] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-[700px]">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] text-white mb-7 animate-fade-in-up"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
          >
            Persönliche Reisen durch Kirgisistan
          </p>

          <h1
            className="font-display font-normal text-white mb-7 animate-slide-up"
            style={{
              fontSize: "clamp(64px, 6.8vw, 92px)",
              lineHeight: 0.92,
              letterSpacing: "-0.01em",
              maxWidth: "720px",
              textShadow: "0 4px 24px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            Kirgisistan.
            <span className="text-gold block" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.5)" }}>
              Anders erleben.
            </span>
          </h1>

          <p
            className="font-sans text-white leading-[1.45] max-w-[560px] mb-7 animate-fade-in-up"
            style={{ fontSize: "18px", animationDelay: "0.15s", textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
          >
            Kleine Gruppen, lokale Gastgeber und persönlich geplante Reisen – von der ersten
            Anfrage bis zur Heimreise.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            <Link
              to="/buchen"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 shadow-lift hover:shadow-glow"
            >
              Reise entdecken <ArrowRight className="h-4 w-4" />
            </Link>
            
              href="#reisen"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 bg-transparent px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/10"
            >
              Persönliche Reise anfragen
            </a>
          </div>

          <p
            className="flex items-center gap-2 text-white/80 tracking-wide animate-fade-in-up"
            style={{ fontSize: "13px", animationDelay: "0.35s", textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
          >
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            5,0 / 5,0 · Kleine Gruppen · Persönlich geplant
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;

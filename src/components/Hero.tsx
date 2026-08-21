import { Link } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Users, MessageCircle, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background image — natural, cinematic */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.jpg"
          alt="Jurten-Lager im Tian Shan Gebirge von Kirgisistan"
          loading="eager"
          className="h-full w-full object-cover animate-[scale-in_1.5s_ease-out_forwards]"
          style={{ transform: "scale(1.05)" }}
        />
        {/* Cinematic vignette for depth */}
        <div className="absolute inset-0 bg-gradient-vignette" />
        {/* Soft warm glow in top-right corner */}
        <div className="absolute inset-0 bg-gradient-sun" />
        {/* Localized readability veil behind text only */}
        <div className="absolute inset-0 bg-gradient-text-veil" />
        {/* Bottom fade for the location bar */}
        <div className="absolute inset-0 bg-gradient-bottom-fade" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-28 md:pt-40 md:pb-32">
        <div className="max-w-2xl">
          {/* Premium eyebrow badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/70 backdrop-blur-md px-4 py-1.5 mb-6 animate-fade-in-up shadow-soft">
            <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Persönliche Reisen durch Kirgisistan
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-foreground leading-[0.95] mb-6 animate-slide-up [text-shadow:0_2px_30px_hsla(40,33%,98%,0.75)]">
            Kirgisistan, wie du es sonst
            <span className="italic text-gold block">nicht erleben würdest.</span>
          </h1>

          {/* Subline */}
          <p
            className="text-lg md:text-xl text-foreground/85 leading-relaxed max-w-xl mb-10 animate-fade-in-up [text-shadow:0_1px_20px_hsla(40,33%,98%,0.7)]"
            style={{ animationDelay: "0.15s" }}
          >
            Kleine Gruppen, lokale Gastgeber und ein Programm, das von der ersten Anfrage bis zur
            Heimreise durchdacht ist. Geplant und begleitet von Sarina.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 mb-14 animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            <Link
              to="/buchen"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 shadow-lift hover:shadow-glow"
            >
              Kostenlos anfragen <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#reisen"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/15 bg-white/65 backdrop-blur-md px-8 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-white/80 hover:border-primary/25 shadow-soft"
            >
              Reisen ansehen
            </a>
          </div>

          {/* Trust pills */}
          <div
            className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-foreground/75 animate-fade-in-up"
            style={{ animationDelay: "0.35s" }}
          >
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Max. 12 Personen
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Voll organisiert
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" /> Antwort innerhalb 24 Std.
            </span>
          </div>
        </div>
      </div>

      {/* Floating proof card — light glass */}
      <div
        className="hidden md:flex absolute bottom-36 right-8 lg:right-16 z-20 items-center gap-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-border px-6 py-5 shadow-lift max-w-[18rem] animate-fade-in-up"
        style={{ animationDelay: "0.45s" }}
      >
        <p className="font-display text-5xl text-primary leading-none">12</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Reisende pro Gruppe – nie mehr. Damit jede Begegnung echt bleibt.
        </p>
      </div>

      {/* Social proof star card — top right on desktop */}
      <div
        className="hidden lg:flex absolute top-40 right-16 z-20 flex-col items-center gap-1 rounded-2xl bg-white/70 backdrop-blur-xl border border-border px-6 py-4 shadow-lift animate-fade-in-up"
        style={{ animationDelay: "0.55s" }}
      >
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-gold text-gold" />
          ))}
        </div>
        <span className="text-sm font-semibold text-foreground">5,0</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Gästebewertung</span>
      </div>

      {/* Bottom location bar — light glass */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-white/75 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-foreground/80 text-sm">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" />
            Tian Shan Gebirge, Kirgisistan
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            10 Tage · Premium Jurten · Lokale Gastgeber
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

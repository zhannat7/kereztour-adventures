import { Link } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Users, MessageCircle, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.jpg"
          alt="Jurten-Lager im Tian Shan Gebirge von Kirgisistan"
          loading="eager"
          className="h-full w-full object-cover animate-[scale-in_1.5s_ease-out_forwards]"
          style={{ transform: "scale(1.05)" }}
        />
        {/* Left-to-right readability veil */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/50 to-transparent" />
        {/* Bottom veil for floating card + bottom bar */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-28 md:pt-40 md:pb-32">
        <div className="max-w-3xl">
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-md px-4 py-1.5 mb-8 animate-fade-in-up">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="text-xs font-medium text-primary-foreground/90">5,0 aus echten Gästestimmen</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-primary-foreground leading-[0.95] mb-7 animate-slide-up">
            Kirgisistan erleben,
            <span className="italic text-secondary block">nicht besuchen.</span>
          </h1>

          {/* Subline */}
          <p className="text-lg md:text-xl text-primary-foreground/85 leading-relaxed max-w-xl mb-10 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            Kleine Gruppen, lokale Gastgeber und ein Programm, das von der ersten Anfrage bis zur
            Heimreise durchdacht ist. Geplant und begleitet von Sarina.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            <Link
              to="/buchen"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-4 text-sm font-semibold text-secondary-foreground transition-all duration-300 hover:brightness-105 shadow-glow"
            >
              Kostenlos anfragen <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#reisen"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 backdrop-blur-md px-8 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/20"
            >
              Reisen ansehen
            </a>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-primary-foreground/80 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-secondary" /> Max. 12 Personen
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-secondary" /> Voll organisiert
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-secondary" /> Antwort innerhalb 24 Std.
            </span>
          </div>
        </div>
      </div>

      {/* Floating proof card */}
      <div className="hidden md:flex absolute bottom-28 right-8 lg:right-16 z-20 items-center gap-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-border px-6 py-5 shadow-lift max-w-[18rem] animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
        <p className="font-display text-5xl text-primary leading-none">12</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Reisende pro Gruppe – nie mehr. Damit jede Begegnung echt bleibt.
        </p>
      </div>

      {/* Bottom location bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-primary-foreground/10 bg-primary/40 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-primary-foreground/80 text-sm">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary" />
            Tian Shan Gebirge, Kirgisistan
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-primary-foreground/60">
            10 Tage · Premium Jurten · Lokale Gastgeber
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { Link } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Users, MessageCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-background pt-10 pb-6 md:pt-14 md:pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-soft mb-7">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground">5,0 aus echten Gästestimmen</span>
            </div>

            <h1 className="font-display text-[2.7rem] leading-[1.05] md:text-6xl lg:text-[4.2rem] text-foreground mb-6">
              Kirgisistan erleben –
              <span className="block italic text-primary">persönlich geführt, wirklich nah.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              Kleine Gruppen, lokale Gastgeber und ein Programm, das von der ersten Anfrage bis zur
              Heimreise durchdacht ist. Geplant und begleitet von Sarina – geboren in Kirgisistan,
              zuhause in beiden Welten.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link to="/buchen" className="btn-accent">
                Kostenlos anfragen <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#reisen" className="btn-ghost">
                Reisen ansehen
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Max. 12 Personen
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Voll organisiert, keine Anzahlung
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" /> Antwort innerhalb 24 Std.
              </span>
            </div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="relative overflow-hidden rounded-[1.75rem] shadow-lift aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <img
                  src={heroAsset.url}
                  alt="Landschaft in Kirgisistan – Tian Shan Gebirge"
                  loading="eager"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-veil" />

                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/90">
                    Tian Shan Gebirge
                  </p>
                </div>
              </div>

              {/* Floating proof card */}
              <div className="hidden sm:flex absolute -bottom-7 -left-4 lg:-left-8 items-center gap-4 rounded-2xl bg-card border border-border px-5 py-4 shadow-lift max-w-[16rem]">
                <p className="font-display text-4xl text-primary leading-none">12</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reisende pro Gruppe – nie mehr. Damit jede Begegnung echt bleibt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

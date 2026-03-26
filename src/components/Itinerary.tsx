import { useScrollReveal } from "@/hooks/useScrollReveal";

const days = [
  { day: 1, title: "Ankunft Bischkek", desc: "Stadttour, Ala-Too-Platz, Museum, Restaurant Supara" },
  { day: 2, title: "Chon-Kemin", desc: "Naturreservat, Burana-Turm, Zusammenfluss zweier Flüsse" },
  { day: 3, title: "Issyk-Kul Südufer", desc: "Adlerjagd, Skazka Canyon, Schwimmen, Jurten-Hotel" },
  { day: 4, title: "Barskoon & Dscheti-Oguz", desc: "Wasserfälle, Kosmonauten-Denkmäler, Jurtenaufbau" },
  { day: 5, title: "Dscheti-Oguz-Schlucht", desc: "Wanderung, Sieben Stiere, Karakol, heiße Quellen" },
  { day: 6, title: "Altyn-Arashan", desc: "4h Wanderung, Thermalquellen, Rückweg per Pferd oder Geländefahrzeug" },
  { day: 7, title: "Karakol & Tscholpon-Ata", desc: "Russisch-orthodoxe Kirche, Dunganen-Moschee" },
  { day: 8, title: "Issyk-Kul Nordküste", desc: "Ruh Ordo Museum, Bootsfahrt, Petroglyphen, Schwimmen" },
  { day: 9, title: "Rückkehr Bischkek", desc: "Größter Basar, Abschiedsabendessen mit Livemusik" },
  { day: 10, title: "Abreise", desc: "Transfer zum Flughafen Manas" },
];

const Itinerary = () => {
  const ref = useScrollReveal();

  return (
    <section id="reiseplan" className="py-24 md:py-32 bg-muted/40 relative">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
            Tag für Tag
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground">
            Dein <span className="italic text-primary">Reiseplan</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {days.map((d) => (
            <div
              key={d.day}
              className="stagger-child group relative rounded-2xl bg-card border border-border p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 flex flex-col"
            >
              {/* Day number */}
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold transition-transform duration-300 group-hover:scale-110">
                  {d.day}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tag {d.day}
                </span>
              </div>
              <h3 className="font-display text-base md:text-lg text-foreground mb-2 leading-snug">
                {d.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-auto">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Itinerary;

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

const Itinerary = () => (
  <section id="reiseplan" className="py-20 bg-card">
    <div className="container mx-auto px-4 max-w-5xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-14">
        Reiseplan – Tag für Tag
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {days.map((d) => (
          <div
            key={d.day}
            className="rounded-xl border border-border p-5 flex flex-col gap-3"
            style={{ backgroundColor: "#f5f0e8" }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {d.day}
              </span>
              <span className="font-display text-sm md:text-base font-semibold text-foreground">
                Tag {d.day} – {d.title}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {d.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Itinerary;

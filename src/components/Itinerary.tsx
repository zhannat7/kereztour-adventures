import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const days = [
  { day: 1, title: "Ankunft in Bischkek", desc: "Ankunft am Flughafen Manas, Transfer ins Hotel. Stadttour: Ala-Too-Platz, Eichenpark und historisches Museum. Abendessen im traditionellen Restaurant Supara." },
  { day: 2, title: "Chon-Kemin", desc: "Besuch des Burana-Turms (UNESCO). Weiterfahrt zum Chon-Kemin-Naturreservat – Beobachtung des Zusammenflusses zweier Gebirgsflüsse." },
  { day: 3, title: "Issyk-Kul Südufer", desc: "Vorführung der traditionellen Adlerjagd mit Steinadlern. Besuch der Märchenschlucht Skazka. Schwimmen im Issyk-Kul." },
  { day: 4, title: "Barskoon & Dscheti-Oguz", desc: "Wasserfälle in Barskoon und Kosmonauten-Denkmäler. Gemeinsamer Aufbau einer traditionellen Jurte mit Einheimischen." },
  { day: 5, title: "Dscheti-Oguz & Karakol", desc: "Wanderung durch die Schlucht mit den roten Sandsteinformationen – die Sieben Stiere und das Gebrochene Herz. Fahrt nach Karakol. Optional: heiße Quellen." },
  { day: 6, title: "Altyn-Arashan", desc: "4-stündige Wanderung ins Altyn-Arashan-Tal. Baden in natürlichen heißen Thermalquellen. Rückweg per Pferd oder Geländefahrzeug." },
  { day: 7, title: "Historische Kirchen & Moschee", desc: "Russisch-orthodoxe Kirche und einzigartige Dunganen-Moschee – komplett ohne einen einzigen Nagel gebaut. Fahrt nach Tscholpon-Ata." },
  { day: 8, title: "Ruh Ordo & Petroglyphen", desc: "Kulturmuseum Ruh Ordo. Bootsfahrt auf dem Issyk-Kul mit Blick auf das Tien-Shan-Gebirge. Petroglyphen-Museum mit Felszeichnungen aus 2000 v. Chr." },
  { day: 9, title: "Rückkehr nach Bischkek", desc: "Besuch des größten Basars des Landes. Festliches Abschiedsabendessen mit traditioneller kirgisischer Livemusik." },
  { day: 10, title: "Heimreise", desc: "Transfer zum Flughafen Manas und individuelle Abreise." },
];

const Itinerary = () => {
  const ref = useScrollReveal();

  return (
    <section id="reiseplan" className="py-24 md:py-32 bg-muted/40 relative">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
            Kultur Tour · Tag für Tag
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground">
            Dein <span className="italic text-primary">Reiseplan</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            10 unvergessliche Tage durch Kirgisistans schönste Orte – Kultur, Natur und echte Begegnungen.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {days.map((d) => (
            <div
              key={d.day}
              className="stagger-child group relative rounded-2xl bg-card border border-border p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 flex flex-col"
            >
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

        <div className="mt-12 text-center">
          <Link
            to="/reisen/kultur"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Mehr zur Kultur Tour <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Itinerary;

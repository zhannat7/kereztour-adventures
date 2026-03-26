import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const days = [
  { day: 1, title: "Ankunft in Bischkek", desc: "Ankunft Flughafen Manas, Transfer zum Hotel in Bischkek. Stadttour: Ala-Too-Platz, Eichenpark, Historisches Museum. Abendessen im Restaurant Supara." },
  { day: 2, title: "Chon-Kemin-Reservat", desc: "Fahrt zum Chon-Kemin-Reservat, Halt am Burana-Turm, Zusammenfluss zweier Flüsse. Übernachtung im lokalen Hotel." },
  { day: 3, title: "Issyk-Kul Südufer", desc: "Adlerjagd-Vorführung in Bokonbaeva, Canyons Skazka & Ak-Sai, Schwimmen im See. Übernachtung im Jurten-Hotel." },
  { day: 4, title: "Barskoon & Dscheti-Oguz", desc: "Barskoon Wasserfälle, Kosmonauten-Denkmäler, Jurtenaufbau mit Einheimischen. Fahrt nach Dscheti-Oguz, Übernachtung." },
  { day: 5, title: "Dscheti-Oguz-Schlucht", desc: "Wanderung (Sieben Stiere & Gebrochenes Herz), Fahrt nach Karakol, heiße Quellen, Übernachtung." },
  { day: 6, title: "Altyn-Arashan-Tal", desc: "4-stündige Wanderung, Thermalquellen, Rückweg per Pferd oder Geländefahrzeug." },
  { day: 7, title: "Karakol & Tscholpon-Ata", desc: "Russisch-orthodoxe Kirche, Dunganen-Moschee (ohne Nägel gebaut). Fahrt nach Tscholpon-Ata." },
  { day: 8, title: "Ruh Ordo & Issyk-Kul", desc: "Freilichtmuseum Ruh Ordo, Bootsfahrt auf dem Issyk-Kul-See, Petroglyphen-Museum, Schwimmen." },
  { day: 9, title: "Rückfahrt & Abschied", desc: "Rückfahrt nach Bischkek, größter Basar. Abschiedsabendessen mit kirgisischer Livemusik." },
  { day: 10, title: "Abreise", desc: "Transfer zum Flughafen Manas, individuelle Abreise." },
];

const Itinerary = () => (
  <section id="reiseplan" className="py-20 bg-card">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-14">
        Reiseplan – Tag für Tag
      </h2>
      <Accordion type="single" collapsible className="space-y-3">
        {days.map((d) => (
          <AccordionItem
            key={d.day}
            value={`day-${d.day}`}
            className="rounded-xl border border-border bg-background px-6 overflow-hidden"
          >
            <AccordionTrigger className="text-left hover:no-underline py-5">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {d.day}
                </span>
                <span className="font-display text-base font-semibold text-foreground">
                  Tag {d.day}: {d.title}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-5 pl-12">
              {d.desc}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default Itinerary;

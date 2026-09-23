import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, Users, Home, Hotel, Star, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

import t1a from "@/assets/gallery/IMG_2518.jpg";
import t1b from "@/assets/gallery/11.png";
import t1c from "@/assets/gallery/12.png";
import t1d from "@/assets/gallery/13.png";
import t1e from "@/assets/gallery/14.png";
import t2a from "@/assets/gallery/IMG_2646.jpg";
import t2b from "@/assets/gallery/IMG_2677.jpg";
import t2c from "@/assets/gallery/21.png";
import t2d from "@/assets/gallery/22.png";
import t3a from "@/assets/gallery/IMG_4663.jpg";
import t3b from "@/assets/gallery/IMG_3007.jpg";
import t3c from "@/assets/gallery/31.png";
import t3d from "@/assets/gallery/32.png";
import t4a from "@/assets/gallery/IMG_4858.jpg";
import t4b from "@/assets/gallery/IMG_4846.jpg";
import t4c from "@/assets/gallery/41.png";
import t4d from "@/assets/gallery/42.png";
import t5a from "@/assets/gallery/IMG_3600.jpg";
import t5b from "@/assets/gallery/51.png";
import t6a from "@/assets/gallery/IMG_4933.jpg";
import t6b from "@/assets/gallery/IMG_4920.jpg";
import t8a from "@/assets/gallery/IMG_4992.jpg";
import t8b from "@/assets/gallery/IMG_3858.jpg";
import t8c from "@/assets/gallery/81.png";
import t9a from "@/assets/gallery/82.png";
import t9b from "@/assets/gallery/91.png";
import t10a from "@/assets/gallery/10.png";

const days = [
  { day: 1, title: "Ankunft in Bischkek", desc: "Ankunft am Flughafen Manas, Transfer ins Hotel. Nach einer Ruhepause Mittagessen in einem lokalen Restaurant. Stadttour: Ala-Too-Platz, Eichenpark und historisches Museum. Abendessen im traditionellen Restaurant Supara.", stay: "Hotel in Bischkek", photos: [t1a, t1b, t1c, t1d, t1e] },
  { day: 2, title: "Chon-Kemin", desc: "Fahrt zum einzigartigen Chon-Kemin-Naturreservat mit Halt am historischen Burana-Turm (UNESCO). Beobachtung des Zusammenflusses zweier Gebirgsflüsse. Abendessen und Übernachtung im lokalen Hotel.", stay: "Lokales Hotel in Chon-Kemin", photos: [t2a, t2b, t2c, t2d] },
  { day: 3, title: "Issyk-Kul Südufer", desc: "Halt im Dorf Bokonbaeva: Vorführung der traditionellen Adlerjagd mit Steinadlern (Berkut). Besuch der Märchenschlucht Skazka und des Ak-Sai-Canyons. Schwimmen im Issyk-Kul-See.", stay: "Traditionelles Jurten-Hotel", photos: [t3a, t3b, t3c, t3d] },
  { day: 4, title: "Barskoon & Dscheti-Oguz", desc: "Besuch der Wasserfälle in Barskoon und der Kosmonauten-Denkmäler. Gemeinsamer Aufbau einer traditionellen Jurte mit Einheimischen, die kunstvolle Wollenteppiche nach kirgisischer Tradition herstellen.", stay: "Unterkunft in Dscheti-Oguz", photos: [t4a, t4b, t4c, t4d] },
  { day: 5, title: "Dscheti-Oguz & Karakol", desc: "Wanderung durch die malerische Dscheti-Oguz-Schlucht – bekannt für die roten Sandsteinformationen Sieben Stiere und das Gebrochene Herz. Fahrt nach Karakol. Optional: Besuch der heißen Quellen.", stay: "Hotel in Karakol", photos: [t5a, t5b] },
  { day: 6, title: "Altyn-Arashan", desc: "Fahrt ins Altyn-Arashan-Tal (Goldene Heilquelle). 4-stündige Wanderung durch dichte Wälder und alpine Landschaft. Baden in natürlichen heißen Thermalquellen. Rückweg per Pferd oder Geländefahrzeug.", stay: "Unterkunft in Altyn-Arashan", photos: [t6a, t6b] },
  { day: 7, title: "Historische Kirchen & Dunganen-Moschee", desc: "Besuch der historischen russisch-orthodoxen Kirche und der einzigartigen Dunganen-Moschee – ein Holzbauwerk komplett ohne einen einzigen Nagel. Fahrt zur Nordküste nach Tscholpon-Ata.", stay: "Hotel in Tscholpon-Ata", photos: [] },
  { day: 8, title: "Ruh Ordo, Bootsfahrt & Petroglyphen", desc: "Besuch des Kulturmuseums Ruh Ordo. Entspannte Bootsfahrt auf dem Issyk-Kul mit Blick auf das Tien-Shan-Gebirge. Petroglyphen-Museum mit Felszeichnungen aus ca. 2000 v. Chr. Bad im See.", stay: "Hotel an der Nordküste", photos: [t8a, t8b, t8c] },
  { day: 9, title: "Rückkehr nach Bischkek", desc: "Rückfahrt nach Bischkek. Besuch des größten Basars des Landes. Festliches Abschiedsabendessen mit Klängen traditioneller kirgisischer Instrumente.", stay: "Hotel in Bischkek", photos: [t9a, t9b] },
  { day: 10, title: "Heimreise", desc: "Transfer zum Flughafen Manas und individuelle Abreise.", stay: "", photos: [t10a] },
];

const tiers = [
  { name: "Economy", price: "990", featured: false, tagline: "Authentisch & erschwinglich", details: [{ icon: Users, text: "Gruppe bis 12 Personen" }, { icon: Home, text: "Hostel & Jurte, Mehrbettzimmer" }, { icon: Star, text: "Standard Service" }] },
  { name: "Comfort", price: "1.490", featured: true, tagline: "Exklusiv & komfortabel", details: [{ icon: Users, text: "Kleine Gruppe, max. 4 Personen" }, { icon: Hotel, text: "Luxushotel, Einzel-/Doppelzimmer" }, { icon: Star, text: "Premium Service" }] },
];

const highlights = [
  "Traditionelle Adlerjagd mit Steinadlern im Dorf Bokonbaeva",
  "Baden im türkisfarbenen Issyk-Kul-See",
  "Thermalquellen in Altyn-Arashan – der Goldenen Heilquelle",
  "Dunganen-Moschee – ein Holzbauwerk ohne einen einzigen Nagel",
  "Bootsfahrt mit Blick auf das Tien-Shan-Gebirge",
  "Petroglyphen aus ca. 2000 v. Chr.",
  "Burana-Turm (UNESCO-Erbe)",
  "Jurtenaufbau mit Einheimischen",
  "Festliches Abschiedsabendessen mit kirgisischer Livemusik",
];

const PhotoSlider = ({ photos }: { photos: string[] }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const itemW = photos.length <= 2 ? 220 : photos.length <= 4 ? 140 : 110;
  const itemH = photos.length <= 2 ? 140 : photos.length <= 4 ? 100 : 80;
  const activeW = 280;
  const activeH = 200;

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      style={{ scrollbarWidth: "none" }}
      onMouseLeave={() => setActiveIdx(null)}
    >
      {photos.map((photo, i) => (
        <div
          key={i}
          onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          onMouseEnter={() => setActiveIdx(i)}
          className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer"
          style={{
            width: activeIdx === i ? `${activeW}px` : `${itemW}px`,
            height: activeIdx === i ? `${activeH}px` : `${itemH}px`,
            opacity: activeIdx !== null && activeIdx !== i ? 0.45 : 1,
            transition: "all 0.35s cubic-bezier(0.34, 1.1, 0.64, 1)",
          }}
        >
          <img src={photo} loading="lazy" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
};

const Kultur = () => {
  const [activeDay, setActiveDay] = useState(0);
  const [cultureDates, setCultureDates] = useState<Array<{
    id: string;
    date: string;
    label: string;
    maxParticipants: number;
    availablePlaces: number;
    status: string;
  }>>([]);
  const dayRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const loadCultureDates = async () => {
      const { data, error } = await (supabase as any).rpc("get_tour_date_availability");

      if (error) {
        setCultureDates([]);
        return;
      }

      setCultureDates(
        ((data as any[]) ?? [])
          .filter((item: any) => item.tour === "Kultur Tour")
          .map((item: any) => ({
            id: item.id,
            date: item.start_date,
            label: format(parseISO(item.start_date), "dd.MM.") + "–" + format(parseISO(item.end_date), "dd.MM.yyyy"),
            maxParticipants: Number(item.max_participants),
            availablePlaces: Number(item.available_places),
            status: item.status,
          }))
      );
    };

    loadCultureDates();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowMid = window.scrollY + window.innerHeight / 2;
      let closest = 0;
      let closestDist = Infinity;
      dayRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elMid = window.scrollY + rect.top + rect.height / 2;
        const dist = Math.abs(windowMid - elMid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveDay(closest);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-background pb-24 pt-24 md:pt-32">
        <div className="container mx-auto max-w-5xl px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>

          <div className="mb-16">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
              10 Tage · Gruppenreise
            </span>
            <h1 className="mb-5 font-display text-5xl leading-tight text-foreground md:text-7xl lg:text-8xl">
              Kultur Tour
              <span className="block text-2xl md:text-3xl italic text-primary mt-2">
                Kirgisistan von seiner schönsten Seite
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              10 Tage durch Kirgisistans kulturelle Highlights – von der Hauptstadt Bischkek
              bis zum majestätischen Issyk-Kul-See. Authentische Erlebnisse, atemberaubende
              Natur und unvergessliche Begegnungen.
            </p>
          </div>

          <div className="mb-20">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
              Was dich <span className="italic text-primary">erwartet</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 border-b border-border bg-card p-4">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-12">
              Dein <span className="italic text-primary">Reiseplan</span>
            </h2>

            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border md:left-8" />
              <div className="space-y-16">
                {days.map((d, i) => (
                  <div
                    key={d.day}
                    className="relative flex gap-6 md:gap-10"
                    ref={(el) => { if (el) dayRefs.current[i] = el; }}
                  >
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-sm font-bold text-base ring-4 ring-background md:h-16 md:w-16 md:text-xl transition-all duration-500 ${activeDay === i ? "bg-primary text-primary-foreground scale-110" : "bg-card border-2 border-primary text-primary"}`}>
                        {d.day}
                      </div>
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-1">Tag {d.day}</p>
                      <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">{d.title}</h3>
                      <div className="flex flex-col gap-3 mb-5">
                        <p className="text-base text-muted-foreground leading-relaxed">{d.desc}</p>
                        {d.stay && (
                          <div className="inline-flex self-start items-center gap-2 rounded-sm bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                            Unterkunft: {d.stay}
                          </div>
                        )}
                      </div>
                      {d.photos.length > 0 && <PhotoSlider photos={d.photos} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-16 border-y border-border bg-sand/50 p-6 md:p-8">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary mb-2">Nächste Reisetermine</p>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                Deinen <span className="italic text-primary">Termin auswählen</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Die Termine sind geplant und werden nach deiner Anfrage von Sarina bestätigt. Erst danach erfolgt die Zahlung.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cultureDates.length > 0 ? (
                cultureDates.map((item) => {
                  const isFull = item.status === "full" || item.availablePlaces <= 0;
                  return (
                    <div key={item.id} className="border border-border bg-card p-5">
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-primary mt-1 mb-4">
                        {isFull ? "Ausgebucht" : "Noch " + item.availablePlaces + " " + (item.availablePlaces === 1 ? "Platz" : "Plätze") + " verfügbar"}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {tiers.map((tier) => (
                          <Link
                            key={tier.name}
                            to={isFull ? "#" : "/buchen?tour=kultur&tier=" + tier.name.toLowerCase() + "&date=" + item.date}
                            aria-disabled={isFull}
                            className={"inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors " + (isFull ? "pointer-events-none opacity-50" : "hover:border-primary hover:text-primary")}
                          >
                            {tier.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="border border-border bg-card p-5 text-sm text-muted-foreground md:col-span-3">
                  Aktuell sind keine Reisetermine verfügbar.
                </div>
              )}
            </div>
          </div>

          <div className="mb-16">
            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                Deine <span className="italic text-primary">Reisevariante</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Das Reiseerlebnis bleibt gleich – du entscheidest, welche Unterkunft und welchen Komfort du bevorzugst.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-soft md:p-7"
                >
                  <div className="flex items-start justify-between gap-5 mb-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">{tier.tagline}</p>
                      <h3 className="font-display text-2xl md:text-3xl text-foreground">{tier.name}</h3>
                    </div>
                    {tier.featured && (
                      <span className="whitespace-nowrap rounded-sm bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">Mehr Komfort</span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2 border-b border-border pb-6 mb-6">
                    <span className="font-display text-4xl md:text-5xl text-primary">{tier.price} €</span>
                    <span className="text-sm text-muted-foreground">pro Person</span>
                  </div>

                  <ul className="space-y-4 mb-7">
                    {tier.details.map((d) => (
                      <li key={d.text} className="flex items-center gap-3 text-sm text-foreground">
                        <d.icon className="h-5 w-5 shrink-0 text-primary" />
                        <span>{d.text}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/buchen?tour=kultur&tier=${tier.name.toLowerCase()}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
                  >
                    {tier.name} buchen
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Kultur;

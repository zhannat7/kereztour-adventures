import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, Users, Home, Hotel, Star, CheckCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  {
    day: 1,
    title: "Ankunft in Bischkek",
    desc: "Ankunft am Flughafen Manas, Transfer ins Hotel. Nach einer Ruhepause Mittagessen in einem lokalen Restaurant. Stadttour: Ala-Too-Platz, Eichenpark und historisches Museum. Abendessen im traditionellen Restaurant Supara.",
    stay: "Hotel in Bischkek",
    photos: [t1a, t1b, t1c, t1d, t1e],
  },
  {
    day: 2,
    title: "Chon-Kemin",
    desc: "Fahrt zum einzigartigen Chon-Kemin-Naturreservat mit Halt am historischen Burana-Turm (UNESCO). Beobachtung des Zusammenflusses zweier Gebirgsflüsse. Abendessen und Übernachtung im lokalen Hotel.",
    stay: "Lokales Hotel in Chon-Kemin",
    photos: [t2a, t2b, t2c, t2d],
  },
  {
    day: 3,
    title: "Issyk-Kul Südufer",
    desc: "Halt im Dorf Bokonbaeva: Vorführung der traditionellen Adlerjagd – eine uralte Kunst mit Steinadlern (Berkut), die nur noch von wenigen praktiziert wird. Besuch der Märchenschlucht Skazka und des Ak-Sai-Canyons. Schwimmen im Issyk-Kul-See.",
    stay: "Traditionelles Jurten-Hotel",
    photos: [t3a, t3b, t3c, t3d],
  },
  {
    day: 4,
    title: "Barskoon & Dscheti-Oguz",
    desc: "Besuch der Wasserfälle in Barskoon und der Kosmonauten-Denkmäler. Gemeinsamer Aufbau einer traditionellen Jurte mit Einheimischen, die kunstvolle Wollenteppiche nach kirgisischer Tradition herstellen.",
    stay: "Unterkunft in Dscheti-Oguz",
    photos: [t4a, t4b, t4c, t4d],
  },
  {
    day: 5,
    title: "Dscheti-Oguz & Karakol",
    desc: "Wanderung durch die malerische Dscheti-Oguz-Schlucht – bekannt für die roten Sandsteinformationen Sieben Stiere und das Gebrochene Herz. Fahrt nach Karakol. Optional: Besuch der heißen Quellen zur Entspannung.",
    stay: "Hotel in Karakol",
    photos: [t5a, t5b],
  },
  {
    day: 6,
    title: "Altyn-Arashan",
    desc: "Fahrt ins Altyn-Arashan-Tal (Goldene Heilquelle). 4-stündige Wanderung durch dichte Wälder und alpine Landschaft. Baden in natürlichen heißen Thermalquellen mit heilender Wirkung. Rückweg wahlweise per Pferd oder Geländefahrzeug.",
    stay: "Unterkunft in Altyn-Arashan",
    photos: [t6a, t6b],
  },
  {
    day: 7,
    title: "Historische Kirchen & Dunganen-Moschee",
    desc: "Besuch der historischen russisch-orthodoxen Kirche und der einzigartigen Dunganen-Moschee – ein beeindruckendes Holzbauwerk, das komplett ohne einen einzigen Nagel errichtet wurde. Fahrt zur Nordküste nach Tscholpon-Ata.",
    stay: "Hotel in Tscholpon-Ata",
    photos: [],
  },
  {
    day: 8,
    title: "Ruh Ordo, Bootsfahrt & Petroglyphen",
    desc: "Besuch des Kulturmuseums Ruh Ordo zu Ehren des Schriftstellers Tschingis Aitmatow. Entspannte Bootsfahrt auf dem Issyk-Kul mit Blick auf das Tien-Shan-Gebirge. Petroglyphen-Museum mit Felszeichnungen aus ca. 2000 v. Chr. Bad im See.",
    stay: "Hotel an der Nordküste",
    photos: [t8a, t8b, t8c],
  },
  {
    day: 9,
    title: "Rückkehr nach Bischkek",
    desc: "Rückfahrt nach Bischkek. Besuch des größten Basars des Landes – ideal für Souvenirs, Trockenfrüchte und lokale Spezialitäten. Festliches Abschiedsabendessen mit Klängen traditioneller kirgisischer Instrumente.",
    stay: "Hotel in Bischkek",
    photos: [t9a, t9b],
  },
  {
    day: 10,
    title: "Heimreise",
    desc: "Transfer zum Flughafen Manas und individuelle Abreise.",
    stay: "",
    photos: [t10a],
  },
];

const tiers = [
  {
    name: "Economy",
    price: "990",
    featured: false,
    icon: Home,
    tagline: "Authentisch & erschwinglich",
    details: [
      { icon: Users, text: "Gruppe bis 12 Personen" },
      { icon: Home, text: "Hostel & Jurte, Mehrbettzimmer" },
      { icon: Star, text: "Standard Service" },
    ],
  },
  {
    name: "Comfort",
    price: "1.490",
    featured: true,
    icon: Hotel,
    tagline: "Exklusiv & komfortabel",
    details: [
      { icon: Users, text: "Kleine Gruppe, max. 4 Personen" },
      { icon: Hotel, text: "Luxushotel, Einzel-/Doppelzimmer" },
      { icon: Star, text: "Premium Service" },
    ],
  },
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

/* Mini Lightbox für Tag-Fotos */
const PhotoLightbox = ({ photos, startIdx, onClose }: {
  photos: string[];
  startIdx: number;
  onClose: () => void;
}) => {
  const [idx, setIdx] = useState(startIdx);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % photos.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, photos.length]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition">
        <X className="h-6 w-6" />
      </button>
      {photos.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + photos.length) % photos.length); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white/80 hover:bg-white/20 hover:text-white transition">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % photos.length); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white/80 hover:bg-white/20 hover:text-white transition">
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <div className="flex-1 flex items-center justify-center w-full px-16 pb-2" onClick={(e) => e.stopPropagation()}>
        <img src={photos[idx]} className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" />
      </div>
      {photos.length > 1 && (
        <span className="text-white/50 text-xs mb-4 tracking-widest uppercase">
          {idx + 1} / {photos.length}
        </span>
      )}
    </div>
  );
};

const Kultur = () => {
  const [lightbox, setLightbox] = useState<{ photos: string[]; idx: number } | null>(null);

  const openPhoto = useCallback((photos: string[], idx: number) => {
    setLightbox({ photos, idx });
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">

          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>

          {/* Header */}
          <div className="mb-12">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
              10 Tage · Gruppenreise
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Kultur Tour
              <span className="block text-2xl md:text-3xl italic text-primary mt-2">
                Kirgisistan von seiner schönsten Seite
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              10 Tage durch Kirgisistans kulturelle Highlights – von der Hauptstadt Bischkek
              bis zum majestätischen Issyk-Kul-See. Authentische Erlebnisse, atemberaubende
              Natur und unvergessliche Begegnungen mit der nomadischen Kultur.
            </p>
          </div>

          {/* Highlights */}
          <div className="mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
              Was dich <span className="italic text-primary">erwartet</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 rounded-xl bg-card border border-border p-4">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reiseplan mit Fotos */}
          <div className="mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8">
              Dein <span className="italic text-primary">Reiseplan</span>
            </h2>
            <div className="space-y-6">
              {days.map((d) => (
                <div key={d.day} className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="p-6 flex gap-5">
                    {/* Day Number */}
                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                      {d.day}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                        Tag {d.day}
                      </p>
                      <h3 className="font-display text-lg text-foreground mb-2">{d.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
                      {d.stay && (
                        <p className="text-xs text-primary mt-2 font-medium">Unterkunft: {d.stay}</p>
                      )}
                    </div>
                  </div>

                  {/* Photos */}
                  {d.photos.length > 0 && (
                    <div className="flex gap-2 px-6 pb-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                      {d.photos.map((photo, pi) => (
                        <button
                          key={pi}
                          onClick={() => openPhoto(d.photos, pi)}
                          className="flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden hover:opacity-90 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <img
                            src={photo}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pakete */}
          <div className="mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
              Wähle dein <span className="italic text-primary">Paket</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Beide Pakete beinhalten dasselbe 10-Tage-Programm – der Unterschied liegt im Komfort.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative rounded-3xl p-8 md:p-10 flex flex-col transition-all duration-500 hover:-translate-y-1 ${
                    tier.featured
                      ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 ring-1 ring-primary"
                      : "bg-card border border-border hover:border-primary/30 hover:shadow-xl"
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground uppercase tracking-wider shadow-lg">
                      <Sparkles className="h-3 w-3" /> Empfohlen
                    </div>
                  )}
                  <p className={`text-sm font-medium mb-2 ${tier.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {tier.tagline}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl md:text-6xl font-display">{tier.price}</span>
                    <span className="text-lg">€</span>
                    <span className={`text-sm ml-1 ${tier.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      pro Person
                    </span>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {tier.details.map((d) => (
                      <li key={d.text} className="flex items-center gap-3 text-sm">
                        <d.icon className={`h-5 w-5 shrink-0 ${tier.featured ? "text-secondary" : "text-primary"}`} />
                        <span>{d.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/buchen?tour=kultur"
                    className={`inline-flex items-center justify-center gap-2 rounded-full py-4 font-semibold transition-all duration-300 hover:scale-105 ${
                      tier.featured
                        ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-secondary/40"
                        : "bg-primary text-primary-foreground shadow-lg shadow-primary/15 hover:shadow-primary/30"
                    }`}
                  >
                    {tier.name} buchen <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />

      {lightbox && (
        <PhotoLightbox
          photos={lightbox.photos}
          startIdx={lightbox.idx}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
};

export default Kultur;

import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Users, CheckCircle, CalendarDays } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import kyrchynVideo from "@/assets/kyrchyn-tour.mp4.asset.json";

import t1a from "@/assets/gallery/IMG_2518.jpg";
import t1b from "@/assets/gallery/11.webp";
import t1c from "@/assets/gallery/12.webp";
import t1d from "@/assets/gallery/13.webp";
import t1e from "@/assets/gallery/14.webp";
import t2a from "@/assets/gallery/IMG_2646.jpg";
import t2b from "@/assets/gallery/IMG_2677.jpg";
import t2c from "@/assets/gallery/21.webp";
import t2d from "@/assets/gallery/22.webp";
import t3a from "@/assets/gallery/IMG_4663.jpg";
import t3b from "@/assets/gallery/IMG_3007.jpg";
import t3c from "@/assets/gallery/31.webp";
import t3d from "@/assets/gallery/32.webp";
import t4a from "@/assets/gallery/IMG_4858.jpg";
import t4b from "@/assets/gallery/IMG_4846.jpg";
import t4c from "@/assets/gallery/41.webp";
import t4d from "@/assets/gallery/42.webp";
import t5a from "@/assets/gallery/IMG_3600.jpg";
import t5b from "@/assets/gallery/51.webp";
import t6a from "@/assets/gallery/IMG_4933.jpg";
import t6b from "@/assets/gallery/IMG_4920.jpg";
import t7a from "@/assets/gallery/IMG_3466.jpg";
import t8a from "@/assets/gallery/IMG_4992.jpg";
import t8b from "@/assets/gallery/IMG_3858.jpg";
import t8c from "@/assets/gallery/81.webp";
import t9a from "@/assets/gallery/82.webp";
import t9b from "@/assets/gallery/91.webp";
import t10a from "@/assets/gallery/10.webp";

const days = [
  {
    day: 1,
    title: "Giorno 1 – Punto di incontro:",
    bullets: [
      "Arrivo all'Aeroporto Internazionale di Manas e trasferimento in hotel a Bishkek.",
      "Riposo dopo il lungo viaggio.",
      "Pranzo intorno alle 12 o alle 13 in un ristorante locale.",
      "Tour della città nel pomeriggio: visita a Piazza Ala-Too, Parco delle Querce e Museo Storico.",
      "Cena in un ristorante etnico tradizionale a Bishkek chiamato \"Supara\"."
    ],
    photos: [t1a, t1b, t1c, t1d, t1e]
  },
  {
    day: 2,
    title: "Giorno 2 – Chon-Kemin:",
    paragraphs: [
      "Il nostro tour inizia in direzione dell'unica Riserva Naturale di Chon-Kemin.",
      "Lungo la strada, faremo una sosta presso la storica Torre di Burana. Successivamente, continueremo il nostro viaggio verso la gola di Chon-Kemin. All'ingresso della valle si trova la confluenza di due fiumi: il turchese Chon-Kemin e il selvaggio Chuy. Lì vi aspettano escursioni a cavallo o un facile trekking nel Parco Nazionale di Chon-Kemin.",
      "La cena si terrà in un hotel locale, dove pernotteremo anche."
    ],
    photos: [t2a, t2b, t2c, t2d]
  },
  {
    day: 3,
    title: "Giorno 3 – Sponda sud del lago Issyk-Kul:",
    paragraphs: [
      "Partenza in direzione della sponda sud del lago Issyk-Kul con sosta nel villaggio di Bokonbaeva. Lì assisteremo a una dimostrazione di caccia con l'aquila, un'antica tradizione dei kirghisi sopravvissuta fino ad oggi, sebbene praticata solo da pochi.",
      "Questa pratica unica unisce la caccia a volpi e lepri, l'addestramento di rapaci come l'aquila reale (\"Berkut\") e un legame profondo tra cacciatore e uccello.",
      "Successivamente, visiteremo i canyon \"Skazka\" (Valle delle fiabe) e \"Aksai\".",
      "Dopo una giornata ricca di eventi, ci sarà la possibilità di nuotare nel lago e rinfrescarsi.",
      "Pernottamento in un tradizionale hotel di yurte nelle vicinanze."
    ],
    photos: [t3a, t3b, t3c, t3d]
  },
  {
    day: 4,
    title: "Giorno 4 – Barskoon e Dscheti-Oguz:",
    paragraphs: [
      "Proseguiamo verso il villaggio di Barskoon, noto per le sue impressionanti cascate. In passato, anche i cosmonauti russi vi trascorrevano il loro tempo libero, e in loro onore sono stati eretti dei monumenti.",
      "Dopo pranzo, ci aspetta un'attività interessante: aiuteremo a montare una yurta tradizionale insieme agli abitanti del posto, che realizzano tappeti artistici di lana secondo la tradizione kirghisa.",
      "Successivamente, proseguiamo per Jeti-Oguz, dove ceneremo e pernotteremo."
    ],
    photos: [t4a, t4b, t4c, t4d]
  },
  {
    day: 5,
    title: "Giorno 5 – Dscheti-Oguz e Karakol:",
    paragraphs: [
      "Dscheti-Oguz è una pittoresca gola nelle montagne del Tien-Shan, famosa per le sue formazioni di arenaria rossa, in particolare i \"Sette Tori\" e il \"Cuore Infranto\".",
      "Qui ci sono meravigliose opportunità per fare escursioni, fotografare e godersi la natura.",
      "Viaggio verso la città di Karakol (circa 30 minuti).",
      "Se il tempo lo permette, visiteremo le sorgenti termali poco fuori Karakol, ideali per rilassarsi dopo una lunga giornata.",
      "Cena in un ristorante locale e pernottamento."
    ],
    photos: [t5a, t5b]
  },
  {
    day: 6,
    title: "Giorno 6 – Altyn-Arashan:",
    paragraphs: [
      "Ci dirigiamo verso la bellissima valle di Altyn-Arashan, nota per la sua natura mozzafiato e le sorgenti termali.",
      "La gola si trova in una zona alpina remota, circondata da fitte foreste, limpidi torrenti di montagna e cime innevate.",
      "\"Altyn-Arashan\" significa \"Sorgente termale dorata\" in kirghiso, e qui si trovano sorgenti termali naturali stimate per i loro effetti curativi.",
      "I bagni caldi si trovano immersi nella natura: un'esperienza unica per rilassarsi dopo un'escursione o una giornata attiva.",
      "Altyn-Arashan è raggiungibile solo con veicoli fuoristrada o a piedi, il che rende il luogo particolarmente tranquillo e incontaminato.",
      "L'intera escursione a piedi dura circa 4 ore, incluse le pause per riposare e scattare fotografie.",
      "Per il ritorno, c'è la possibilità di scegliere se tornare a cavallo o comodamente con uno speciale veicolo fuoristrada."
    ],
    photos: [t6a, t6b]
  },
  {
    day: 7,
    title: "Giorno 7 – Chiese storiche e Moschea Dungan:",
    paragraphs: [
      "Dopo colazione, visitiamo in tutta tranquillità la storica chiesa russo-ortodossa e la moschea Dungan, due impressionanti edifici religiosi con architetture molto diverse tra loro.",
      "La moschea Dungan è una struttura unica in legno, costruita interamente senza l'uso di un singolo chiodo.",
      "Successivamente, proseguiamo per Cholpon-Ata, sulla costa nord del lago Issyk-Kul.",
      "Prima dell'arrivo, visiteremo il villaggio etnico di Kyrchyn."
    ],
    photos: [t7a],
    video: kyrchynVideo.url
  },
  {
    day: 8,
    title: "Giorno 8 – Ruh Ordo, Gita in barca e Petrografi:",
    paragraphs: [
      "A Cholpon-Ata, visitiamo il museo culturale all'aperto \"Ruh Ordo\", intitolato al famoso scrittore kirghiso Cingiz Ajtmatov.",
      "Successivamente, faremo una rilassante gita in barca sul lago Issyk-Kul con una nave da escursione. Godiamo l'aria fresca del lago e la vista imponente delle montagne del Tien-Shan.",
      "Dopo pranzo, visitiamo il famoso museo di petroglifi a cielo aperto, chiamato anche \"Giardino di Pietra\". Le incisioni rupestri risalgono al 2000 a.C. circa e sono considerate un tesoro culturale della regione.",
      "E naturalmente, un bagno nelle acque limpide del lago Issyk-Kul è d'obbligo!"
    ],
    photos: [t8a, t8b, t8c]
  },
  {
    day: 9,
    title: "Giorno 9 – Ritorno a Bishkek e Bazar:",
    paragraphs: [
      "Il nono giorno, ritorniamo a Bishkek. Dopo l'arrivo, visitiamo il bazar più grande del paese, un luogo perfetto per acquistare souvenir, frutta secca e altre specialità locali.",
      "Per concludere il nostro viaggio, ci aspetta una festosa cena d'addio in un ristorante suggestivo. Lì potremo goderci i suoni degli strumenti tradizionali kirghisi, suonati da musicisti di talento: una conclusione culturale indimenticabile."
    ],
    photos: [t9a, t9b]
  },
  {
    day: 10,
    title: "Giorno 10 – Transferimento all'aeroporto:",
    paragraphs: [
      "Trasferimento all'aeroporto di Manas e partenza individuale."
    ],
    photos: [t10a]
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

const PhotoSlider = ({ photos }: { photos: string[] }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

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
          className={`h-[110px] w-[150px] flex-shrink-0 overflow-hidden rounded-xl cursor-pointer sm:h-[150px] sm:w-[200px] ${
            activeIdx !== null && activeIdx !== i ? "opacity-45" : "opacity-100"
          }`}
          style={{ transition: "opacity 0.35s cubic-bezier(0.34, 1.1, 0.64, 1)" }}
        >
          <img
            src={photo}
            alt="Landschaft und Erlebnisse auf der Kultur Tour durch Kirgisistan"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

const DaySevenMedia = ({
  video,
  photos,
}: {
  video: string;
  photos: string[];
}) => {
  const photoDescriptions = [
    "Kultur und Architektur in Kirgisistan",
    "Bootsfahrt auf dem Issyk-Kul-See",
    "Besuch des Kulturzentrums Ruh Ordo",
  ];

  return (
    <div className="mt-7 w-full max-w-[620px] mx-auto">
      <div className="mb-3 aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted shadow-lift sm:mb-4 sm:aspect-[4/3] sm:mx-auto sm:max-w-[460px]">
        <video
          src={video}
          poster={photos[0]}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          aria-label="Kyrchyn Jailoo – Nomadenkultur und Landschaft"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {photos.map((photo, index) => (
          <div
            key={photo}
            className="group aspect-[4/3] overflow-hidden rounded-xl bg-muted"
          >
            <img
              src={photo}
              alt={photoDescriptions[index] ?? "Impression von Tag 7 der Kultur Tour"}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Kultur = () => {
  const { t } = useLanguage();
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
    let active = true;

    const loadCultureDates = async () => {
      const { data, error } = await (supabase as any).rpc("get_tour_date_availability");

      if (!active) return;
      if (error) {
        console.error("Kultur-Termine konnten nicht aktualisiert werden:", error);
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
            availablePlaces: Math.max(0, Number(item.available_places)),
            status: item.status,
          }))
      );
    };

    void loadCultureDates();

    // Keep the dates in sync with admin edits and confirmed/cancelled bookings.
    // Supabase Realtime updates immediately when enabled; polling is the fallback.
    const refreshInterval = window.setInterval(() => {
      if (active) void loadCultureDates();
    }, 15000);
    const availabilityChannel = supabase
      .channel("public-culture-availability")
      .on("postgres_changes", { event: "*", schema: "public", table: "tour_dates" }, () => {
        if (active) void loadCultureDates();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        if (active) void loadCultureDates();
      })
      .subscribe();

    return () => {
      active = false;
      window.clearInterval(refreshInterval);
      void supabase.removeChannel(availabilityChannel);
    };
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
      <main className="container mx-auto max-w-5xl px-6 bg-background pb-24 pt-24 md:pt-32">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" /> {t("Zurück")}
          </Link>

          <section className="mb-20 grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-14">
            <div className="py-2">
              <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                {t("10 Tage · Gruppenreise")}
              </span>
              <h1 className="mb-4 font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
                {t("Kultur Tour")}
              </h1>
              <p className="mb-8 font-display text-xl italic text-primary md:text-2xl">
                {t("Kirgisistan von seiner schönsten Seite")}
              </p>
              <p className="mb-6 max-w-xl text-base leading-relaxed text-muted-foreground">Il viaggio offre numerose opportunità per vivere la straordinaria natura del Kirghizistan. Fai escursioni attraverso valli pittoresche, nuota nelle acque cristalline del lago Issyk-Kul e trascorri la notte in Yurta tradizionali. Scopri di più sulla storia e la cultura del paese attraverso visite a musei e siti storici. Durante il viaggio, avrai l'occasione di provare la cucina tradizionale kirghisa.</p>
              <Link
                to="/buchen?tour=kultur"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {t("Kultur Tour unverbindlich anfragen")} <span className="ml-2" aria-hidden="true">→</span>
              </Link>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{t("Kleine Gruppen")}</span>
                <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />{t("10 unvergessliche Tage")}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-sand/50 p-3 sm:p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary">
                  <CalendarDays className="h-4 w-4" />
                </span>
                {t("Reisedaten")}
              </div>
              <div className="divide-y divide-primary/15">
                {cultureDates
                  .filter((item) => item.status !== "cancelled")
                  .filter((item) => item.date >= format(new Date(), "yyyy-MM-dd"))
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((item) => {
                    const isFull = item.status === "full" || item.availablePlaces <= 0;
                    const endDateMatch = item.label.match(/[-–]\s*(\d{2})\.(\d{2})\.(\d{4})/);
                    const dateRangeLabel = endDateMatch
                      ? `${format(parseISO(item.date), "dd.MM.yyyy")}–${endDateMatch[1]}.${endDateMatch[2]}.${endDateMatch[3]}`
                      : item.label;
                    const card = (
                      <div className="flex items-center gap-3 py-2.5 sm:gap-4">
                        
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug text-foreground sm:text-base">{dateRangeLabel}</p>
                          <p className={`mt-1 text-xs font-medium ${isFull ? "text-muted-foreground" : "text-primary"}`}>
                            {isFull
                              ? t("Ausgebucht")
                              : t("Noch {count} {placeWord} verfügbar")
                                  .replace("{count}", String(item.availablePlaces))
                                  .replace("{placeWord}", item.availablePlaces === 1 ? t("Platz") : t("Plätze"))}
                          </p>
                        </div>
                      </div>
                    );
                    return isFull ? (
                      <div key={item.id} className="cursor-not-allowed opacity-75">{card}</div>
                    ) : (
                      <Link key={item.id} to={"/buchen?tour=kultur&date=" + item.date} className="block rounded-2xl transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t("Termin auswählen") + ": " + item.label}>
                        {card}
                      </Link>
                    );
                  })}
                {cultureDates.filter((item) => item.status !== "cancelled").length === 0 && (
                  <div className="rounded-2xl bg-background p-5 text-sm text-muted-foreground">
                    {t("Aktuell sind keine Reisetermine verfügbar.")}
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="mb-20">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
              {t("Was dich")} <span className="italic text-primary">{t("erwartet")}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
              {highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 border-b border-primary/15 py-4 pr-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{t(h)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-12">
              {t("Dein")} <span className="italic text-primary">{t("Reiseplan")}</span>
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
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold text-base ring-4 ring-background md:h-16 md:w-16 md:text-xl transition-all duration-500 ${activeDay === i ? "bg-primary text-primary-foreground scale-110 border-2 border-primary" : "bg-background border-2 border-primary text-primary"}`}>
                        {d.day}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 pb-2">
                      <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">{d.title}</h3>
                      <div className="flex flex-col gap-3 mb-5">
                        {d.bullets ? (
                          <ul className="list-disc space-y-2 pl-5 text-base text-muted-foreground leading-relaxed">
                            {d.bullets.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        ) : (
                          d.paragraphs?.map((paragraph) => (
                            <p key={paragraph} className="text-base text-muted-foreground leading-relaxed">{paragraph}</p>
                          ))
                        )}
                      </div>
                      {d.day === 7 && d.video ? (
                        <DaySevenMedia video={d.video} photos={d.photos} />
                      ) : (
                        d.photos.length > 0 && <PhotoSlider photos={d.photos} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                {t("Gruppengröße")} <span className="italic text-primary">{t("und Preise")}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                {t("Der Preis richtet sich nach der Gruppengröße. Bei 2 bis 4 Personen reist du im Jeep, ab 5 Personen im Minibus.")}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card md:rounded-3xl">
              <div className="grid grid-cols-1 divide-y divide-border/70 md:grid-cols-3 md:divide-x md:divide-y-0">
                <div className="flex items-center justify-between gap-4 px-4 py-4 md:block md:p-7">
                  <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary md:mb-3 md:text-xs md:tracking-[0.14em]">{t("2 Personen · Jeep")}</p>
                    <p className="text-sm text-muted-foreground md:hidden">{t("pro Person")}</p>
                  </div>
                  <div className="shrink-0 text-right md:text-left">
                    <p className="font-display text-3xl leading-none tracking-tight text-primary md:text-4xl">2.700 €</p>
                    <p className="mt-1 hidden text-sm text-muted-foreground md:block md:mt-2">{t("pro Person")}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-4 md:block md:p-7">
                  <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary md:mb-3 md:text-xs md:tracking-[0.14em]">{t("4 Personen · Jeep")}</p>
                    <p className="text-sm text-muted-foreground md:hidden">{t("pro Person")}</p>
                  </div>
                  <div className="shrink-0 text-right md:text-left">
                    <p className="font-display text-3xl leading-none tracking-tight text-primary md:text-4xl">1.700 €</p>
                    <p className="mt-1 hidden text-sm text-muted-foreground md:block md:mt-2">{t("pro Person")}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-4 md:block md:p-7">
                  <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary md:mb-3 md:text-xs md:tracking-[0.14em]">{t("Ab 5 Personen · Minibus")}</p>
                    <p className="text-sm text-muted-foreground md:hidden">{t("pro Person")}</p>
                  </div>
                  <div className="shrink-0 text-right md:text-left">
                    <p className="font-display text-3xl leading-none tracking-tight text-primary md:text-4xl">1.690 €</p>
                    <p className="mt-1 hidden text-sm text-muted-foreground md:block md:mt-2">{t("pro Person")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="mb-8">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                {t("Im Preis inklusive")}
              </h2>
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                {t("Diese Leistungen sind in deiner Kultur Tour enthalten.")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Übernachtungen in 4-Sterne-Hotels und traditionellen Jurten mit WC und Dusche",
                "Alle Transfers und Fahrten entlang der Reiseroute",
                "Erfahrener professioneller Guide während der gesamten Reise",
                "Vollpension mit drei Mahlzeiten täglich",
                "Traditionelles Essen bei einer kirgisischen Familie",
                "Picknick in der Natur",
                "Ein Bier pro Person",
                "Aktivitäten und Eintrittsgelder laut Reiseprogramm",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 border-b border-border/70 py-3 pr-3 last:border-b-0">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-foreground">{t(item)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-16 rounded-3xl bg-sand/60 p-6 md:p-8">
            <h2 className="mb-3 font-display text-2xl text-foreground">
              {t("Buchung und Zahlung")}
            </h2>
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t("Wähle deinen Wunschtermin und sende uns eine unverbindliche Buchungsanfrage. Wir prüfen die Verfügbarkeit und stimmen die Details deiner Reise persönlich mit dir ab. Möchtest du verbindlich buchen, erhältst du nach der Bestätigung einen Zahlungslink für die Anzahlung von 150 €. Den Restbetrag bezahlst du während deiner Reise in Kirgisistan in bar.")}
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t("Bitte informiere dich vor der verbindlichen Buchung über die geltenden Stornierungsbedingungen.")}
            </p>
          </div>
          <div className="mb-8 mt-8 text-center">
            <Link
              to="/buchen?tour=kultur"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              {t("Kultur Tour unverbindlich anfragen")} →
            </Link>
          </div>
      </main>
      <Footer />
    </>
  );
};

export default Kultur;

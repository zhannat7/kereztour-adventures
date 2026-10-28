import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, ArrowRight, Mountain, Thermometer, Backpack, CalendarDays } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { fetchTourDates, getCachedTourDates } from "@/lib/tourDatesCache";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const days = [
  { day: 1, title: "Ankunft in Bischkek", desc: "Ankunft am Flughafen Manas, Transfer ins Zentrum. Akklimatisierung bei einem Spaziergang über den Ala-Too-Platz und durch den Eichenpark.", stay: "Hotel in Bischkek" },
  { day: 2, title: "Aufbruch Richtung Berge (Bischkek – Kyzart)", desc: "Fahrt vorbei am Burana-Turm (UNESCO) bis zum Dorf Kyzart.", stay: "Gästehaus in Kyzart oder Jurtencamp am Fuße des Passes" },
  { day: 3, title: "Trekking zum Song-Köl See", desc: "Anspruchsvoller Aufstieg über den Tuz-Ashuu Pass (3.228 m). Belohnt wird man mit dem Blick auf den zweitgrößten See Kirgisistans, umgeben von nomadischen Weiden. Ca. 16–18 km (5–7 Std. wandern).", stay: "Traditionelles Jurtencamp am Seeufer (mit Betten und Holzofen)" },
  { day: 4, title: "Das Nomadenleben am Song-Köl", desc: "Ein intensiver Tag am See: Wanderung entlang der Uferlinie oder zu den umliegenden Bergrücken (bis zu 3.500 m) für ein 360-Grad-Panorama. Beobachtung der Stutenmilch-Produktion und Kontakt mit den Hirten.", stay: "Jurtencamp am Song-Köl" },
  { day: 5, title: "Abstieg und Fahrt zum Issyk-Kul See", desc: "Abstieg vom Plateau über die Serpentinen des „33 Papageien“-Passes (ca. 3–4 Std.). Unten wartet der Fahrer. Fahrt entlang der Südküste des Issyk-Kul bis nach Bokonbayevo.", stay: "Jurtencamp direkt am Strand (mit Duschen)" },
  { day: 6, title: "Märchen-Canyon & Karakol", desc: "Kurzes, aber intensives Trekking durch die bizarren Felsformationen des Skazka (Fairytale) Canyons. Weiterfahrt nach Karakol und Vorbereitung auf den großen Ala-Köl Trek.", stay: "Hotel/Gästehaus in Karakol" },
  { day: 7, title: "Der Aufstieg zur „Sirota“-Hütte", desc: "Transfer mit dem Geländewagen tief ins Karakol-Tal. Steiler Aufstieg durch dichte Wälder bis zum Rastplatz „Sirota“.", stay: "Bergsteiger-Hütte (einfache Holzhütte) oder Zelt" },
  { day: 8, title: "Die Königsetappe: Ala-Köl See & Pass", desc: "Der härteste Tag: Aufstieg zum Ala-Köl See (3.560 m) und weiter über den Ala-Köl Pass (3.911 m). Atemberaubender Blick auf die 5.000er Gipfel des Tienschan. Langer Abstieg in das Tal von Altyn-Arashan.", stay: "Berghütte in Altyn-Arashan mit Zugang zu heißen Thermalquellen" },
  { day: 9, title: "Erholung & Fahrt nach Cholpon-Ata", desc: "Vormittags Entspannung in den heißen Quellen. Anstatt zu wandern, erfolgt der Abstieg spektakulär mit einem russischen Allrad über die holprige Piste zurück nach Karakol. Fahrt nach Cholpon-Ata – ein Bad im klaren Wasser des Issyk-Kul-Sees darf nicht fehlen!", stay: "Hotel in Cholpon-Ata" },
  { day: 10, title: "Rückfahrt nach Bischkek & Basar", desc: "Rückkehr nach Bischkek und Besuch des größten Basars des Landes – perfekt für Souvenirs, getrocknete Früchte und lokale Spezialitäten. Zum Abschluss ein festliches Abschiedsabendessen mit traditioneller kirgisischer Live-Musik.", stay: "Hotel in Bischkek" },
  { day: 11, title: "Transfer zum Flughafen", desc: "Transfer zum Flughafen Manas und individuelle Abreise.", stay: "" },
];

const tips = [
  {
    icon: Mountain,
    title: "Beste Reisezeit",
    desc: "Juli bis Ende August. Nur dann sind die hohen Pässe (Ala-Köl) sicher schneefrei.",
  },
  {
    icon: Backpack,
    title: "Ausrüstung",
    desc: "Gute Wanderschuhe, Wanderstöcke und warme Funktionskleidung nach dem Zwiebelprinzip sind Pflicht.",
  },
  {
    icon: Thermometer,
    title: "Höhe & Fitness",
    desc: "Die Tour erreicht bis zu 3.911 m. Grundlegende Trekking-Erfahrung und gute körperliche Fitness werden vorausgesetzt.",
  },
];

const Trekking = () => {
  const { t } = useLanguage();
  const [activeDay, setActiveDay] = useState(0);
  const dayRefs = useRef<HTMLDivElement[]>([]);
  const mapTrekking = (data: any[]) => data.filter((item: any) => item.tour === "Intensiv-Trekking").map((item: any) => ({ id: item.id, date: item.start_date, label: format(parseISO(item.start_date), "dd.MM.") + "–" + format(parseISO(item.end_date), "dd.MM.yyyy"), availablePlaces: Number(item.available_places), status: item.status })).filter((item) => item.date >= format(new Date(), "yyyy-MM-dd") && item.status !== "cancelled").sort((a, b) => a.date.localeCompare(b.date));
  const [trekkingDates, setTrekkingDates] = useState<Array<{ id: string; date: string; label: string; availablePlaces: number; status: string }> | null>(() => { const c = getCachedTourDates(); return c ? mapTrekking(c) : null; });

  useEffect(() => {
    const loadTrekkingDates = async (force = true) => {
      try { setTrekkingDates(mapTrekking(await fetchTourDates(force))); } catch { setTrekkingDates((prev) => prev ?? []); }
    };
    loadTrekkingDates(false);
    const channel = supabase
      .channel("trekking-tour-dates")
      .on("postgres_changes", { event: "*", schema: "public", table: "tour_dates" }, () => { loadTrekkingDates(); })
      .subscribe();
    const onFocus = () => loadTrekkingDates();
    window.addEventListener("focus", onFocus);
    return () => { supabase.removeChannel(channel); window.removeEventListener("focus", onFocus); };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Treat the upper-middle of the viewport as the reading position.
      const readingLine = window.innerHeight * 0.4;
      let activeIndex = -1;
      let closestIndex = 0;
      let closestDist = Infinity;

      dayRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= readingLine && rect.bottom >= readingLine) {
          activeIndex = i;
        }
        const dist = readingLine < rect.top
          ? rect.top - readingLine
          : readingLine > rect.bottom
            ? readingLine - rect.bottom
            : 0;
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });

      setActiveDay(activeIndex >= 0 ? activeIndex : closestIndex);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
  <>
    <Navbar />
    <main className="bg-background pb-24 pt-24 md:pt-32">
      <div className="container mx-auto max-w-6xl px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> {t("Zurück")}
        </Link>

        {/* Header and admin-managed dates */}
        <section className="mb-10 grid items-start gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <h1 className="mb-4 font-display text-4xl leading-[1.08] text-foreground sm:text-5xl xl:text-[3.4rem]">
              {t("Intensiv-Trekking")}
              <span className="block text-2xl md:text-3xl italic text-primary mt-2">{t("Bergseen Kirgistans – 11 Tage")}</span>
            </h1>
            <p className="mb-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{t("Diese Tour ist für gut vorbereitete Bergwanderer konzipiert, die die beeindruckende Hochgebirgslandschaft Kirgistans erleben möchten. Die Route führt zu zwei spektakulären Bergseen: dem Song-Köl und dem türkisfarbenen Ala-Köl.")}</p>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{t("Du übernachtest in traditionellen Jurten, Berghütten und Gästehäusern und lernst dabei die einzigartige Natur Zentralasiens kennen.")}</p>
          </div>
          <div className="rounded-2xl bg-sand/50 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary"><CalendarDays className="h-4 w-4" /></span>{t("Reisedaten")}</div>
            <div className="divide-y divide-primary/15">
              {trekkingDates === null && <div className="space-y-3" aria-busy="true">{[0,1,2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)}</div>}
              {(trekkingDates ?? []).map((item) => {
                const isFull = item.status === "full" || item.availablePlaces <= 0;
                const endDateMatch = item.label.match(/[-–]\\s*(\\d{2})\\.(\\d{2})\\.(\\d{4})/);
                const dateRangeLabel = endDateMatch
                  ? `${format(parseISO(item.date), "dd.MM.yyyy")}–${endDateMatch[1]}.${endDateMatch[2]}.${endDateMatch[3]}`
                  : item.label;
                const card = <div className="flex items-center gap-3 py-2.5">
                  
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium leading-snug text-foreground sm:text-base">{dateRangeLabel}</p><p className={"mt-1 text-xs font-medium " + (isFull ? "text-muted-foreground" : "text-primary")}>{isFull ? t("Ausgebucht") : t("Noch {count} {placeWord} verfügbar").replace("{count}", String(item.availablePlaces)).replace("{placeWord}", item.availablePlaces === 1 ? t("Platz") : t("Plätze"))}</p></div>
                </div>;
                return isFull ? (
                  <div key={item.id} className="cursor-not-allowed opacity-75">{card}</div>
                ) : (
                  <Link key={item.id} to={"/buchen?tour=trekking&date=" + item.date} className="block rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t("Termin auswählen") + ": " + item.label}>
                    {card}
                  </Link>
                );
              })}
              {trekkingDates !== null && trekkingDates.length === 0 && <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">{t("Aktuell sind keine Reisetermine verfügbar.")}</div>}
            </div>
          </div>
        </section>

        {/* Compact price and booking action */}
        <div className="mb-16 flex flex-wrap items-center justify-between gap-4 py-2">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">{t("Angebot")}</span>
              <span className="text-sm font-medium text-primary">{t("Sie sparen 260 €")}</span>
            </div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{t("Preis pro Person")}</p>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-xl text-muted-foreground line-through decoration-2">1.750 €</span>
              <span className="font-display text-3xl text-foreground">1.490 €</span>
            </div>
          </div>
          <Link
            to="/buchen?tour=trekking"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {t("Reisetermin auswählen")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Itinerary */}
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
          {t("Dein")} <span className="italic text-primary">{t("Reiseplan")}</span>
        </h2>
        <div className="space-y-4 mb-20">
          {days.map((d) => (
            <div
              key={d.day}
              ref={(el) => { if (el) dayRefs.current[d.day - 1] = el; }}
              className="flex gap-5 border-b border-border py-5 transition-colors hover:border-primary/40"
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300 ${activeDay === d.day - 1 ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 bg-background text-primary"}`}>
                {d.day}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  {t("Tag")} {d.day}
                </p>
                <h3 className="font-display text-lg text-foreground mb-1">{t(d.title)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(d.desc)}</p>
                {d.stay && <p className="text-xs text-muted-foreground mt-2 font-medium">{t("Übernachtung")}: {t(d.stay)}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
          {t("Wichtige")} <span className="italic text-primary">{t("Hinweise")}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border mb-16">
          {tips.map((tip) => (
            <div key={t(tip.title)} className="flex flex-col gap-3 py-5 md:px-6 first:md:pl-0 last:md:pr-0">
              <div className="flex h-9 w-9 items-center justify-center text-primary">
                <tip.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg text-foreground">{t(tip.title)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(tip.desc)}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border-y border-border py-10 text-center">
          <p className="font-display text-2xl text-foreground mb-6">{t("Bereit für das Abenteuer deines Lebens?")}</p>
          <Link
            to="/buchen?tour=trekking"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {t("Jetzt Platz sichern")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
    <Footer />
  </>
  );
};

export default Trekking;

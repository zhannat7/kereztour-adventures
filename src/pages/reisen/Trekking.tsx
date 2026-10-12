import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, ArrowRight, Mountain, Thermometer, Backpack, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const days = [
  {
    day: 1,
    title: "Ankunft in Bischkek",
    desc: "Ankunft am Flughafen Manas, Transfer ins Zentrum. Spaziergang über den Ala-Too-Platz und durch den Eichenpark. Proviant-Kauf auf dem Osh-Basar.",
    stay: "Hotel in Bischkek",
  },
  {
    day: 2,
    title: "Bischkek → Kyzart",
    desc: "Fahrt vorbei am Burana-Turm (UNESCO). Warm-up-Trekking (ca. 2–3 Std.) zu den ersten Ausläufern der Berge zur Höhenakklimatisierung.",
    stay: "Gästehaus oder Jurtencamp in Kyzart",
  },
  {
    day: 3,
    title: "Trekking zum Song-Köl See",
    desc: "Anspruchsvoller Aufstieg über den Tuz-Ashuu Pass (3.228 m). Blick auf den zweitgrößten See Kirgisistans. Ca. 16–18 km, 5–7 Std.",
    stay: "Jurtencamp am Seeufer",
  },
  {
    day: 4,
    title: "Nomadenleben am Song-Köl",
    desc: "Ein intensiver Tag am See: Wanderung entlang der Uferlinie oder zu den umliegenden Bergrücken bis 3.500 m für ein 360°-Panorama. Kontakt mit nomadischen Hirten und Beobachtung der traditionellen Stutenmilch-Produktion.",
    stay: "Jurtencamp am Song-Köl",
  },
  {
    day: 5,
    title: "Abstieg → Issyk-Kul See",
    desc: "Abstieg über den '33 Papageien'-Pass (ca. 3–4 Std.). Fahrt entlang der Südküste des Issyk-Kul bis nach Bokonbayevo.",
    stay: "Jurtencamp 'Bel-Tam' direkt am Strand",
  },
  {
    day: 6,
    title: "Skazka Canyon → Karakol",
    desc: "Kurzes aber intensives Trekking durch die bizarren Felsformationen des Skazka (Fairytale) Canyons. Weiterfahrt nach Karakol, Besuch der historischen hölzernen russisch-orthodoxen Kirche. Vorbereitung auf den großen Ala-Köl Trek.",
    stay: "Hotel/Gästehaus in Karakol",
  },
  {
    day: 7,
    title: "Aufstieg zur Sirota-Hütte",
    desc: "Transfer mit dem Geländewagen ins Karakol-Tal. Steiler Aufstieg durch dichte Wälder bis zum Rastplatz Sirota.",
    stay: "Bergsteiger-Hütte oder Zelt",
  },
  {
    day: 8,
    title: "Königsetappe: Ala-Köl Pass",
    desc: "Der härteste Tag der Tour: Aufstieg zum Ala-Köl See (3.560 m) und weiter über den Ala-Köl Pass (3.911 m). Atemberaubender Blick auf die 5.000er Gipfel des Tienschan. Langer Abstieg in das idyllische Tal von Altyn-Arashan.",
    stay: "Berghütte mit heißen Thermalquellen",
  },
  {
    day: 9,
    title: "Erholung & Rückfahrt",
    desc: "Entspannung in den heißen Quellen. Spektakulärer Abstieg mit russischem Allrad-LKW (UAZ). Lange Rückfahrt nach Bischkek (ca. 6–7 Std.). Abschiedsabendessen.",
    stay: "Hotel in Bischkek",
  },
  {
    day: 10,
    title: "Heimreise",
    desc: "Letzte Souvenir-Käufe (Honig, Filzwaren). Transfer zum Flughafen Manas und Rückflug.",
    stay: "",
  },
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
  const [trekkingDates, setTrekkingDates] = useState<Array<{ id: string; date: string; label: string; availablePlaces: number; status: string }>>([]);

  useEffect(() => {
    const loadTrekkingDates = async () => {
      const { data, error } = await (supabase as any).rpc("get_tour_date_availability");
      if (error) { setTrekkingDates([]); return; }
      setTrekkingDates(((data as any[]) ?? []).filter((item: any) => item.tour === "Intensiv-Trekking").map((item: any) => ({ id: item.id, date: item.start_date, label: format(parseISO(item.start_date), "dd.MM.") + "–" + format(parseISO(item.end_date), "dd.MM.yyyy"), availablePlaces: Number(item.available_places), status: item.status })).filter((item) => item.date >= format(new Date(), "yyyy-MM-dd") && item.status !== "cancelled").sort((a, b) => a.date.localeCompare(b.date)));
    };
    loadTrekkingDates();
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
              🥾 {t("Intensiv-Trekking")}
              <span className="block text-2xl md:text-3xl italic text-primary mt-2">{t("Bergseen Kirgistans – 10 Tage")}</span>
            </h1>
            <p className="mb-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">{t("Diese Tour ist für gut vorbereitete Bergwanderer konzipiert, die die beeindruckende Hochgebirgslandschaft Kirgistans erleben möchten. Die Route führt zu zwei spektakulären Bergseen: dem Song-Köl und dem türkisfarbenen Ala-Köl.")}</p>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{t("Du übernachtest in traditionellen Jurten, Berghütten und Gästehäusern und lernst dabei die einzigartige Natur Zentralasiens kennen.")}</p>
          </div>
          <div className="rounded-2xl bg-sand/50 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary"><CalendarDays className="h-4 w-4" /></span>{t("Reisedaten")}</div>
            <div className="divide-y divide-primary/15">
              {trekkingDates.map((item) => {
                const isFull = item.status === "full" || item.availablePlaces <= 0;
                const endDateMatch = item.label.match(/[-–]\\s*(\\d{2})\\.(\\d{2})\\.(\\d{4})/);
                const dateRangeLabel = endDateMatch
                  ? `${format(parseISO(item.date), "dd.MM.yyyy")}–${endDateMatch[1]}.${endDateMatch[2]}.${endDateMatch[3]}`
                  : item.label;
                const card = <div className="flex items-center gap-3 py-2.5">
                  
                  <div className="min-w-0 flex-1"><p className="font-display text-base leading-snug text-foreground sm:text-lg">{dateRangeLabel}</p><p className={"mt-1 text-xs font-medium " + (isFull ? "text-muted-foreground" : "text-primary")}>{isFull ? t("Ausgebucht") : t("Noch {count} {placeWord} verfügbar").replace("{count}", String(item.availablePlaces)).replace("{placeWord}", item.availablePlaces === 1 ? t("Platz") : t("Plätze"))}</p></div>
                </div>;
                return isFull ? (
                  <div key={item.id} className="cursor-not-allowed opacity-75">{card}</div>
                ) : (
                  <Link key={item.id} to={"/buchen?tour=trekking&date=" + item.date} className="block rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t("Termin auswählen") + ": " + item.label}>
                    {card}
                  </Link>
                );
              })}
              {trekkingDates.length === 0 && <div className="rounded-2xl bg-background p-4 text-sm text-muted-foreground">{t("Aktuell sind keine Reisetermine verfügbar.")}</div>}
            </div>
          </div>
        </section>

        {/* Compact price and booking action */}
        <div className="mb-16 flex flex-wrap items-center justify-between gap-4 py-2">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{t("Preis pro Person")}</p>
            <p className="font-display text-3xl text-foreground">1.200 €</p>
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
              className="group flex gap-5 border-b border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-primary text-lg font-bold text-primary-foreground">
                {d.day}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  {t("Tag")} {d.day}
                </p>
                <h3 className="font-display text-lg text-foreground mb-1">{t(d.title)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(d.desc)}</p>
                {d.stay && <p className="text-xs text-primary mt-2 font-medium">🏕️ {t(d.stay)}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
          {t("Wichtige")} <span className="italic text-primary">{t("Hinweise")}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tips.map((tip) => (
            <div key={t(tip.title)} className="flex flex-col gap-4 border border-border bg-card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                <tip.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg text-foreground">{t(tip.title)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(tip.desc)}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border-y border-border bg-muted/60 p-10 text-center">
          <p className="font-display text-2xl text-foreground mb-6">{t("Bereit für das Abenteuer deines Lebens?")}</p>
          <Link
            to="/buchen?tour=trekking"
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-10 py-4 font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5"
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

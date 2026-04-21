import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mountain, Thermometer, Backpack } from "lucide-react";
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

const Trekking = () => (
  <>
    <Navbar />
    <main className="pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>

        {/* Header */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
          🥾 Intensiv-Trekking
          <span className="block text-2xl md:text-3xl italic text-primary mt-2">Bergseen Kirgistans – 10 Tage</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-4 max-w-3xl">
          Diese Tour ist für gut vorbereitete Bergwanderer konzipiert, die die Herausforderung der Höhe suchen. Die
          Route führt zu den spektakulärsten Highlights Zentralasiens: dem Hochgebirgssee Song-Köl und dem
          türkisfarbenen Ala-Köl.
        </p>
        <p className="text-muted-foreground mb-12 max-w-3xl">
          Übernachtungen finden authentisch in Jurten, Berghütten und Gästehäusern statt.
        </p>

        {/* Price Banner */}
        <div className="rounded-2xl bg-primary text-primary-foreground p-6 mb-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-primary-foreground/70 text-sm uppercase tracking-widest mb-1">Preis pro Person</p>
            <p className="font-display text-5xl">1.200 €</p>
          </div>
          <Link
            to="/buchen?tour=trekking"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 font-semibold text-secondary-foreground shadow-lg hover:scale-105 transition-all duration-300"
          >
            Jetzt buchen <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Itinerary */}
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
          Dein <span className="italic text-primary">Reiseplan</span>
        </h2>
        <div className="space-y-4 mb-20">
          {days.map((d) => (
            <div
              key={d.day}
              className="group rounded-2xl bg-card border border-border p-6 flex gap-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                {d.day}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Tag {d.day}
                </p>
                <h3 className="font-display text-lg text-foreground mb-1">{d.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
                {d.stay && <p className="text-xs text-primary mt-2 font-medium">🏕️ {d.stay}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">
          Wichtige <span className="italic text-primary">Hinweise</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tips.map((tip) => (
            <div key={tip.title} className="rounded-2xl bg-card border border-border p-6 flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <tip.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg text-foreground">{tip.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-muted/60 border border-border p-10 text-center">
          <p className="font-display text-2xl text-foreground mb-6">Bereit für das Abenteuer deines Lebens?</p>
          <Link
            to="/buchen?tour=trekking"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 font-semibold text-primary-foreground shadow-lg hover:scale-105 transition-all duration-300"
          >
            Jetzt Platz sichern <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Trekking;

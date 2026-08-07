import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Clock, Users, Mountain } from "lucide-react";
import nomadenImage from "@/assets/nomaden-spiele.png.asset.json";
import trekkingImage from "@/assets/trekking.jpg.asset.json";



type Tour = {
  badge: string;
  title: string;
  desc: string;
  duration: string;
  groupSize: string;
  price: string;
  to: string;
  image: string;
  imagePosition?: string;
};

const tours: Tour[] = [
  {
    badge: "Bestseller",
    title: "Kultur Tour",
    desc: "10 Tage durch die schönsten Orte des Landes – Adlerjagd, Jurtenbau, Thermalquellen und der türkisfarbene Issyk-Kul.",
    duration: "10 Tage",
    groupSize: "bis 12 Personen",
    price: "ab 990 €",
    to: "/reisen/kultur",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
  },
  {
    badge: "Einmaliges Event",
    title: "Weltspiele der Nomaden 2026",
    desc: "Reiterspiele, Adlerjagd-Wettbewerbe und internationale Festatmosphäre am Ufer des Issyk-Kul.",
    duration: "8 Tage",
    groupSize: "bis 12 Personen",
    price: "1.200 €",
    to: "/reisen/nomaden",
    image: nomadenImage.url,
    imagePosition: "center 40%",
  },
  {
    badge: "Für Aktive",
    title: "Intensiv-Trekking",
    desc: "Song-Köl, Ala-Köl Pass auf 3.911 m und heiße Quellen – Kirgisistan von seiner wildesten Seite.",
    duration: "10 Tage",
    groupSize: "bis 8 Personen",
    price: "1.200 €",
    to: "/reisen/trekking",
    image: trekkingImage.url,
    imagePosition: "center 35%",
  },
];

const Tours = () => {
  const ref = useScrollReveal();

  return (
    <section id="reisen" className="py-16 md:py-24 bg-background">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4 block">Unsere Reisen</span>
            <h2 className="font-display text-3xl md:text-[2.75rem] leading-tight text-foreground">
              Drei Wege, <span className="italic text-primary">Kirgisistan zu entdecken</span>
            </h2>
          </div>
          <Link to="/buchen" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors">
            Unsicher, welche passt? Frag uns <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Link
              key={tour.to}
              to={tour.to}
              className="stagger-child group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={tour.image}
                  alt={tour.title}
                  loading="lazy"
                  style={{ objectPosition: tour.imagePosition ?? "center" }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {tour.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl text-foreground mb-2 leading-snug">{tour.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{tour.desc}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-6">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {tour.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {tour.groupSize}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
                  <div>
                    <p className="font-display text-2xl text-primary leading-none">{tour.price}</p>
                    <p className="text-xs text-muted-foreground mt-1">pro Person</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary transition-colors duration-300 group-hover:bg-secondary group-hover:text-secondary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-sand/70 px-6 py-5 text-sm text-muted-foreground">
          <Mountain className="h-5 w-5 shrink-0 text-primary" />
          <p>
            Alle Reisen lassen sich auf Wunsch als private Tour für Familien oder Freundesgruppen anpassen –
            Termine flexibel nach Absprache.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Tours;

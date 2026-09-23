import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Clock, Users } from "lucide-react";

type Tour = {
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
    title: "Kultur Tour",
    desc: "10 Tage durch die schönsten Regionen Kirgisistans – Kultur, Natur, Traditionen und echte Begegnungen.",
    duration: "10 Tage",
    groupSize: "bis 12 Personen",
    price: "ab 990 €",
    to: "/reisen/kultur",
    image: "/tour-kultur.jpg",
    imagePosition: "center 45%",
  },
  {
    title: "Intensiv-Trekking",
    desc: "Berge, alpine Landschaften und abgelegene Täler – für alle, die Kirgisistan aktiv erleben möchten.",
    duration: "10 Tage",
    groupSize: "bis 8 Personen",
    price: "1.200 €",
    to: "/reisen/trekking",
    image: "/tour-trekking.jpg",
    imagePosition: "center 35%",
  },
  {
    title: "Kyrchyn Tour",
    desc: "Kyrchyn Jailoo erleben, nomadische Kultur kennenlernen und Kirgisistan auf besondere Weise entdecken.",
    duration: "Nach Termin",
    groupSize: "Individuell",
    price: "1.300 €",
    to: "/reisen/kyrchyn",
    image: "/tour-kyrchyn.jpg",
    imagePosition: "center 40%",
  },
];

const Tours = () => {
  const ref = useScrollReveal();

  return (
    <section id="preise" className="bg-background py-20 md:py-28 scroll-mt-24">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-[1600px]">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4 block">Unsere Reisen</span>
            <h2 className="font-display text-4xl leading-tight text-foreground md:text-6xl">
              Drei Wege, <span className="italic text-primary">Kirgisistan zu entdecken</span>
            </h2>
          </div>
          <Link
            to="/buchen"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors"
          >
            Reise auswählen <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {tours.map((tour) => (
            <Link
              key={tour.to}
              to={tour.to}
              className="stagger-child group flex flex-col overflow-hidden border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={tour.image}
                  alt={tour.title}
                  loading="lazy"
                  style={{ objectPosition: tour.imagePosition ?? "center" }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3 className="mb-3 font-display text-2xl leading-snug text-foreground md:text-3xl">
                  {tour.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-snug mb-4">
                  {tour.desc}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {tour.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {tour.groupSize}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="font-display text-2xl text-primary leading-none">
                      {tour.price}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      pro Person
                    </p>
                  </div>

                   <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-primary/20 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tours;

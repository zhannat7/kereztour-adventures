import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const tours = [
  {
    emoji: "🏇",
    title: "Weltspiele der Nomaden 2026",
    desc: "Erleben Sie das spektakuläre Kultur- und Sportevent am Issyk-Kul-See – Tradition, Abenteuer und internationale Atmosphäre.",
    to: "/reisen/nomaden",
  },
  {
    emoji: "🏛️",
    title: "Kultur Tour",
    desc: "10 Tage durch Kirgisistans kulturelle Highlights – von Bischkek bis zum Issyk-Kul, mit authentischen Erlebnissen.",
    to: "/reisen/kultur",
  },
  {
    emoji: "🥾",
    title: "Intensiv-Trekking für echte Naturfreunde",
    desc: "Anspruchsvolle Wanderungen durch unberührte Berglandschaften, Thermalquellen und majestätische Schluchten.",
    to: "/reisen/trekking",
  },
];

const Tours = () => {
  const ref = useScrollReveal();

  return (
    <section id="reisen" className="py-24 md:py-32 bg-muted/40 relative">
      <div ref={ref} className="section-reveal container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4 block">
            Entdecke unsere Touren
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground">
            Unsere <span className="italic text-primary">Reisen</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Link
              key={tour.to}
              to={tour.to}
              className="stagger-child group relative rounded-2xl bg-card border border-border p-8 flex flex-col cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 no-underline"
            >
              <span className="text-4xl mb-5 block transition-transform duration-300 group-hover:scale-110">
                {tour.emoji}
              </span>
              <h3 className="font-display text-xl md:text-2xl text-foreground mb-3 leading-snug">
                {tour.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-auto">
                {tour.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tours;

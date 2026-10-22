import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Clock, Users } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type Tour = {
  title: string;
  desc: string;
  duration: string;
  groupSize: string;
  price: string;
  originalPrice?: string;
  saving?: string;
  to: string;
  image?: string;
  imagePosition?: string;
};

const tours: Tour[] = [
  {
    title: "Kultur Tour",
    desc: "10 Tage durch die schönsten Regionen Kirgisistans – Kultur, Natur, Traditionen und echte Begegnungen.",
    duration: "10 Tage",
    groupSize: "Kleine Gruppe, maximal 8 Personen",
    price: "1.690 €",
    to: "/reisen/kultur",
    image: "/tour-kultur.webp",
    imagePosition: "center 65%",
  },
  {
    title: "Intensiv-Trekking",
    desc: "Berge, alpine Landschaften und abgelegene Täler – für alle, die Kirgisistan aktiv erleben möchten.",
    duration: "11 Tage",
    groupSize: "Kleine Gruppe, maximal 8 Personen",
    price: "1.490 €",
    originalPrice: "1.750 €",
    saving: "Sie sparen 260 €",
    to: "/reisen/trekking",
    image: "/tour-trekking.webp",
    imagePosition: "center 35%",
  },
];

const Tours = () => {
  const ref = useScrollReveal();
  const { t } = useLanguage();

  return (
    <section id="preise" className="bg-background py-10 md:py-14 scroll-mt-24">
      <div ref={ref} className="section-reveal container mx-auto max-w-[1160px] px-4 sm:px-6">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center md:mb-10 md:flex-row md:items-end md:text-left">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4 block">{t("Unsere Reisen")}</span>
            <h2 className="font-display text-3xl leading-tight text-foreground md:text-5xl">
              {t("Zwei Wege, ")}<span className="italic text-primary">{t("Kirgisistan zu entdecken")}</span>
            </h2>
          </div>
        </div>

        <div className="mx-auto max-w-[1160px]">
          {tours.map((tour, index) => (
            <Link
              key={tour.to}
              to={tour.to}
              className={`stagger-child group grid grid-cols-1 items-center gap-0 border-b border-border py-6 first:border-t md:py-8 lg:grid-cols-12 lg:gap-8 ${index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="relative aspect-[4/3] max-h-[400px] overflow-hidden bg-muted lg:col-span-6">
                <img
                  src={tour.image}
                  alt={t(tour.title)}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: tour.imagePosition ?? "center" }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
              </div>

              <div className="flex flex-col py-5 lg:col-span-6 lg:px-2 lg:py-6">
                <span className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {t("Reise")} 0{index + 1}
                </span>
                <h3 className="mb-3 font-display text-3xl leading-tight text-foreground sm:text-4xl xl:text-4xl">
                  {t(tour.title)}
                </h3>
                <p className="mb-5 max-w-xl text-base leading-7 text-muted-foreground">
                  {t(tour.desc)}
                </p>

                <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> {t(tour.duration)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> {t(tour.groupSize)}
                  </span>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
                  <div>
                    {tour.originalPrice && (
                      <div className="mb-2 flex flex-wrap items-center gap-3 text-xs">
                        <span className="rounded-full bg-secondary px-3 py-1 font-semibold uppercase tracking-wide text-secondary-foreground">{t("Angebot")}</span>
                        <span className="text-muted-foreground">{t(tour.saving ?? "")}</span>
                      </div>
                    )}
                    {tour.originalPrice && (
                      <p className="mb-1 font-display text-lg leading-none text-muted-foreground line-through">{t(tour.originalPrice)}</p>
                    )}
                    <p className="font-display text-3xl leading-none text-primary sm:text-4xl">{t(tour.price)}</p>
                    <p className="mt-2 text-xs tracking-wide text-muted-foreground">{t("pro Person")}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 border-b border-primary pb-2 text-sm font-semibold text-primary transition-colors group-hover:border-foreground group-hover:text-foreground">
                    {t("Reise entdecken")} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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

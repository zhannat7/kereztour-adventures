import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

type CultureDate = {
  id: string;
  startDate: string;
  endDate: string;
};

const Hero = () => {
  const [dates, setDates] = useState<CultureDate[]>([]);

  useEffect(() => {
    const loadDates = async () => {
      const { data, error } = await (supabase as any).rpc("get_tour_date_availability");

      if (error) {
        setDates([]);
        return;
      }

      setDates(
        ((data as any[]) ?? [])
          .filter((item: any) => item.tour === "Kultur Tour")
          .map((item: any) => ({
            id: item.id,
            startDate: item.start_date,
            endDate: item.end_date,
          }))
      );
    };

    loadDates();
  }, []);

  return (
    <section className="relative w-full h-[82vh] sm:h-[84vh] lg:h-[88vh] lg:max-h-[860px] lg:min-h-[650px] flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-wide.jpg"
          alt="Jurten-Lager im Tian Shan Gebirge von Kirgisistan"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,30,26,0.42)_0%,rgba(5,30,26,0.18)_42%,rgba(5,30,26,0.72)_100%)]" />
        <div className="absolute inset-0 bg-gradient-vignette" />
      </div>

      <div className="relative z-10 flex h-full w-full items-start">
        <div className="w-full px-6 pt-[132px] sm:px-10 sm:pt-[110px] lg:px-16 lg:pt-[calc(24vh-68px)] xl:px-24">
          <div className="mx-auto max-w-[620px] text-center lg:max-w-[900px]">
            <h1 className="mb-7 animate-slide-up font-display text-[42px] font-normal leading-[0.98] tracking-[0.015em] text-primary-foreground drop-shadow-lg sm:text-[58px] md:text-[68px] lg:mb-9 lg:text-[clamp(68px,6vw,92px)]">
              <span className="block">Kirgisistan</span>
              <span className="mt-2 block text-gold sm:mt-3 lg:whitespace-nowrap">
                Authentisch erleben
              </span>
            </h1>

            <div className="mb-8 flex animate-fade-in items-center justify-center gap-4 px-6 sm:mb-10 lg:mb-12">
              <span className="hidden h-px w-12 bg-gold sm:block" aria-hidden="true" />
              <p className="text-[12px] font-semibold uppercase leading-relaxed tracking-[0.22em] text-primary-foreground/90 sm:text-[13px] lg:text-[16px]">
                Kleine Gruppenreisen ins Herz Zentralasiens
              </p>
              <span className="hidden h-px w-12 bg-gold sm:block" aria-hidden="true" />
            </div>

            <div
              className="flex animate-fade-in-up flex-col items-center justify-center gap-5 sm:flex-row sm:items-stretch sm:gap-6"
              style={{ animationDelay: "0.25s" }}
            >
              <Link
                to="/buchen"
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-md border border-gold bg-gold/20 px-8 py-4 text-[15px] font-semibold uppercase tracking-[0.12em] text-white shadow-lift backdrop-blur-sm transition-all duration-500 hover:bg-gold/35 hover:shadow-glow sm:px-9"
              >
                <span className="absolute inset-0 translate-y-full bg-gold/25 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center gap-3 whitespace-nowrap">
                  Beginne Deine Reise
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {dates.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-7 sm:px-10 sm:pb-9 lg:px-16 xl:px-24">
          <div className="mx-auto max-w-[1180px] border-t border-white/25 pt-5">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              Nächste Reisetermine · Kultur Tour
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0">
              {dates.map((item, index) => (
                <div
                  key={item.id}
                  className={`py-1 sm:px-6 ${index > 0 ? "border-t border-white/15 sm:border-l sm:border-t-0" : "sm:pl-0"} ${index === dates.length - 1 ? "sm:pr-0" : ""}`}
                >
                  <p className="text-lg font-semibold tracking-tight text-white sm:text-xl lg:text-2xl">
                    {format(parseISO(item.startDate), "dd.MM.")}–{format(parseISO(item.endDate), "dd.MM.yyyy")}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-white/70 sm:text-sm">
              Für Intensiv-Trekking und Kyrchyn Tour stimmen wir den Reisetermin individuell mit dir ab.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;

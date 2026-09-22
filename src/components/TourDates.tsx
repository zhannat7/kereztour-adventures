import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type CultureDate = {
  id: string;
  startDate: string;
  endDate: string;
  availablePlaces: number;
  status: string;
};

const TourDates = () => {
  const ref = useScrollReveal();
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
            availablePlaces: Number(item.available_places),
            status: item.status,
          }))
      );
    };

    loadDates();
  }, []);

  return (
    <section className="py-12 md:py-14 bg-background">
      <div
        ref={ref}
        className="section-reveal container mx-auto px-6 max-w-[1180px]"
      >
        <div className="text-center max-w-2xl mx-auto mb-9">
          <span className="eyebrow mb-3 block">Kultur Tour</span>
          <h2 className="font-body text-3xl md:text-[2.35rem] font-semibold tracking-tight leading-tight text-foreground">
            Nächste Reisetermine
          </h2>
        </div>

        {dates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 border-y border-border/70">
              {dates.map((item, index) => {
                const isFull = item.status === "full" || item.availablePlaces <= 0;

                return (
                  <div
                    key={item.id}
                    className={`px-5 py-6 md:px-7 md:py-7 ${index > 0 ? "border-t md:border-t-0 md:border-l border-border/70" : ""}`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
                      Termin {index + 1}
                    </p>

                    <p className="font-body text-2xl md:text-[1.7rem] font-semibold tracking-tight text-foreground leading-tight">
                      {format(parseISO(item.startDate), "dd.MM.")}–{format(parseISO(item.endDate), "dd.MM.yyyy")}
                    </p>

                    <p className={`font-body text-sm mt-2 ${isFull ? "text-muted-foreground" : "text-primary"}`}>
                      {isFull
                        ? "Ausgebucht"
                        : `${item.availablePlaces} ${item.availablePlaces === 1 ? "Platz" : "Plätze"} verfügbar`}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-7">
              <Link
                to="/buchen?tour=kultur"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
              >
                Termin auswählen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="font-body text-center text-sm text-muted-foreground mt-4">
              Für Intensiv-Trekking und Kyrchyn Tour stimmen wir den Reisetermin individuell mit dir ab.
            </p>
          </>
        ) : (
          <p className="font-body text-center text-sm text-muted-foreground">
            Aktuell sind keine Reisetermine verfügbar.
          </p>
        )}
      </div>
    </section>
  );
};

export default TourDates;

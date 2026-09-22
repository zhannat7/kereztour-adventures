import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
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
    <section className="py-10 md:py-12 bg-sand/40">
      <div
        ref={ref}
        className="section-reveal container mx-auto px-6 max-w-[1400px]"
      >
        <div className="text-center max-w-2xl mx-auto mb-7">
          <span className="eyebrow mb-3 block">Kultur Tour</span>
          <h2 className="font-display text-3xl md:text-[2.35rem] leading-tight text-foreground">
            Nächste <span className="italic text-primary">Reisetermine</span>
          </h2>
        </div>

        {dates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dates.map((item) => {
                const isFull = item.status === "full" || item.availablePlaces <= 0;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border bg-card px-5 py-4 shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CalendarDays className="h-5 w-5" />
                      </span>

                      <div>
                        <p className="font-semibold text-foreground">
                          {format(parseISO(item.startDate), "dd.MM.")}–{format(parseISO(item.endDate), "dd.MM.yyyy")}
                        </p>
                        <p className="text-sm text-primary mt-0.5">
                          {isFull
                            ? "Ausgebucht"
                            : `${item.availablePlaces} ${item.availablePlaces === 1 ? "Platz" : "Plätze"} verfügbar`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-6">
              <Link
                to="/buchen?tour=kultur"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Termin auswählen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Für Intensiv-Trekking und Kyrchyn Tour stimmen wir den Reisetermin individuell mit dir ab.
            </p>
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Aktuell sind keine Reisetermine verfügbar.
          </p>
        )}
      </div>
    </section>
  );
};

export default TourDates;

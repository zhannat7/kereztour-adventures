import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

type CultureDate = {
  id: string;
  startDate: string;
  endDate: string;
};

const TourDates = () => {
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

  if (!dates.length) return null;

  return (
    <div className="relative z-20 mx-auto -mt-16 flex w-full max-w-[1600px] justify-end px-6 sm:-mt-20 lg:px-16 xl:px-24">
      <div className="relative mr-2 flex h-[200px] w-[200px] flex-col items-center justify-center rounded-full border border-gold/40 bg-card/80 px-6 text-center shadow-lift backdrop-blur-md sm:mr-6 lg:mr-12">
        <div className="absolute -top-8 left-1/2 h-8 w-px -translate-x-1/2 bg-gold/60" />
        <div className="absolute -top-[37px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-gold/50 bg-card shadow-soft" />

        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
          Kultur Tour
        </p>
        <p className="mt-1 font-body text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Termine 2026
        </p>

        <div className="my-3.5 w-full space-y-1.5 border-y border-border/70 py-3.5">
          {dates.map((item) => (
            <p
              key={item.id}
              className="font-body text-[14px] font-semibold tracking-[-0.01em] text-foreground"
            >
              {format(parseISO(item.startDate), "dd.MM.")}–{format(parseISO(item.endDate), "dd.MM.")}
            </p>
          ))}
        </div>

        <p className="px-1 text-[11px] font-medium leading-snug text-muted-foreground">
          Trekking & Kyrchyn nach Absprache
        </p>
      </div>
    </div>
  );
};

export default TourDates;

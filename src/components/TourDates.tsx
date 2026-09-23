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
    <div className="absolute bottom-6 right-5 z-20 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-12">
      <div className="relative flex h-[180px] w-[180px] flex-col items-center justify-center rounded-full border border-gold/40 bg-card/80 px-5 text-center shadow-lift backdrop-blur-md sm:h-[200px] sm:w-[200px] sm:px-6">
        <div className="absolute -top-7 left-1/2 h-7 w-px -translate-x-1/2 bg-gold/60" />
        <div className="absolute -top-[34px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-gold/50 bg-card shadow-soft" />

        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90">
          Kultur Tour
        </p>
        <p className="mt-1 font-body text-[10px] uppercase tracking-[0.16em] text-white/70">
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

        <p className="px-1 text-[10.5px] font-medium leading-snug text-muted-foreground sm:text-[11px]">
          Trekking & Kyrchyn nach Absprache
        </p>
      </div>
    </div>
  );
};

export default TourDates;

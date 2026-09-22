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
    <div className="relative z-20 -mt-12 flex justify-center px-6 sm:-mt-14">
      <div className="relative flex h-[190px] w-[190px] flex-col items-center justify-center rounded-full border border-border/80 bg-card px-5 text-center shadow-lift">
        <div className="absolute -top-8 left-1/2 h-8 w-px -translate-x-1/2 bg-border" />
        <div className="absolute -top-[36px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-card ring-1 ring-border" />

        <p className="font-body text-[9px] font-semibold uppercase tracking-[0.22em] text-primary">
          Kultur Tour
        </p>
        <p className="mt-1 font-body text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          Termine 2026
        </p>

        <div className="my-3 w-full space-y-1.5">
          {dates.map((item) => (
            <p
              key={item.id}
              className="font-body text-[13px] font-semibold tracking-tight text-foreground"
            >
              {format(parseISO(item.startDate), "dd.MM.")}–{format(parseISO(item.endDate), "dd.MM.")}
            </p>
          ))}
        </div>

        <p className="text-[8.5px] leading-tight text-muted-foreground">
          Trekking & Kyrchyn nach Absprache
        </p>
      </div>
    </div>
  );
};

export default TourDates;

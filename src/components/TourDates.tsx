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
    <div className="relative z-20 -mt-8 flex justify-center px-6 sm:-mt-10">
      <div className="relative w-full max-w-[360px] rounded-[28px] border border-border/80 bg-card px-6 py-5 text-center shadow-lift">
        <div className="absolute -top-3 left-1/2 h-6 w-px -translate-x-1/2 bg-border" />
        <div className="absolute -top-[17px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-border bg-card" />

        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Kultur Tour · Nächste Termine
        </p>

        <div className="mt-3 space-y-1">
          {dates.map((item) => (
            <p key={item.id} className="font-body text-[15px] font-semibold tracking-tight text-foreground">
              {format(parseISO(item.startDate), "dd.MM.")}–{format(parseISO(item.endDate), "dd.MM.yyyy")}
            </p>
          ))}
        </div>

        <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
          Trekking & Kyrchyn: Termin nach Absprache
        </p>
      </div>
    </div>
  );
};

export default TourDates;

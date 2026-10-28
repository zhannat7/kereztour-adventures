import { supabase } from "@/integrations/supabase/client";

// Shared in-memory cache so tour pages show dates instantly after a prefetch.
let cached: any[] | null = null;
let inflight: Promise<any[]> | null = null;

export const getCachedTourDates = () => cached;

export const fetchTourDates = (force = false): Promise<any[]> => {
  if (!force && inflight) return inflight;
  inflight = (supabase as any)
    .rpc("get_tour_date_availability")
    .then(({ data, error }: any) => {
      if (error) throw error;
      cached = (data as any[]) ?? [];
      return cached;
    })
    .finally(() => { inflight = null; });
  return inflight!;
};

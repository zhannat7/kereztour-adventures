import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TourDate = Database["public"]["Functions"]["get_tour_date_availability"]["Returns"][number];
const STORAGE_KEY = "kereztour:tour-dates:v1";
const MAX_AGE = 5 * 60 * 1000;

// Only public availability is stored, and a live read still runs on every mount.
const readSnapshot = (): { data: TourDate[]; savedAt: number } | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const snapshot = JSON.parse(raw);
    if (!Number.isFinite(snapshot.savedAt) || Date.now() - snapshot.savedAt > MAX_AGE || !Array.isArray(snapshot.data)) return null;
    if (!snapshot.data.every((row: TourDate) => row && typeof row.id === "string" && typeof row.tour === "string" && typeof row.start_date === "string" && typeof row.end_date === "string" && typeof row.status === "string" && Number.isFinite(row.available_places))) return null;
    return snapshot;
  } catch { return null; }
};
const snapshot = readSnapshot();
let cached: TourDate[] | null = snapshot?.data ?? null;
let savedAt = snapshot?.savedAt ?? 0;
let inflight: Promise<TourDate[]> | null = null;

export const getCachedTourDates = () => Date.now() - savedAt <= MAX_AGE ? cached : null;

export const fetchTourDates = (_force = false): Promise<TourDate[]> => {
  // Refresh triggers also share an active read, avoiding competing responses.
  if (inflight) return inflight;
  const request = supabase
    .rpc("get_tour_date_availability")
    .then(({ data, error }) => {
      if (error) throw error;
      cached = data ?? [];
      savedAt = Date.now();
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data: cached, savedAt })); } catch { /* Storage may be disabled. */ }
      return cached;
    })
    .finally(() => { inflight = null; });
  inflight = request;
  return request;
};

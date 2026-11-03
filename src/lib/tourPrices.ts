import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TourPrices = {
  kultur_2: number;
  kultur_3_4: number;
  kultur_5plus: number;
  trekking: number;
  trekking_original: number;
};

export const DEFAULT_PRICES: TourPrices = {
  kultur_2: 2700,
  kultur_3_4: 1700,
  kultur_5plus: 1690,
  trekking: 1490,
  trekking_original: 1750,
};

let cache: TourPrices | null = null;
let pending: Promise<TourPrices> | null = null;
const listeners = new Set<(p: TourPrices) => void>();

export const fetchTourPrices = async (force = false): Promise<TourPrices> => {
  if (cache && !force) return cache;
  if (pending && !force) return pending;
  pending = (async () => {
    const { data } = await (supabase as any).from("tour_prices").select("price_key, amount");
    const next = { ...DEFAULT_PRICES };
    for (const row of (data ?? []) as { price_key: keyof TourPrices; amount: number }[]) {
      if (row.price_key in next) next[row.price_key] = Number(row.amount);
    }
    cache = next;
    listeners.forEach((l) => l(next));
    return next;
  })();
  try { return await pending; } finally { pending = null; }
};

export const setTourPricesCache = (p: TourPrices) => {
  cache = p;
  listeners.forEach((l) => l(p));
};

export const useTourPrices = () => {
  const [prices, setPrices] = useState<TourPrices>(cache ?? DEFAULT_PRICES);
  useEffect(() => {
    listeners.add(setPrices);
    void fetchTourPrices();
    return () => { listeners.delete(setPrices); };
  }, []);
  return prices;
};

export const eur = (n: number) => `${n.toLocaleString("de-DE")} €`;

export type CultureTransport = "jeep" | "minibus";

/** Kultur Tour price per person by the customer's chosen vehicle. */
export const getCultureTransportPrice = (persons: number, transport: CultureTransport, p: TourPrices) => {
  if (persons < 1) return 0;
  if (transport === "minibus") return p.kultur_5plus;
  return persons <= 2 ? p.kultur_2 : p.kultur_3_4;
};

export const getCulturePrice = (persons: number, p: TourPrices) => {
  if (persons === 2) return p.kultur_2;
  if (persons >= 3 && persons <= 4) return p.kultur_3_4;
  if (persons >= 5) return p.kultur_5plus;
  return 0;
};

import { beforeEach, describe, expect, it, vi } from "vitest";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { rpc } }));

const row = { id: "date-1", tour: "Kultur Tour", start_date: "2027-05-15", end_date: "2027-05-24", status: "open", available_places: 8, confirmed_participants: 0, max_participants: 8 };
const key = "kereztour:tour-dates:v1";

beforeEach(() => { vi.resetModules(); sessionStorage.clear(); rpc.mockReset(); });

describe("shared tour date loading", () => {
  it("shows a recent snapshot immediately and refreshes its availability", async () => {
    sessionStorage.setItem(key, JSON.stringify({ data: [row], savedAt: Date.now() }));
    rpc.mockResolvedValue({ data: [{ ...row, available_places: 7 }], error: null });
    const cache = await import("../lib/tourDatesCache");
    expect(cache.getCachedTourDates()?.[0].available_places).toBe(8);
    await cache.fetchTourDates();
    expect(cache.getCachedTourDates()?.[0].available_places).toBe(7);
    expect(rpc).toHaveBeenCalledWith("get_tour_date_availability");
  });

  it("does not display an expired snapshot", async () => {
    sessionStorage.setItem(key, JSON.stringify({ data: [row], savedAt: Date.now() - 300001 }));
    const cache = await import("../lib/tourDatesCache");
    expect(cache.getCachedTourDates()).toBeNull();
  });

  it("shares concurrent navigation and refresh requests", async () => {
    rpc.mockResolvedValue({ data: [row], error: null });
    const cache = await import("../lib/tourDatesCache");
    const first = cache.fetchTourDates();
    expect(cache.fetchTourDates(true)).toBe(first);
    await first;
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it("can retry after a failed request", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: new Error("offline") }).mockResolvedValueOnce({ data: [row], error: null });
    const cache = await import("../lib/tourDatesCache");
    await expect(cache.fetchTourDates()).rejects.toThrow("offline");
    await expect(cache.fetchTourDates()).resolves.toEqual([row]);
  });
});
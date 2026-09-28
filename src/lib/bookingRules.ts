export type CultureTier = "economy" | "comfort";

export const getCulturePrice = (tier: CultureTier, persons: number): number => {
  if (tier === "comfort") return persons === 2 ? 2700 : 1700;
  return 1300;
};

export const isValidCultureGroupSize = (
  tier: CultureTier,
  persons: number,
): boolean =>
  tier === "economy"
    ? persons >= 6 && persons <= 8
    : persons === 2 || persons === 4;

export const calculateTotalPrice = (pricePerPerson: number, persons: number): number =>
  pricePerPerson * persons;

export const getAvailablePlaces = (
  tourHasTiers: boolean,
  tier: CultureTier | null,
  availability: {
    available_places?: number | null;
    economy_available_places?: number | null;
    comfort_available_places?: number | null;
  },
): number => {
  if (!tourHasTiers) return Number(availability.available_places ?? 0);

  if (tier === "economy") {
    return Number(
      availability.economy_available_places ?? availability.available_places ?? 0,
    );
  }

  return Number(
    availability.comfort_available_places ?? availability.available_places ?? 0,
  );
};

export const isBookingAvailable = (
  persons: number,
  availablePlaces: number,
): boolean => availablePlaces > 0 && persons <= availablePlaces;

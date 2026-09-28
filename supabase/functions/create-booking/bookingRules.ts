export type BookingTour = "kultur" | "trekking";
export type BookingTier = "economy" | "comfort" | "standard";

export const getBookingPrice = (
  tour: BookingTour,
  tier: BookingTier | null,
  persons: number,
): number => {
  if (tour === "trekking") return 1200;

  if (tier === "economy") return 1300;
  if (tier === "comfort") return persons === 2 ? 2700 : 1700;

  return 0;
};

export const isValidBookingOption = (
  tour: BookingTour,
  tier: BookingTier | null,
  persons: number,
): boolean => {
  if (tour === "trekking") return tier === "standard";
  if (tier === "economy") return persons >= 6 && persons <= 8;
  if (tier === "comfort") return persons === 2 || persons === 4;
  return false;
};

export const getAvailablePlaces = (
  tour: BookingTour,
  tier: BookingTier | null,
  availability: Record<string, unknown>,
): number => {
  if (tour === "trekking") return Number(availability.available_places ?? 0);

  if (tier === "economy") {
    return Number(
      availability.economy_available_places ?? availability.available_places ?? 0,
    );
  }

  if (tier === "comfort") {
    return Number(
      availability.comfort_available_places ?? availability.available_places ?? 0,
    );
  }

  return 0;
};

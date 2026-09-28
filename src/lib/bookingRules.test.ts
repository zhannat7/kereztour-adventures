import { describe, expect, test } from "vitest";
import {
  calculateTotalPrice,
  getAvailablePlaces,
  getCulturePrice,
  isBookingAvailable,
  isValidCultureGroupSize,
} from "./bookingRules";

describe("Kultur Tour pricing", () => {
  test("Standard costs 1,300 € per person", () => {
    expect(getCulturePrice("economy", 6)).toBe(1300);
    expect(getCulturePrice("economy", 8)).toBe(1300);
  });

  test("VIP costs 2,700 € for 2 people", () => {
    expect(getCulturePrice("comfort", 2)).toBe(2700);
  });

  test("VIP costs 1,700 € for 4 people", () => {
    expect(getCulturePrice("comfort", 4)).toBe(1700);
  });

  test("2 VIP people total 5,400 €", () => {
    expect(calculateTotalPrice(getCulturePrice("comfort", 2), 2)).toBe(5400);
  });

  test("4 VIP people total 6,800 €", () => {
    expect(calculateTotalPrice(getCulturePrice("comfort", 4), 4)).toBe(6800);
  });

  test("6 Standard people total 7,800 €", () => {
    expect(calculateTotalPrice(getCulturePrice("economy", 6), 6)).toBe(7800);
  });
});

describe("Kultur Tour group-size validation", () => {
  test("Standard allows 6 to 8 people", () => {
    expect(isValidCultureGroupSize("economy", 5)).toBe(false);
    expect(isValidCultureGroupSize("economy", 6)).toBe(true);
    expect(isValidCultureGroupSize("economy", 8)).toBe(true);
    expect(isValidCultureGroupSize("economy", 9)).toBe(false);
  });

  test("VIP allows only 2 or 4 people", () => {
    expect(isValidCultureGroupSize("comfort", 1)).toBe(false);
    expect(isValidCultureGroupSize("comfort", 2)).toBe(true);
    expect(isValidCultureGroupSize("comfort", 3)).toBe(false);
    expect(isValidCultureGroupSize("comfort", 4)).toBe(true);
    expect(isValidCultureGroupSize("comfort", 5)).toBe(false);
  });
});

describe("Availability", () => {
  test("uses Standard availability for economy", () => {
    expect(
      getAvailablePlaces(true, "economy", {
        available_places: 12,
        economy_available_places: 6,
        comfort_available_places: 2,
      }),
    ).toBe(6);
  });

  test("uses VIP availability for comfort", () => {
    expect(
      getAvailablePlaces(true, "comfort", {
        available_places: 12,
        economy_available_places: 6,
        comfort_available_places: 2,
      }),
    ).toBe(2);
  });

  test("falls back to total availability when tier capacity is missing", () => {
    expect(
      getAvailablePlaces(true, "comfort", {
        available_places: 4,
      }),
    ).toBe(4);
  });

  test("tierless trekking uses total availability", () => {
    expect(
      getAvailablePlaces(false, null, {
        available_places: 8,
      }),
    ).toBe(8);
  });

  test("booking is available only when enough places remain", () => {
    expect(isBookingAvailable(2, 2)).toBe(true);
    expect(isBookingAvailable(2, 1)).toBe(false);
    expect(isBookingAvailable(2, 0)).toBe(false);
  });
});

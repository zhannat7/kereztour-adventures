import {
  getAvailablePlaces,
  getBookingPrice,
  isValidBookingOption,
} from "./bookingRules.ts";

Deno.test("Kultur Standard price is 1,300 €", () => {
  if (getBookingPrice("kultur", "economy", 6) !== 1300) {
    throw new Error("Expected Standard price to be 1300");
  }
});

Deno.test("Kultur VIP price is 2,700 € for 2 people", () => {
  if (getBookingPrice("kultur", "comfort", 2) !== 2700) {
    throw new Error("Expected VIP 2-person price to be 2700");
  }
});

Deno.test("Kultur VIP price is 1,700 € for 4 people", () => {
  if (getBookingPrice("kultur", "comfort", 4) !== 1700) {
    throw new Error("Expected VIP 4-person price to be 1700");
  }
});

Deno.test("Kultur VIP allows only 2 or 4 people", () => {
  if (isValidBookingOption("kultur", "comfort", 1)) throw new Error("1 person must be invalid");
  if (!isValidBookingOption("kultur", "comfort", 2)) throw new Error("2 people must be valid");
  if (isValidBookingOption("kultur", "comfort", 3)) throw new Error("3 people must be invalid");
  if (!isValidBookingOption("kultur", "comfort", 5)) throw new Error("5 people must be invalid");
});

Deno.test("Kultur Standard allows 6 to 8 people", () => {
  if (isValidBookingOption("kultur", "economy", 5)) throw new Error("5 people must be invalid");
  if (!isValidBookingOption("kultur", "economy", 6)) throw new Error("6 people must be valid");
  if (!isValidBookingOption("kultur", "economy", 8)) throw new Error("8 people must be valid");
  if (isValidBookingOption("kultur", "economy", 9)) throw new Error("9 people must be invalid");
});

Deno.test("Trekking requires the standard tier", () => {
  if (!isValidBookingOption("trekking", "standard", 1)) {
    throw new Error("Trekking standard option must be valid");
  }
  if (isValidBookingOption("trekking", "comfort", 1)) {
    throw new Error("Trekking comfort option must be invalid");
  }
});

Deno.test("Availability uses the selected Kultur tier", () => {
  const availability = {
    available_places: 12,
    economy_available_places: 6,
    comfort_available_places: 2,
  };

  if (getAvailablePlaces("kultur", "economy", availability) !== 6) {
    throw new Error("Expected Standard availability to be 6");
  }

  if (getAvailablePlaces("kultur", "comfort", availability) !== 2) {
    throw new Error("Expected VIP availability to be 2");
  }
});

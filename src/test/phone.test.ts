import { describe, it, expect } from "vitest";
import { isValidPhone } from "../lib/phone";

describe("Telefonnummern-Prüfung im Buchungsformular", () => {
  it("akzeptiert die vollständige österreichische Nummer +4368110272670", () => {
    expect(isValidPhone("+4368110272670")).toBe(true);
  });

  it("akzeptiert Trennzeichen und 00-Vorwahl", () => {
    expect(isValidPhone("+43 681 102 726 70")).toBe(true);
    expect(isValidPhone("+43 (0)681 / 10272670")).toBe(true);
    expect(isValidPhone("0043 681 10272670")).toBe(true);
  });

  it("lehnt unvollständige Nummern ab", () => {
    expect(isValidPhone("222")).toBe(false);
    expect(isValidPhone("+43")).toBe(false);
    expect(isValidPhone("")).toBe(false);
  });
});

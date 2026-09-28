import { describe, expect, test } from "vitest";
import { getEditableTextEntries } from "./LanguageContext";

describe("editable website text catalog", () => {
  test("contains the main booking and navigation texts", () => {
    const keys = new Set(getEditableTextEntries().map((entry) => entry.key));

    expect(keys.has("Reise buchen")).toBe(true);
    expect(keys.has("Buchungsanfrage senden →")).toBe(true);
    expect(keys.has("Vorname")).toBe(true);
    expect(keys.has("Nachname")).toBe(true);
    expect(keys.has("E-Mail")).toBe(true);
    expect(keys.has("Telefonnummer")).toBe(true);
  });

  test("does not contain duplicate keys", () => {
    const entries = getEditableTextEntries();
    const keys = entries.map((entry) => entry.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  test("every catalog entry has a fallback string", () => {
    for (const entry of getEditableTextEntries()) {
      expect(entry.key.length).toBeGreaterThan(0);
      expect(entry.fallback).toBeTypeOf("string");
    }
  });
});

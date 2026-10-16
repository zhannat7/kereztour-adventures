import { describe, expect, it } from "vitest";
import { isInquiryStatus } from "../lib/inquiry-status";

describe("Bearbeitungsstatus für Kontaktanfragen", () => {
  it("akzeptiert einen offenen, laufenden und abgeschlossenen Bearbeitungsstand", () => {
    expect(isInquiryStatus("pending")).toBe(true);
    expect(isInquiryStatus("in_progress")).toBe(true);
    expect(isInquiryStatus("completed")).toBe(true);
  });
  it("weist unbekannte Statuswerte vor dem Speichern zurück", () => {
    expect(isInquiryStatus("confirmed")).toBe(false);
    expect(isInquiryStatus("")).toBe(false);
  });
});
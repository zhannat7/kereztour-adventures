import { describe, expect, test } from "vitest";
import { getEditableTextEntries } from "../src/i18n/LanguageContext";
describe("editable website text catalog", () => {
 test("contains main booking texts",()=>{const keys=new Set(getEditableTextEntries().map(e=>e.key)); for(const k of ["Reise buchen","Buchungsanfrage senden →","Vorname","Nachname","E-Mail","Telefonnummer"]) expect(keys.has(k)).toBe(true);});
 test("has no duplicate keys",()=>{const keys=getEditableTextEntries().map(e=>e.key); expect(new Set(keys).size).toBe(keys.length);});
 test("every entry has fallback",()=>{for(const e of getEditableTextEntries()){expect(e.key.length).toBeGreaterThan(0);expect(e.fallback).toBeTypeOf("string");}});
});
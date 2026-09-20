# Kontaktformular im grünen Bereich (CtaBand) mit E-Mail-Versand

## Ziel

Im grünen Kontaktbereich unten auf der Startseite:

- Button „Reise anfragen →" wird ersetzt durch **„Anfrage per Formular →"**.
- Klick darauf öffnet ein **Kontaktformular direkt auf der Website** (Modal-Dialog) mit den Feldern:
  - Name
  - E-Mail-Adresse
  - Gewünschte Reise (Auswahl: Kultur Tour / Intensiv-Trekking / Weltspiele der Nomaden 2026)
  - Reisezeitraum (Von – Bis, Datumswahl)
  - Anzahl der Personen
  - Nachricht
  - Button **„Anfrage senden"**
- Die Anfrage geht als E-Mail an **sarinasadirovna@gmail.com** und wird zusätzlich in der Datenbank gespeichert.
- „Direkt auf WhatsApp" und die sichtbare E-Mail-Adresse darunter bleiben unverändert. Sonst nichts am grünen Bereich ändern.

## Voraussetzung: E-Mail-Versand aktivieren

Die Website kann noch keine E-Mails versenden. Damit Anfragen ankommen, ist einmalig die Einrichtung eines eigenen Absender-Domains nötig (Domain muss der Nutzerin gehören). Ablauf:

1. E-Mail-Setup-Dialog anzeigen → Nutzerin richtet ihren Domain ein (DNS-Bestätigung kann danach noch etwas dauern; Versand startet automatisch nach Freischaltung).
2. E-Mail-Infrastruktur im Backend aufsetzen (`setup_email_infra`).
3. App-E-Mail-Versand aktivieren (`scaffold_transactional_email`).

## Umsetzung

### 1. Datenbank

- Neue Tabelle `public.contact_messages` (Name, Email, Tour, DateFrom, DateTo, Persons, Message, Timestamps).
- RLS aktivieren; Policy: anonyme INSERTs erlaubt, Lesen nur für authentifizierte Nutzer.
- GRANTs: INSERT für anon/authenticated, SELECT für authenticated, ALL für service_role.

### 2. E-Mail-Vorlage

- Neue Vorlage `contact-inquiry.tsx` in `supabase/functions/_shared/transactional-email-templates/`:
  - Betreff: „Neue Reiseanfrage von {name}"
  - Inhalt: alle Formularfelder übersichtlich aufbereitet, Markenfarben, weißer Hintergrund.
- In `registry.ts` registrieren, danach Edge Functions deployen.

### 3. Formular im CtaBand

- `CtaBand.tsx`: Button-Text ändern, Dialog (shadcn `Dialog`) mit Formular öffnen.
- Validierung wie auf der Buchungsseite (zod: Pflichtfelder, gültige E-Mail, Personen 1–20, Nachricht max. 1000 Zeichen).
- Beim Absenden:
  1. INSERT in `contact_messages`
  2. `send-transactional-email` aufrufen mit `templateName: "contact-inquiry"`, `recipientEmail: sarinasadirovna@gmail.com`, `idempotencyKey` aus der Datensatz-ID, `templateData` mit allen Feldern.
- Ladezustand am Button, Erfolgsmeldung im Dialog („Danke! Wir melden uns innerhalb von 24 Stunden."), Fehlermeldung bei Problemen.
- Design im bestehenden Stil des Buchungsformulars (dieselben Eingabefelder, gleiche Typografie).

### 4. Prüfung

- Formular absenden und prüfen: Eintrag in der Datenbank, E-Mail in der Warteschlange.
- Desktop (1431×872) und Handy (390×844): Dialog vollständig bedienbar, nichts abgeschnitten.
- Build-Fehler-Log kontrollieren.

## Hinweis

- Jede E-Mail erhält automatisch einen kleinen Abmelde-Hinweis im Footer – das ist technisch nicht abschaltbar, für Anfragen aber unproblematisch.
- Bis der Domain bestätigt ist, werden Anfragen trotzdem gespeichert; die E-Mail-Benachrichtigung startet automatisch nach Freischaltung.

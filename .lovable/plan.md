# WhatsApp-Screenshots in „Gästestimmen" auf mittlere Größe verkleinern

## Aktueller Stand
Die beiden WhatsApp-Screenshots (Helmut & Hubert) füllen derzeit die komplette Kartenbreite (~353 × 650 px auf dem PC, ~9,3 × 17,2 cm) und wirken dadurch zu groß.

## Geplante Änderung (nur `src/components/Testimonials.tsx`)

Die Screenshots werden auf eine **mittelgroße, professionell wirkende Darstellung** verkleinert:

1. **Feste maximale Höhe:** ca. **430 px (~11,3 cm)** auf dem PC, ca. **360 px** auf dem Handy — deutlich kleiner als jetzt, aber noch gut lesbar.
2. **Bild mittig in der Karte** statt randlos vollbreit: dezenter heller Hintergrundbereich (Kartenfarbe) mit etwas Innenabstand, damit das kleinere Bild nicht verloren wirkt.
3. **Leicht abgerundete Ecken** am Screenshot selbst (`rounded-lg`) — ordnet sich sauber in die Karte ein.
4. **Kartenhöhe:** Die Karten behalten ihre Höhe (via `justify-center`), sodass alle drei Karten gleich hoch bleiben und das Grid ruhig wirkt.
5. **Nichts anderes ändert sich:** Design, Farben, Schatten, Hover-Effekte, die Text-Bewertung (Maria S.) und die übrigen Sections bleiben unverändert.

## Verifikation
- Playwright-Check auf PC (1431×872) und Handy (390×844): Screenshot-Größe messen, Darstellung mittig und ausgewogen prüfen.
- Build-Fehler Log prüfen.

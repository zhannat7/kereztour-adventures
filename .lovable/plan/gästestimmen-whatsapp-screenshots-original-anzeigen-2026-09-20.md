# Gästestimmen: WhatsApp-Screenshots „original" anzeigen

## Ziel
Die beiden WhatsApp-Bewertungen sollen wie das Original-Screenshot wirken: ohne Rahmen, ohne grauen Innen-Hintergrund, ohne abgerundete Innenkante — das Screenshot selbst füllt die Karte komplett (randlos, Vollbreite), wie ein echter Chat-Ausschnitt.

## Änderung (nur `src/components/Testimonials.tsx`)
- Screenshot-Karten: statt `p-4` + `bg-muted/40` + kleinem abgerundeten Bild das Bild **vollflächig** in der Karte darstellen:
  - `<img>` mit `w-full h-auto` (natürliches Seitenverhältnis, kein Beschnitt),
  - kein Padding, kein Innen-Hintergrund, keine Innenrundung — die Karte rundet oben via `overflow-hidden` selbst,
  - Text-Karte (Maria S.) bleibt unverändert.
- Höhe: Vollbreite bei 3 Spalten ergibt ca. 340–400 px Bildhöhe — gut lesbar und „original".

## Verifikation
- Playwright (Desktop 1431×872 + Handy 390×844): Screenshot der Sektion prüfen.
- **Rückfall-Regel (Wunsch des Nutzers):** Wirkt die randlose Darstellung unschön (z. B. weil die Screenshots einen hellen Chat-Hintergrund haben, der mit der Kartenfarbe konkurriert), wird der jetzige Zustand (zentriert mit leichtem Innen-Abstand) beibehalten — dann keine Änderung im Build.

## Nicht anpassen
- Design, Farben, Schrift, Karten-Raster, Text-Karte, Grid-Layout bleiben unverändert.

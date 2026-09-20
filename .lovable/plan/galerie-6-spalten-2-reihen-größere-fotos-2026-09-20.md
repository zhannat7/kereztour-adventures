# Galerie: 6 Spalten × 2 Reihen (größere Fotos)

## Ziel
Die Reisefotos werden größer: statt 8 Spalten nur noch **6 Spalten in 2 Reihen** (12 sichtbare Fotos, Instagram-ähnlich). Alle 63 Fotos bleiben über die Klick-Ansicht (Lightbox) erreichbar.

## Änderungen — `src/components/Gallery.tsx`

1. `VISIBLE` von `16` auf `12` ändern (2 Reihen à 6 Spalten).
2. Grid-Klassen anpassen:
   - `grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8`
   → `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`
   - Ab Tablet/Mobil bleibt es kleiner (3–4 Spalten), ab Desktop exakt 6 Spalten.
3. Sonst nichts ändern: quadratische Kacheln (`aspect-square`), Hover-Zoom, Lightbox, Zähltexte bleiben unverändert.

## Ergebnis bei 1160 px Fensterbreite
Jede Kachel wächst von ca. 134 × 134 px auf ca. **185 × 185 px (≈ 4,9 × 4,9 cm)** — rund 40 % größer. Auf großen Bildschirmen (1600 px) ca. **250 × 250 px (≈ 6,6 cm)**.

## Verifikation
- Build prüfen (`build-errors.log`).
- Playwright-Screenshot Desktop (1431×872) und Mobil (390×844): 6 Spalten × 2 Reihen, keine Abschneidung, Lightbox öffnet.

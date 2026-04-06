
## Plan: Hero-Sektion verkleinern

Das Problem ist klar: `min-h-screen` macht den Hero 100vh hoch, sodass die zweite Sektion (Highlights) beim Laden nicht sichtbar ist. Wie im Referenzbild soll der Hero ca. 65-70% der Viewport-Höhe einnehmen, damit der Besucher sofort einen Teaser der nächsten Sektion sieht.

### Änderungen in `src/components/Hero.tsx`

1. **Höhe reduzieren**: `min-h-screen` → `h-[70vh] md:h-[75vh]` — damit bleibt ca. 25-30% des Viewports für den Anfang der Highlights sichtbar
2. **Content kompakter machen**: 
   - Stats-Bereich (`mt-16`) auf `mt-8` reduzieren
   - Abstände zwischen Elementen leicht verringern (mb-8 → mb-5, mb-10 → mb-6)
3. **Alles andere bleibt**: Text, Crossfade, Farben, Animationen — alles unverändert

### Ergebnis
Beim Öffnen der Seite sieht der User den Hero mit den Bildern UND bereits die Überschrift + obere Hälfte der Highlights-Sektion — genau wie im Referenzbeispiel.

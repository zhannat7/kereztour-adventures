

## Plan: Galerie-Redesign — Enges Mosaik-Grid mit Thumbnail-Lightbox

Inspiriert vom Fussballtour-Referenzbild: kompaktes Grid mit vielen kleinen Bildern, keine Overlays, und eine Lightbox mit Thumbnail-Streifen.

### Änderungen in `src/components/Gallery.tsx`

**1. Section-Header**
- Titel: "Fotos unserer zufriedenen Kunden" mit Hashtag `#kereztour` (im Primary-Farbton)
- Zentriert, passend zum bestehenden Design-System (Instrument Serif)

**2. Grid-Layout (ersetzt Masonry)**
- Enges, gleichmässiges Grid: 4 Spalten mobile, 6-8 Spalten tablet, 10 Spalten desktop
- Alle Bilder quadratisch zugeschnitten (`aspect-square object-cover`)
- Kleiner Gap (2-3px) zwischen Bildern
- Abgerundete Ecken (rounded, ~4px)
- Keine dunklen Overlays, keine Hover-Effekte mit Gradient
- Alle 48 Bilder direkt sichtbar (kein "Mehr laden" Button)

**3. Neue Lightbox (ersetzt aktuelle)**
- Dunkler Hintergrund (bg-black/95)
- Grosses Bild zentriert in Originalgrösse
- X-Button oben rechts zum Schliessen
- Navigationspfeile links/rechts
- Zähler unten (z.B. "5 von 48")
- **Thumbnail-Streifen** am unteren Rand: horizontal scrollbare kleine Vorschaubilder, aktives Bild hervorgehoben mit hellem Rahmen
- Keyboard-Navigation (Escape, Pfeiltasten)
- Mobile-freundlich: Touch-fähiger Thumbnail-Streifen

### Technische Details
- Nur `Gallery.tsx` wird geändert
- Alle 48 bestehenden Bild-Imports bleiben erhalten
- Lightbox-Komponente wird inline neu geschrieben mit Thumbnail-Leiste
- Scroll-into-view für aktives Thumbnail im Streifen


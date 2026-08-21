# Navbar fixieren

## Ziel
Die Navbar bleibt beim Scrollen auf allen Seiten fixiert am oberen Bildschirmrand, damit Navigation und "Anfrage senden" jederzeit erreichbar sind.

## Aktueller Zustand
- Auf der Startseite ist die Navbar `absolute` positioniert und scrollt mit der Seite aus dem Bild.
- Auf Unterseiten ist sie `relative` und scrollt ebenfalls mit.
- Es gibt bereits einen Scroll-State (`scrolled`), der das Aussehen zwischen transparent und solid umschaltet.

## Umsetzung
1. **Positionierung ändern**
   - Wrapper von `absolute`/`relative` auf `fixed top-0 left-0 right-0 z-50` umstellen.
   - Auf der Startseite weiterhin transparent über dem Hero anzeigen, wenn `scrolled === false`.
   - Nach dem Scrollen und auf allen Unterseiten die solide `bg-background/85 backdrop-blur-xl`-Variante verwenden.

2. **Layout-Kompensation**
   - Prüfen, ob der fixierten Navbar ein Padding/Offset am `<body>` oder Page-Wrapper fehlt, damit Inhalte nicht unter die Navbar rutschen.
   - Ggf. `pt-20` oder ähnlichen Abstand auf Page-Containern ergänzen.

3. **Mobile Menü**
   - Sicherstellen, dass das aufklappende Mobile-Menü korrekt unter der fixierten Navbar erscheint und weiterhin scrollbar ist.
   - Schließen-Verhalten beim Klick auf einen Link beibehalten.

## Technische Details
- Datei: `src/components/Navbar.tsx`
- Tailwind-Klassen: `fixed`, `top-0`, `z-50`, `bg-background/85`, `backdrop-blur-xl`
- Keine neuen Abhängigkeiten nötig.

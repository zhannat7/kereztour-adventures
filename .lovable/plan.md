# Einheitliche Seitenbreite

## Ziel
Alle Bereiche der Startseite und die Navigationsleiste erhalten dieselbe großzügige horizontale Linie wie die neue Galerie. Dadurch werden unnötig breite Seitenränder reduziert und die Seite wirkt durchgehend ausgerichtet.

## Umsetzung
1. Die äußeren Inhaltscontainer von Highlights, Reisen, Über uns, Gästestimmen, Preise, FAQ, Kontaktband und Footer auf eine gemeinsame breitere Maximalbreite umstellen.
2. Die Navigationsleiste auf dieselbe Maximalbreite setzen, sodass Logo und Menüpunkte mit den Bereichen darunter fluchten.
3. Schmalere innere Textblöcke dort beibehalten, wo sie die Lesbarkeit sichern; nur die äußere Ausrichtung und verfügbare Fläche werden verbreitert.
4. Desktop und Handy auf abgeschnittene Inhalte, Überlauf und saubere Ausrichtung prüfen.

## Technische Details
- Gemeinsame äußere Breite: `max-w-[1600px]` mit dem bestehenden seitlichen Abstand `px-6`.
- Kartenraster dürfen die neue Breite nutzen; Fließtext bleibt über bestehende innere `max-w-*`-Begrenzungen gut lesbar.
- Keine Änderungen an Texten, Farben, Bildern oder Funktionen.

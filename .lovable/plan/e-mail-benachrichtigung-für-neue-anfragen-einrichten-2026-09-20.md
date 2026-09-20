# E-Mail-Benachrichtigung für neue Anfragen einrichten

## Stand (geprüft)

Die Datenbank funktioniert. Buchungen und Kontaktanfragen werden bereits zuverlässig gespeichert. Was noch fehlt: die automatische E-Mail-Benachrichtigung an sarinasadirovna@gmail.com bei jeder neuen Anfrage.

## Ziel

Bei jeder neuen Kontaktanfrage über das Formular bekommst du automatisch eine E-Mail mit allen Angaben des Kunden.

## Schritte

1. **Absender-Domain einrichten:** Es öffnet sich ein Einrichtungsfenster – dort trägst du deine eigene Domain ein (z. B. deine Website-Domain). Bis die Domain bestätigt ist, werden Anfragen weiterhin gespeichert; die E-Mails starten automatisch nach Freischaltung.
2. **E-Mail-System im Backend aufsetzen** (läuft automatisch nach Schritt 1).
3. **E-Mail-Vorlage für Anfragen** fertigstellen: Betreff „Neue Reiseanfrage von {Name}", übersichtliche Darstellung aller Formularfelder in den Markenfarben.
4. **Abmelde-Seite** in der App anlegen (technisch nötig, wird im E-Mail-Footer verlinkt).
5. **Prüfung:** Test-Anfrage absenden, Datenbankeintrag und E-Mail-Versand kontrollieren; Desktop und Handy checken.

## Hinweis

Jede E-Mail enthält automatisch einen kleinen Abmelde-Hinweis im Footer – technisch nicht abschaltbar, für Anfragen aber unproblematisch.

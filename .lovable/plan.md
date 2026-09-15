# Hero-Reduktion: weniger Text wie im Musterbild

## Ziel
Der Hero soll wie im Musterbild (Nomad Land KG) sehr aufgeräumt wirken: großes Bild, wenig Text, ein klarer Button. Die gelöschte Unterzeile wird nicht verloren — sie wandert in die "Über uns"-Sektion als ausführliche Beschreibung.

## Änderungen

### 1. `src/components/Hero.tsx` — Text reduzieren
Entfernt werden:
- Die Unterzeile „Abseits des Massentourismus: echte Nomadenkultur, wilde Berglandschaften und herzliche Gastfreundschaft – persönlich geplant von Anfang bis Ende."
- Der zweite Button „Unverbindlich anfragen"
- Die Trust-Zeile „5,0 / 5,0 · Kleine Gruppen · Lokale Gastgeber"

Übrig bleibt (wie im Musterbild, zentriert über dem Bild):
- Eyebrow: „Kleine Gruppenreisen ins Herz Zentralasiens"
- Titel: „Kirgisistan. Authentisch erleben."
- Ein Button: „Reise finden" (führt zur Buchungsseite)

Abstände werden danach neu ausbalanciert, damit der reduzierte Block zentral und luftig sitzt. Bild, Höhe, Overlay und Navbar bleiben unverändert.

### 2. `src/components/About.tsx` — Text dort einfügen
Der gelöschte Satz wird als einleitender Absatz in die „Über uns"-Sektion übernommen (dort steht er bisher nicht):

> „Abseits des Massentourismus: echte Nomadenkultur, wilde Berglandschaften und herzliche Gastfreundschaft – persönlich geplant von Anfang bis Ende."

Er ergänzt dort die bestehenden Absätze über Sarina und das kleine Reisebüro.

## Verifikation
- Screenshot Desktop + Mobile: Hero zeigt nur Eyebrow, Titel, einen Button; Text gut lesbar; nächste Sektion unten sichtbar.
- Build-Fehler-Log prüfen.

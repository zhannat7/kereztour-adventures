# Hero-Untertitel in die zweite Sektion verschieben

## Ziel
Der Satz „Abseits des Massentourismus: echte Nomadenkultur, wilde Berglandschaften und herzliche Gastfreundschaft – persönlich geplant von Anfang bis Ende." wird aus dem Hero entfernt und in der zweiten Sektion („Warum Kereztour") platziert. Der Hero wird reduziert: großes Bild, Eyebrow, Headline, Buttons, Trust-Zeile – mehr Text nicht.

## Änderungen

### 1. `src/components/Hero.tsx`
- Untertitel-Absatz (Zeilen 43–49) entfernen.
- Abstände danach anpassen, damit der Hero ausgewogen bleibt: Abstand unter der Headline leicht vergrößern, Abstand zwischen Buttons und Trust-Zeile angleichen.
- Alles andere (Bild, Farben, Höhe, Animationen) bleibt unverändert.

### 2. `src/components/Highlights.tsx`
- Den verschobenen Satz als Lead-Text der Sektion „Warum Kereztour" einfügen – prominent unter der Überschrift, als erster einführender Absatz.
- Den bestehenden Absatz („Kein Massentourismus, keine Callcenter…") kürzen bzw. mit dem neuen Lead zusammenführen, damit sich nichts doppelt – z. B. als kürzerer zweiter Satz.
- Scroll-Reveal-Animation wie bisher beibehalten.

## Verifikation
- Build prüfen (keine Fehler).
- Playwright-Screenshot Desktop + Mobile: Hero ohne Untertitel sauber zentriert; Satz erscheint in der zweiten Sektion.

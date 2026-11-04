# Markenhandbuch (Deutsch)

*Abgeleitete Kopie der englischen Fassung. Bei Abweichungen gilt die englische Fassung.*

Mampfio ist ein fiktiver Essens-Lieferdienst, ein Aggregator für Restaurants aller Küchen. Die Marke existiert für das SCS-Buch und den Workshop als Beispielunternehmen. Dieser Styleguide gilt für alle Oberflächen der Beispiel-Codebasis, für Folien und für mampfio.de.

Die Marke steht auf einem Satz: **Essen soll Spaß machen, schon beim Bestellen.** Darum ist das Logo ein Gesicht, das genüsslich in eine Pizza beißt, und keine abstrakte Form.

## Logo

Das Logo besteht aus der Bildmarke (Gesicht mit Pizza) und der Wortmarke „mampfio“ in Baloo 2 ExtraBold, kleingeschrieben. Die Wortmarke ist als Pfad gezeichnet, damit sie ohne Webfont korrekt aussieht. Alle Dateien liegen in der Asset-Gruppe **Logos**.

| Datei | Einsatz |
| --- | --- |
| `mampfio-lockup.svg` | Standard. Auf `surface`, `surface-raised` oder `surface-sunken`. |
| `mampfio-lockup-reversed.svg` | Auf dunklem Grund: `surface` im dunklen Theme oder Fotos mit dunkler Fläche. |
| `mampfio-mark.svg` | Wenn der Name schon daneben steht: Navigation, Ladebildschirm, Social-Avatar. |
| `mampfio-app-icon.svg` | App-Icon und Favicon ab 32 px. |
| `mampfio-wordmark.svg` | Nur wo die Bildmarke nicht passt, etwa im Fließtext-Footer. |

**Schutzzone:** Rund um das Logo bleibt ein Viertel der Höhe der Bildmarke frei. Bei 120 px Höhe sind das 30 px auf jeder Seite.

**Mindestgrößen:** Das Lockup ist digital mindestens 120 px breit und im Druck mindestens 30 mm. Die Bildmarke ist mindestens 32 px hoch. Darunter verschwinden Zähne, Krümel und Salami. Eine vereinfachte Favicon-Variante für 16 px fehlt noch.

**Nicht erlaubt:**

- Das Lockup auf `brand-berry` oder `action` setzen, denn dann verschwindet das Gesicht.
- Gesicht oder Pizza umfärben, drehen, verzerren, mit Kontur oder Schatten versehen.
- Die Pizza gegen anderes Essen tauschen. Das ist eine offene Markenentscheidung und kein Gestaltungsspielraum.
- Die Wortmarke großschreiben oder neu setzen. Im Fließtext heißt die Firma „Mampfio“, mit großem M.

## Farben

Die Farben haben Rollen. Wer eine Farbe sucht, sucht die Rolle, nicht den Farbton.

- **Grund:** `surface` (Creme) ist der Standard. `surface-raised` trägt Karten, `surface-sunken` setzt Bereiche ab.
- **Text:** `ink` (Pflaume) für alles Lesbare, `ink-muted` für Metadaten. Reines Schwarz gibt es nicht.
- **Aktion:** `action` mit `on-action` für die eine Primäraktion pro Screen, typischerweise „In den Warenkorb“ oder „Bestellen“. `link` und `focus` sind die dunklere Beere.
- **Marke und Illustration:** `brand-berry`, `cheese`, `crust` und `pepperoni` kommen aus dem Logo. Nur `cheese` darf als UI-Highlight auftreten, mit `on-cheese` als Textfarbe.
- **Status:** `error` und `success` erscheinen immer zusammen mit Icon und Text.

`brand-berry` ist bewusst keine UI-Farbe. Creme auf dem Logo-Pink erreicht nur 4.3:1 und fällt bei normalem Text durch. Darum ist `action` eine Stufe dunkler.

## Typografie

Zwei Familien, beide von Google Fonts:

- **Baloo 2** (`display`) in ExtraBold für Überschriften. Sie ist rund und gutmütig, wie das Logo. Nie für Fließtext und nie unter 20 px.
- **Nunito Sans** (`sans`) für alles andere. Sie ist ruhig genug, um Speisekarten lesbar zu halten.

Preise stehen in `body-strong`. Metadaten wie Lieferzeit und Liefergebühr stehen in `caption` in `ink-muted`, nie kleiner als 13 px.

## Formen und Raster

Mampfio ist rund. Buttons nutzen `radius-m`, Karten und Bilder `radius-l`, Filter `radius-pill`. Spitze Ecken kommen nicht vor.

Abstände folgen einem 4-px-Raster: `space-4` innerhalb von Karten, `space-6` zwischen Karten, `space-12` zwischen Abschnitten. Es gibt genau eine Schattenstufe, `shadow-card`.

## Illustration und Essen

Essen wird flach gezeichnet, in den Logo-Farben, mit runden Enden und ohne Verläufe. Wenn Fotos verwendet werden, zeigen sie das Gericht von oben oder leicht schräg, mit warmem Licht und ohne Menschen. Das Gesicht aus dem Logo bleibt Logo: Es wird nicht zum Maskottchen mit Armen und Szenen.

## Ikonografie

Icons sind Strich-Icons auf einem 24-px-Raster mit 2 px Strichstärke und runden Enden, in `ink` oder `on-action`. Ein Icon-Set ist noch nicht festgelegt.

## Tonalität

Mampfio duzt, spricht kurz und klingt nach jemandem, der gern isst. Humor gibt es sparsam, höchstens einmal pro Screen und nie in Fehlermeldungen.

| So | Nicht so |
| --- | --- |
| Deine Pizza ist unterwegs. Noch etwa 20 Minuten. | Ihre Bestellung wurde erfolgreich an den Lieferpartner übermittelt! |
| Das hat nicht geklappt. Prüf bitte deine Adresse. | Ups! Da ist was schiefgelaufen 🙈 |
| Hunger? Mampfio. | Die Nr. 1 für Ihren Genuss!!! |

## Barrierefreiheit

Jedes Textpaar in den Tokens erreicht in beiden Themes mindestens 4.5:1. Die Werte stehen in den Usage-Notizen. Steuerelement-Ränder und der Fokusring erreichen mindestens 3:1. Status wird nie nur über Farbe vermittelt, denn `error` und `action` liegen beide im Rotbereich.

## Offene Punkte

- Die DPMA-Markenprüfung für „Mampfio“ steht aus. Bis dahin ist dieses Logo ein Arbeitsstand.
- Es fehlt eine Favicon-Variante für 16 px.
- Ein Icon-Set ist noch nicht festgelegt.
- UI-Komponenten wie Button, Restaurantkarte und Warenkorb sind noch nicht enthalten.

# Typography

Bootstrap's reboot sets body text in Nunito Sans and headings in Baloo 2. For anything else use the design system's type styles, `.mf-<style>`. They set family, size, line height, weight and letter spacing in one class.

```html example
<p class="mf-display-l mb-2">Pizza in deiner Nähe</p>
<p class="mf-heading mb-2">Beliebt in Ehrenfeld</p>
<p class="mf-heading-s mb-1">Trattoria Bella</p>
<p class="mf-caption text-body-secondary mb-4">25–35 Min · 1,99 € Lieferung</p>
<p class="mf-body-l mb-3">Wir bringen dir dein Lieblingsessen – heiß und pünktlich.</p>
<p class="mf-body mb-3">Margherita mit Büffelmozzarella und Basilikum</p>
<p class="mb-0"><span class="mf-body-strong">12,50 €</span> · <span class="mf-label">In den Warenkorb</span></p>
```

| Class | Use |
| --- | --- |
| `.mf-display-xl` | Landing page hero, at most one line per screen |
| `.mf-display-l` | Page titles |
| `.mf-heading` | Section headings |
| `.mf-heading-s` | Restaurant names on cards, dialog titles |
| `.mf-body-l` | Introductions, marketing copy |
| `.mf-body` | Default body text, dish descriptions |
| `.mf-body-strong` | Prices, emphasis in body text |
| `.mf-label` | Form labels and other labels |
| `.mf-caption` | Metadata, always with `.text-body-secondary`. Never smaller than 13 px. |

## Rules

- Baloo 2 is for headings only, never below 20 px. That rules out `.mf-display-*` and `.mf-heading*` for anything smaller.
- Prices are always `.mf-body-strong`.
- The type style doesn't decide the HTML element. A restaurant name on a card can be an `h3` with `.mf-heading-s`.
- Don't use Bootstrap's `.fs-*`, `.display-*` or `.lead`. They compile, but their sizes are not Mampfio's.

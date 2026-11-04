# Buttons

Mampfio uses two button styles: primary for the one main action of a screen, and outline secondary for everything else.

```html example
<button type="button" class="btn btn-primary">In den Warenkorb</button>
<button type="button" class="btn btn-outline-secondary">Details</button>
<button type="button" class="btn btn-primary" disabled>Bestellen</button>
```

## Rules

- **Exactly one primary button per screen.** Typically "In den Warenkorb" or "Bestellen". A list of restaurant cards with a primary button on each card breaks the rule; the screen's main action is elsewhere.
- **Everything else is `.btn-outline-secondary`.** It uses `control-border` and `ink`, so it stays readable in both themes.
- **Don't use the other variants** (`.btn-secondary`, `.btn-success`, `.btn-danger`, `.btn-warning`, `.btn-info`, `.btn-light`, `.btn-dark`, or the other outline variants). They compile from light-theme colours and stay light in dark mode. Only primary and outline secondary are corrected for dark mode.
- Button labels are short verbs in German, with the informal "du": "Bestellen", not "Bestellung absenden".

## Sizes and full width

Buttons are rounder than inputs (`radius-m`). Sizes keep the radius.

```html example
<div class="d-flex flex-wrap gap-3 align-items-center mb-4">
  <button type="button" class="btn btn-primary btn-sm">Klein</button>
  <button type="button" class="btn btn-primary">Normal</button>
  <button type="button" class="btn btn-primary btn-lg">Groß</button>
</div>
<button type="button" class="btn btn-primary w-100">Bestellen</button>
```

On a phone, the main action of a form or the basket spans the full width with `.w-100`.

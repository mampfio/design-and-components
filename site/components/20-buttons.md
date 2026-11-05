# Buttons

Mampfio uses two button styles: primary for the one main action of a screen, and outline secondary for everything else.

```html example
<div class="d-flex flex-wrap gap-3">
  <button type="button" class="btn btn-primary">In den Warenkorb</button>
  <button type="button" class="btn btn-outline-secondary">Details</button>
</div>
```

## Disabled

A disabled button loses the brand colour: muted text on a sunken fill, the same for both styles. It doesn't fade, so it can't be mistaken for an enabled button.

```html example
<div class="d-flex flex-wrap gap-3">
  <button type="button" class="btn btn-primary" disabled>Bestellen</button>
  <button type="button" class="btn btn-outline-secondary" disabled>Details</button>
</div>
```

Prefer an enabled button with a clear message over a disabled one. "Bestellen" that stays disabled until the form is valid doesn't tell anyone what's missing; an enabled button that shows the errors does. Disable a button only when the reason is visible right next to it, for example "Mindestbestellwert 15 € noch nicht erreicht".

## Rules

- **Exactly one primary button per screen.** Typically "In den Warenkorb" or "Bestellen". A list of restaurant cards with a primary button on each card breaks the rule; the screen's main action is elsewhere.
- **Everything else is `.btn-outline-secondary`.** It uses `control-border` and <dfn title="Design-system name for the text colour.">`ink`</dfn>, so it stays readable in both themes.
- **Don't use the other variants** (`.btn-secondary`, `.btn-success`, `.btn-danger`, `.btn-warning`, `.btn-info`, `.btn-light`, `.btn-dark`, or the other outline variants). They stay light in dark mode.
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

## With an icon

An icon goes before the label, at 20 px (`.mf-icon-sm`). Buttons with an icon only need an `aria-label`.

```html example
<div class="d-flex flex-wrap gap-3 align-items-center">
  <button type="button" class="btn btn-primary d-inline-flex align-items-center gap-2">
    <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#shopping-basket"></use></svg>
    In den Warenkorb
  </button>
  <button type="button" class="btn btn-outline-secondary d-inline-flex align-items-center gap-2">
    <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#phone"></use></svg>
    Restaurant anrufen
  </button>
  <button type="button" class="btn btn-outline-secondary d-inline-flex align-items-center p-2" aria-label="Aus dem Warenkorb entfernen">
    <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#trash-2"></use></svg>
  </button>
</div>
```

See the [Icons](icons.html) page for the full set and what each icon means.

# Menu and basket

## Menu items

A menu lists dishes in a flush list group inside a card. Each dish has its name, description, price and an add button. The add button is outline secondary: a menu has many dishes, and the screen's one primary action is "Bestellen" in the basket.

```html example
<section class="card" aria-labelledby="pizza">
  <div class="card-body p-4 pb-0">
    <h2 class="mf-heading mb-0" id="pizza">Pizza</h2>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item d-flex gap-4 align-items-start px-4 py-4">
      <div class="flex-grow-1">
        <h3 class="mf-body-strong mb-1">Margherita</h3>
        <p class="mb-2">Tomaten, Büffelmozzarella, Basilikum</p>
        <p class="mf-body-strong mb-0">12,50 €</p>
      </div>
      <button type="button" class="btn btn-outline-secondary d-inline-flex p-2" aria-label="Margherita in den Warenkorb">
        <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#plus"></use></svg>
      </button>
    </li>
    <li class="list-group-item d-flex gap-4 align-items-start px-4 py-4">
      <div class="flex-grow-1">
        <h3 class="mf-body-strong mb-1">Diavola <span class="badge text-bg-warning ms-1">Neu</span></h3>
        <p class="mb-2">Tomaten, Mozzarella, scharfe Salami</p>
        <p class="mf-body-strong mb-0">13,90 €</p>
      </div>
      <button type="button" class="btn btn-outline-secondary d-inline-flex p-2" aria-label="Diavola in den Warenkorb">
        <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#plus"></use></svg>
      </button>
    </li>
  </ul>
</section>
```

- The dish name is `.mf-body-strong`, not a Baloo heading: a menu has dozens of them, and the section heading carries the display face.
- The description is `.mf-body` in `ink`; it's content, not metadata.
- The add button names the dish in its `aria-label`, so a screen reader list of buttons makes sense.

## Quantity stepper

Once a dish is in the basket, the add button becomes a stepper. It is pill-shaped (`radius-pill`), and the quantity between the buttons is announced when it changes. At one, the minus button becomes a trash button.

```html example
<div class="d-flex flex-wrap gap-6 align-items-center">
  <div class="d-inline-flex align-items-center gap-2" role="group" aria-label="Menge Margherita">
    <button type="button" class="btn btn-outline-secondary rounded-pill d-inline-flex p-2" aria-label="Eine Margherita weniger">
      <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#minus"></use></svg>
    </button>
    <output class="mf-body-strong text-center" style="min-width: 2ch" aria-live="polite">2</output>
    <button type="button" class="btn btn-outline-secondary rounded-pill d-inline-flex p-2" aria-label="Eine Margherita mehr">
      <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#plus"></use></svg>
    </button>
  </div>
  <div class="d-inline-flex align-items-center gap-2" role="group" aria-label="Menge Diavola">
    <button type="button" class="btn btn-outline-secondary rounded-pill d-inline-flex p-2" aria-label="Diavola aus dem Warenkorb entfernen">
      <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#trash-2"></use></svg>
    </button>
    <output class="mf-body-strong text-center" style="min-width: 2ch" aria-live="polite">1</output>
    <button type="button" class="btn btn-outline-secondary rounded-pill d-inline-flex p-2" aria-label="Eine Diavola mehr">
      <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#plus"></use></svg>
    </button>
  </div>
</div>
```

## Basket button

The basket in the header shows how many items it holds in a count badge, `.mf-badge-count`. The visually hidden text makes the count readable without the badge.

```html example
<a href="#" class="btn btn-outline-secondary position-relative d-inline-flex align-items-center gap-2">
  <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#shopping-basket"></use></svg>
  Warenkorb
  <span class="badge mf-badge-count position-absolute top-0 start-100 translate-middle">3<span class="visually-hidden"> Artikel</span></span>
</a>
```

## Basket

The basket lists what's in it, the costs and the screen's one primary action. If the minimum order value isn't reached, the button stays enabled and the reason is shown right above it.

```html example
<section class="card" style="max-width: 420px" aria-labelledby="warenkorb">
  <div class="card-body p-4">
    <h2 class="mf-heading-s mb-1" id="warenkorb">Dein Warenkorb</h2>
    <p class="mf-caption text-body-secondary mb-4">Trattoria Bella · 25–35 Min</p>
    <ul class="list-unstyled mb-4">
      <li class="d-flex align-items-center gap-3 py-2 border-bottom">
        <span class="flex-grow-1">2 × Margherita</span>
        <span class="mf-body-strong">25,00 €</span>
      </li>
      <li class="d-flex align-items-center gap-3 py-2 border-bottom">
        <span class="flex-grow-1">1 × Diavola</span>
        <span class="mf-body-strong">13,90 €</span>
      </li>
    </ul>
    <dl class="d-grid gap-1 mb-4" style="grid-template-columns: 1fr auto">
      <dt class="fw-normal text-body-secondary">Zwischensumme</dt><dd class="mb-0 text-end">38,90 €</dd>
      <dt class="fw-normal text-body-secondary">Lieferung</dt><dd class="mb-0 text-end">1,99 €</dd>
      <dt class="mf-body-strong">Gesamt</dt><dd class="mf-body-strong mb-0 text-end">40,89 €</dd>
    </dl>
    <button type="button" class="btn btn-primary w-100">Bestellen</button>
  </div>
</section>
```

## Rules

- **The basket's "Bestellen" is the screen's one primary button.** Add buttons and steppers on the menu are outline secondary.
- **Prices are `.mf-body-strong`,** everywhere, with a comma and a space before the euro sign: `12,50 €`.
- **Counts use `.mf-badge-count`, offers `.text-bg-warning`.** Never the other way round.
- **Every icon-only button has an `aria-label`** that names the dish: "Eine Margherita mehr", not "Plus".

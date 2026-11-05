# Cards

Cards are the main container for restaurants and dishes. They use `surface-raised`, `radius-l` and the design system's only shadow, `shadow-card`. Card padding is `space-4` (`.p-4`); the gap between cards is `space-6` (`.g-6`).

```html example
<div class="row g-6">
  <div class="col-sm-6">
    <article class="card h-100">
      <div class="card-body p-4">
        <h3 class="mf-heading-s mb-1">Trattoria Bella</h3>
        <p class="mf-caption text-body-secondary mb-4">25–35 Min · 1,99 € Lieferung</p>
        <p class="mb-4">Margherita mit Büffelmozzarella und Basilikum</p>
        <div class="d-flex align-items-center gap-3">
          <span class="mf-body-strong">12,50 €</span>
          <button type="button" class="btn btn-outline-secondary ms-auto">Details</button>
        </div>
      </div>
    </article>
  </div>
  <div class="col-sm-6">
    <article class="card h-100">
      <div class="card-body p-4">
        <div class="d-flex align-items-start gap-2 mb-1">
          <h3 class="mf-heading-s mb-0">Sushi Ehrenfeld</h3>
          <span class="badge text-bg-warning ms-auto">−20 %</span>
        </div>
        <p class="mf-caption text-body-secondary mb-4">35–45 Min · kostenlose Lieferung</p>
        <p class="mb-4">Lachs-Avocado-Roll, 8 Stück</p>
        <div class="d-flex align-items-center gap-3">
          <span class="mf-body-strong">9,90 €</span>
          <button type="button" class="btn btn-outline-secondary ms-auto">Details</button>
        </div>
      </div>
    </article>
  </div>
</div>
```

## With an image

A restaurant or dish card can lead with an image. The card's `radius-l` rounds its top corners. The heading's link stretches over the whole card, so the card is one click target.

```html example
<div class="row row-cols-1 row-cols-sm-2 g-6">
  <div class="col">
    <article class="card h-100">
      <div class="ratio ratio-16x9">
        <img src="dish-pizza.svg" class="card-img-top object-fit-cover" alt="">
      </div>
      <div class="card-body p-4">
        <h3 class="mf-heading-s mb-1"><a href="#" class="stretched-link text-reset text-decoration-none">Trattoria Bella</a></h3>
        <p class="mf-caption text-body-secondary d-flex align-items-center gap-1 mb-0">
          <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#star"></use></svg>
          <span><span class="visually-hidden">Bewertung</span> 4,7</span> · 25–35 Min · 1,99 € Lieferung
        </p>
      </div>
    </article>
  </div>
</div>
```

- Images are 16:9 (`.ratio-16x9` with `.object-fit-cover`), so a list of cards lines up.
- `alt=""` when the restaurant or dish name follows; the image would only repeat it.
- Photos show the dish from above or at a slight angle, in warm light, without people. Illustrations are flat, in the logo colours.

## Rules

- A card is an `article` when it stands for one thing, a restaurant or a dish.
- Restaurant name in `.mf-heading-s`, metadata in `.mf-caption` with `.text-body-secondary`, price in `.mf-body-strong`.
- No primary button on a card in a list. See [Buttons](buttons.html).
- Don't add shadows, borders or other radii. There is one shadow level, and cards already carry it.

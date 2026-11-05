# Empty and loading states

## Empty

An empty list says what's missing and offers the next step. The icon sits in a `surface-sunken` circle; the text follows the tone of voice.

```html example
<div class="text-center py-12 px-4">
  <div class="d-inline-flex p-4 rounded-circle bg-body-secondary mb-4">
    <svg class="mf-icon" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#shopping-basket"></use></svg>
  </div>
  <h2 class="mf-heading-s mb-2">Dein Warenkorb ist leer</h2>
  <p class="text-body-secondary mb-6">Such dir was Leckeres aus. Wir bringen es dir.</p>
  <a href="#" class="btn btn-outline-secondary">Restaurants entdecken</a>
</div>
```

## Loading

While a list loads, show its shape with Bootstrap's placeholders, not a spinner. The page doesn't jump when the content arrives. A visually hidden status tells screen readers what's happening.

```html example
<div class="row row-cols-1 row-cols-sm-2 g-6" aria-busy="true">
  <p class="visually-hidden" role="status">Restaurants werden geladen</p>
  <div class="col">
    <div class="card h-100" aria-hidden="true"><div class="card-body p-4 placeholder-glow">
      <p class="mf-heading-s mb-1"><span class="placeholder col-7"></span></p>
      <p class="mf-caption mb-0"><span class="placeholder col-5"></span></p>
    </div></div>
  </div>
  <div class="col">
    <div class="card h-100" aria-hidden="true"><div class="card-body p-4 placeholder-glow">
      <p class="mf-heading-s mb-1"><span class="placeholder col-6"></span></p>
      <p class="mf-caption mb-0"><span class="placeholder col-4"></span></p>
    </div></div>
  </div>
</div>
```

For short waits inside a button, such as sending the order, use a small spinner next to the label and keep the button's width:

```html example
<button type="button" class="btn btn-primary d-inline-flex align-items-center gap-2" disabled>
  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
  <span role="status">Wird bestellt …</span>
</button>
```

## Rules

- **Empty states offer a way on,** with one outline secondary button. They may use the screen's one bit of humour; errors never do.
- **Placeholders have the shape of what's coming:** the same cards, the same type styles.
- **Spinners only in buttons** and only for actions that take a moment. A whole page doesn't spin.
- **Text in empty and loading states is German, with "du",** like every other text.

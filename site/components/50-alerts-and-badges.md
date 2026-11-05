# Alerts and badges

## Alerts

Mampfio has two status roles: `success` and `error`. Use `.alert-success` and `.alert-danger`, with `role="status"` for confirmations and `role="alert"` for errors.

```html example
<div class="alert alert-success d-flex gap-3 align-items-start mb-3" role="status">
  <svg class="mf-icon" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#circle-check"></use></svg>
  <span>Deine Pizza ist unterwegs. Noch etwa 20 Minuten.</span>
</div>
<div class="alert alert-danger d-flex gap-3 align-items-start mb-0" role="alert">
  <svg class="mf-icon" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#circle-alert"></use></svg>
  <span>Das hat nicht geklappt. Prüf bitte deine Adresse.</span>
</div>
```

- Status is never conveyed by colour alone. The text has to work without the colour.
- Every status message has its icon: `circle-check` for success, `circle-alert` for errors. The icon is decoration (`aria-hidden`); the text carries the message.
- `.alert-warning` and `.alert-info` exist, but Mampfio has no such roles. Don't use them.
- Known limit: alert backgrounds and borders keep their light shades in dark mode.

## Badges

Badges mark offers and news. They use `cheese` with `on-cheese` text, which is what `.text-bg-warning` means in Mampfio.

```html example
<span class="badge text-bg-warning">Neu in Köln</span>
<span class="badge text-bg-warning">−20 %</span>
<span class="badge text-bg-warning">Gratis Lieferung</span>
```

- Use `.text-bg-warning` for offers and news. The other `.text-bg-*` classes stay light in dark mode.
- An offer badge is a highlight, so at most one per card.

### Count badges

A count badge shows a number of items, such as the basket count. It uses `action` with `on-action` text: add `.mf-badge-count` to `.badge`. Its text is 13 px, the caption minimum.

```html example
<span class="badge mf-badge-count">3</span>
<span class="badge mf-badge-count">12</span>
```

- Counts only. An offer is never a count badge, and a count is never cheese.
- Add the unit as visually hidden text, so the number makes sense without the icon next to it: `3<span class="visually-hidden"> Artikel</span>`. See [Menu and basket](menu-and-basket.html).

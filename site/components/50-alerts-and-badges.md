# Alerts and badges

## Alerts

Mampfio has two status roles: `success` and `error`. Use `.alert-success` and `.alert-danger`, with `role="status"` for confirmations and `role="alert"` for errors.

```html example
<div class="alert alert-success mb-3" role="status">Deine Pizza ist unterwegs. Noch etwa 20 Minuten.</div>
<div class="alert alert-danger mb-0" role="alert">Das hat nicht geklappt. Prüf bitte deine Adresse.</div>
```

- Status is never conveyed by colour alone. The text has to work without the colour.
- The design system asks for an icon with every status message. No icon set has been chosen yet, so the examples have none.
- `.alert-warning` and `.alert-info` exist, but Mampfio has no such roles. Don't use them.
- Known limit: in dark mode, alert backgrounds and borders are shades Bootstrap derives from the light status colours, not Mampfio tokens.

## Badges

Badges mark offers and news. They use `cheese` with `on-cheese` text, which is what `.text-bg-warning` means in Mampfio.

```html example
<span class="badge text-bg-warning">Neu in Köln</span>
<span class="badge text-bg-warning">−20 %</span>
<span class="badge text-bg-warning">Gratis Lieferung</span>
```

- Use `.text-bg-warning` only. The other `.text-bg-*` classes stay light in dark mode.
- A badge is a highlight, so at most one per card.

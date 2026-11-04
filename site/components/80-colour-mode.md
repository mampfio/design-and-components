# Colour mode

Mampfio has a light and a dark theme. A page chooses one with `data-theme` on `<html>`. Without the attribute, a page is light, whatever the operating system prefers.

```html
<html lang="de" data-theme="dark">
```

The attribute also works on a part of the page. Everything inside takes the other theme:

```html example
<div class="row g-4">
  <div class="col-sm-6" data-theme="light">
    <div class="card"><div class="card-body p-4">
      <p class="mf-heading-s mb-3">Hell</p>
      <button type="button" class="btn btn-primary">Bestellen</button>
    </div></div>
  </div>
  <div class="col-sm-6" data-theme="dark">
    <div class="card"><div class="card-body p-4">
      <p class="mf-heading-s mb-3">Dunkel</p>
      <button type="button" class="btn btn-primary">Bestellen</button>
    </div></div>
  </div>
</div>
```

## Rules

- **Set `data-theme`, never `data-bs-theme`.** Bootstrap's own attribute does nothing here. `scss/_color-mode.scss` points Bootstrap at `data-theme`.
- **The preference belongs to the user, not to one SCS.** If Discovery shows dark and Ordering light, the theme flips at every boundary. All SCS have to read the same preference, for example a cookie on the shared domain, and render `data-theme` on the server, so the page doesn't flash.
- **Logos switch with the theme.** Use `mampfio-lockup.svg` on light and `mampfio-lockup-reversed.svg` on dark.

## What stays light in dark mode

Bootstrap 5 compiles theme colours at build time. The WebJar corrects primary and outline secondary buttons, focus rings and cards. These keep their light colours:

- utilities such as `.bg-primary` and `.text-bg-success` (except `.text-bg-warning`, cheese is the same in both themes),
- checked checkboxes, switches, active pills and active pagination items,
- alert backgrounds and borders, which Bootstrap derives from the light status colours.

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

- **Set `data-theme`, never `data-bs-theme`.** With Bootstrap's attribute, Bootstrap's parts switch but the Mampfio tokens don't, so the page ends up half dark.
- **The preference belongs to the user, not to one SCS.** If Discovery shows dark and Ordering light, the theme flips at every boundary. All SCS read the same cookie, below, and render `data-theme` on the server, so the page doesn't flash.
- **Logos switch with the theme.** Use `mampfio-lockup.svg` on light and `mampfio-lockup-reversed.svg` on dark.

## The theme cookie

Every SCS follows this contract:

| | |
| --- | --- |
| Name | `mampfio-theme` |
| Values | `light` or `dark`. Missing or any other value means `light`. |
| Domain | The domain all SCS share, so every SCS sees the same cookie |
| Path | `/` |
| Other attributes | `SameSite=Lax`, `Max-Age` one year, not `HttpOnly`, because the toggle sets it in the browser |

On every request, the server reads the cookie and renders `<html data-theme="…">`. The toggle sets the cookie and switches the page without a reload. It shows `moon` on light pages and `sun` on dark ones:

```html
<button type="button" class="btn btn-outline-secondary d-inline-flex p-2" id="theme-toggle" aria-label="Dunkles Design">
  <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#moon"></use></svg>
</button>
<script type="module">
  const toggle = document.getElementById("theme-toggle");
  const show = (theme) => {
    toggle.setAttribute("aria-label", theme === "dark" ? "Helles Design" : "Dunkles Design");
    toggle.querySelector("use").setAttribute("href", `/webjars/mampfio-design-system/icons/icons.svg#${theme === "dark" ? "sun" : "moon"}`);
  };
  show(document.documentElement.dataset.theme);
  toggle.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.cookie = `mampfio-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.dataset.theme = theme;
    show(theme);
  });
</script>
```

Without a `Domain` attribute, as above, the cookie belongs to the host that set it. When the SCS run on subdomains, add `Domain=` with the shared parent domain.

## What stays light in dark mode

Primary and outline secondary buttons, focus rings, cards and dialogs follow the theme. These keep their light colours:

- utilities such as `.bg-primary` and `.text-bg-success` (except `.text-bg-warning`, cheese is the same in both themes),
- checked checkboxes, switches, active pills and active pagination items,
- alert backgrounds and borders, which Bootstrap derives from the light status colours.

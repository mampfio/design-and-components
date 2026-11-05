# Page layout

Every Mampfio page has the same frame: the shared header, one `main` with the page's content, and a footer. Inside, a `.container` holds the content with the brand book's page margins, `space-4` on phones and `space-8` from `lg` up.

```html
<!doctype html>
<html lang="de" data-theme="light"> <!-- from the mampfio-theme cookie, see Colour mode -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pizza in Ehrenfeld · Mampfio</title>
  <link rel="icon" href="/webjars/mampfio-design-system/logos/mampfio-favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/webjars/mampfio-design-system/css/mampfio.min.css">
  <script src="/webjars/mampfio-design-system/js/bootstrap.bundle.min.js" defer></script>
</head>
<body>
  <a class="visually-hidden-focusable" href="#inhalt">Zum Inhalt</a>
  <!-- the shared header, included from the SCS that owns it -->
  <main id="inhalt" class="container px-4 px-lg-8 py-8">
    …
  </main>
  <footer class="bg-body-secondary">
    <div class="container px-4 px-lg-8 py-8">…</div>
  </footer>
</body>
</html>
```

## A whole page

```html example
<div class="bg-body-secondary text-body-secondary mf-caption text-center py-4">Gemeinsamer Header</div>
<main class="container px-4 px-lg-8 py-8">
  <nav aria-label="Brotkrumen" class="mb-4">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item"><a href="#">Köln</a></li>
      <li class="breadcrumb-item active" aria-current="page">Ehrenfeld</li>
    </ol>
  </nav>
  <h1 class="mf-display-l mb-2">Pizza in Ehrenfeld</h1>
  <p class="mf-body-l mb-12">12 Restaurants liefern zu dir.</p>
  <section aria-labelledby="beliebt">
    <h2 class="mf-heading mb-6" id="beliebt">Beliebt</h2>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-6">
      <div class="col">
        <article class="card h-100"><div class="card-body p-4">
          <h3 class="mf-heading-s mb-1">Trattoria Bella</h3>
          <p class="mf-caption text-body-secondary mb-0">25–35 Min · 1,99 € Lieferung</p>
        </div></article>
      </div>
      <div class="col">
        <article class="card h-100"><div class="card-body p-4">
          <h3 class="mf-heading-s mb-1">Pizzeria da Enzo</h3>
          <p class="mf-caption text-body-secondary mb-0">30–40 Min · kostenlose Lieferung</p>
        </div></article>
      </div>
    </div>
  </section>
</main>
<footer class="bg-body-secondary">
  <div class="container px-4 px-lg-8 py-8 mf-caption text-body-secondary">Mampfio · Impressum · Datenschutz</div>
</footer>
```

## Rules

- **Page margins:** put `.px-4 .px-lg-8` on every `.container`. Bootstrap's own container padding is 12 px, which isn't a Mampfio step.
- **One `h1` per page,** in `.mf-display-l`. `.mf-display-xl` is for the landing page hero only.
- **Sections** are `space-12` apart (`.mb-12`); a section heading is `space-6` above its content (`.mb-6`).
- **Lists of cards** use `.row-cols-*` with `.g-6`: one column on phones, two from `md`, three from `lg`.
- **Breakpoints** are Bootstrap's: `sm` 576 px, `md` 768 px, `lg` 992 px, `xl` 1200 px, `xxl` 1400 px.
- **The footer** sits on `surface-sunken` (`.bg-body-secondary`).
- **The header** isn't part of this layout. Each SCS includes it from the system that owns it, see [Navigation](navigation.html).
- **The skip link** comes first in `body`, so keyboard users can jump past the header.

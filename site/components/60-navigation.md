# Navigation

## Tabs and pills

Tabs switch between views of the same thing, such as a restaurant's menu and its ratings. Filters are pills with `radius-pill`: add `.rounded-pill` to each link, because `.nav-pills` alone uses the input radius.

```html example
<ul class="nav nav-tabs mb-6">
  <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Speisekarte</a></li>
  <li class="nav-item"><a class="nav-link" href="#">Bewertungen</a></li>
  <li class="nav-item"><a class="nav-link" href="#">Infos</a></li>
</ul>
<ul class="nav nav-pills gap-2">
  <li class="nav-item"><a class="nav-link active rounded-pill" aria-current="page" href="#">Alle</a></li>
  <li class="nav-item"><a class="nav-link rounded-pill" href="#">Pizza</a></li>
  <li class="nav-item"><a class="nav-link rounded-pill" href="#">Sushi</a></li>
  <li class="nav-item"><a class="nav-link rounded-pill" href="#">Burger</a></li>
</ul>
```

## Breadcrumb and pagination

```html example
<nav aria-label="Brotkrumen" class="mb-4">
  <ol class="breadcrumb mb-0">
    <li class="breadcrumb-item"><a href="#">Köln</a></li>
    <li class="breadcrumb-item"><a href="#">Ehrenfeld</a></li>
    <li class="breadcrumb-item active" aria-current="page">Trattoria Bella</li>
  </ol>
</nav>
<nav aria-label="Seiten">
  <ul class="pagination mb-0">
    <li class="page-item disabled"><a class="page-link">Zurück</a></li>
    <li class="page-item active" aria-current="page"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">Weiter</a></li>
  </ul>
</nav>
```

## Rules

- Navigation across SCS (the header with logo, search and basket) is not a Bootstrap component here. Each SCS includes it from the system that owns it.
- Inside one SCS, use tabs for views and pills for filters.
- Known limit: active pills and pagination use the light `action` colour in dark mode.

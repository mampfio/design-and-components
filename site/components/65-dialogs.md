# Dialogs

Dialogs are Bootstrap modals. They sit on `surface-raised` with `radius-l`, like cards. The title uses `.mf-heading-s`.

```html example
<div class="modal position-static d-block" tabindex="-1" aria-labelledby="dialog-title">
  <div class="modal-dialog m-0">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title mf-heading-s" id="dialog-title">Anderes Restaurant?</h2>
        <button type="button" class="btn-close" aria-label="Schließen"></button>
      </div>
      <div class="modal-body">
        <p class="mb-0">In deinem Warenkorb liegen Gerichte von Trattoria Bella. Wenn du bei Sushi Ehrenfeld bestellst, leeren wir ihn.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary">Abbrechen</button>
        <button type="button" class="btn btn-primary">Warenkorb leeren</button>
      </div>
    </div>
  </div>
</div>
```

The example shows the dialog in place. In a page, it's hidden until a button opens it:

```html
<button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#restaurant-wechseln">Sushi Ehrenfeld</button>

<div class="modal fade" id="restaurant-wechseln" tabindex="-1" aria-labelledby="restaurant-wechseln-titel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">…</div>
  </div>
</div>
```

## Rules

- **Inside a dialog, the dialog's main action is the primary button.** The page's primary button is behind the backdrop.
- **Cancel comes first, the main action last,** as in Bootstrap's footer.
- **The title says what happens,** as a question or a short statement: "Anderes Restaurant?", not "Hinweis" or "Achtung".
- **Use a dialog only when the user has to decide before going on.** Confirmations go in a `role="status"` alert, see [Alerts and badges](alerts-and-badges.html).

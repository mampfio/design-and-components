# Forms

Form controls are Bootstrap's, with Mampfio's `control-border` (at least <dfn title="WCAG contrast ratio between text and background. 4.5:1 is the minimum for normal text; 3:1 for large text, borders and focus rings.">3:1</dfn> against the surface) and the Mampfio focus ring. Labels use `.mf-label`.

```html example
<form class="mx-0" style="max-width: 420px" onsubmit="return false">
  <label class="form-label mf-label" for="street">Straße und Hausnummer</label>
  <input class="form-control mb-3" id="street" value="Venloer Str. 12">

  <label class="form-label mf-label" for="time">Lieferzeit</label>
  <select class="form-select mb-3" id="time">
    <option>So schnell wie möglich</option>
    <option>18:30</option>
  </select>

  <label class="form-label mf-label" for="note">Hinweis für den Fahrer</label>
  <textarea class="form-control mb-1" id="note" rows="2" aria-describedby="note-help"></textarea>
  <p class="mf-caption text-body-secondary mb-3" id="note-help">Zum Beispiel: Klingel defekt, bitte anrufen.</p>

  <div class="form-check mb-2">
    <input class="form-check-input" type="checkbox" id="contactless" checked>
    <label class="form-check-label" for="contactless">Kontaktlos liefern</label>
  </div>
  <div class="form-check form-switch mb-4">
    <input class="form-check-input" type="checkbox" role="switch" id="cutlery">
    <label class="form-check-label" for="cutlery">Besteck mitschicken</label>
  </div>

  <button class="btn btn-primary w-100">Bestellen</button>
</form>
```

## Validation

Errors use `error`, always with text, never colour alone. Put the message under the field and link it with `aria-describedby`.

```html example
<div style="max-width: 420px">
  <label class="form-label mf-label" for="zip">Postleitzahl</label>
  <input class="form-control is-invalid" id="zip" value="5067" aria-describedby="zip-error" aria-invalid="true">
  <p class="invalid-feedback" id="zip-error">Das hat nicht geklappt. Prüf bitte deine Postleitzahl.</p>
</div>
```

## Rules

- Every field has a visible label. Placeholders are examples, not labels.
- Help text is `.mf-caption` with `.text-body-secondary`.
- Error messages follow the <dfn title="How the brand sounds in writing: word choice, formality, humour.">tone of voice</dfn>: short, friendly, no "Ups!", no exclamation marks.
- Known limit: a checked checkbox or switch keeps the light `action` colour in dark mode.

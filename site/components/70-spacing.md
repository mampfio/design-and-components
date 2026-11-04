# Spacing

Spacing follows the design system's 4 px grid. Bootstrap's spacing utilities (`p-*`, `m-*`, `gap-*`, `g-*` and their side variants) are renamed to the token steps: the number in the class is the token's number.

```html example
<div class="d-flex flex-wrap align-items-end gap-4">
  <div class="text-center"><div class="bg-body-secondary border p-1"></div><p class="mf-caption mb-0 mt-1">p-1 · 4 px</p></div>
  <div class="text-center"><div class="bg-body-secondary border p-2"></div><p class="mf-caption mb-0 mt-1">p-2 · 8 px</p></div>
  <div class="text-center"><div class="bg-body-secondary border p-3"></div><p class="mf-caption mb-0 mt-1">p-3 · 12 px</p></div>
  <div class="text-center"><div class="bg-body-secondary border p-4"></div><p class="mf-caption mb-0 mt-1">p-4 · 16 px</p></div>
  <div class="text-center"><div class="bg-body-secondary border p-6"></div><p class="mf-caption mb-0 mt-1">p-6 · 24 px</p></div>
  <div class="text-center"><div class="bg-body-secondary border p-8"></div><p class="mf-caption mb-0 mt-1">p-8 · 32 px</p></div>
  <div class="text-center"><div class="bg-body-secondary border p-12"></div><p class="mf-caption mb-0 mt-1">p-12 · 48 px</p></div>
  <div class="text-center"><div class="bg-body-secondary border p-16"></div><p class="mf-caption mb-0 mt-1">p-16 · 64 px</p></div>
</div>
```

| Class step | Token | Value | Use |
| --- | --- | --- | --- |
| `1` | `space-1` | 4 px | Gap between icon and label |
| `2` | `space-2` | 8 px | Gap between badges, tight lists |
| `3` | `space-3` | 12 px | Padding of chips and small buttons |
| `4` | `space-4` | 16 px | Card padding, mobile page margin |
| `6` | `space-6` | 24 px | Gap between cards |
| `8` | `space-8` | 32 px | Desktop page margin |
| `12` | `space-12` | 48 px | Gap between sections |
| `16` | `space-16` | 64 px | Hero padding |

## Rules

- **Steps 5, 7, 9, 10, 11, 13, 14 and 15 don't exist.** `.p-5` or `.mt-5` from a Bootstrap example does nothing. Pick the token step instead: Bootstrap's `5` (48 px) is Mampfio's `12`.
- Grid gutters use the same steps: `.g-6` between cards.
- Code copied from the official Bootstrap docs needs its spacing classes checked. Nothing else changes.

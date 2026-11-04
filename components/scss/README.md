# The Bootstrap overlay

Mampfio uses Bootstrap 5 without forking it. Bootstrap is installed from npm and compiled as it is. Mampfio changes it from the outside, in two places only:

- `_bootstrap-adapter.scss` sets Bootstrap's `!default` variables from Mampfio tokens **before** Bootstrap compiles.
- `_extensions.scss` sets Bootstrap's `--bs-*` custom properties **after** Bootstrap compiles, where a variable can't do the job.

Nothing else touches Bootstrap. No copied partials, no edited files, no selectors that depend on Bootstrap's internals, no `!important`.

## Why this works: `!default`

Every Bootstrap variable is declared like this:

```scss
$primary: $blue !default;
```

`!default` means "use this value unless the variable already has one". So a variable you set *before* `@import "bootstrap/scss/bootstrap"` wins, and everything Bootstrap derives from it follows: buttons, alerts, badges, utilities, hover and active shades, contrast colours. The adapter uses this mechanism and nothing more.

## The import order

`mampfio.scss` is the only entry point. The order is the design:

| Step | File | Produces CSS? | Knows about |
| --- | --- | --- | --- |
| 1 | `_tokens.generated.scss` | no | Mampfio tokens |
| 2 | `_bootstrap-adapter.scss` | no | tokens and Bootstrap variable names |
| 3 | `bootstrap/scss/bootstrap` | yes | Bootstrap only |
| 3b | `_color-mode.scss` | no output of its own; extends Bootstrap's selectors | Bootstrap's `data-bs-theme` attribute |
| 4 | `_design-system.generated.scss` | yes | Mampfio tokens |
| 5 | `_extensions.scss` | yes | tokens and Bootstrap's `--bs-*` properties |

Steps 1 and 4 are generated from `design/tokens.json` (repo root) by `scripts/generate-tokens.mjs`. Never edit them.

Swapping steps 1 and 2 breaks the build, because the adapter reads `$mampfio-*` variables. Moving step 2 after step 3 doesn't break the build; it silently does nothing, because Bootstrap has already compiled with its own defaults. That's the mistake to watch for.

## Two kinds of values: compile time and runtime

This is the one idea you need to understand the adapter.

**Compile-time values** are real colours. Bootstrap does arithmetic on some variables: `shade-color($primary, 15%)` for hover states, contrast checks for text on coloured backgrounds, `rgba()` for focus shadows. Sass can only do that with a concrete colour, so these variables get a `$mampfio-*-light` token. The result is baked into `mampfio.css` and **does not change in dark mode.**

**Runtime values** are `var(--token)`. Where Bootstrap only passes a value through to a CSS property without computing anything, the adapter hands it a custom property, for example `$input-border-color: var(--control-border)`. The browser resolves it, so it follows light and dark mode.

Rule of thumb: if Bootstrap computes with the variable, give it a `$mampfio-*` token; if Bootstrap only passes it through, give it `var(--token)`. If you get it wrong, Sass tells you: `shade-color(var(--action), 15%)` is a compile error.

## Dark mode

The design system switches themes with `data-theme="light|dark"`, as `design/tokens.css` does. Without the attribute a page is light.

Bootstrap 5.3 themes with `data-bs-theme`. Most of it goes through its `color-mode` mixin, but some selectors are hard-coded, among them `:root, [data-bs-theme="light"]`, which holds all light root variables. `_color-mode.scss` therefore doesn't touch the mixin. It uses Sass `@extend` on the attribute selectors:

```scss
[data-theme="light"] { @extend [data-bs-theme="light"]; }
[data-theme="dark"]  { @extend [data-bs-theme="dark"]; }
```

Every compiled selector that contains `[data-bs-theme=…]` gets a twin with `[data-theme=…]`: `[data-bs-theme=dark] .form-select, [data-theme=dark] .form-select`. Nesting works in both directions, a light card in a dark page as well as the reverse. The adapter fills the dark values from the `$mampfio-*-dark` tokens (`$body-bg-dark`, `$body-color-dark`, `$border-color-dark`, `$link-color-dark` and so on). The design system's own custom properties switch on the same attribute, in `_design-system.generated.scss`.

`data-bs-theme` still works as a side effect. Mampfio pages don't use it.

A first version redefined Bootstrap's `color-mode` mixin instead. It missed the hard-coded light root selector, so a `data-theme="light"` area inside a dark page kept the dark theme's cream text on a white card. The extend covers selectors whether or not they come from the mixin, and `scripts/check-theme.mjs` proves it on the compiled CSS.

Bootstrap 5 has no dark variant of theme colours. `$primary` is compiled once, with the light value. That's why `_extensions.scss` exists.

## Extensions: closing the compile-time gap

Bootstrap 5.3 components read their colours from documented custom properties such as `--bs-btn-bg` or `--bs-card-bg`. `_extensions.scss` sets these properties back to `var(--token)`, so the components follow dark mode after all:

- `.btn-primary` and `.btn-outline-secondary`: all states. Hover and active shades use `color-mix()` instead of Sass's `shade-color()`, so they work at runtime.
- `:root { --bs-focus-ring-color }` and the focus `box-shadow` on buttons and form controls: Bootstrap bakes the light focus colour into these shadows.
- `.card`: background and the design system's one shadow level, which Bootstrap has no variable for.

An extension rule may only set `--bs-*` properties on Bootstrap's public component classes. If you need a selector from Bootstrap's internals, the change doesn't belong in the overlay.

## The fitness function

`npm run check:bootstrap` (`scripts/check-bootstrap-overrides.mjs`) runs before every Sass compile. It fails the build when:

1. the adapter assigns a variable that the installed Bootstrap doesn't declare with `!default` in `_variables.scss` or `_variables-dark.scss`, for example after Bootstrap renamed it, or
2. the adapter contains a raw colour (`#…`, `rgb()`, `hsl()`). Values belong in `tokens.json`.

Without check 1, a renamed variable would just stop working: Sass happily creates an unused variable, and the build stays green.

`npm run check:theme` (`scripts/check-theme.mjs`) runs after the Sass compile. It fails when a compiled selector themes with `data-bs-theme` but has no `data-theme` twin.

What the checks do **not** catch:

- **Changed meaning.** Bootstrap keeps a variable's name but uses it somewhere new. Only the visual comparison in `demo/index.html` finds that.
- **`--bs-*` properties in `_extensions.scss`.** The check reads only the adapter. If Bootstrap renames a component custom property, the extension rule becomes dead code, without an error.
- **Dark-mode leftovers.** Some Bootstrap dark styles are not driven by variables the adapter sets, for example the colour of an unchecked form switch. They keep Bootstrap's defaults.

## Where does my change go?

| I want to… | Change |
| --- | --- |
| change a colour, font, radius or spacing value | the Mampfio design system, exported to `design/tokens.json`; never the SCSS |
| make a Bootstrap component use an existing token | `_bootstrap-adapter.scss`, if a `!default` variable exists for it |
| fix a component that keeps its light colour in dark mode | `_extensions.scss`, through its `--bs-*` properties |
| add a Mampfio-only style (`.mf-*`) | `tokens.json` type styles, or a new design-system partial, not the overlay |
| change Bootstrap's markup or behaviour | nothing here; that's a different component |

## Deliberate deviations

The adapter changes more than colours. Three changes behave differently from stock Bootstrap and surprise people:

- **Spacing steps follow the tokens.** `$spacers` uses the token step numbers, so `.p-4` is `space-4` (16 px), and `.p-5` doesn't exist.
- **Info is neutral ink.** Mampfio has no info role.
- **Warning is cheese.** Use `.text-bg-warning` for offer badges.

## Bootstrap 6

Bootstrap 6 replaces `@import` and `!default` with `@use … with (…)` and token maps. The idea of the overlay stays; its mechanism changes. Expect to rewrite `_bootstrap-adapter.scss` as a `with ()` configuration and to update the check script. Tokens and the design-system partials stay as they are.

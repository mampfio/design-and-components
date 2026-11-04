# Mampfio

- *This English text is canonical. The German section is a derived copy; where they differ, English wins.*

Mampfio is a fictional food delivery service: an aggregator for restaurants of every cuisine. The brand exists as the example company for the SCS book and workshop. This style guide applies to every interface in the example codebase, to slides and to mampfio.de.

The brand rests on one sentence: **Food should be fun, starting with the order.** That is why the logo is a face biting happily into a pizza rather than an abstract shape.

## Logo

The logo combines the mark (face with pizza) and the wordmark "mampfio" set in lowercase Baloo 2 ExtraBold. The wordmark is drawn as outlines, so it renders correctly without a web font. All files are in the **Logos** asset group.

| File | Use |
| --- | --- |
| `mampfio-lockup.svg` | Default. On `surface`, `surface-raised` or `surface-sunken`. |
| `mampfio-lockup-reversed.svg` | On dark grounds: `surface` in the dark theme, or photos with a dark area. |
| `mampfio-mark.svg` | When the name already appears nearby: navigation, loading screen, social avatar. |
| `mampfio-app-icon.svg` | App icon, and favicon from 32 px up. |
| `mampfio-wordmark.svg` | Only where the mark doesn't fit, such as a text footer. |

**Clear space:** Keep a quarter of the mark's height free on every side. At a mark height of 120 px that is 30 px.

**Minimum sizes:** The lockup is at least 120 px wide on screen and 30 mm in print. The mark is at least 32 px tall. Below that, the teeth, crumbs and pepperoni disappear. A simplified 16 px favicon is still missing.

**Don't:**

- Place the lockup on `brand-berry` or `action`, because the face disappears.
- Recolour, rotate, stretch, outline or add a shadow to the face or the pizza.
- Swap the pizza for other food. That is an open brand decision, not design latitude.
- Capitalise or reset the wordmark. In running text the company is "Mampfio", with a capital M.

## Colour

Colours have roles. When you need a colour, look for the role, not the hue.

- **Ground:** `surface` (cream) is the default. `surface-raised` carries cards, and `surface-sunken` sets areas apart.
- **Text:** `ink` (plum) for everything readable, `ink-muted` for metadata. There is no pure black.
- **Action:** `action` with `on-action` for the single primary action per screen, typically "In den Warenkorb" (add to basket) or "Bestellen" (order). `link` and `focus` use the darker berry.
- **Brand and illustration:** `brand-berry`, `cheese`, `crust` and `pepperoni` come from the logo. Only `cheese` may appear as a UI highlight, with `on-cheese` as its text colour.
- **Status:** `error` and `success` always appear together with an icon and text.

`brand-berry` is deliberately not a UI colour. Cream on the logo pink reaches only 4.3:1 and fails for normal-sized text. That is why `action` is one step darker.

## Typography

Two families, both from Google Fonts:

- **Baloo 2** (`display`) in ExtraBold for headings. It is round and good-natured, like the logo. Never use it for body text or below 20 px.
- **Nunito Sans** (`sans`) for everything else. It is calm enough to keep menus readable.

Prices are set in `body-strong`. Metadata such as delivery time and delivery fee is set in `caption` in `ink-muted`, never smaller than 13 px.

## Shapes and grid

Mampfio is round. Buttons use `radius-m`, cards and images `radius-l`, filters `radius-pill`. There are no sharp corners.

Spacing follows a 4 px grid: `space-4` inside cards, `space-6` between cards, `space-12` between sections. There is exactly one shadow level, `shadow-card`.

## Illustration and food

Food is drawn flat, in the logo colours, with rounded ends and no gradients. Where photos are used, they show the dish from above or at a slight angle, in warm light and without people. The face from the logo stays a logo: it does not become a mascot with arms and scenes.

## Iconography

Icons are stroke icons on a 24 px grid, with a 2 px stroke and rounded ends, in `ink` or `on-action`. No icon set has been chosen yet.

## Tone of voice

The product speaks German. Mampfio uses the informal "du", keeps sentences short and sounds like someone who enjoys eating. Humour is used sparingly, at most once per screen and never in error messages.

| Do (German copy) | Meaning | Don't |
| --- | --- | --- |
| Deine Pizza ist unterwegs. Noch etwa 20 Minuten. | Your pizza is on its way. About 20 more minutes. | Ihre Bestellung wurde erfolgreich an den Lieferpartner übermittelt! |
| Das hat nicht geklappt. Prüf bitte deine Adresse. | That didn't work. Please check your address. | Ups! Da ist was schiefgelaufen 🙈 |
| Hunger? Mampfio. | Hungry? Mampfio. | Die Nr. 1 für Ihren Genuss!!! |

The don'ts are formal ("Ihre"), bureaucratic, cutesy or shouty.

## Accessibility

Every text pairing in the tokens reaches at least 4.5:1 in both themes. The ratios are listed in the usage notes. Control borders and the focus ring reach at least 3:1. Status is never conveyed by colour alone, because `error` and `action` both sit in the red range.

## Open points

- The DPMA trademark search for "Mampfio" is outstanding. Until then this logo is a working draft.
- A 16 px favicon variant is missing.
- No icon set has been chosen yet.
- UI components such as button, restaurant card and basket are not included yet.

---

## Consuming this system (generated — do not edit)

Every path named below is under `project/` in this design system: read `project/api/tokens.md`, not `api/tokens.md`.

This system ships tokens and assets, no components: take colours, type and fonts from the tokens card below for any page, deck or mock-up; a Slides deck or Design canvas also takes `tokens.json` by file path (that type’s SKILL.md says how). On a Design canvas, also copy `tokens.css` to `project/ds/<folder>/tokens.css` in the call that installs this system, and link it in each artboard that uses this system, right after the `support.js` line and before the system’s other stylesheets: `<link rel="stylesheet" href="ds/<folder>/tokens.css">` (with one `../` in front for each folder the artboard is in).

**Read, per thing:** token values: `api/tokens.md`; stored assets and their paths: `api/assets/<Group>.md`. After this README, fetch the cards and fonts you need in ONE message as parallel calls — none depends on another.

**Two rules.** Before you use a thing — a component, a token group, an icon, an asset — read its card from the index below; a value you did not read from a card is a guess. `tokens.json`, `manifest.json` and `design-system.json` are sources for tools: hand them over. `assets/<Group>/README.md` is the long-form second read a card links to; `SKILL.md` and `artifact-type/` beside them are authoring guidance, not needed to consume the system.

## Index (generated — do not edit)

**Tokens**

- `api/tokens.md` — Every token: surface, text, fill, palette, type, spacing, radius, shadow. (9.5k)

**Icons and assets**

- `api/assets/Logos.md` — 5 files, by asset id. (1.7k)

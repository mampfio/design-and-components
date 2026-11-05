# Mampfio brand book

Mampfio is a fictional food delivery service: an aggregator for restaurants of every cuisine. The brand exists as an example company for the teaching purposes. This style guide applies to every interface in the example codebases, to slides and to mampfio.de.

The brand rests on one sentence: **Food should be fun, starting with the order.** That is why the logo is a face biting happily into a pizza rather than an abstract shape.

## Logo

The logo combines the mark (face with pizza) and the wordmark "mampfio" set in lowercase Baloo 2 ExtraBold. The wordmark is drawn as outlines, so it renders correctly without a web font. Every SCS serves them from the Component Library under `/webjars/mampfio-design-system/logos/`.

| Logo | File | Use |
| --- | --- | --- |
| <img src="assets/Logos/mampfio-lockup.svg" alt="Mampfio lockup" height="32"> | `mampfio-lockup.svg` | Default. On `surface`, `surface-raised` or `surface-sunken`. |
| <img src="assets/Logos/mampfio-lockup-reversed.svg" alt="Mampfio lockup, reversed" height="32"> | `mampfio-lockup-reversed.svg` | On dark grounds: `surface` in the dark theme, or photos with a dark area. |
| <img src="assets/Logos/mampfio-mark.svg" alt="Mampfio mark" height="32"> | `mampfio-mark.svg` | When the name already appears nearby: navigation, loading screen, social avatar. |
| <img src="assets/Logos/mampfio-app-icon.svg" alt="Mampfio app icon" height="32"> | `mampfio-app-icon.svg` | App icon, and favicon from 32 px up. |
| <img src="assets/Logos/mampfio-wordmark.svg" alt="Mampfio wordmark" height="32"> | `mampfio-wordmark.svg` | Only where the mark doesn't fit, such as a text footer. |
| <img src="assets/Logos/mampfio-favicon.svg" alt="Mampfio favicon" height="32"> | `mampfio-favicon.svg` | Browser tab favicon, and anywhere the mark is shown below 32 px. |

**Clear space:** Keep a quarter of the mark's height free on every side. At a mark height of 120 px that is 30 px.

**Minimum sizes:** The lockup is at least 120 px wide on screen and 30 mm in print. The mark is at least 32 px tall. Below that, the teeth, crumbs and pepperoni disappear, so use `mampfio-favicon.svg` instead: the same face and slice, simplified for 16 px.

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

Two families. Both ship with the Component Library (`fonts/`), so don't load them from Google Fonts or any other CDN:

- **Baloo 2** (`display`) in ExtraBold for headings. It is round and good-natured, like the logo. Never use it for body text or below 20 px.
- **Nunito Sans** (`sans`) for everything else. It is calm enough to keep menus readable.

Prices are set in `body-strong`. Metadata such as delivery time and delivery fee is set in `caption` in `ink-muted`, never smaller than 13 px.

## Shapes and grid

Mampfio is round. Buttons use `radius-m`, cards and images `radius-l`, filters `radius-pill`. There are no sharp corners.

Spacing follows a 4 px grid: `space-4` inside cards, `space-6` between cards, `space-12` between sections. There is exactly one shadow level, `shadow-card`.

## Illustration and food

Food is drawn flat, in the logo colours, with rounded ends and no gradients. Where photos are used, they show the dish from above or at a slight angle, in warm light and without people. The face from the logo stays a logo: it does not become a mascot with arms and scenes.

## Iconography

Icons are stroke icons on a 24 px grid, with a 2 px stroke and rounded ends, in `ink` or `on-action`. Mampfio uses a selection from [Lucide](https://lucide.dev), listed with their meanings in `design/assets/Icons/README.md`. Each icon has one meaning. An icon never stands in for the logo, and status icons always come with text.

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

- There is no token for disabled states yet. Disabled buttons combine `ink-muted`, `surface-sunken` and `line`.
- Some Bootstrap parts keep their light colours in dark mode: checked checkboxes and switches, active pills and pagination, and alert backgrounds. The Colour mode page lists them.
- Whether the logo may show food other than pizza is undecided.

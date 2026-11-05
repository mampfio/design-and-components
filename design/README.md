# Maintaining the design system site

`design/` is the master of the Mampfio design system: brand book, tokens and logos. Every other place that shows or uses them is generated from here. The GitHub Action `.github/workflows/design-site.yml` publishes it, together with the component docs, to **https://mampfio.github.io/design-and-components/**.

The brand itself is described in [`brand-book-en.md`](brand-book-en.md). This file only explains how the site is built and where to change what.

## What lives here

| File | Content | Used by |
| --- | --- | --- |
| `brand-book-en.md` | Brand rules, tone of voice, accessibility | Brand book page |
| `tokens.json` | Every colour, type style, spacing, radius and shadow value | WebJar (`components/scripts/generate-tokens.mjs`), Tokens page (`site/tokens-page.mjs`) |
| `assets/Logos/*.svg` | The six logos, including the 16 px favicon | WebJar, Logos page, site header and favicon |
| `assets/Logos/README.md` | When to use which logo; its order sets the order on the Logos page | Logos page |
| `assets/Icons/*.svg`, `README.md`, `LICENSE` | The Lucide icons Mampfio uses, what each one means, and their licence | WebJar sprite, Icons page, component examples |
| `components/Cover/preview.html` | The cover card on the brand book page | Brand book page |

Each fact exists once. Nothing in `components/` or `site/` holds a token value, a logo or brand text of its own.

## Where each page comes from

| Page | Source |
| --- | --- |
| Brand book (`index.html`) | `brand-book-en.md` and the cover card |
| Tokens | generated from `tokens.json` |
| Logos | `assets/Logos/` |
| Icons | `assets/Icons/`, grouped as in its README |
| Components | `site/components/*.md`, with live examples rendered by the WebJar's CSS |

Every page is styled with the WebJar's `mampfio-tokens.css`, which `components/scripts/generate-tokens.mjs` generates from `tokens.json`. Layout, navigation and the theme toggle live in `site/build.mjs` and `site/site.css`.

## Making a change

- **Brand rules:** edit `brand-book-en.md`.
- **A token value:** edit `tokens.json`. The WebJar's CSS, the component examples and the Tokens page all follow on the next build. Token names are a contract: renaming one breaks the WebJar build on purpose, because the Bootstrap adapter refers to it.
- **A new token:** add it to `tokens.json` in the matching group, with a `usage` note. The Tokens page shows the note.
- **A logo:** replace the SVG in `assets/Logos/` under the same name. Adding or renaming one means updating `assets/Logos/README.md`; the build expects exactly six.
- **A new icon:** take it from Lucide 1.61.0, the version in use, so every icon has the same drawing style. The drawings stay unchanged; the files carry an added provenance block (C2PA metadata), which the WebJar's sprite leaves out. Every file keeps its `@license` comment; `LICENSE` holds the full ISC and MIT texts, because some Lucide icons come from Feather. To add one: `npm pack lucide-static@1.61.0`, then copy `package/icons/<name>.svg` into `assets/Icons/` and add a line with its meaning to `assets/Icons/README.md`. The WebJar build fails if a file isn't listed, or if an icon breaks the 24 px / 2 px / round rule. Moving to a newer Lucide version means replacing all icons and `LICENSE` at once.
- **A component page:** edit or add a file in `site/components/`. The number prefix sets the order in the side navigation (`20-buttons.md` becomes `buttons.html`). A code block marked `` ```html example `` becomes a live example with its code underneath; a plain `` ```html `` block stays code only.

Push to `main`. The workflow runs when anything in `design/`, `site/`, `components/` or the workflow itself changes, and can also be started by hand under **Actions → Design site → Run workflow**.

## Previewing locally

```sh
cd components && npm ci && npm run build   # WebJar CSS, generated from tokens.json
cd ../site && npm ci && npm run build      # writes site/_site/
open _site/index.html
```

The workflow runs the same two builds, then deploys `site/_site/`. If the local build fails, the deploy fails too. The WebJar build also runs the Bootstrap and colour-mode checks, so a broken overlay never reaches the site.

## What the build checks on its own

- The cover card loads nothing from other sites. The build fails if it links to another host, such as Google Fonts. The site's own pages only reference files inside `_site/`.
- `assets/Logos/README.md` names exactly six logos.
- The install snippets on the Components page show the newest `design-system-v*` tag. The build fails if the checkout has no such tag; the release job starts a site rebuild.
- The code on every component page passes the Component Library's markup check (`components/check/check-markup.mjs`).
- Every icon is listed in `assets/Icons/README.md` and keeps the brand book's stroke style (checked by the WebJar build).

## History

`design/` started as an export of a Claude Design System artifact. That artifact is retired; this folder replaced it. The German brand book was dropped and can come back as a translation of `brand-book-en.md`.

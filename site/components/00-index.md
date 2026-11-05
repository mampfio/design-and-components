# Components

The Mampfio Component Library contains Bootstrap 5.3 with Mampfio's <dfn title="A named design decision (colour, size, spacing), defined once in tokens.json and used everywhere.">tokens</dfn>. Every SCS writes ordinary Bootstrap markup and gets the Mampfio look. These pages show the parts that Mampfio uses, with the rules that come with them. Everything not listed here works as in the [official Bootstrap documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/), with Mampfio's colours.

Every example is rendered live with the same `mampfio.min.css` the Component Library ships. The **Dark** button at the top switches the examples too.

## Installing

Every release ships the Component Library twice: as a WebJar for Maven and as an npm package. Both are assets of a [GitHub release](https://github.com/mampfio/design-and-components/releases); there is no Maven or npm registry. The snippets use the latest release, [{{latest-release}}](https://github.com/mampfio/design-and-components/releases/tag/design-system-v{{latest-release}}). To install an older one, change `VERSION`.

### As a WebJar (Maven)

Download the jar and install it into your local Maven repository:

```sh
VERSION={{latest-release}}
curl -fL -o /tmp/mampfio-design-system.jar \
  "https://github.com/mampfio/design-and-components/releases/download/design-system-v$VERSION/mampfio-design-system-$VERSION.jar" && \
mvn install:install-file \
  -Dfile=/tmp/mampfio-design-system.jar \
  -DgroupId=de.mampfio \
  -DartifactId=mampfio-design-system \
  -Dversion=$VERSION \
  -Dpackaging=jar
```

The jar lives only in the local `~/.m2`, so every laptop and every CI job has to run this once per version.

Then add the dependency. `webjars-locator-lite` makes the version-free URLs below work:

```xml
<dependency>
  <groupId>de.mampfio</groupId>
  <artifactId>mampfio-design-system</artifactId>
  <version>{{latest-release}}</version> <!-- the VERSION you installed -->
</dependency>
<dependency>
  <groupId>org.webjars</groupId>
  <artifactId>webjars-locator-lite</artifactId>
</dependency>
```

### As an npm package

```sh
VERSION={{latest-release}}
npm install "https://github.com/mampfio/design-and-components/releases/download/design-system-v$VERSION/mampfio-design-system-$VERSION.tgz"
```

The files land in `node_modules/mampfio-design-system/` with the same layout as the WebJar (see *What's inside* below). Serve them from your own origin; the paths below assume the WebJar.

## Using it

Load two files in your layout:

```html
<html lang="de" data-theme="light">
<head>
  <link rel="stylesheet" href="/webjars/mampfio-design-system/css/mampfio.min.css">
  <script src="/webjars/mampfio-design-system/js/bootstrap.bundle.min.js" defer></script>
</head>
```

Pages and web components that don't use Bootstrap markup load `css/mampfio-tokens.css` instead: tokens, fonts and the `.mf-*` type styles, nothing else.

Spring Boot serves the WebJar under `/webjars/`, so these lines are the same in a Pebble (Discovery) and a JTE (Ordering) layout.

Web components in Shadow DOM inherit the `--token` custom properties from the page, so they can use `var(--action)` without loading Bootstrap.

Icons come from one sprite and take the text colour. The [Icons](icons.html) page lists them and what each one means:

```html
<svg class="mf-icon" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#bike"></use></svg>
```

`<use>` only loads sprites from the page's own origin. That's fine, because every SCS serves the Component Library itself, and a web component that another SCS embeds can use the same path: it resolves against the page, which serves the sprite too.

A web component can't rely on that when the host page may run an older Component Library without the icon it needs. Then it fetches the sprite from its own SCS and inlines the icon. The sprite has to be served with CORS for the host's origin, and the icon needs its size set inline, because `.mf-icon` doesn't reach into Shadow DOM:

```js
// In the web component's module, served by its own SCS.
const sprite = fetch(new URL("/webjars/mampfio-design-system/icons/icons.svg", import.meta.url))
  .then((response) => response.text())
  .then((text) => new DOMParser().parseFromString(text, "image/svg+xml"));

export async function icon(name, size = 24) {
  const symbol = (await sprite).getElementById(name);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", symbol.getAttribute("viewBox"));
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("aria-hidden", "true");
  svg.append(...[...symbol.childNodes].map((node) => document.importNode(node, true)));
  return svg;
}

// this.shadowRoot.querySelector("button").prepend(await icon("bike", 20));
```

## What's inside

Paths are relative to `/webjars/mampfio-design-system/` (WebJar) or `node_modules/mampfio-design-system/` (npm).

| Path | Content |
| --- | --- |
| `css/mampfio.css`, `css/mampfio.min.css` | Bootstrap compiled with Mampfio tokens, plus design-system CSS |
| `css/mampfio-tokens.css` | Custom properties, fonts and `.mf-*` type styles without Bootstrap |
| `js/bootstrap.bundle.min.js` | Bootstrap's JavaScript bundle, unchanged |
| `fonts/` | Baloo 2 (800) and Nunito Sans (400, 600, 700), Latin subsets |
| `logos/` | The six logo SVGs, including the favicon. See [Logos](logos.html). |
| `icons/icons.svg` | The design system's icons as one SVG sprite. See [Icons](icons.html). |
| `tokens.json` | The token source, for tools. See [Tokens](tokens.html). |
| `check/check-markup.mjs` | The markup check, see *Checking your markup* below |
| `licenses/` | Bootstrap MIT licence, font OFL licences, Lucide ISC and MIT licence |

## Where Mampfio differs from Bootstrap

Everything else works as in Bootstrap's documentation. These don't:

| Don't use | Use instead | Why |
| --- | --- | --- |
| `data-bs-theme` | `data-theme` | Bootstrap's attribute leaves the Mampfio tokens light. See [Colour mode](colour-mode.html). |
| Spacing steps `5`, `7`, `9`–`11`, `13`–`15` (`.p-5`, `.mt-5`, `.g-5` …) | `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16` | The number is the token step: `.p-4` is 16 px, `.p-12` is 48 px. Bootstrap's `5` is Mampfio's `12`. See [Spacing](spacing.html). |
| `.fs-*`, `.display-*`, `.lead` | `.mf-*` type styles | Their sizes are not Mampfio's. See [Typography](typography.html). |
| Button variants other than `.btn-primary` and `.btn-outline-secondary` | `.btn-outline-secondary` | They stay light in dark mode. See [Buttons](buttons.html). |
| `.text-bg-*` except `.text-bg-warning`, and `.bg-*` / `.text-*` theme colours | `.text-bg-warning` for offers, `.mf-badge-count` for counts, `.bg-body-secondary`, `.text-body-secondary` | They stay light in dark mode. |
| `.alert-warning`, `.alert-info` | `.alert-success`, `.alert-danger` | Mampfio has no warning or info role. `.text-bg-warning` means cheese, the offer highlight. |

### Checking your markup

The Component Library ships a check for this table. It needs Node 22 or later and nothing else:

```sh
# npm
node node_modules/mampfio-design-system/check/check-markup.mjs src/

# anything else, e.g. a Maven project with Pebble or JTE templates
curl -fLO https://mampfio.github.io/design-and-components/webjar/check/check-markup.mjs
node check-markup.mjs src/main/resources/templates
```

It prints every problem with file and line and exits with 1, so it can run in CI.

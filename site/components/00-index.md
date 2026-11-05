# Components

The Mampfio WebJar contains Bootstrap 5.3 with Mampfio's tokens. Every SCS writes ordinary Bootstrap markup and gets the Mampfio look. These pages show the parts that Mampfio uses, with the rules that come with them. Everything not listed here works as in the [official Bootstrap documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/), with Mampfio's colours.

Every example is rendered live with the same `mampfio.min.css` the WebJar ships. The **Dark** button at the top switches the examples too.

## Installing

Every release ships the same build twice: as a WebJar for Maven and as an npm package. Both are assets of a [GitHub release](https://github.com/mampfio/design-and-components/releases); there is no Maven or npm registry. Set `VERSION` to a released version.

### As a WebJar (Maven)

Download the jar and install it into your local Maven repository:

```sh
VERSION=0.1.0
curl -fL -o /tmp/mampfio-design-system.jar \
  "https://github.com/mampfio/design-and-components/releases/download/design-system-v$VERSION/mampfio-design-system-$VERSION.jar" && \
mvn install:install-file \
  -Dfile=/tmp/mampfio-design-system.jar \
  -DgroupId=de.mampfio \
  -DartifactId=mampfio-design-system \
  -Dversion=$VERSION \
  -Dpackaging=jar
```

`-f` makes curl fail on a 404 instead of saving GitHub's error page as a jar; `-L` follows the redirect to the download. Maven generates a minimal POM, which is enough, because the WebJar has no dependencies. The jar lives only in the local `~/.m2`, so every laptop and every CI job has to run this once per version.

Then add the dependency. `webjars-locator-lite` makes the version-free URLs below work:

```xml
<dependency>
  <groupId>de.mampfio</groupId>
  <artifactId>mampfio-design-system</artifactId>
  <version>0.1.0</version> <!-- the VERSION you installed -->
</dependency>
<dependency>
  <groupId>org.webjars</groupId>
  <artifactId>webjars-locator-lite</artifactId>
</dependency>
```

### As an npm package

```sh
VERSION=0.1.0
npm install "https://github.com/mampfio/design-and-components/releases/download/design-system-v$VERSION/mampfio-design-system-$VERSION.tgz"
```

npm writes the URL into `package.json` and the checksum into `package-lock.json`, so `npm ci` installs exactly this build. The files land in `node_modules/mampfio-design-system/` with the same layout as the WebJar (see *What's inside* below). Serve them from your own origin; the paths below assume the WebJar.

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

`<use>` only loads sprites from the page's own origin. That's fine, because every SCS serves the WebJar itself. A web component on a page from another origin has to fetch the icon and inline it.

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
| `licenses/` | Bootstrap MIT licence, font OFL licences, Lucide ISC and MIT licence |

## Where Mampfio differs from Bootstrap

- **Spacing steps are token steps.** `.p-4` is 16 px, `.p-12` is 48 px. `.p-5` doesn't exist. See [Spacing](spacing.html).
- **There is no info colour.** `info` is neutral ink. Use it only if you need a neutral alert; Mampfio has no info role.
- **Warning is cheese.** It's the highlight colour for offers, not a warning.
- **The theme switches with `data-theme`,** never `data-bs-theme`. See [Colour mode](colour-mode.html).
- **Text uses the `.mf-*` type styles** rather than Bootstrap's `.fs-*` and `.display-*` classes. See [Typography](typography.html).

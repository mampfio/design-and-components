# Mampfio design system

This module packages the Mampfio design system. It's a customised version of Bootstrap 5

## How it is layered

```
../design/tokens.json           the design system's master, the only source of values
        │  scripts/generate-tokens.mjs
        ▼
scss/_tokens.generated.scss     $mampfio-* Sass variables (no CSS output)
scss/_design-system.generated   fonts, --token custom properties, .mf-* type styles
        │
scss/_bootstrap-adapter.scss    THE overlay: Bootstrap !default variables ← Mampfio tokens
        │
bootstrap/scss/bootstrap        stock Bootstrap from npm, never edited, never copied
        │
scss/_extensions.scss           the few gaps Bootstrap 5 variables can't close (--bs-* only)
        ▼
dist/css/mampfio.css            one stylesheet for SCS that use Bootstrap markup
dist/css/mampfio-tokens.css     tokens, fonts and type only, for pages and web components without Bootstrap
```

The dependency points one way. Tokens know nothing about Bootstrap. The adapter is the only file that knows both, like an anti-corruption layer. [`scss/README.md`](scss/README.md) explains how the overlay works and where a change belongs.


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

`-f` makes curl fail on a 404 instead of saving GitHub's error page as a jar; `-L` follows the redirect to the download. Maven generates a minimal POM, which is enough, because the WebJar has no dependencies. Then add the dependency as shown in [Using it in a Spring Boot SCS](#using-it-in-a-spring-boot-scs).

The jar lives only in the local `~/.m2`, so every laptop and every CI job has to run this once per version.

### As an npm package

```sh
VERSION=0.1.0
npm install "https://github.com/mampfio/design-and-components/releases/download/design-system-v$VERSION/mampfio-design-system-$VERSION.tgz"
```

npm writes the URL into `package.json` and the checksum into `package-lock.json`, so `npm ci` installs exactly this build. The files land in `node_modules/mampfio-design-system/` with the WebJar's layout, without the `META-INF` prefix: `css/mampfio.css`, `js/bootstrap.bundle.min.js`, `fonts/`, `logos/`, `icons/icons.svg` and `tokens.json`.

## What the WebJar contains

Under `META-INF/resources/webjars/mampfio-design-system/<version>/`:

| Path | Content |
| --- | --- |
| `css/mampfio.css`, `css/mampfio.min.css` | Bootstrap compiled with Mampfio tokens, plus design-system CSS |
| `css/mampfio-tokens.css` | Custom properties, fonts and `.mf-*` type styles without Bootstrap |
| `js/bootstrap.bundle.min.js` | Bootstrap's JavaScript bundle, re-exported unchanged |
| `fonts/` | Baloo 2 (800) and Nunito Sans (400, 600, 700), Latin subsets |
| `logos/` | The six logo SVGs, including the favicon, copied from `design/assets/Logos/` |
| `icons/icons.svg` | The design system's icons as one SVG sprite, built from `design/assets/Icons/` (Lucide) |
| `tokens.json` | The token source from `design/`, for tools |
| `licenses/` | Bootstrap MIT licence, font OFL licences, Lucide ISC and MIT licence |

`META-INF/resources/webjars-locator.properties` registers the WebJar with `webjars-locator-lite`, so version-free URLs work.

## Using it in a Spring Boot SCS

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

The same lines work in a Pebble (Discovery) or JTE (Ordering) layout:

```html
<link rel="stylesheet" href="/webjars/mampfio-design-system/css/mampfio.min.css">
<script src="/webjars/mampfio-design-system/js/bootstrap.bundle.min.js" defer></script>
```

Web components in Shadow DOM inherit the `--token` custom properties from the page, so they can use `var(--action)` without loading Bootstrap.

Icons come from one sprite and take the text colour:

```html
<svg class="mf-icon" aria-hidden="true"><use href="/webjars/mampfio-design-system/icons/icons.svg#bike"></use></svg>
```

`<use>` only loads sprites from the page's own origin. That's fine here, because every SCS serves the WebJar itself. A web component on a page from another origin has to fetch the icon and inline it.

## Building

```sh
./mvnw package       # downloads Maven 3.9.16 on first run, installs Node into target/, runs npm ci and npm run build, packages dist/
npm run build        # the same without Maven, for quick iteration
open demo/index.html # visual check in light and dark mode
```

`npm run build` runs four steps: generate tokens, check the adapter, compile Sass, copy assets.

## Releasing

`.github/workflows/design-system.yml` builds the WebJar and an npm package (`scripts/pack-npm.mjs`) on every push to `main` and every pull request that touches `components/`, and keeps both as a workflow artifact.

1. Set the release version in `pom.xml` (drop `-SNAPSHOT`) and commit.
2. Tag the commit `design-system-v<version>`, for example `design-system-v0.1.0`, and push the tag.
3. The workflow checks the tag against the Maven version and publishes a GitHub release with the `.jar`, the `.tgz` and `SHA256SUMS`.

The `design-system-` prefix keeps releases apart from the workshop's `step-NN` tags.

## Updating Bootstrap

1. Change the exact version of `bootstrap` in `package.json`. Use a version that has been out for at least two weeks.
2. Run `npm install`, then `npm run build`.
3. If `check:bootstrap` fails, Bootstrap renamed or removed a variable the adapter sets. Fix that line in `_bootstrap-adapter.scss`. Nothing else should need a change.
4. Open `demo/index.html` in light and dark mode and compare with the previous build.
5. Bump the module version and release.

The check also fails when someone writes a raw colour into the adapter. Values belong in `tokens.json`.

## Updating tokens

`design/` at the repo root is the master for tokens and logos. Edit `design/tokens.json`, then run `npm run build`. Never edit tokens or logos inside `components/`. Fonts are the exception: they live in `assets/fonts/`, because `tokens.json` names the families but the WebJar ships the files. Token names are the contract: renaming a token breaks the adapter build on purpose.

## Deliberate deviations from stock Bootstrap

- **Spacing utilities follow token steps:** `.p-4` is `space-4` (16 px) and `.mb-12` is `space-12` (48 px). Steps 5, 7 and so on don't exist.
- **There is no info colour:** `info` maps to neutral ink, because Mampfio has no info role.
- **Warning is cheese:** use `.text-bg-warning` for offer badges.
- **Colour mode is a `data-theme` toggle, as in the design system:** set `data-theme="dark"` or `data-theme="light"` on `<html>` (or any subtree). Without the attribute a page is light, whatever the OS prefers. SCS never set `data-bs-theme`; `scss/_color-mode.scss` points Bootstrap at `data-theme`.

## Known limits

- The toggle state is the SCS's problem, not the design system's. Every SCS has to read the same preference (a cookie on the shared domain, for example), or the theme flips when a user crosses from one system to the next.
- Bootstrap 5 compiles theme colours at build time. Utilities such as `.bg-primary` and `.text-bg-success` keep their light values in dark mode. Primary and outline-secondary buttons and focus rings are corrected in `_extensions.scss`.
- Bootstrap 5.3 uses Sass `@import`, which Dart Sass deprecates. The build silences those warnings and pins Sass 1.x. Sass 3 will remove `@import`, so Bootstrap 5 has a hard end of life here.
- Bootstrap 6 (alpha since October 2026) moves to `@use` and token maps. The migration should mostly be a rewrite of `_bootstrap-adapter.scss`; tokens and extensions stay.

## Licences

Bootstrap is MIT-licensed (`licenses/bootstrap-LICENSE.txt`). Baloo 2 and Nunito Sans are under the SIL Open Font License 1.1 and are shipped as subsets (`licenses/OFL-*.txt`).

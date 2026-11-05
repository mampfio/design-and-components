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
        │
scss/_parts.scss                design-system parts Bootstrap has no variant for (.mf-badge-count)
        ▼
dist/css/mampfio.css            one stylesheet for SCS that use Bootstrap markup
dist/css/mampfio-tokens.css     tokens, fonts and type only, for pages and web components without Bootstrap
```

The dependency points one way. Tokens know nothing about Bootstrap. The adapter is the only file that knows both, like an anti-corruption layer. [`scss/README.md`](scss/README.md) explains how the overlay works and where a change belongs.


## Distribution

Every release ships the same build twice: as a WebJar and as an npm package, both as assets of a GitHub release. Everything for the SCS that consume them lives on the [components site](https://mampfio.github.io/design-and-components/components.html): installing, what's inside, usage, where Mampfio differs from Bootstrap and colour mode. Its sources are `site/components/*.md`. How to cut a release is under [Releasing](#releasing).

The jar puts `dist/` under `META-INF/resources/webjars/mampfio-design-system/<version>/`. `src/main/resources/META-INF/resources/webjars-locator.properties`, filtered by Maven, registers the version with `webjars-locator-lite`, so version-free URLs work. `scripts/pack-npm.mjs` packs the same `dist/` as the npm package and takes the version from that file, so both never disagree.

## Markup check

`check/check-markup.mjs` ships in `dist/check/` and finds Bootstrap classes and attributes that don't work with Mampfio (spacing step 5, `.fs-*`, other button variants, `data-bs-theme` and so on). The site build runs it on every component page, so the docs never show what they forbid. When a rule on the site changes, change the check with it.

## Building

```sh
./mvnw package       # downloads Maven 3.9.16 on first run, installs Node into target/, runs npm ci and npm run build, packages dist/
npm run build        # the same without Maven, for quick iteration
open demo/index.html # visual check in light and dark mode
```

`npm run build` generates the tokens, checks the adapter, compiles Sass (plain and minified), checks that every colour-mode selector also reacts to `data-theme`, copies the assets and builds the icon sprite.

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

## Known limits

- Bootstrap 5 compiles theme colours at build time. Utilities such as `.bg-primary` and `.text-bg-success` keep their light values in dark mode. Primary and outline-secondary buttons, focus rings and cards are corrected in `_extensions.scss`; the [Colour mode](https://mampfio.github.io/design-and-components/colour-mode.html) page lists what stays light.
- Bootstrap 5.3 uses Sass `@import`, which Dart Sass deprecates. The build silences those warnings and pins Sass 1.x. Sass 3 will remove `@import`, so Bootstrap 5 has a hard end of life here.
- Bootstrap 6 (alpha since October 2026) moves to `@use` and token maps. The migration should mostly be a rewrite of `_bootstrap-adapter.scss`; tokens and extensions stay.

## Licences

Bootstrap is MIT-licensed (`licenses/bootstrap-LICENSE.txt`). Baloo 2 and Nunito Sans are under the SIL Open Font License 1.1 and are shipped as subsets (`licenses/OFL-*.txt`). The Lucide icons are under ISC, the ones that come from Feather under MIT (`licenses/lucide-LICENSE.txt`).

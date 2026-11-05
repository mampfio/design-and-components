# Mampfio design and components

The Mampfio design system and the components built on it, for the SCS book and workshop.

**[Browse the design system →](https://mampfio.github.io/design-and-components/)** Logos, tokens and the brand book from `design/`, and [components](https://mampfio.github.io/design-and-components/components.html): the Bootstrap parts Mampfio uses, with live examples and rules. Published on every push to `main`.

| Folder | Content |
| --- | --- |
| [`design/`](design/) | The master of the Mampfio design system: brand book, tokens and logos. Its [README](design/README.md) explains how to maintain the site. |
| [`components/`](components/) | The Component Library: the design system with Bootstrap 5 inside, released as a WebJar and as an npm package. See its [README](components/README.md). |
| [`site/`](site/) | Renders `design/` and the component docs in `site/components/*.md` as the site above. Build `components/` with `npm run build` first, then `cd site && npm ci && npm run build` writes `site/_site/`. |

Tool versions are in `mise.toml`. Maven comes from the wrapper in `components/`.

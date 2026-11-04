# Mampfio design and components

The Mampfio design system and the components built on it, for the SCS book and workshop.

**[Browse the design system →](https://mampfio.github.io/design-and-components/)** Logos, tokens and the brand book, rendered from `design/` on every push to `main`.

| Folder | Content |
| --- | --- |
| [`design/`](design/) | The Mampfio design system, exported from Claude. The source of truth for tokens and logos. |
| [`components/`](components/) | The design system as a Java WebJar, with Bootstrap 5 inside. See its [README](components/README.md). |
| [`site/`](site/) | Renders `design/` as the static site above. `cd site && npm ci && npm run build` writes `site/_site/`. |

Tool versions are in `mise.toml`. Maven comes from the wrapper in `components/`.

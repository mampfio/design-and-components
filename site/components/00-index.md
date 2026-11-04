# Components

The Mampfio WebJar contains Bootstrap 5.3 with Mampfio's tokens. Every SCS writes ordinary Bootstrap markup and gets the Mampfio look. These pages show the parts that Mampfio uses, with the rules that come with them. Everything not listed here works as in the [official Bootstrap documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/), with Mampfio's colours.

Every example is rendered live with the same `mampfio.min.css` the WebJar ships. The **Dark** button at the top switches the examples too.

## Using it

Add the dependency as described in the [components README](https://github.com/mampfio/design-and-components/tree/main/components#using-it-in-a-spring-boot-scs), then load two files in your layout:

```html
<html lang="de" data-theme="light">
<head>
  <link rel="stylesheet" href="/webjars/mampfio-design-system/css/mampfio.min.css">
  <script src="/webjars/mampfio-design-system/js/bootstrap.bundle.min.js" defer></script>
</head>
```

Pages and web components that don't use Bootstrap markup load `css/mampfio-tokens.css` instead: tokens, fonts and the `.mf-*` type styles, nothing else.

## Where Mampfio differs from Bootstrap

- **Spacing steps are token steps.** `.p-4` is 16 px, `.p-12` is 48 px. `.p-5` doesn't exist. See [Spacing](spacing.html).
- **There is no info colour.** `info` is neutral ink. Use it only if you need a neutral alert; Mampfio has no info role.
- **Warning is cheese.** It's the highlight colour for offers, not a warning.
- **The theme switches with `data-theme`,** never `data-bs-theme`. See [Colour mode](colour-mode.html).
- **Text uses the `.mf-*` type styles** rather than Bootstrap's `.fs-*` and `.display-*` classes. See [Typography](typography.html).

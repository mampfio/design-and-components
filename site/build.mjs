// Builds a static HTML site of the Mampfio design system from design/ into site/_site/.
// design/ is the source of truth; this script only renders it. Nothing here defines a value.
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { marked } from "marked";

const DESIGN = "../design";
const FONTS = "../components/assets/fonts";
const OUT = "_site";

const read = (path) => readFileSync(`${DESIGN}/${path}`, "utf8");
const meta = JSON.parse(read("design-system.json"));

// The design system's README ends with sections generated for agents that read the artifact
// ("Consuming this system", "Index"). They name artifact paths and tools, so people don't need them.
const forPeople = (markdown) =>
  markdown
    .replace(/\n---\n+## Consuming this system[\s\S]*$/, "\n")
    .replace(/<!--[\s\S]*?-->\n?/g, "");

// Token tables list hex values. Put a swatch in front of each one.
const swatches = (html) =>
  html.replace(/<td>(#[0-9a-fA-F]{3,8})<\/td>/g, '<td><span class="swatch" style="background:$1"></span>$1</td>');

const LOGOS = JSON.parse(read("manifest.json")).assetGroups.find((g) => g.name === "Logos").order;

const PAGES = [
  { file: "index.html", title: "Overview", lang: "en", body: () => cover() + marked.parse(forPeople(read("README.md"))) },
  { file: "tokens.html", title: "Tokens", lang: "en", body: () => swatches(marked.parse(forPeople(read("api/tokens.md")))) },
  { file: "logos.html", title: "Logos", lang: "en", body: logos },
  { file: "markenhandbuch.html", title: "Markenhandbuch", lang: "de", body: () => marked.parse(read("brand-book-de.md")) },
];

function cover() {
  return `<iframe class="cover" src="cover.html" title="Mampfio cover" loading="lazy"></iframe>`;
}

function logos() {
  const notes = marked.parse(read("assets/Logos/README.md"));
  const tiles = LOGOS.map((name) => {
    const ground = name.includes("reversed") ? "dark" : "light";
    return `<figure class="logo logo-${ground}"><img src="logos/${name}" alt="${name}"><figcaption><a href="logos/${name}" download>${name}</a></figcaption></figure>`;
  }).join("\n");
  return `${notes}<div class="logos">${tiles}</div>`;
}

function page({ title, lang, body }, nav) {
  return `<!doctype html>
<html lang="${lang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · ${meta.title} design system</title>
<link rel="icon" href="logos/mampfio-app-icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="site.css">
<script>
  // Follow the stored choice, else the OS, before first paint. The design system itself only knows data-theme.
  try {
    const stored = localStorage.getItem("mampfio-theme");
    const dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch {}
</script>
</head>
<body>
<header class="top">
  <a href="index.html" class="brand"><img class="logo-on-light" src="logos/mampfio-lockup.svg" alt="Mampfio" height="36"><img class="logo-on-dark" src="logos/mampfio-lockup-reversed.svg" alt="Mampfio" height="36"></a>
  <nav>${nav}</nav>
  <button type="button" id="theme-toggle" aria-pressed="false">Dark</button>
</header>
<main>
${body()}
</main>
<footer>Rendered from <code>design/</code> · last change ${meta.lastChange?.at?.slice(0, 10) ?? "unknown"} · fonts under the SIL Open Font License (<a href="fonts/OFL-Baloo2.txt">Baloo 2</a>, <a href="fonts/OFL-NunitoSans.txt">Nunito Sans</a>)</footer>
<script>
  const toggle = document.getElementById("theme-toggle");
  const sync = () => {
    const theme = document.documentElement.dataset.theme;
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.textContent = theme === "dark" ? "Light" : "Dark";
    // The cover is an iframe with its own <html>; hand the theme down.
    for (const f of document.querySelectorAll("iframe")) {
      try { f.contentDocument.documentElement.dataset.theme = theme; } catch {}
    }
  };
  for (const f of document.querySelectorAll("iframe")) f.addEventListener("load", sync);
  toggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("mampfio-theme", next); } catch {}
    sync();
  });
  sync();
</script>
</body>
</html>
`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/logos`, { recursive: true });

mkdirSync(`${OUT}/fonts`);
copyFileSync(`${DESIGN}/tokens.css`, `${OUT}/tokens.css`);
copyFileSync("site.css", `${OUT}/site.css`);
for (const name of readdirSync(FONTS)) copyFileSync(`${FONTS}/${name}`, `${OUT}/fonts/${name}`);
for (const name of LOGOS) copyFileSync(`${DESIGN}/assets/Logos/${name}`, `${OUT}/logos/${name}`);

// The cover card relies on the design system to inject tokens.css. On its own it needs a link.
// It also loads Google Fonts; the site serves the same fonts itself, so no visitor data goes to Google.
const fontFaces = readFileSync("site.css", "utf8").match(/^@font-face.*$/gm).join("\n");
const coverHtml = read("components/Cover/preview.html")
  .replace(/<!--[\s\S]*?-->\n?/, "")
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/, "")
  .replace("<head>", `<head>\n<link rel="stylesheet" href="tokens.css">\n<style>\n${fontFaces}\n</style>`);
if (coverHtml.includes("fonts.googleapis.com")) throw new Error("cover.html still loads Google Fonts");
writeFileSync(`${OUT}/cover.html`, coverHtml);

for (const p of PAGES) {
  const nav = PAGES.map((q) => `<a href="${q.file}"${q === p ? ' aria-current="page"' : ""}>${q.title}</a>`).join("");
  writeFileSync(`${OUT}/${p.file}`, page(p, nav));
}
writeFileSync(`${OUT}/.nojekyll`, "");

console.log(`site: ${PAGES.length} pages, ${LOGOS.length} logos → ${OUT}/`);

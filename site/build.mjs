// Builds a static HTML site of the Mampfio design system into site/_site/.
// - design/ is the source of truth for the design pages; this script only renders it.
// - site/components/*.md document the WebJar's Bootstrap components. Every ```html example block
//   becomes a live example, rendered with the WebJar's own CSS from components/dist/.
//   Run `npm run build` in components/ first.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { Marked } from "marked";

const DESIGN = "../design";
const WEBJAR = "../components/dist";
const FONTS = "../components/assets/fonts";
const DOCS = "components";
const OUT = "_site";

if (!existsSync(`${WEBJAR}/css/mampfio.min.css`)) {
  throw new Error(`${WEBJAR}/css/mampfio.min.css is missing. Run npm run build in components/ first.`);
}

const read = (path) => readFileSync(`${DESIGN}/${path}`, "utf8");
const meta = JSON.parse(read("design-system.json"));
const LOGOS = JSON.parse(read("manifest.json")).assetGroups.find((g) => g.name === "Logos").order;
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The design system's README ends with sections generated for agents that read the artifact
// ("Consuming this system", "Index"). They name artifact paths and tools, so people don't need them.
const forPeople = (markdown) =>
  markdown.replace(/\n---\n+## Consuming this system[\s\S]*$/, "\n").replace(/<!--[\s\S]*?-->\n?/g, "");

// Token tables list hex values. Put a swatch in front of each one.
const swatches = (html) =>
  html.replace(/<td>(#[0-9a-fA-F]{3,8})<\/td>/g, '<td><span class="swatch" style="background:$1"></span>$1</td>');

// ---- Component pages ---------------------------------------------------------------------------

const examples = []; // { file, html }

function componentMarkdown(slug) {
  let n = 0;
  return new Marked({
    renderer: {
      code({ text, lang }) {
        const [language, flag] = (lang ?? "").split(/\s+/);
        const code = `<div class="code"><button type="button" class="copy">Copy</button><pre><code class="language-${escapeHtml(language || "text")}">${escapeHtml(text)}</code></pre></div>`;
        if (language !== "html" || flag !== "example") return code;
        const file = `examples/${slug}-${++n}.html`;
        examples.push({ file, html: text });
        return `<figure class="example"><iframe src="${file}" title="Example ${n}" loading="lazy"></iframe>${code}</figure>`;
      },
    },
  });
}

const exampleDocument = (html) => `<!doctype html>
<html lang="de" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../webjar/css/mampfio.min.css">
<style>html { background: var(--surface); } body { margin: 0; padding: var(--space-6); background: var(--surface); } a[href="#"] { cursor: default; }</style>
</head>
<body>
${html}
<script src="../webjar/js/bootstrap.bundle.min.js"></script>
<script>for (const a of document.querySelectorAll('a[href="#"]')) a.addEventListener("click", (e) => e.preventDefault());</script>
</body>
</html>
`;

const componentPages = readdirSync(DOCS)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => {
    const slug = f.replace(/^\d+-/, "").replace(/\.md$/, "");
    const markdown = readFileSync(`${DOCS}/${f}`, "utf8");
    const title = markdown.match(/^# (.+)$/m)[1];
    return { slug, title, file: slug === "index" ? "components.html" : `${slug}.html`, markdown };
  });

function componentBody(p) {
  const html = componentMarkdown(p.slug).parse(p.markdown);
  const side = componentPages
    .map((q) => `<a href="${q.file}"${q === p ? ' aria-current="page"' : ""}>${q.slug === "index" ? "Introduction" : q.title}</a>`)
    .join("");
  return `<div class="with-side"><nav class="side" aria-label="Components">${side}</nav><div class="content">${html}</div></div>`;
}

// ---- Design pages ------------------------------------------------------------------------------

const cover = () => `<iframe class="cover" src="cover.html" title="Mampfio cover" loading="lazy"></iframe>`;

function logos() {
  const notes = new Marked().parse(read("assets/Logos/README.md"));
  const tiles = LOGOS.map((name) => {
    const ground = name.includes("reversed") ? "dark" : "light";
    return `<figure class="logo logo-${ground}"><img src="logos/${name}" alt="${name}"><figcaption><a href="logos/${name}" download>${name}</a></figcaption></figure>`;
  }).join("\n");
  return `${notes}<div class="logos">${tiles}</div>`;
}

const md = (text) => new Marked().parse(text);
const TOP = [
  { file: "index.html", title: "Overview", lang: "en", body: () => cover() + md(forPeople(read("README.md"))) },
  { file: "tokens.html", title: "Tokens", lang: "en", body: () => swatches(md(forPeople(read("api/tokens.md")))) },
  { file: "logos.html", title: "Logos", lang: "en", body: logos },
  { file: "components.html", title: "Components", lang: "en", section: "components" },
  { file: "markenhandbuch.html", title: "Markenhandbuch", lang: "de", body: () => md(read("brand-book-de.md")) },
];

// ---- Layout ------------------------------------------------------------------------------------

function page({ title, lang, body, current }) {
  const nav = TOP.map((q) => `<a href="${q.file}"${q === current ? ' aria-current="page"' : ""}>${q.title}</a>`).join("");
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
<footer>Rendered from <code>design/</code> and <code>site/components/</code> · design system last changed ${meta.lastChange?.at?.slice(0, 10) ?? "unknown"} · fonts under the SIL Open Font License (<a href="fonts/OFL-Baloo2.txt">Baloo 2</a>, <a href="fonts/OFL-NunitoSans.txt">Nunito Sans</a>) · Bootstrap is MIT-licensed (<a href="webjar/licenses/bootstrap-LICENSE.txt">licence</a>)</footer>
<script>
  const toggle = document.getElementById("theme-toggle");
  const frames = [...document.querySelectorAll("iframe")];
  // Examples and the cover are iframes with their own <html>: hand the theme down, and size each
  // example to its content, also when a dropdown or accordion changes its height.
  const fit = (f) => { try { f.style.height = Math.ceil(f.contentDocument.body.getBoundingClientRect().height) + "px"; } catch {} };
  const sync = () => {
    const theme = document.documentElement.dataset.theme;
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.textContent = theme === "dark" ? "Light" : "Dark";
    for (const f of frames) {
      try { f.contentDocument.documentElement.dataset.theme = theme; } catch {}
    }
  };
  for (const f of frames) {
    f.addEventListener("load", () => {
      sync();
      if (!f.closest(".example")) return;
      fit(f);
      try { new ResizeObserver(() => fit(f)).observe(f.contentDocument.body); } catch {}
    });
  }
  toggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("mampfio-theme", next); } catch {}
    sync();
  });
  for (const b of document.querySelectorAll(".copy")) {
    b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(b.nextElementSibling.textContent);
        b.textContent = "Copied";
      } catch { b.textContent = "Select and copy"; }
      setTimeout(() => (b.textContent = "Copy"), 1500);
    });
  }
  sync();
</script>
</body>
</html>
`;
}

// ---- Output ------------------------------------------------------------------------------------

// Copies file by file: recursive cpSync fails on some mounted file systems.
function copyDir(from, to, keep = () => true) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (entry.isDirectory()) copyDir(`${from}/${entry.name}`, `${to}/${entry.name}`, keep);
    else if (keep(entry.name)) copyFileSync(`${from}/${entry.name}`, `${to}/${entry.name}`);
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/logos`, { recursive: true });
mkdirSync(`${OUT}/examples`, { recursive: true });

copyFileSync(`${DESIGN}/tokens.css`, `${OUT}/tokens.css`);
copyFileSync("site.css", `${OUT}/site.css`);
copyDir(FONTS, `${OUT}/fonts`);
for (const name of LOGOS) copyFileSync(`${DESIGN}/assets/Logos/${name}`, `${OUT}/logos/${name}`);
// The WebJar's CSS, JS, fonts and licences, exactly as SCS get them.
copyDir(WEBJAR, `${OUT}/webjar`, (name) => !name.endsWith(".map"));

// The cover card relies on the design system to inject tokens.css. On its own it needs a link.
// It also loads Google Fonts; the site serves the same fonts itself, so no visitor data goes to Google.
const fontFaces = readFileSync("site.css", "utf8").match(/^@font-face.*$/gm).join("\n");
const coverHtml = read("components/Cover/preview.html")
  .replace(/<!--[\s\S]*?-->\n?/, "")
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/, "")
  .replace("<head>", `<head>\n<link rel="stylesheet" href="tokens.css">\n<style>\n${fontFaces}\n</style>`);
if (coverHtml.includes("fonts.googleapis.com")) throw new Error("cover.html still loads Google Fonts");
writeFileSync(`${OUT}/cover.html`, coverHtml);

const componentsTop = TOP.find((t) => t.section === "components");
for (const p of TOP.filter((t) => !t.section)) writeFileSync(`${OUT}/${p.file}`, page({ ...p, current: p }));
for (const p of componentPages) {
  writeFileSync(`${OUT}/${p.file}`, page({ title: p.title, lang: "en", body: () => componentBody(p), current: componentsTop }));
}
for (const e of examples) writeFileSync(`${OUT}/${e.file}`, exampleDocument(e.html));
writeFileSync(`${OUT}/.nojekyll`, "");

console.log(`site: ${TOP.length - 1 + componentPages.length} pages, ${examples.length} live examples, ${LOGOS.length} logos → ${OUT}/`);

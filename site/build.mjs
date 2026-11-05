// Builds a static HTML site of the Mampfio design system into site/_site/.
// - design/ is the master for brand book, tokens and logos; this script only renders it.
//   Tokens are styled with the WebJar's mampfio-tokens.css, generated from design/tokens.json,
//   and the Tokens page is generated from the same file (tokens-page.mjs). No value lives here.
// - site/components/*.md document the WebJar's Bootstrap components. Every ```html example block
//   becomes a live example, rendered with the WebJar's own CSS from components/dist/.
//   Run `npm run build` in components/ first.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { Marked } from "marked";
import { tokensPage } from "./tokens-page.mjs";

const DESIGN = "../design";
const WEBJAR = "../components/dist";
const DOCS = "components";
const OUT = "_site";

if (!existsSync(`${WEBJAR}/css/mampfio.min.css`)) {
  throw new Error(`${WEBJAR}/css/mampfio.min.css is missing. Run npm run build in components/ first.`);
}

const read = (path) => readFileSync(`${DESIGN}/${path}`, "utf8");
const tokens = JSON.parse(read("tokens.json"));
// The logo order is the order in which assets/Logos/README.md describes them.
const LOGOS = [...new Set(read("assets/Logos/README.md").match(/mampfio-[a-z-]+\.svg/g))];
if (LOGOS.length !== 5) throw new Error(`assets/Logos/README.md names ${LOGOS.length} logos, expected 5`);
// Date of the last commit that touched design/. Needs the git history (fetch-depth: 0 in CI).
let lastChange = "unknown";
try { lastChange = execFileSync("git", ["log", "-1", "--format=%cs", "--", DESIGN], { encoding: "utf8" }).trim() || lastChange; } catch {}
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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
  { file: "index.html", title: "Brand book", lang: "en", body: () => cover() + md(read("brand-book-en.md")) },
  { file: "tokens.html", title: "Tokens", lang: "en", body: () => tokensPage(tokens) },
  { file: "logos.html", title: "Logos", lang: "en", body: logos },
  { file: "components.html", title: "Components", lang: "en", section: "components" },
];

// ---- Layout ------------------------------------------------------------------------------------

function page({ title, lang, body, current }) {
  const nav = TOP.map((q) => `<a href="${q.file}"${q === current ? ' aria-current="page"' : ""}>${q.title}</a>`).join("");
  return `<!doctype html>
<html lang="${lang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · ${tokens.name} design system</title>
<link rel="icon" href="logos/mampfio-app-icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="webjar/css/mampfio-tokens.css">
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
<footer>Rendered from <code>design/</code> and <code>site/components/</code> · design system last changed ${lastChange} · fonts under the SIL Open Font License (<a href="webjar/licenses/OFL-Baloo2.txt">Baloo 2</a>, <a href="webjar/licenses/OFL-NunitoSans.txt">Nunito Sans</a>) · Bootstrap is MIT-licensed (<a href="webjar/licenses/bootstrap-LICENSE.txt">licence</a>)</footer>
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

copyFileSync("site.css", `${OUT}/site.css`);
for (const name of LOGOS) copyFileSync(`${DESIGN}/assets/Logos/${name}`, `${OUT}/logos/${name}`);
// The WebJar's CSS, JS, fonts and licences, exactly as SCS get them.
copyDir(WEBJAR, `${OUT}/webjar`, (name) => !name.endsWith(".map"));

// The cover card gets its tokens and fonts from the WebJar, like every page here. The site makes
// no third-party requests (no Google Fonts), and the build fails if the cover tries to.
const coverHtml = read("components/Cover/preview.html").replace("<head>", '<head>\n<link rel="stylesheet" href="webjar/css/mampfio-tokens.css">');
if (/https?:\/\//.test(coverHtml.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, ""))) throw new Error("cover.html loads something from another site");
writeFileSync(`${OUT}/cover.html`, coverHtml);

const componentsTop = TOP.find((t) => t.section === "components");
for (const p of TOP.filter((t) => !t.section)) writeFileSync(`${OUT}/${p.file}`, page({ ...p, current: p }));
for (const p of componentPages) {
  writeFileSync(`${OUT}/${p.file}`, page({ title: p.title, lang: "en", body: () => componentBody(p), current: componentsTop }));
}
for (const e of examples) writeFileSync(`${OUT}/${e.file}`, exampleDocument(e.html));
writeFileSync(`${OUT}/.nojekyll`, "");

console.log(`site: ${TOP.length - 1 + componentPages.length} pages, ${examples.length} live examples, ${LOGOS.length} logos → ${OUT}/`);

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
import { check } from "../components/check/check-markup.mjs";

const DESIGN = "../design";
const WEBJAR = "../components/dist";
const DOCS = "components";
const OUT = "_site";

if (!existsSync(`${WEBJAR}/css/mampfio.min.css`)) {
  throw new Error(`${WEBJAR}/css/mampfio.min.css is missing. Run npm run build in components/ first.`);
}

// The install snippets on the Components page show the newest released version: the highest
// design-system-v* tag. CI fetches all tags, and the release job starts a site rebuild.
const LATEST_RELEASE = execFileSync("git", ["tag", "--list", "design-system-v*", "--sort=-v:refname"], { encoding: "utf8" })
  .split("\n")[0]
  .replace("design-system-v", "");
if (!LATEST_RELEASE) throw new Error("No design-system-v* tag found. Run git fetch --tags.");

const read = (path) => readFileSync(`${DESIGN}/${path}`, "utf8");
const tokens = JSON.parse(read("tokens.json"));
// The logo order is the order in which assets/Logos/README.md describes them.
const LOGOS = [...new Set(read("assets/Logos/README.md").match(/mampfio-[a-z-]+\.svg/g))];
if (LOGOS.length !== 6) throw new Error(`assets/Logos/README.md names ${LOGOS.length} logos, expected 6`);
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The WebJar's icon sprite. Pages and examples inline it, so <use href="#name"> works everywhere,
// also when the site is opened from disk, where browsers block <use> references to other files.
const SPRITE = readFileSync(`${WEBJAR}/icons/icons.svg`, "utf8").replace(/<!--[\s\S]*?-->/g, "")
  .replace("<svg ", '<svg style="display:none" aria-hidden="true" ');
const SPRITE_URL = "/webjars/mampfio-design-system/icons/icons.svg";

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

const exampleDocument = (source) => {
  // Snippets show the URL an SCS uses; the example itself points at the inlined sprite.
  const html = source.replaceAll(`${SPRITE_URL}#`, "#");
  return `<!doctype html>
<html lang="de" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../webjar/css/mampfio.min.css">
<style>html { background: var(--surface); } body { margin: 0; padding: var(--space-6); background: var(--surface); } a[href="#"] { cursor: default; }</style>
</head>
<body>
${html.includes('href="#') ? SPRITE : ""}
${html}
<script src="../webjar/js/bootstrap.bundle.min.js"></script>
<script>for (const a of document.querySelectorAll('a[href="#"]')) a.addEventListener("click", (e) => e.preventDefault());</script>
</body>
</html>
`;
};

const componentPages = readdirSync(DOCS)
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((f) => {
    const slug = f.replace(/^\d+-/, "").replace(/\.md$/, "");
    const markdown = readFileSync(`${DOCS}/${f}`, "utf8").replaceAll("{{latest-release}}", LATEST_RELEASE);
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
// Most visitors build a frontend, not a brand. Send them to the Components pages first.
const startHere = () => `<aside class="start-here"><p><strong>Building a frontend for an SCS?</strong> Start with <a href="components.html">Components</a>: how to load the Component Library, the page layout and the rules for each part. Come back here for colour roles, type and tone of voice.</p></aside>`;

function logos() {
  const notes = new Marked().parse(read("assets/Logos/README.md"));
  const tiles = LOGOS.map((name) => {
    const ground = name.includes("reversed") ? "dark" : "light";
    return `<figure class="logo logo-${ground}"><img src="logos/${name}" alt="${name}"><figcaption><a href="logos/${name}" download>${name}</a></figcaption></figure>`;
  }).join("\n");
  const url = `<p>In an SCS, load them from the Component Library: <code>/webjars/mampfio-design-system/logos/&lt;file&gt;</code>.</p>`;
  return `${notes}${url}<div class="logos">${tiles}</div>`;
}

// The Icons page follows design/assets/Icons/README.md: its intro, then one grid per "## group",
// each icon with the meaning the README gives it.
function icons() {
  const readme = read("assets/Icons/README.md");
  const [intro, ...groups] = readme.split(/^## /m);
  const usage = new Marked().parse(
    "## Using an icon\n\nInside a link or button, the icon is decoration: hide it from screen readers and keep the text.\n\n```html\n" +
      `<button type="button" class="btn btn-primary d-inline-flex align-items-center gap-2">\n  <svg class="mf-icon mf-icon-sm" aria-hidden="true"><use href="${SPRITE_URL}#shopping-basket"></use></svg>\n  In den Warenkorb\n</button>\n` +
      "```\n\nAlone, an icon needs a name: `<svg class=\"mf-icon\" role=\"img\" aria-label=\"Warenkorb\">`. Use `.mf-icon` (24 px) on its own and `.mf-icon-sm` (20 px) in buttons and next to text.",
  );
  const grids = groups.map((g) => {
    const [heading, ...lines] = g.split("\n");
    const tiles = lines
      .map((l) => l.match(/^- `([a-z0-9-]+)\.svg`: (.+)$/))
      .filter(Boolean)
      .map(([, name, use]) => `<figure class="icon-tile"><svg class="mf-icon" aria-hidden="true"><use href="#${name}"></use></svg><figcaption><code>${name}</code><span>${escapeHtml(use.replace(/\.$/, ""))}</span></figcaption></figure>`)
      .join("");
    return `<h2>${escapeHtml(heading)}</h2><div class="icons">${tiles}</div>`;
  });
  return SPRITE + new Marked().parse(intro) + grids.join("") + usage + `<p>Licence: <a href="webjar/licenses/lucide-LICENSE.txt">Lucide (ISC and MIT)</a>.</p>`;
}

const md = (text) => new Marked().parse(text);
const TOP = [
  // The brand book links logos relative to design/, so it renders on GitHub too; the site serves them from logos/.
  { file: "index.html", title: "Brand book", lang: "en", body: () => startHere() + cover() + md(read("brand-book-en.md").replaceAll('src="assets/Logos/', 'src="logos/')) },
  { file: "tokens.html", title: "Tokens", lang: "en", body: () => tokensPage(tokens) },
  { file: "logos.html", title: "Logos", lang: "en", body: logos },
  { file: "icons.html", title: "Icons", lang: "en", body: icons },
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
<link rel="icon" href="logos/mampfio-favicon.svg" type="image/svg+xml">
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
<footer>Fonts under the SIL Open Font License (<a href="webjar/licenses/OFL-Baloo2.txt">Baloo 2</a>, <a href="webjar/licenses/OFL-NunitoSans.txt">Nunito Sans</a>) · icons by Lucide (<a href="webjar/licenses/lucide-LICENSE.txt">ISC and MIT</a>) · Bootstrap is MIT-licensed (<a href="webjar/licenses/bootstrap-LICENSE.txt">licence</a>)</footer>
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
// Images the component examples use, such as a dish photo stand-in.
copyDir("example-assets", `${OUT}/examples`);
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
// The pages follow the rules they document: the Component Library's markup check runs on every page's code.
const problems = componentPages.flatMap((p) => check(p.markdown).map((f) => `site/components/${p.slug}: line ${f.line}: ${f.what}: ${f.why}`));
if (problems.length) throw new Error(`Component pages break the Mampfio rules:\n${problems.join("\n")}`);
for (const e of examples) writeFileSync(`${OUT}/${e.file}`, exampleDocument(e.html));
writeFileSync(`${OUT}/.nojekyll`, "");

console.log(`site: ${TOP.length - 1 + componentPages.length} pages, ${examples.length} live examples, ${LOGOS.length} logos → ${OUT}/`);

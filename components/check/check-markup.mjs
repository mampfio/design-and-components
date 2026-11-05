#!/usr/bin/env node
// Mampfio markup check: finds Bootstrap classes and attributes that don't work with the Mampfio
// design system. Node 22 or later, no dependencies. Ships with the Component Library in check/.
//
//   node check-markup.mjs src/main/resources/templates
//
// Scans template, HTML and script files below the given paths (default: the current directory),
// looks at class attributes and data-bs-theme, and exits with 1 if it finds anything.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const STEPS = "(?:5|7|9|10|11|13|14|15)"; // spacing steps that don't exist in Mampfio
const BP = "(?:-(?:sm|md|lg|xl|xxl))?";
const THEME = "(?:primary|secondary|success|danger|info|light|dark)";

// [pattern for one class, what to do instead]
const RULES = [
  [`(?:[mp][tbsexy]?|gap|row-gap|column-gap|g[xy]?)${BP}-n?${STEPS}`, "spacing step doesn't exist; use 1, 2, 3, 4, 6, 8, 12 or 16 (Bootstrap's 5 is Mampfio's 12)"],
  [`fs-[1-6]|display-[1-6]|lead`, "Bootstrap type size; use an .mf-* type style"],
  [`btn-(?:secondary|success|danger|warning|info|light|dark)`, "button variant stays light in dark mode; use .btn-primary or .btn-outline-secondary"],
  [`btn-outline-(?:primary|success|danger|warning|info|light|dark)`, "button variant stays light in dark mode; use .btn-outline-secondary"],
  [`text-bg-${THEME}`, "stays light in dark mode; badges use .text-bg-warning (offers) or .mf-badge-count (counts)"],
  [`bg-${THEME}`, "stays light in dark mode; use bg-body, bg-body-secondary or a token"],
  [`text-${THEME}`, "stays light in dark mode; use text-body or text-body-secondary"],
  [`alert-(?:warning|info)`, "Mampfio has no warning or info role; use .alert-success or .alert-danger"],
].map(([p, why]) => [new RegExp(`^(?:${p})$`), why]);

const EXTENSIONS = new Set([".html", ".htm", ".peb", ".jte", ".kte", ".jinja", ".j2", ".twig", ".hbs", ".mustache", ".vue", ".svelte", ".jsx", ".tsx", ".js", ".ts", ".md"]);
const SKIP = new Set(["node_modules", "target", "build", "dist", ".git", "_site", "webjars"]);

function* files(path) {
  const s = statSync(path);
  if (s.isFile()) { yield path; return; }
  for (const e of readdirSync(path, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(path, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (EXTENSIONS.has(extname(e.name))) yield p;
  }
}

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

export function check(text) {
  const found = [];
  for (const m of text.matchAll(/\bclass(?:Name)?\s*=\s*(["'`])([\s\S]*?)\1/g)) {
    const start = m.index + m[0].indexOf(m[2]);
    for (const c of m[2].matchAll(/[^\s{}()"'`]+/g)) {
      const rule = RULES.find(([re]) => re.test(c[0]));
      if (rule) found.push({ line: lineOf(text, start + c.index), what: `.${c[0]}`, why: rule[1] });
    }
  }
  for (const m of text.matchAll(/\bdata-bs-theme\s*=/g)) {
    found.push({ line: lineOf(text, m.index), what: "data-bs-theme", why: "use data-theme; data-bs-theme leaves the Mampfio tokens light" });
  }
  return found;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const paths = process.argv.slice(2);
  let count = 0;
  for (const root of paths.length ? paths : ["."]) {
    for (const file of files(root)) {
      for (const f of check(readFileSync(file, "utf8"))) {
        console.log(`${file}:${f.line}: ${f.what}: ${f.why}`);
        count++;
      }
    }
  }
  console.log(count ? `\n${count} problem${count === 1 ? "" : "s"}. See https://mampfio.github.io/design-and-components/components.html` : "Mampfio markup check: no problems.");
  process.exit(count ? 1 : 0);
}

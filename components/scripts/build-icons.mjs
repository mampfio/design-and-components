// Builds the icon sprite from design/assets/Icons/ and checks every icon against the brand book:
// stroke icons on a 24 px grid, 2 px stroke, rounded ends and joins, drawn in currentColor.
// Only icons listed in design/assets/Icons/README.md are part of the design system.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const SOURCE = "../design/assets/Icons";
const listed = [...new Set(readFileSync(`${SOURCE}/README.md`, "utf8").match(/`([a-z0-9-]+)\.svg`/g).map((m) => m.slice(1, -5)))];
const files = readdirSync(SOURCE).filter((f) => f.endsWith(".svg")).map((f) => f.slice(0, -4));

const problems = [];
for (const name of files) if (!listed.includes(name)) problems.push(`${name}.svg is not listed in README.md`);
for (const name of listed) if (!files.includes(name)) problems.push(`README.md lists ${name}.svg, but the file is missing`);

const RULES = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

const symbols = [];
for (const name of listed.filter((n) => files.includes(n))) {
  const svg = readFileSync(`${SOURCE}/${name}.svg`, "utf8")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata>[\s\S]*?<\/metadata>/g, ""); // provenance blocks, not drawing
  const open = svg.match(/<svg\b[^>]*>/)?.[0] ?? "";
  for (const [attr, value] of Object.entries(RULES)) {
    const actual = open.match(new RegExp(`\\s${attr}="([^"]*)"`))?.[1];
    if (actual !== value) problems.push(`${name}.svg: ${attr} is ${actual ?? "missing"}, the brand book needs ${value}`);
  }
  const body = svg.slice(svg.indexOf(open) + open.length, svg.lastIndexOf("</svg>")).replace(/\s+/g, " ").trim();
  if (/<(image|text|style|script)\b|fill="(?!none)/.test(body)) problems.push(`${name}.svg: only stroked shapes are allowed`);
  symbols.push(`<symbol id="${name}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g></symbol>`);
}

if (problems.length) {
  console.error(`icons: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

mkdirSync("dist/icons", { recursive: true });
mkdirSync("dist/licenses", { recursive: true });
writeFileSync(
  "dist/icons/icons.svg",
  `<svg xmlns="http://www.w3.org/2000/svg"><!-- Lucide 1.61.0, ISC and MIT licences: ../licenses/lucide-LICENSE.txt -->\n${symbols.join("\n")}\n</svg>\n`,
);
copyFileSync(`${SOURCE}/LICENSE`, "dist/licenses/lucide-LICENSE.txt");
console.log(`icons: ${symbols.length} icons in dist/icons/icons.svg, all on the 24 px / 2 px / round grid`);

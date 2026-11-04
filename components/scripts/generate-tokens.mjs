// Turns the design system's tokens.json into two Sass partials and one plain CSS file.
// design/tokens.json at the repo root is exported from the Mampfio design system and is the only source of values.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SOURCE = "../design/tokens.json";
const tokens = JSON.parse(readFileSync(SOURCE, "utf8"));
const HEADER = "// GENERATED from design/tokens.json by scripts/generate-tokens.mjs. Do not edit.\n";

// Font files shipped in assets/fonts. tokens.json names the families; this maps them to files.
const FONT_FACES = [
  { family: "Baloo 2", weight: 800, file: "baloo2-800.woff2" },
  { family: "Nunito Sans", weight: 400, file: "nunitosans-400.woff2" },
  { family: "Nunito Sans", weight: 600, file: "nunitosans-600.woff2" },
  { family: "Nunito Sans", weight: 700, file: "nunitosans-700.woff2" },
];

const themed = (v) => (typeof v === "string" ? { light: v, dark: v } : v);

// 1. Sass variables, no CSS output. Bootstrap's adapter reads these.
const sass = [HEADER];
for (const t of tokens.color.tokens) {
  const v = themed(t.value);
  sass.push(`$mampfio-${t.name}-light: ${v.light};`, `$mampfio-${t.name}-dark: ${v.dark};`);
}
for (const [key, stack] of Object.entries(tokens.type.families)) sass.push(`$mampfio-font-${key}: ${stack};`);
for (const group of ["spacing", "radius"]) {
  for (const t of tokens[group].tokens) sass.push(`$mampfio-${t.name}: ${t.value};`);
}
for (const t of tokens.shadow.tokens) {
  const v = themed(t.value);
  sass.push(`$mampfio-${t.name}-light: ${v.light};`, `$mampfio-${t.name}-dark: ${v.dark};`);
}
writeFileSync("scss/_tokens.generated.scss", sass.join("\n") + "\n");

// 2. Design-system CSS: fonts, custom properties (same names as the design system's tokens.css),
//    and the type styles as mf-* classes. Emitted into mampfio.css and, alone, into mampfio-tokens.css.
const css = [];
for (const f of FONT_FACES) {
  css.push(`@font-face { font-family: "${f.family}"; font-style: normal; font-weight: ${f.weight}; font-display: swap; src: url("../fonts/${f.file}") format("woff2"); }`);
}
const light = [], dark = [];
for (const t of tokens.color.tokens) {
  const v = themed(t.value);
  light.push(`  --${t.name}: ${v.light};`);
  if (v.dark !== v.light) dark.push(`  --${t.name}: ${v.dark};`);
}
for (const [key, stack] of Object.entries(tokens.type.families)) light.push(`  --font-${key}: ${stack};`);
for (const group of ["spacing", "radius"]) for (const t of tokens[group].tokens) light.push(`  --${t.name}: ${t.value};`);
for (const t of tokens.shadow.tokens) {
  const v = themed(t.value);
  light.push(`  --${t.name}: ${v.light};`);
  if (v.dark !== v.light) dark.push(`  --${t.name}: ${v.dark};`);
}
// Themes switch with data-theme, as in design/tokens.css. Without the attribute the page is light.
css.push(`:root, [data-theme="light"] {\n  color-scheme: light;\n${light.join("\n")}\n}`);
css.push(`[data-theme="dark"] {\n  color-scheme: dark;\n${dark.join("\n")}\n}`);
for (const g of tokens.type.groups) {
  for (const s of g.styles) {
    const decl = [
      `font-family: var(--font-${s.family ?? g.family})`,
      `font-size: ${s.fontSize}`,
      `line-height: ${s.lineHeight}`,
      `font-weight: ${s.fontWeight}`,
      s.letterSpacing ? `letter-spacing: ${s.letterSpacing}` : null,
    ].filter(Boolean).join("; ");
    css.push(`.mf-${s.name} { ${decl}; }`);
  }
}
const cssText = css.join("\n") + "\n";
writeFileSync("scss/_design-system.generated.scss", HEADER + cssText);
mkdirSync("dist/css", { recursive: true });
writeFileSync("dist/css/mampfio-tokens.css", `/* Mampfio design system tokens ${tokens.name} v${tokens.version}. Generated, do not edit. */\n` + cssText);

console.log(`tokens: ${tokens.color.tokens.length} colours, ${tokens.type.groups.reduce((n, g) => n + g.styles.length, 0)} type styles`);

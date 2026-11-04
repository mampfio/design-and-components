// Fitness function for colour mode, run on the compiled CSS. Fails the build when a selector
// themes with Bootstrap's data-bs-theme but has no data-theme twin, which would leave part of
// the page in the wrong theme when SCS nest data-theme="light" and data-theme="dark".
import { readFileSync } from "node:fs";

const css = readFileSync("dist/css/mampfio.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const themed = [...css.matchAll(/([^{}]+)\{/g)]
  .map((m) => m[1].replace(/@charset[^;]*;/, "").replace(/\s+/g, " ").trim())
  .filter((prelude) => prelude.includes("data-bs-theme"));
const missing = themed.filter((prelude) => {
  const selectors = prelude.split(",").map((s) => s.trim());
  return selectors.some((s) => s.includes("data-bs-theme") && !selectors.includes(s.replace(/data-bs-theme/g, "data-theme")));
});

console.log(`colour mode: ${themed.length} Bootstrap theme selectors, all answer to data-theme`.replace("all", missing.length ? "NOT all" : "all"));
if (missing.length) {
  console.error(`No data-theme twin for:\n  ${missing.join("\n  ")}\nCheck scss/_color-mode.scss.`);
  process.exit(1);
}

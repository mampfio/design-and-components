// Copies everything the webjar ships next to the compiled CSS into dist/.
// Logos and tokens come from design/ at the repo root, the design system's source of truth.
import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist/js", { recursive: true });
mkdirSync("dist/licenses", { recursive: true });
cpSync("node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", "dist/js/bootstrap.bundle.min.js");
cpSync("node_modules/bootstrap/LICENSE", "dist/licenses/bootstrap-LICENSE.txt");
cpSync("assets/fonts", "dist/fonts", { recursive: true, filter: (p) => !p.endsWith(".txt") });
cpSync("assets/fonts/OFL-Baloo2.txt", "dist/licenses/OFL-Baloo2.txt");
cpSync("assets/fonts/OFL-NunitoSans.txt", "dist/licenses/OFL-NunitoSans.txt");
cpSync("../design/assets/Logos", "dist/logos", { recursive: true, filter: (p) => !p.endsWith(".md") });
cpSync("../design/tokens.json", "dist/tokens.json");
console.log("assets copied to dist/");

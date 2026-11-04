// Fitness function for Bootstrap upgrades. Fails the build when the adapter
// overrides a variable the installed Bootstrap no longer has, or hard-codes a colour,
// or when mampfio.scss no longer imports exactly the partials of bootstrap.scss, in order.
import { readFileSync } from "node:fs";

const root = "node_modules/bootstrap";
const version = JSON.parse(readFileSync(`${root}/package.json`, "utf8")).version;
const upstream = ["_variables.scss", "_variables-dark.scss"]
  .map((f) => readFileSync(`${root}/scss/${f}`, "utf8"))
  .join("\n");
const known = new Set([...upstream.matchAll(/^\$([\w-]+):[^;]*!default/gm)].map((m) => m[1]));

const adapter = readFileSync("scss/_bootstrap-adapter.scss", "utf8");
const code = adapter.replace(/\/\/.*$/gm, "");
const assigned = [...code.matchAll(/^\$([\w-]+)\s*:/gm)].map((m) => m[1]);

const unknown = assigned.filter((name) => !known.has(name));
const rawColours = [...code.matchAll(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/gi)].map((m) => m[0]);

console.log(`bootstrap ${version}: adapter overrides ${assigned.length} variables`);
if (unknown.length) console.error(`Not a !default variable in Bootstrap ${version}: ${unknown.map((n) => "$" + n).join(", ")}`);
if (rawColours.length) console.error(`Raw colours in the adapter (use $mampfio-* tokens): ${rawColours.join(", ")}`);
const bootstrapParts = [...readFileSync(`${root}/scss/bootstrap.scss`, "utf8").matchAll(/^@import "([^"]+)";/gm)]
  .map((m) => m[1])
  .filter((p) => p !== "mixins/banner");
const ourParts = [...readFileSync("scss/mampfio.scss", "utf8").matchAll(/^@import "bootstrap\/scss\/([^"]+)";/gm)].map((m) => m[1]);
const sameParts = bootstrapParts.length === ourParts.length && bootstrapParts.every((p, i) => p === ourParts[i]);
console.log(`bootstrap ${version}: mampfio.scss imports ${ourParts.length} of ${bootstrapParts.length} partials`);
if (!sameParts) console.error(`mampfio.scss must import Bootstrap's partials as bootstrap.scss does:\n  bootstrap.scss: ${bootstrapParts.join(", ")}\n  mampfio.scss:   ${ourParts.join(", ")}`);
const colorModeMixin = readFileSync(`${root}/scss/mixins/_color-mode.scss`, "utf8");
const mixinSignature = /@mixin color-mode\(\$mode: light, \$root: false\)/.test(colorModeMixin);
if (!mixinSignature) console.error("Bootstrap's color-mode mixin changed its signature. Update scss/_color-mode.scss.");

if (unknown.length || rawColours.length || !sameParts || !mixinSignature) process.exit(1);

// Fitness function for Bootstrap upgrades. Fails the build when the adapter
// overrides a variable the installed Bootstrap no longer has, or hard-codes a colour.
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
if (unknown.length || rawColours.length) process.exit(1);

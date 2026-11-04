// Packs dist/ as the npm package mampfio-design-system-<version>.tgz in target/.
// The version comes from the Maven build, so the WebJar and the npm package never disagree.
// Run after `mvn package`.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const props = readFileSync("target/classes/META-INF/resources/webjars-locator.properties", "utf8");
const version = props.match(/^mampfio-design-system\.version=(.+)$/m)?.[1]?.trim();
if (!version) throw new Error("No version in webjars-locator.properties. Run mvn package first.");

const source = JSON.parse(readFileSync("package.json", "utf8"));
const stage = "target/npm";
rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
cpSync("dist", stage, { recursive: true });
cpSync("README.md", `${stage}/README.md`);

writeFileSync(`${stage}/package.json`, JSON.stringify({
  name: source.name,
  version,
  description: source.description,
  license: source.license,
  style: "css/mampfio.css",
  exports: {
    "./css/*": "./css/*",
    "./js/*": "./js/*",
    "./fonts/*": "./fonts/*",
    "./logos/*": "./logos/*",
    "./tokens.json": "./tokens.json",
  },
}, null, 2) + "\n");

execFileSync("npm", ["pack", "--pack-destination", "..", "--silent"], { cwd: stage, stdio: "inherit" });
console.log(`packed target/${source.name}-${version}.tgz`);

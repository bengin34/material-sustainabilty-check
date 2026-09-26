// Baut die statische Version (für GitHub Pages) aus data/*.js + site/*.
// Start: node scripts/build-static.js  →  dist/
const fs = require("fs");
const path = require("path");
const systems = require("../data/systems");
const { materials } = require("../data/materials");

const root = path.join(__dirname, "..");
const siteDir = path.join(root, "site");
const outDir = path.join(root, "dist");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, "data.json"), JSON.stringify({ systems, materials }));
fs.copyFileSync(path.join(siteDir, "index.html"), path.join(outDir, "index.html"));
fs.copyFileSync(path.join(siteDir, "app.js"), path.join(outDir, "app.js"));
fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

console.log(`Statische Site gebaut: dist/ (${materials.length} Materialgruppen, ${Object.keys(systems).length} Systeme)`);

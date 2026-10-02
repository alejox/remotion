#!/usr/bin/env node
/**
 * Renders every beat of a config as its own transparent ProRes 4444 clip (for DaVinci Resolve)
 * and writes `overlays.manifest.json` next to them.
 *
 *   node scripts/render-overlays.mjs <config-or-beats.json> [outDir]
 *
 * Input: a JSON array of beats, or an object with a `beats` array (a VideoConfig dumped as JSON).
 * Beat times (`at`) stay in SOURCE seconds: resolve-silence-cutter maps them onto the cut timeline.
 * Spotlight beats are skipped (they need footage). Set BROWSER_EXECUTABLE (and CHROME_MODE=headless-shell if needed) to use a local Chrome.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const [input, outArg = "out/overlays"] = process.argv.slice(2);
if (!input) {
  console.error("Uso: node scripts/render-overlays.mjs <beats.json> [outDir]");
  process.exit(2);
}

const data = JSON.parse(readFileSync(input, "utf8"));
const beats = Array.isArray(data) ? data : data.beats;
if (!Array.isArray(beats)) {
  console.error("El JSON debe ser un arreglo de beats o un objeto con `beats`.");
  process.exit(2);
}

const outDir = resolve(outArg);
mkdirSync(outDir, { recursive: true });

const manifest = [];
for (const [i, beat] of beats.entries()) {
  if (beat.type === "spotlight") {
    console.warn(`beat ${i} (spotlight): omitido, necesita el video de fondo`);
    continue;
  }
  const name = `${String(i + 1).padStart(2, "0")}-${beat.type}`;
  const file = join(outDir, `${name}.mov`);
  const propsFile = join(outDir, `${name}.props.json`);
  writeFileSync(propsFile, JSON.stringify({ beat }));

  const args = [
    "remotion", "render", "src/index.ts", "Overlay", file,
    `--props=${propsFile}`,
    "--codec=prores", "--prores-profile=4444",
    "--image-format=png", "--pixel-format=yuva444p10le",
  ];
  if (process.env.BROWSER_EXECUTABLE) {
    args.push(`--browser-executable=${process.env.BROWSER_EXECUTABLE}`);
  }
  if (process.env.CHROME_MODE) {
    args.push(`--chrome-mode=${process.env.CHROME_MODE}`);
  }
  console.log(`Renderizando ${name} (${beat.dur}s)...`);
  const r = spawnSync("npx", args, { stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`Falló el render de ${name}`);
    process.exit(r.status ?? 1);
  }
  manifest.push({ file, type: beat.type, at: beat.at, dur: beat.dur });
}

const manifestFile = join(outDir, "overlays.manifest.json");
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
console.log(`Listo: ${manifest.length} overlays. Manifiesto: ${manifestFile}`);

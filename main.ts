// DealBeacon hand-in program (Node 22, standard library only).
//
// It hands the finished site to the grader: the static files under
// app/, the screenshots under screenshots/, and the dossier the judge
// reads, built with the kit's vendored library. It writes the same
// bytes on every run, so the grader's two runs agree.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, lstatSync, mkdirSync, readdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const src = join(from, name);
    const dst = join(to, name);
    const info = lstatSync(src);
    if (info.isSymbolicLink()) {
      throw new Error(`refusing to copy a symbolic link: ${src}`);
    }
    if (info.isDirectory()) {
      copyTree(src, dst);
    } else if (info.isFile()) {
      copyFileSync(src, dst);
    }
  }
}

function fail(message) {
  throw new Error(`dealbeacon main.ts: ${message}`);
}

const appDir = join(root, "app");
const shotsDir = join(root, "screenshots");
if (!existsSync(join(appDir, "index.html"))) fail("app/index.html is missing");
if (!existsSync(shotsDir)) fail("screenshots/ is missing");

const shots = readdirSync(shotsDir).filter((name) => !name.startsWith("."));
if (shots.length < 3 || shots.length > 4) {
  fail(`expected 3 or 4 screenshots, found ${shots.length}`);
}

mkdirSync(outDir, { recursive: true });
copyTree(appDir, join(outDir, "app"));
copyTree(shotsDir, join(outDir, "screenshots"));

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, "dossier.json"), dossier);

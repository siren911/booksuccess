import { copyFile, mkdir, writeFile } from "node:fs/promises";

const outDir = new URL("../out/", import.meta.url);

await mkdir(outDir, { recursive: true });
await writeFile(new URL(".nojekyll", outDir), "");

try {
  await copyFile(new URL("index.html", outDir), new URL("404.html", outDir));
} catch {
  // The site only uses one route. If Next changes its output, GitHub Pages can
  // still serve the generated index without this fallback.
}

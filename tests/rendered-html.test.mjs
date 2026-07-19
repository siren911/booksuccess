import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const outRoot = new URL("../out/", import.meta.url);

test("exports the reading circle app for GitHub Pages", async () => {
  const html = await readFile(new URL("index.html", outRoot), "utf8");

  assert.match(html, /<title>성공 대화론 독서모임<\/title>/i);
  assert.match(html, /성공 대화론 독서모임/);
  assert.match(html, /책 문장/);
  assert.match(html, /내 성찰/);
  assert.match(html, /AI 질문 카드/);
  assert.match(html, /대화 기록/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);

  await access(new URL(".nojekyll", outRoot));
  await access(new URL("404.html", outRoot));
});

test("keeps the project configured for GitHub Pages", async () => {
  const [page, layout, nextConfig, workflow, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../.github/workflows/deploy-github-pages.yml", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /localStorage/);
  assert.match(page, /questionBanks/);
  assert.match(page, /resetTimer/);
  assert.match(layout, /lang="ko"/);
  assert.match(nextConfig, /output:\s*"export"/);
  assert.match(nextConfig, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /npm run build:github/);
  assert.match(packageJson, /"build:github"/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /_sites-preview|Starter Project|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("app/_sites-preview", root)));
});

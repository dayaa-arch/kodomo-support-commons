import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { SEED_DATASET_PATH } from "../src/modules/facility/infrastructure/JsonFacilityRepository.ts";
import { validateSeedDataset } from "../src/modules/facility/infrastructure/seed-schema.ts";
import { ALLOW_INDEXING, SITE_URL } from "../src/shared/domain/site-config.ts";

const outputDirectory = path.join(process.cwd(), "out");
const requiredFiles = [
  "index.html",
  "search.html",
  "privacy.html",
  "terms.html",
  "data-policy.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "favicon.ico",
  "icon.svg",
  "apple-icon.png",
];

await Promise.all(
  requiredFiles.map((file) => access(path.join(outputDirectory, file))),
);

const seedRaw = await readFile(
  path.join(process.cwd(), SEED_DATASET_PATH),
  "utf8",
);
const dataset = validateSeedDataset(JSON.parse(seedRaw));
const facilityFiles = (await readdir(path.join(outputDirectory, "facilities"))).filter(
  (file) => file.endsWith(".html"),
);

if (facilityFiles.length !== dataset.support_providers.length) {
  throw new Error(
    `施設詳細の出力件数が不一致です: expected=${dataset.support_providers.length}, actual=${facilityFiles.length}`,
  );
}

const [indexHtml, robots, sitemap, headers] = await Promise.all([
  readFile(path.join(outputDirectory, "index.html"), "utf8"),
  readFile(path.join(outputDirectory, "robots.txt"), "utf8"),
  readFile(path.join(outputDirectory, "sitemap.xml"), "utf8"),
  readFile(path.join(outputDirectory, "_headers"), "utf8"),
]);

const sitemapEntries = [...sitemap.matchAll(/<loc>/g)].length;
const expectedSitemapEntries = dataset.support_providers.length + 5;
if (sitemapEntries !== expectedSitemapEntries) {
  throw new Error(
    `sitemapのURL件数が不一致です: expected=${expectedSitemapEntries}, actual=${sitemapEntries}`,
  );
}

if (!sitemap.includes(SITE_URL.origin)) {
  throw new Error(`sitemapに公開originがありません: ${SITE_URL.origin}`);
}

if (ALLOW_INDEXING) {
  if (!robots.includes("Allow: /") || indexHtml.includes("noindex")) {
    throw new Error("検索エンジン公開設定と生成物が一致しません");
  }
} else if (!robots.includes("Disallow: /") || !indexHtml.includes("noindex")) {
  throw new Error("非公開設定と生成物が一致しません");
}

for (const directive of [
  "Content-Security-Policy",
  "Permissions-Policy",
  "Referrer-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
]) {
  if (!headers.includes(directive)) {
    throw new Error(`_headersに必須設定がありません: ${directive}`);
  }
}

process.stdout.write(
  `静的出力監査に成功しました: 必須 ${requiredFiles.length} ファイル、施設 ${facilityFiles.length} ページ、sitemap ${sitemapEntries} URL\n`,
);

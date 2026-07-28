import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { toFacilities } from "./seed-mapper.ts";
import { validateSeedDataset } from "./seed-schema.ts";
import { SEED_DATASET_PATH } from "./JsonFacilityRepository.ts";

/**
 * 正本データセットそのものが現行スキーマを満たし、全件写像できることを確認する。
 * データ追加の PR がここで落ちれば、不正なデータの公開を防げる。
 */

const raw = await readFile(path.join(process.cwd(), SEED_DATASET_PATH), "utf8");
const dataset = validateSeedDataset(JSON.parse(raw));
const facilities = toFacilities(dataset);

test("正本データセットが検証を通り、全レコードを写像できる", () => {
  assert.ok(facilities.length > 0, "施設が1件以上ある");
  assert.equal(facilities.length, dataset.support_providers.length);
});

test("slug が一意で、URL に使える形式になっている", () => {
  const slugs = facilities.map((facility) => facility.slug);

  assert.equal(new Set(slugs).size, slugs.length, "slug が重複していない");
  for (const slug of slugs) {
    assert.match(slug, /^[a-z0-9-]+$/, `slug "${slug}" が URL に使える形式である`);
  }
});

test("すべての施設に出典と最終確認日がある", () => {
  for (const facility of facilities) {
    assert.ok(facility.sourceUrl, `${facility.slug} に出典 URL がある`);
    assert.match(
      facility.lastCheckedAt,
      /^\d{4}-\d{2}-\d{2}$/,
      `${facility.slug} の最終確認日が YYYY-MM-DD 形式である`,
    );
  }
});

test("市域全体の窓口が含まれている（区で絞り込んでも見落とさないため）", () => {
  const citywide = facilities.filter((facility) => facility.ward === null);

  assert.ok(citywide.length > 0, "区を持たない窓口が1件以上ある");
});

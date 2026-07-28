import assert from "node:assert/strict";
import test from "node:test";

import { SeedValidationError, validateSeedDataset } from "./seed-schema.ts";

function createRawRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "ward-child-family-tsurumi",
    name: "鶴見区 こども家庭相談",
    provider_type: "ward_child_family_consultation",
    ward_code: "tsurumi",
    ward_name: "鶴見区",
    address: "横浜市鶴見区鶴見中央3-20-1",
    phone: "045-510-1840",
    alternate_phone: null,
    consultation_methods: ["phone", "in_person"],
    themes: ["school_attendance"],
    target_users: ["child", "parent_family"],
    target_age: "乳幼児期から思春期まで",
    cost: "無料",
    reservation_required: false,
    anonymous_available: null,
    parent_only_consultation: true,
    hours: "平日 8:45–17:00",
    operator: "横浜市鶴見区役所",
    official_site_url: "https://example.city/child",
    source_url: "https://example.city/child",
    source_updated_at: null,
    checked_at: "2026-07-27",
    verification_status: "official_source",
    notes: ["秘密厳守。"],
    ...overrides,
  };
}

function createRawDataset(records: readonly unknown[]) {
  return {
    schema_version: "0.1.0",
    source_catalog: [
      {
        id: "ward_child_family_consultation",
        title: "こども家庭相談",
        url: "https://example.city/child",
      },
    ],
    support_providers: records,
  };
}

test("正しいデータセットは検証を通る", () => {
  const dataset = validateSeedDataset(createRawDataset([createRawRecord()]));

  assert.equal(dataset.schema_version, "0.1.0");
  assert.equal(dataset.support_providers.length, 1);
  assert.equal(dataset.support_providers[0]?.id, "ward-child-family-tsurumi");
});

test("区を持たない市域全体の窓口（ward_code: null）を受け入れる", () => {
  const dataset = validateSeedDataset(
    createRawDataset([createRawRecord({ ward_code: null, ward_name: null })]),
  );

  assert.equal(dataset.support_providers[0]?.ward_code, null);
});

test("必須項目が欠けていると検証に失敗する", () => {
  for (const field of ["id", "name", "source_url", "checked_at"]) {
    assert.throws(
      () =>
        validateSeedDataset(
          createRawDataset([createRawRecord({ [field]: undefined })]),
        ),
      SeedValidationError,
      `${field} の欠落を検出する`,
    );
  }
});

test("未知の enum 値は検証に失敗する（黙って捨てない）", () => {
  assert.throws(
    () =>
      validateSeedDataset(
        createRawDataset([createRawRecord({ themes: ["unknown_theme"] })]),
      ),
    /未知の値/,
  );

  assert.throws(
    () =>
      validateSeedDataset(
        createRawDataset([createRawRecord({ target_users: ["teacher"] })]),
      ),
    /未知の値/,
  );

  assert.throws(
    () =>
      validateSeedDataset(
        createRawDataset([createRawRecord({ consultation_methods: ["fax"] })]),
      ),
    /未知の値/,
  );

  assert.throws(
    () =>
      validateSeedDataset(
        createRawDataset([createRawRecord({ verification_status: "checked" })]),
      ),
    /未知の値/,
  );
});

test("未知の区コードは検証に失敗する", () => {
  assert.throws(
    () =>
      validateSeedDataset(
        createRawDataset([createRawRecord({ ward_code: "shinjuku" })]),
      ),
    /未知の区コード/,
  );
});

test("id の重複は検証に失敗する", () => {
  assert.throws(
    () =>
      validateSeedDataset(
        createRawDataset([
          createRawRecord(),
          createRawRecord({ name: "別の窓口だが id が同じ" }),
        ]),
      ),
    /重複/,
  );
});

test("エラーメッセージに問題のあるレコードと項目が含まれる", () => {
  assert.throws(
    () =>
      validateSeedDataset(
        createRawDataset([createRawRecord({ themes: ["unknown_theme"] })]),
      ),
    (error: Error) => {
      assert.match(error.message, /ward-child-family-tsurumi/);
      assert.match(error.message, /themes/);
      return true;
    },
  );
});

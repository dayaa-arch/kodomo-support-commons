import assert from "node:assert/strict";
import test from "node:test";

import { toCost, toFacility } from "./seed-mapper.ts";
import type { SeedProviderRecord } from "./seed-schema.ts";

const SOURCE_TITLES = new Map([
  ["ward_child_family_consultation", "こども家庭相談"],
]);

function createRecord(
  overrides: Partial<SeedProviderRecord> = {},
): SeedProviderRecord {
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
    themes: ["school_attendance", "mood_anxiety"],
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

test("id を slug に、確認状況を公式情報確認済みに写像する", () => {
  const facility = toFacility(createRecord(), SOURCE_TITLES);

  assert.equal(facility.slug, "ward-child-family-tsurumi");
  assert.equal(facility.verificationStatus, "official-verified");
  assert.equal(facility.sourceName, "こども家庭相談");
});

test("テーマコードをドメインのテーマに写像する", () => {
  const facility = toFacility(
    createRecord({
      themes: [
        "school_attendance",
        "mood_anxiety",
        "family_parent_child",
        "bullying_friendship",
        "living_financial",
        "caregiving_young_carer",
        "other",
      ],
    }),
    SOURCE_TITLES,
  );

  assert.deepEqual(facility.supportThemes, [
    "school-absence",
    "low-mood",
    "family",
    "bullying",
    "livelihood",
    "caregiving",
    "other",
  ]);
});

test("若者本人は子ども本人に、一般はその他に寄せ、重複を取り除く", () => {
  const facility = toFacility(
    createRecord({
      target_users: ["child", "young_person", "general_public", "school_staff"],
    }),
    SOURCE_TITLES,
  );

  assert.deepEqual(facility.targetAudiences, ["child", "other", "school"]);
});

test("相談方法コードを写像し、LINE やWebフォームを失わない", () => {
  const facility = toFacility(
    createRecord({
      consultation_methods: ["phone", "in_person", "line", "web_form", "phone_callback"],
    }),
    SOURCE_TITLES,
  );

  assert.deepEqual(facility.consultationMethods, [
    "phone",
    "inperson",
    "line",
    "web-form",
    "phone-callback",
  ]);
});

test("区コードが null の窓口は市域全体として扱う", () => {
  const facility = toFacility(
    createRecord({ ward_code: null, ward_name: null }),
    SOURCE_TITLES,
  );

  assert.equal(facility.ward, null);
});

test("費用は区分に写像しつつ、出典の表現をそのまま残す", () => {
  const free = toFacility(createRecord({ cost: "無料（利用登録が必要）" }), SOURCE_TITLES);
  assert.equal(free.cost, "free");
  assert.equal(free.costDetail, "無料（利用登録が必要）");

  const unknown = toFacility(createRecord({ cost: null }), SOURCE_TITLES);
  assert.equal(unknown.cost, "unknown");
  assert.equal(unknown.costDetail, null);
});

test("費用の記述から区分を導く", () => {
  assert.equal(toCost(null), "unknown");
  assert.equal(toCost("無料"), "free");
  assert.equal(toCost("無料（フリーダイヤル）"), "free");
  assert.equal(toCost("1回 500円"), "unknown");
});

test("出典に無い項目を推測で補完しない", () => {
  const facility = toFacility(
    createRecord({ operator: null, address: null, phone: null, hours: null }),
    SOURCE_TITLES,
  );

  assert.equal(facility.summary, null);
  assert.equal(facility.whatYouCanConsult, null);
  assert.equal(facility.eligibility, null);
  assert.equal(facility.howToUse, null);
  assert.equal(facility.operator, null);
  assert.equal(facility.address, null);
  assert.equal(facility.phone, null);
  assert.equal(facility.receptionHours, null);
});

test("対象年齢を「誰が利用できるか」に写像し、補足を保持する", () => {
  const facility = toFacility(createRecord(), SOURCE_TITLES);

  assert.equal(facility.whoCanUse, "乳幼児期から思春期まで");
  assert.deepEqual(facility.notes, ["秘密厳守。"]);
});

test("補足が無い場合は空配列にする", () => {
  const facility = toFacility(createRecord({ notes: null }), SOURCE_TITLES);

  assert.deepEqual(facility.notes, []);
});

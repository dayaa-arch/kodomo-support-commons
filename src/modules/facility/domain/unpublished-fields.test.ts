import assert from "node:assert/strict";
import test from "node:test";

import type { Facility } from "./facility.ts";
import { collectUnpublishedFields } from "./unpublished-fields.ts";

function createFacility(overrides: Partial<Facility> = {}): Facility {
  return {
    slug: "test-facility",
    name: "テスト相談窓口",
    operator: "テスト運営者",
    operatingDepartment: null,
    summary: "テスト用の相談窓口です。",
    ward: "kohoku",
    address: "横浜市港北区テスト1-1-1",
    phone: "045-000-0000",
    alternatePhone: null,
    supportThemes: ["school-absence"],
    targetAudiences: ["guardian"],
    whatYouCanConsult: "学校に行きづらいことを相談できます。",
    whoCanUse: "小学生から高校生年代",
    eligibility: "どなたでも相談できます。",
    howToUse: "電話で予約してください。",
    consultationMethods: ["phone"],
    cost: "free",
    costDetail: "無料",
    reservationRequired: false,
    anonymousConsultation: true,
    guardianOnlyConsultation: true,
    receptionHours: "平日 9:00〜17:00",
    officialUrl: null,
    imageVariant: "conversation",
    notes: [],
    sourceName: "テスト情報源",
    sourceUrl: null,
    lastCheckedAt: "2026-07-29",
    verificationStatus: "official-verified",
    ...overrides,
  };
}

test("すべての項目が揃っていれば未掲載項目はない", () => {
  assert.deepEqual(collectUnpublishedFields(createFacility()), []);
});

test("値が無い項目を項目名として列挙する", () => {
  const facility = createFacility({
    summary: null,
    whatYouCanConsult: null,
    howToUse: null,
    phone: null,
  });

  assert.deepEqual(collectUnpublishedFields(facility), [
    "施設の概要",
    "何を相談できるか",
    "利用までの流れ",
    "電話番号",
  ]);
});

test("費用が不明なときは未掲載として扱う", () => {
  const facility = createFacility({ cost: "unknown", costDetail: null });

  assert.ok(collectUnpublishedFields(facility).includes("費用"));
});

test("費用が確認できていれば未掲載に含めない", () => {
  assert.ok(!collectUnpublishedFields(createFacility()).includes("費用"));
});

test("真偽値が false でも「確認できた事実」として扱う", () => {
  const facility = createFacility({
    reservationRequired: false,
    anonymousConsultation: false,
    guardianOnlyConsultation: false,
  });
  const unpublished = collectUnpublishedFields(facility);

  assert.ok(!unpublished.includes("予約の要否"));
  assert.ok(!unpublished.includes("匿名で相談できるか"));
  assert.ok(!unpublished.includes("保護者だけで相談できるか"));
});

test("真偽値が null のときは未掲載として扱う", () => {
  const facility = createFacility({
    reservationRequired: null,
    anonymousConsultation: null,
    guardianOnlyConsultation: null,
  });
  const unpublished = collectUnpublishedFields(facility);

  assert.ok(unpublished.includes("予約の要否"));
  assert.ok(unpublished.includes("匿名で相談できるか"));
  assert.ok(unpublished.includes("保護者だけで相談できるか"));
});

test("空白だけの文字列は未掲載として扱う", () => {
  assert.ok(collectUnpublishedFields(createFacility({ summary: "   " })).includes("施設の概要"));
});

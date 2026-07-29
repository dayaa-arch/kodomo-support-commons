import assert from "node:assert/strict";
import test from "node:test";

import type { Facility } from "./facility.ts";
import {
  deriveFeatureLabels,
  formatBooleanInformation,
  formatOptionalInformation,
  UNPUBLISHED_INFORMATION_LABEL,
} from "./derive-feature-labels.ts";

const baseFacility: Facility = {
  slug: "test-facility",
  name: "テスト相談窓口",
  operator: "テスト運営者",
  operatingDepartment: null,
  summary: "テスト用の相談窓口です。",
  ward: "kohoku",
  address: null,
  phone: null,
  alternatePhone: null,
  supportThemes: ["school-absence"],
  targetAudiences: ["guardian"],
  whatYouCanConsult: null,
  whoCanUse: null,
  eligibility: null,
  howToUse: null,
  consultationMethods: ["phone"],
  cost: "free",
  costDetail: null,
  reservationRequired: false,
  anonymousConsultation: true,
  guardianOnlyConsultation: true,
  receptionHours: null,
  officialUrl: null,
  imageVariant: "conversation",
  notes: [],
  sourceName: "テスト情報源",
  sourceUrl: null,
  lastCheckedAt: "2026-07-27",
  verificationStatus: "official-verified",
};

test("施設の事実から表示ラベルを導出する", () => {
  assert.deepEqual(
    deriveFeatureLabels(baseFacility).map(({ label }) => label),
    [
      "無料",
      "保護者だけでも相談可",
      "予約不要",
      "匿名相談可",
      "公式情報確認済み",
    ],
  );
});

test("費用が確認できていないときは特徴ラベルに出さない", () => {
  const labels = deriveFeatureLabels({
    ...baseFacility,
    cost: "unknown",
    costDetail: null,
  }).map(({ label }) => label);

  assert.ok(!labels.includes("公式サイトで確認してください"));
  assert.deepEqual(labels, [
    "保護者だけでも相談可",
    "予約不要",
    "匿名相談可",
    "公式情報確認済み",
  ]);
});

test("費用の表現は出典の原文を優先する", () => {
  const labels = deriveFeatureLabels({
    ...baseFacility,
    costDetail: "無料（利用登録が必要）",
  }).map(({ label }) => label);

  assert.equal(labels[0], "無料（利用登録が必要）");
});

test("未掲載の任意情報は共通の案内文へ変換する", () => {
  assert.equal(formatOptionalInformation(null), UNPUBLISHED_INFORMATION_LABEL);
  assert.equal(formatOptionalInformation("   "), UNPUBLISHED_INFORMATION_LABEL);
  assert.equal(formatBooleanInformation(null), UNPUBLISHED_INFORMATION_LABEL);
});

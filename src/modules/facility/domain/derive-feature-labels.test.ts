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

test("未掲載の任意情報は共通の案内文へ変換する", () => {
  assert.equal(formatOptionalInformation(null), UNPUBLISHED_INFORMATION_LABEL);
  assert.equal(formatOptionalInformation("   "), UNPUBLISHED_INFORMATION_LABEL);
  assert.equal(formatBooleanInformation(null), UNPUBLISHED_INFORMATION_LABEL);
});

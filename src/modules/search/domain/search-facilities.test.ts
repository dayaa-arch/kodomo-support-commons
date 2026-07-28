import assert from "node:assert/strict";
import test from "node:test";

import type { Facility } from "../../facility/domain/facility.ts";
import type { Ward } from "../../../shared/domain/wards.ts";
import { searchFacilities } from "./search-facilities.ts";

function createFacility(
  slug: string,
  ward: Ward | null,
  supportThemes: Facility["supportThemes"] = ["school-absence"],
): Facility {
  return {
    slug,
    name: slug,
    operator: "テスト運営者",
    operatingDepartment: null,
    summary: "テスト施設",
    ward,
    address: null,
    phone: null,
    alternatePhone: null,
    supportThemes,
    targetAudiences: ["child"],
    whatYouCanConsult: null,
    whoCanUse: null,
    eligibility: null,
    howToUse: null,
    consultationMethods: ["phone"],
    cost: "free",
    costDetail: null,
    reservationRequired: null,
    anonymousConsultation: false,
    guardianOnlyConsultation: false,
    receptionHours: null,
    officialUrl: null,
    imageVariant: "conversation",
    notes: [],
    sourceName: "テスト情報源",
    sourceUrl: null,
    lastCheckedAt: "2026-07-27",
    verificationStatus: "unverified",
  };
}

test("選択区、隣接区の順で表示し、それ以外の区を除外する", () => {
  const facilities = [
    createFacility("選択区・テーマ不一致", "kohoku", ["family"]),
    createFacility("隣接区・テーマ一致", "tsurumi"),
    createFacility("隣接区・テーマ不一致", "tsuzuki", ["family"]),
    createFacility("対象外の区", "kanazawa"),
  ];

  const results = searchFacilities(facilities, {
    targetAudience: "child",
    supportTheme: "school-absence",
    ward: "kohoku",
  });

  assert.deepEqual(
    results.map(({ facility, locationMatch }) => [facility.slug, locationMatch]),
    [
      ["選択区・テーマ不一致", "selected"],
      ["隣接区・テーマ一致", "adjacent"],
      ["隣接区・テーマ不一致", "adjacent"],
    ],
  );
});

test("区を持たない市域全体の窓口は、選択区の次・隣接区より前に表示する", () => {
  const facilities = [
    createFacility("隣接区", "tsurumi"),
    createFacility("市域全体", null),
    createFacility("選択区", "kohoku"),
  ];

  const results = searchFacilities(facilities, {
    targetAudience: "child",
    supportTheme: "school-absence",
    ward: "kohoku",
  });

  assert.deepEqual(
    results.map(({ facility, locationMatch }) => [facility.slug, locationMatch]),
    [
      ["選択区", "selected"],
      ["市域全体", "citywide"],
      ["隣接区", "adjacent"],
    ],
  );
});

test("市域全体の窓口は、どの区を選んでも結果に含まれる", () => {
  const facilities = [createFacility("市域全体", null)];

  for (const ward of ["kohoku", "kanazawa", "seya"] as const) {
    const results = searchFacilities(facilities, {
      targetAudience: "child",
      supportTheme: "school-absence",
      ward,
    });

    assert.deepEqual(
      results.map(({ facility }) => facility.slug),
      ["市域全体"],
      `${ward} を選んだときに市域全体の窓口が含まれる`,
    );
  }
});

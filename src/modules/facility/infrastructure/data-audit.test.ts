import assert from "node:assert/strict";
import test from "node:test";

import type { EmergencyContact } from "../../../shared/domain/emergency-contacts.ts";
import { collectFreshnessIssues } from "./data-audit.ts";
import type { SeedDataset, SeedProviderRecord } from "./seed-schema.ts";

function createDataset(checkedAt: string): SeedDataset {
  const provider = {
    id: "sample",
    checked_at: checkedAt,
  } as SeedProviderRecord;
  return {
    schema_version: "0.1.0",
    generated_at: "2026-07-27",
    record_count: 1,
    provider_type_counts: { sample: 1 },
    ward_master: [],
    source_catalog: [],
    support_providers: [provider],
  };
}

function createEmergencyContact(checkedAt: string): EmergencyContact {
  return {
    id: "emergency-sample",
    kind: "consultation",
    name: "相談先",
    phone: "0120-000-000",
    availability: "24時間",
    description: "説明",
    sourceName: "公式情報",
    sourceUrl: "https://example.com/",
    lastCheckedAt: checkedAt,
  };
}

test("施設は90日、緊急相談先は30日以内なら問題にしない", () => {
  const issues = collectFreshnessIssues(createDataset("2026-06-08"), {
    today: new Date("2026-09-06T12:00:00Z"),
    emergencyContacts: [createEmergencyContact("2026-08-07")],
  });
  assert.deepEqual(issues, []);
});

test("期限超過と未来日の両方を検出する", () => {
  const staleIssues = collectFreshnessIssues(createDataset("2026-06-07"), {
    today: new Date("2026-09-06T12:00:00Z"),
    emergencyContacts: [createEmergencyContact("2026-08-06")],
  });
  assert.deepEqual(
    staleIssues.map(({ kind, reason }) => [kind, reason]),
    [
      ["facility", "stale"],
      ["emergency", "stale"],
    ],
  );

  const futureIssues = collectFreshnessIssues(createDataset("2026-09-07"), {
    today: new Date("2026-09-06T12:00:00Z"),
    emergencyContacts: [],
  });
  assert.equal(futureIssues[0]?.reason, "future");
});

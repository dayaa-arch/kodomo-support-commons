import {
  CHILD_CONSULTATION_CONTACTS,
  EMERGENCY_CALL_CONTACTS,
  type EmergencyContact,
} from "../../../shared/domain/emergency-contacts.ts";
import type { SeedDataset } from "./seed-schema.ts";

export interface FreshnessIssue {
  readonly kind: "facility" | "emergency";
  readonly id: string;
  readonly checkedAt: string;
  readonly ageInDays: number;
  readonly maximumAgeInDays: number;
  readonly reason: "future" | "stale";
}

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function parseUtcDate(value: string): number {
  return Date.parse(`${value}T00:00:00.000Z`);
}

function inspectDate(
  kind: FreshnessIssue["kind"],
  id: string,
  checkedAt: string,
  maximumAgeInDays: number,
  today: Date,
): FreshnessIssue | null {
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  const ageInDays = Math.floor(
    (todayUtc - parseUtcDate(checkedAt)) / DAY_IN_MILLISECONDS,
  );
  if (ageInDays < 0) {
    return {
      kind,
      id,
      checkedAt,
      ageInDays,
      maximumAgeInDays,
      reason: "future",
    };
  }
  if (ageInDays > maximumAgeInDays) {
    return {
      kind,
      id,
      checkedAt,
      ageInDays,
      maximumAgeInDays,
      reason: "stale",
    };
  }
  return null;
}

export function collectFreshnessIssues(
  dataset: SeedDataset,
  options: {
    readonly today?: Date;
    readonly emergencyContacts?: readonly EmergencyContact[];
  } = {},
): readonly FreshnessIssue[] {
  const today = options.today ?? new Date();
  const emergencyContacts =
    options.emergencyContacts ??
    [...CHILD_CONSULTATION_CONTACTS, ...EMERGENCY_CALL_CONTACTS];
  const issues: FreshnessIssue[] = [];

  for (const provider of dataset.support_providers) {
    const issue = inspectDate(
      "facility",
      provider.id,
      provider.checked_at,
      90,
      today,
    );
    if (issue) issues.push(issue);
  }

  for (const contact of emergencyContacts) {
    const issue = inspectDate(
      "emergency",
      contact.id,
      contact.lastCheckedAt,
      30,
      today,
    );
    if (issue) issues.push(issue);
  }

  return issues;
}

export function assertDatasetFreshness(
  dataset: SeedDataset,
  options: Parameters<typeof collectFreshnessIssues>[1] = {},
): void {
  const issues = collectFreshnessIssues(dataset, options);
  if (issues.length === 0) return;

  const details = issues
    .map((issue) => {
      if (issue.reason === "future") {
        return `${issue.kind}:${issue.id} の確認日 ${issue.checkedAt} が未来です`;
      }
      return `${issue.kind}:${issue.id} は最終確認から ${issue.ageInDays} 日経過しています（上限 ${issue.maximumAgeInDays} 日）`;
    })
    .join("\n- ");
  throw new Error(`情報鮮度の監査に失敗しました:\n- ${details}`);
}

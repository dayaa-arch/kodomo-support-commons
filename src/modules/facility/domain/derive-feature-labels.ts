import {
  COST_LABELS,
  VERIFICATION_STATUS_LABELS,
  type Facility,
} from "./facility.ts";

export type FeatureLabelTone = "blue" | "green" | "orange" | "purple" | "gray";

export interface FeatureLabel {
  readonly label: string;
  readonly tone: FeatureLabelTone;
}

export function deriveFeatureLabels(facility: Facility): readonly FeatureLabel[] {
  const labels: FeatureLabel[] = [
    {
      label: COST_LABELS[facility.cost],
      tone: facility.cost === "free" ? "green" : "gray",
    },
  ];

  if (facility.guardianOnlyConsultation === true) {
    labels.push({ label: "保護者だけでも相談可", tone: "orange" });
  }

  if (facility.reservationRequired !== null) {
    labels.push({
      label: facility.reservationRequired ? "予約制" : "予約不要",
      tone: "blue",
    });
  }

  if (facility.anonymousConsultation === true) {
    labels.push({ label: "匿名相談可", tone: "purple" });
  }

  labels.push({
    label: VERIFICATION_STATUS_LABELS[facility.verificationStatus],
    tone: facility.verificationStatus === "unverified" ? "gray" : "green",
  });

  return labels;
}

export const UNPUBLISHED_INFORMATION_LABEL = "公式サイトで確認してください";

export function formatOptionalInformation(value: string | null): string {
  return value?.trim() ? value : UNPUBLISHED_INFORMATION_LABEL;
}

export function formatBooleanInformation(value: boolean | null): string {
  if (value === null) {
    return UNPUBLISHED_INFORMATION_LABEL;
  }

  return value ? "利用できます" : "利用できません";
}

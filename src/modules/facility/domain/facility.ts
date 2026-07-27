import type {
  ConsultationMethod,
  SupportTheme,
  TargetAudience,
} from "../../../shared/domain/support-taxonomy.ts";
import type { Ward } from "../../../shared/domain/wards.ts";

export const COST_LABELS = {
  free: "無料",
  partial: "一部有料",
  paid: "有料",
  unknown: "費用は要確認",
} as const;

export type Cost = keyof typeof COST_LABELS;

export const VERIFICATION_STATUS_LABELS = {
  "operator-verified": "運営者確認済み",
  "official-verified": "公式情報確認済み",
  unverified: "未確認",
} as const;

export type VerificationStatus = keyof typeof VERIFICATION_STATUS_LABELS;

export type FacilityImageVariant = "conversation" | "community" | "learning";

export interface Facility {
  readonly slug: string;
  readonly name: string;
  readonly operator: string;
  readonly operatingDepartment: string | null;
  readonly summary: string;
  readonly ward: Ward;
  readonly supportThemes: readonly SupportTheme[];
  readonly targetAudiences: readonly TargetAudience[];
  readonly whatYouCanConsult: string | null;
  readonly whoCanUse: string | null;
  readonly eligibility: string | null;
  readonly howToUse: string | null;
  readonly consultationMethods: readonly ConsultationMethod[];
  readonly cost: Cost;
  readonly reservationRequired: boolean | null;
  readonly anonymousConsultation: boolean | null;
  readonly guardianOnlyConsultation: boolean | null;
  readonly receptionHours: string | null;
  readonly officialUrl: string | null;
  readonly imageVariant: FacilityImageVariant;
  readonly sourceName: string;
  readonly sourceUrl: string | null;
  readonly lastCheckedAt: string;
  readonly verificationStatus: VerificationStatus;
}

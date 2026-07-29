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
  unknown: "公式サイトで確認してください",
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
  readonly operator: string | null;
  readonly operatingDepartment: string | null;
  readonly summary: string | null;
  /** null は特定の区に属さない市域全体の窓口を表す。 */
  readonly ward: Ward | null;
  readonly address: string | null;
  readonly phone: string | null;
  readonly alternatePhone: string | null;
  readonly supportThemes: readonly SupportTheme[];
  readonly targetAudiences: readonly TargetAudience[];
  readonly whatYouCanConsult: string | null;
  readonly whoCanUse: string | null;
  readonly eligibility: string | null;
  readonly howToUse: string | null;
  readonly consultationMethods: readonly ConsultationMethod[];
  readonly cost: Cost;
  /** 費用の補足（例: 「無料（利用登録が必要）」）。出典の表現をそのまま保持する。 */
  readonly costDetail: string | null;
  readonly reservationRequired: boolean | null;
  readonly anonymousConsultation: boolean | null;
  readonly guardianOnlyConsultation: boolean | null;
  readonly receptionHours: string | null;
  readonly officialUrl: string | null;
  readonly imageVariant: FacilityImageVariant;
  readonly notes: readonly string[];
  readonly sourceName: string;
  readonly sourceUrl: string | null;
  readonly lastCheckedAt: string;
  readonly verificationStatus: VerificationStatus;
}

/** 特定の区に属さず、市域全体を対象とする窓口かどうか。 */
export function isCitywideFacility(facility: Facility): boolean {
  return facility.ward === null;
}

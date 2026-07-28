import type {
  ConsultationMethod,
  SupportTheme,
  TargetAudience,
} from "../../../shared/domain/support-taxonomy.ts";
import type { Ward } from "../../../shared/domain/wards.ts";
import type {
  Cost,
  Facility,
  FacilityImageVariant,
  VerificationStatus,
} from "../domain/facility.ts";
import type {
  SeedConsultationMethodCode,
  SeedDataset,
  SeedProviderRecord,
  SeedTargetUserCode,
  SeedThemeCode,
  SeedVerificationStatusCode,
} from "./seed-schema.ts";

/**
 * 検証済みの正本レコードをドメイン型 Facility へ写像する。
 *
 * ここでの変換はコード値の対応付けに限り、事実情報の推測・補完は行わない。
 * 出典に無い項目は null のまま残し、表示側で「公式サイトで確認してください」に委ねる。
 */

const THEME_MAP: Readonly<Record<SeedThemeCode, SupportTheme>> = {
  school_attendance: "school-absence",
  mood_anxiety: "low-mood",
  family_parent_child: "family",
  bullying_friendship: "bullying",
  living_financial: "livelihood",
  caregiving_young_carer: "caregiving",
  other: "other",
};

/**
 * 対象者コードの対応。
 * young_person（若者本人）は Q1 の「子ども本人」に、
 * general_public（その他・一般）は「その他」に寄せる。
 */
const TARGET_AUDIENCE_MAP: Readonly<Record<SeedTargetUserCode, TargetAudience>> = {
  child: "child",
  parent_family: "guardian",
  school_staff: "school",
  supporter: "supporter",
  young_person: "child",
  general_public: "other",
};

const CONSULTATION_METHOD_MAP: Readonly<
  Record<SeedConsultationMethodCode, ConsultationMethod>
> = {
  phone: "phone",
  in_person: "inperson",
  line: "line",
  web_form: "web-form",
  phone_callback: "phone-callback",
};

const VERIFICATION_STATUS_MAP: Readonly<
  Record<SeedVerificationStatusCode, VerificationStatus>
> = {
  operator_verified: "operator-verified",
  official_source: "official-verified",
  unverified: "unverified",
};

/** 詳細ページの挿絵。事実情報ではなく装飾のため、提供種別から決定的に選ぶ。 */
const IMAGE_VARIANT_BY_PROVIDER_TYPE: Readonly<
  Record<string, FacilityImageVariant>
> = {
  regional_childrearing_hub: "community",
  school_refusal_support: "learning",
  education_consultation: "learning",
  youth_online_consultation: "learning",
};

function toImageVariant(providerType: string): FacilityImageVariant {
  return IMAGE_VARIANT_BY_PROVIDER_TYPE[providerType] ?? "conversation";
}

/**
 * 費用の記述から区分を導く。
 * 出典が空欄なら unknown のままにし、「無料」と読み取れる場合のみ free とする。
 * 元の表現（例:「無料（利用登録が必要）」）は costDetail に保持する。
 */
export function toCost(rawCost: string | null): Cost {
  if (rawCost === null) {
    return "unknown";
  }
  if (rawCost.includes("無料")) {
    return "free";
  }
  return "unknown";
}

function unique<T>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

export function toFacility(
  record: SeedProviderRecord,
  sourceTitleByProviderType: ReadonlyMap<string, string>,
): Facility {
  return {
    slug: record.id,
    name: record.name,
    operator: record.operator,
    operatingDepartment: null,
    // 正本に概要文がないため補完しない（推測で書かない）。
    summary: null,
    ward: (record.ward_code as Ward | null) ?? null,
    address: record.address,
    phone: record.phone,
    alternatePhone: record.alternate_phone,
    supportThemes: unique(record.themes.map((theme) => THEME_MAP[theme])),
    targetAudiences: unique(
      record.target_users.map((user) => TARGET_AUDIENCE_MAP[user]),
    ),
    whatYouCanConsult: null,
    whoCanUse: record.target_age,
    eligibility: null,
    howToUse: null,
    consultationMethods: unique(
      record.consultation_methods.map((method) => CONSULTATION_METHOD_MAP[method]),
    ),
    cost: toCost(record.cost),
    costDetail: record.cost,
    reservationRequired: record.reservation_required,
    anonymousConsultation: record.anonymous_available,
    guardianOnlyConsultation: record.parent_only_consultation,
    receptionHours: record.hours,
    officialUrl: record.official_site_url,
    imageVariant: toImageVariant(record.provider_type),
    notes: record.notes ?? [],
    sourceName:
      sourceTitleByProviderType.get(record.provider_type) ?? "横浜市 公式情報",
    sourceUrl: record.source_url,
    lastCheckedAt: record.checked_at,
    verificationStatus: VERIFICATION_STATUS_MAP[record.verification_status],
  };
}

export function toFacilities(dataset: SeedDataset): readonly Facility[] {
  const sourceTitleByProviderType = new Map(
    dataset.source_catalog.map((entry) => [entry.id, entry.title]),
  );

  return dataset.support_providers.map((record) =>
    toFacility(record, sourceTitleByProviderType),
  );
}

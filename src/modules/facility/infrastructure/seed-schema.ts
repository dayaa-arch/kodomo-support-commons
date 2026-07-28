import { WARD_OPTIONS } from "../../../shared/domain/wards.ts";

/**
 * 正本データセット（data/seed/*.json）の形と検証。
 *
 * ここは infrastructure の境界であり、外部データの構造を知ってよい唯一の場所。
 * 検証を通ったレコードだけが seed-mapper でドメイン型へ写像される。
 */

export const SEED_THEME_CODES = [
  "school_attendance",
  "mood_anxiety",
  "family_parent_child",
  "bullying_friendship",
  "living_financial",
  "caregiving_young_carer",
  "other",
] as const;

export type SeedThemeCode = (typeof SEED_THEME_CODES)[number];

export const SEED_TARGET_USER_CODES = [
  "child",
  "parent_family",
  "school_staff",
  "supporter",
  "young_person",
  "general_public",
] as const;

export type SeedTargetUserCode = (typeof SEED_TARGET_USER_CODES)[number];

export const SEED_CONSULTATION_METHOD_CODES = [
  "phone",
  "in_person",
  "line",
  "web_form",
  "phone_callback",
] as const;

export type SeedConsultationMethodCode =
  (typeof SEED_CONSULTATION_METHOD_CODES)[number];

export const SEED_VERIFICATION_STATUS_CODES = [
  "operator_verified",
  "official_source",
  "unverified",
] as const;

export type SeedVerificationStatusCode =
  (typeof SEED_VERIFICATION_STATUS_CODES)[number];

const SEED_WARD_CODES = WARD_OPTIONS.map((option) => option.value);

export interface SeedProviderRecord {
  readonly id: string;
  readonly name: string;
  readonly provider_type: string;
  readonly ward_code: string | null;
  readonly ward_name: string | null;
  readonly address: string | null;
  readonly phone: string | null;
  readonly alternate_phone: string | null;
  readonly consultation_methods: readonly SeedConsultationMethodCode[];
  readonly themes: readonly SeedThemeCode[];
  readonly target_users: readonly SeedTargetUserCode[];
  readonly target_age: string | null;
  readonly cost: string | null;
  readonly reservation_required: boolean | null;
  readonly anonymous_available: boolean | null;
  readonly parent_only_consultation: boolean | null;
  readonly hours: string | null;
  readonly operator: string | null;
  readonly official_site_url: string | null;
  readonly source_url: string;
  readonly source_updated_at: string | null;
  readonly checked_at: string;
  readonly verification_status: SeedVerificationStatusCode;
  readonly notes: readonly string[] | null;
}

export interface SeedSourceCatalogEntry {
  readonly id: string;
  readonly title: string;
  readonly url: string;
}

export interface SeedDataset {
  readonly schema_version: string;
  readonly source_catalog: readonly SeedSourceCatalogEntry[];
  readonly support_providers: readonly SeedProviderRecord[];
}

/** 正本データが不正なときに投げる。ビルドを失敗させて公開を防ぐ。 */
export class SeedValidationError extends Error {
  constructor(message: string) {
    super(`正本データセットの検証に失敗しました: ${message}`);
    this.name = "SeedValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(
  value: unknown,
  where: string,
  field: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    return fail(where, field, `文字列が必要ですが ${describe(value)} でした`);
  }
  return value;
}

function optionalString(
  value: unknown,
  where: string,
  field: string,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    return fail(where, field, `文字列か null が必要ですが ${describe(value)} でした`);
  }
  return value;
}

function optionalBoolean(
  value: unknown,
  where: string,
  field: string,
): boolean | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "boolean") {
    return fail(where, field, `真偽値か null が必要ですが ${describe(value)} でした`);
  }
  return value;
}

function requireEnumArray<T extends string>(
  value: unknown,
  allowed: readonly T[],
  where: string,
  field: string,
): readonly T[] {
  if (!Array.isArray(value)) {
    return fail(where, field, `配列が必要ですが ${describe(value)} でした`);
  }
  return value.map((entry) => {
    if (typeof entry !== "string" || !allowed.includes(entry as T)) {
      return fail(
        where,
        field,
        `未知の値 ${describe(entry)} が含まれています（許可値: ${allowed.join(", ")}）`,
      );
    }
    return entry as T;
  });
}

function optionalStringArray(
  value: unknown,
  where: string,
  field: string,
): readonly string[] | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!Array.isArray(value)) {
    return fail(where, field, `配列か null が必要ですが ${describe(value)} でした`);
  }
  return value.map((entry, index) =>
    requireString(entry, where, `${field}[${index}]`),
  );
}

function describe(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `"${value}"`;
  if (Array.isArray(value)) return "配列";
  if (typeof value === "object") return "オブジェクト";
  return String(value);
}

function fail(where: string, field: string, reason: string): never {
  throw new SeedValidationError(`${where} の ${field}: ${reason}`);
}

function validateProviderRecord(
  value: unknown,
  index: number,
): SeedProviderRecord {
  if (!isRecord(value)) {
    throw new SeedValidationError(
      `support_providers[${index}]: オブジェクトが必要ですが ${describe(value)} でした`,
    );
  }

  const id = requireString(value.id, `support_providers[${index}]`, "id");
  const where = `support_providers[${index}] (id: ${id})`;

  const wardCode = optionalString(value.ward_code, where, "ward_code");
  if (wardCode !== null && !SEED_WARD_CODES.includes(wardCode as never)) {
    fail(
      where,
      "ward_code",
      `未知の区コード "${wardCode}" です（許可値: ${SEED_WARD_CODES.join(", ")} または null）`,
    );
  }

  const verificationStatus = requireString(
    value.verification_status,
    where,
    "verification_status",
  );
  if (
    !SEED_VERIFICATION_STATUS_CODES.includes(
      verificationStatus as SeedVerificationStatusCode,
    )
  ) {
    fail(
      where,
      "verification_status",
      `未知の値 "${verificationStatus}" です（許可値: ${SEED_VERIFICATION_STATUS_CODES.join(", ")}）`,
    );
  }

  return {
    id,
    name: requireString(value.name, where, "name"),
    provider_type: requireString(value.provider_type, where, "provider_type"),
    ward_code: wardCode,
    ward_name: optionalString(value.ward_name, where, "ward_name"),
    address: optionalString(value.address, where, "address"),
    phone: optionalString(value.phone, where, "phone"),
    alternate_phone: optionalString(value.alternate_phone, where, "alternate_phone"),
    consultation_methods: requireEnumArray(
      value.consultation_methods,
      SEED_CONSULTATION_METHOD_CODES,
      where,
      "consultation_methods",
    ),
    themes: requireEnumArray(value.themes, SEED_THEME_CODES, where, "themes"),
    target_users: requireEnumArray(
      value.target_users,
      SEED_TARGET_USER_CODES,
      where,
      "target_users",
    ),
    target_age: optionalString(value.target_age, where, "target_age"),
    cost: optionalString(value.cost, where, "cost"),
    reservation_required: optionalBoolean(
      value.reservation_required,
      where,
      "reservation_required",
    ),
    anonymous_available: optionalBoolean(
      value.anonymous_available,
      where,
      "anonymous_available",
    ),
    parent_only_consultation: optionalBoolean(
      value.parent_only_consultation,
      where,
      "parent_only_consultation",
    ),
    hours: optionalString(value.hours, where, "hours"),
    operator: optionalString(value.operator, where, "operator"),
    official_site_url: optionalString(value.official_site_url, where, "official_site_url"),
    source_url: requireString(value.source_url, where, "source_url"),
    source_updated_at: optionalString(value.source_updated_at, where, "source_updated_at"),
    checked_at: requireString(value.checked_at, where, "checked_at"),
    verification_status: verificationStatus as SeedVerificationStatusCode,
    notes: optionalStringArray(value.notes, where, "notes"),
  };
}

function validateSourceCatalogEntry(
  value: unknown,
  index: number,
): SeedSourceCatalogEntry {
  if (!isRecord(value)) {
    throw new SeedValidationError(
      `source_catalog[${index}]: オブジェクトが必要ですが ${describe(value)} でした`,
    );
  }

  const where = `source_catalog[${index}]`;
  return {
    id: requireString(value.id, where, "id"),
    title: requireString(value.title, where, "title"),
    url: requireString(value.url, where, "url"),
  };
}

/**
 * 正本データセットを検証する。
 * 必須項目の欠落・未知の enum 値・id 重複があれば SeedValidationError を投げる。
 */
export function validateSeedDataset(input: unknown): SeedDataset {
  if (!isRecord(input)) {
    throw new SeedValidationError(
      `トップレベルはオブジェクトが必要ですが ${describe(input)} でした`,
    );
  }

  const schemaVersion = requireString(
    input.schema_version,
    "データセット",
    "schema_version",
  );

  if (!Array.isArray(input.support_providers)) {
    throw new SeedValidationError(
      `データセット の support_providers: 配列が必要ですが ${describe(input.support_providers)} でした`,
    );
  }

  if (!Array.isArray(input.source_catalog)) {
    throw new SeedValidationError(
      `データセット の source_catalog: 配列が必要ですが ${describe(input.source_catalog)} でした`,
    );
  }

  const supportProviders = input.support_providers.map(validateProviderRecord);

  const seenIds = new Set<string>();
  for (const provider of supportProviders) {
    if (seenIds.has(provider.id)) {
      throw new SeedValidationError(
        `support_providers の id "${provider.id}" が重複しています。id は URL の識別子になるため一意である必要があります`,
      );
    }
    seenIds.add(provider.id);
  }

  return {
    schema_version: schemaVersion,
    source_catalog: input.source_catalog.map(validateSourceCatalogEntry),
    support_providers: supportProviders,
  };
}

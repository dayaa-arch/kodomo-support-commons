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

export interface SeedWardEntry {
  readonly code: string;
  readonly name: string;
}

export interface SeedDataset {
  readonly schema_version: string;
  readonly generated_at: string;
  readonly record_count: number;
  readonly provider_type_counts: Readonly<Record<string, number>>;
  readonly ward_master: readonly SeedWardEntry[];
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
  if (typeof value !== "string" || value.trim() === "") {
    return fail(where, field, `文字列か null が必要ですが ${describe(value)} でした`);
  }
  return value;
}

function requireInteger(value: unknown, where: string, field: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    return fail(where, field, `0以上の整数が必要ですが ${describe(value)} でした`);
  }
  return value;
}

function requireIsoDate(value: unknown, where: string, field: string): string {
  const date = requireString(value, where, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return fail(where, field, `YYYY-MM-DD 形式の日付が必要ですが "${date}" でした`);
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year!, month! - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month! - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return fail(where, field, `実在する日付が必要ですが "${date}" でした`);
  }
  return date;
}

function optionalIsoDate(
  value: unknown,
  where: string,
  field: string,
): string | null {
  if (value === null || value === undefined) return null;
  return requireIsoDate(value, where, field);
}

function requireHttpUrl(value: unknown, where: string, field: string): string {
  const url = requireString(value, where, field);
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return fail(where, field, `正しい URL が必要ですが "${url}" でした`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return fail(where, field, `http(s) URL が必要ですが "${url}" でした`);
  }
  return url;
}

function optionalHttpUrl(
  value: unknown,
  where: string,
  field: string,
): string | null {
  if (value === null || value === undefined) return null;
  return requireHttpUrl(value, where, field);
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
  if (value.length === 0) {
    return fail(where, field, "1件以上の値が必要です");
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
  const wardName = optionalString(value.ward_name, where, "ward_name");
  if ((wardCode === null) !== (wardName === null)) {
    fail(where, "ward_name", "ward_code と ward_name は両方 null または両方指定してください");
  }
  if (wardCode !== null) {
    const expectedWardName = WARD_OPTIONS.find(
      (option) => option.value === wardCode,
    )?.label;
    if (wardName !== expectedWardName) {
      fail(
        where,
        "ward_name",
        `区コード "${wardCode}" に対応する区名は "${expectedWardName}" ですが ${describe(wardName)} でした`,
      );
    }
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    fail(where, "id", `URL に使える英小文字・数字・ハイフン形式が必要ですが "${id}" でした`);
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
    ward_name: wardName,
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
    official_site_url: optionalHttpUrl(
      value.official_site_url,
      where,
      "official_site_url",
    ),
    source_url: requireHttpUrl(value.source_url, where, "source_url"),
    source_updated_at: optionalIsoDate(
      value.source_updated_at,
      where,
      "source_updated_at",
    ),
    checked_at: requireIsoDate(value.checked_at, where, "checked_at"),
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
    url: requireHttpUrl(value.url, where, "url"),
  };
}

function validateWardEntry(value: unknown, index: number): SeedWardEntry {
  if (!isRecord(value)) {
    throw new SeedValidationError(
      `ward_master[${index}]: オブジェクトが必要ですが ${describe(value)} でした`,
    );
  }
  const where = `ward_master[${index}]`;
  return {
    code: requireString(value.code, where, "code"),
    name: requireString(value.name, where, "name"),
  };
}

function validateCountMap(value: unknown): Readonly<Record<string, number>> {
  if (!isRecord(value)) {
    throw new SeedValidationError(
      `データセット の provider_type_counts: オブジェクトが必要ですが ${describe(value)} でした`,
    );
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, count]) => [
      key,
      requireInteger(count, "provider_type_counts", key),
    ]),
  );
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
  const generatedAt = requireIsoDate(
    input.generated_at,
    "データセット",
    "generated_at",
  );
  const recordCount = requireInteger(
    input.record_count,
    "データセット",
    "record_count",
  );
  const providerTypeCounts = validateCountMap(input.provider_type_counts);

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
  if (!Array.isArray(input.ward_master)) {
    throw new SeedValidationError(
      `データセット の ward_master: 配列が必要ですが ${describe(input.ward_master)} でした`,
    );
  }

  const sourceCatalog = input.source_catalog.map(validateSourceCatalogEntry);
  const wardMaster = input.ward_master.map(validateWardEntry);
  const supportProviders = input.support_providers.map(validateProviderRecord);

  if (recordCount !== supportProviders.length) {
    throw new SeedValidationError(
      `record_count は ${recordCount} ですが support_providers は ${supportProviders.length} 件です`,
    );
  }

  const expectedWards = WARD_OPTIONS.map(({ value, label }) => ({
    code: value,
    name: label,
  }));
  if (JSON.stringify(wardMaster) !== JSON.stringify(expectedWards)) {
    throw new SeedValidationError(
      "ward_master がアプリケーションの18区マスタと一致しません",
    );
  }

  const actualProviderTypeCounts: Record<string, number> = {};
  for (const provider of supportProviders) {
    actualProviderTypeCounts[provider.provider_type] =
      (actualProviderTypeCounts[provider.provider_type] ?? 0) + 1;
  }
  const sortedCounts = (counts: Readonly<Record<string, number>>) =>
    Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
  if (
    JSON.stringify(sortedCounts(providerTypeCounts)) !==
    JSON.stringify(sortedCounts(actualProviderTypeCounts))
  ) {
    throw new SeedValidationError(
      "provider_type_counts が support_providers の実件数と一致しません",
    );
  }

  const seenIds = new Set<string>();
  const seenSpecificOfficialUrls = new Map<string, string>();
  for (const provider of supportProviders) {
    if (seenIds.has(provider.id)) {
      throw new SeedValidationError(
        `support_providers の id "${provider.id}" が重複しています。id は URL の識別子になるため一意である必要があります`,
      );
    }
    seenIds.add(provider.id);

    if (
      provider.official_site_url &&
      provider.official_site_url !== provider.source_url
    ) {
      const existingId = seenSpecificOfficialUrls.get(provider.official_site_url);
      if (existingId) {
        throw new SeedValidationError(
          `個別の公式 URL "${provider.official_site_url}" が ${existingId} と ${provider.id} で重複しています`,
        );
      }
      seenSpecificOfficialUrls.set(provider.official_site_url, provider.id);
    }
  }

  const sourceIds = new Set<string>();
  const sourceUrls = new Set<string>();
  for (const source of sourceCatalog) {
    if (sourceIds.has(source.id)) {
      throw new SeedValidationError(`source_catalog の id "${source.id}" が重複しています`);
    }
    if (sourceUrls.has(source.url)) {
      throw new SeedValidationError(`source_catalog の URL "${source.url}" が重複しています`);
    }
    sourceIds.add(source.id);
    sourceUrls.add(source.url);
  }
  for (const provider of supportProviders) {
    if (!sourceUrls.has(provider.source_url)) {
      throw new SeedValidationError(
        `${provider.id} の source_url "${provider.source_url}" が source_catalog にありません`,
      );
    }
  }

  return {
    schema_version: schemaVersion,
    generated_at: generatedAt,
    record_count: recordCount,
    provider_type_counts: providerTypeCounts,
    ward_master: wardMaster,
    source_catalog: sourceCatalog,
    support_providers: supportProviders,
  };
}

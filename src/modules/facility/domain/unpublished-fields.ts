import type { Facility } from "./facility.ts";

/**
 * 出典で確認できなかった項目のラベル一覧。
 *
 * 値が無い項目を画面から黙って消すと「情報が無い」ことが利用者に伝わらないため、
 * 項目名を列挙して明示する。推測で内容を補うことはしない。
 */
export function collectUnpublishedFields(facility: Facility): readonly string[] {
  const fields: { readonly label: string; readonly value: unknown }[] = [
    { label: "施設の概要", value: facility.summary },
    { label: "何を相談できるか", value: facility.whatYouCanConsult },
    { label: "誰が利用できるか", value: facility.whoCanUse },
    { label: "利用までの流れ", value: facility.howToUse },
    { label: "利用条件", value: facility.eligibility },
    { label: "費用", value: facility.cost === "unknown" ? null : facility.cost },
    { label: "予約の要否", value: facility.reservationRequired },
    { label: "匿名で相談できるか", value: facility.anonymousConsultation },
    { label: "保護者だけで相談できるか", value: facility.guardianOnlyConsultation },
    { label: "受付時間", value: facility.receptionHours },
    { label: "電話番号", value: facility.phone },
    { label: "所在地", value: facility.address },
  ];

  return fields
    .filter(({ value }) => !isPublished(value))
    .map(({ label }) => label);
}

function isPublished(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim() !== "";
  }
  return true;
}

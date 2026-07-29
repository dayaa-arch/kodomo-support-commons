/**
 * 表示用の電話番号から発信リンクの値を作る。
 * 例: 「0120-0-78310」→「tel:0120078310」
 *
 * 相談方法が電話中心のため、施設・緊急連絡先の双方で同じ扱いにする。
 */
export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

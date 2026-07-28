export const TARGET_AUDIENCE_OPTIONS = [
  {
    value: "child",
    label: "子ども本人",
    description: "自分のことを相談したい",
  },
  {
    value: "guardian",
    label: "自分の子ども・家族",
    description: "保護者・家族として探したい",
  },
  {
    value: "school",
    label: "学校の児童・生徒",
    description: "学校関係者として探したい",
  },
  {
    value: "supporter",
    label: "支援している子ども",
    description: "支援者として探したい",
  },
  {
    value: "other",
    label: "その他",
    description: "上の選択肢に当てはまらない",
  },
] as const;

export type TargetAudience = (typeof TARGET_AUDIENCE_OPTIONS)[number]["value"];

export const SUPPORT_THEME_OPTIONS = [
  {
    value: "school-absence",
    label: "学校に行けない・行きづらい",
  },
  {
    value: "low-mood",
    label: "気分の落ち込み・不安",
  },
  {
    value: "family",
    label: "家庭や親子関係",
  },
  {
    value: "bullying",
    label: "いじめ・友人関係",
  },
  {
    value: "livelihood",
    label: "生活や経済面",
  },
  {
    value: "caregiving",
    label: "子どもの世話や家族のケア",
  },
  {
    value: "other",
    label: "その他",
  },
] as const;

export type SupportTheme = (typeof SUPPORT_THEME_OPTIONS)[number]["value"];

export const CONSULTATION_METHOD_LABELS = {
  phone: "電話",
  inperson: "対面",
  online: "オンライン",
  email: "メール",
  chat: "チャット",
  line: "LINE",
  "web-form": "Webフォーム",
  "phone-callback": "電話での折り返し",
} as const;

export type ConsultationMethod = keyof typeof CONSULTATION_METHOD_LABELS;

export function getTargetAudienceLabel(value: TargetAudience): string {
  return (
    TARGET_AUDIENCE_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}

export function getSupportThemeLabel(value: SupportTheme): string {
  return SUPPORT_THEME_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

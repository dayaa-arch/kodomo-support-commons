/**
 * 今すぐ助けが必要なときの連絡先。
 *
 * 施設検索の対象ではなく、サイト全体で固定して案内する情報のため、
 * 区マスタ（wards.ts）と同じくリファレンスデータとして持つ。
 * 掲載内容は公的機関の公開情報に基づき、推測で補わない。
 */

export interface EmergencyContact {
  readonly id: string;
  readonly kind: "consultation" | "emergency";
  readonly name: string;
  /** 表示用の電話番号（ハイフンあり）。 */
  readonly phone: string;
  /** 受付時間・対象など、かける前に知っておきたい条件。 */
  readonly availability: string;
  /** 利用者向けの説明。掲載元の案内をそのまま伝える。 */
  readonly description: string;
  readonly sourceName: string;
  readonly sourceUrl: string;
  /** 公式情報を最後に確認した日（YYYY-MM-DD）。 */
  readonly lastCheckedAt: string;
}

/** 子ども本人や家族が相談できる窓口。 */
export const CHILD_CONSULTATION_CONTACTS: readonly EmergencyContact[] = [
  {
    id: "emergency-child-sos-24h",
    kind: "consultation",
    name: "24時間子供SOSダイヤル",
    phone: "0120-0-78310",
    availability: "24時間・年中無休・通話無料",
    description:
      "いじめや学校生活の悩みなどを24時間いつでも無料で相談できる",
    sourceName: "文部科学省「24時間子供SOSダイヤル」",
    sourceUrl:
      "https://www.mext.go.jp/a_menu/shotou/seitoshidou/1306988.htm",
    lastCheckedAt: "2026-09-06",
  },
  {
    id: "emergency-childline",
    kind: "consultation",
    name: "チャイルドライン",
    phone: "0120-99-7777",
    availability:
      "18歳まで・毎日16時〜21時（12月29日〜1月3日は休み）・通話無料",
    description:
      "チャイルドラインは子どものための相談先です。ちょっとしたことでも、おしゃべりしたいだけでも大丈夫。どんなことでも話してね。",
    sourceName: "チャイルドライン支援センター",
    sourceUrl: "https://childline.or.jp/tel/",
    lastCheckedAt: "2026-09-06",
  },
  {
    id: "emergency-child-abuse-189",
    kind: "consultation",
    name: "児童相談所虐待対応ダイヤル 189",
    phone: "189",
    availability: "24時間・通話無料・匿名で相談可",
    description:
      "虐待かもしれないと思ったときに、近くの児童相談所へ相談・通告できる",
    sourceName: "こども家庭庁「児童相談所虐待対応ダイヤル189」",
    sourceUrl:
      "https://www.cfa.go.jp/policies/jidougyakutai/gyakutai-taiou-dial/",
    lastCheckedAt: "2026-09-06",
  },
  {
    id: "emergency-yokohama-child-abuse",
    kind: "consultation",
    name: "よこはま子ども虐待ホットライン",
    phone: "0120-805-240",
    availability: "24時間・通話無料・匿名で相談可",
    description:
      "横浜市で、子どもの虐待について相談・通告したいときの窓口",
    sourceName: "横浜市「こども虐待の相談・通告・情報提供先」",
    sourceUrl:
      "https://www.city.yokohama.lg.jp/kosodate-kyoiku/oyakokenko/DV/gyakutaisoudan.html",
    lastCheckedAt: "2026-09-06",
  },
];

/** いのちや身体に関わる危険があるときの通報先。相談窓口とは性質が異なるため分けて扱う。 */
export const EMERGENCY_CALL_CONTACTS: readonly EmergencyContact[] = [
  {
    id: "emergency-police-110",
    kind: "emergency",
    name: "110番（警察）",
    phone: "110",
    availability: "24時間",
    description: "事件や事故など、身の危険があるとき",
    sourceName: "横浜市「緊急通報」",
    sourceUrl:
      "https://www.city.yokohama.lg.jp/lang/residents/living-guide/emergency/110-119.html",
    lastCheckedAt: "2026-09-06",
  },
  {
    id: "emergency-fire-ambulance-119",
    kind: "emergency",
    name: "119番（救急・消防）",
    phone: "119",
    availability: "24時間",
    description: "けがや急な体調の悪化があるとき",
    sourceName: "横浜市「緊急通報」",
    sourceUrl:
      "https://www.city.yokohama.lg.jp/lang/residents/living-guide/emergency/110-119.html",
    lastCheckedAt: "2026-09-06",
  },
];

/**
 * 今すぐ助けが必要なときの連絡先。
 *
 * 施設検索の対象ではなく、サイト全体で固定して案内する情報のため、
 * 区マスタ（wards.ts）と同じくリファレンスデータとして持つ。
 * 掲載内容は公的機関の公開情報に基づき、推測で補わない。
 */

export interface EmergencyContact {
  readonly name: string;
  /** 表示用の電話番号（ハイフンあり）。 */
  readonly phone: string;
  /** 受付時間・対象など、かける前に知っておきたい条件。 */
  readonly availability: string;
  /** 利用者向けの説明。掲載元の案内をそのまま伝える。 */
  readonly description: string;
}

/** 子ども本人や家族が相談できる窓口。 */
export const CHILD_CONSULTATION_CONTACTS: readonly EmergencyContact[] = [
  {
    name: "24時間こどもSOSダイヤル",
    phone: "0120-0-78310",
    availability: "24時間365日・通話無料",
    description:
      "いじめや学校生活の悩みなどを24時間いつでも無料で相談できる",
  },
  {
    name: "チャイルドライン",
    phone: "0120-99-7777",
    availability: "18歳まで・毎日16時〜21時・通話無料",
    description:
      "チャイルドラインは子どものための相談先です。ちょっとしたことでも、おしゃべりしたいだけでも大丈夫。どんなことでも話してね。",
  },
];

/** いのちや身体に関わる危険があるときの通報先。相談窓口とは性質が異なるため分けて扱う。 */
export const EMERGENCY_CALL_CONTACTS: readonly EmergencyContact[] = [
  {
    name: "110番（警察）",
    phone: "110",
    availability: "24時間",
    description: "事件や事故など、身の危険があるとき",
  },
  {
    name: "119番（救急・消防）",
    phone: "119",
    availability: "24時間",
    description: "けがや急な体調の悪化があるとき",
  },
];

export const WARD_OPTIONS = [
  { value: "tsurumi", label: "鶴見区" },
  { value: "kanagawa", label: "神奈川区" },
  { value: "nishi", label: "西区" },
  { value: "naka", label: "中区" },
  { value: "minami", label: "南区" },
  { value: "konan", label: "港南区" },
  { value: "hodogaya", label: "保土ケ谷区" },
  { value: "asahi", label: "旭区" },
  { value: "isogo", label: "磯子区" },
  { value: "kanazawa", label: "金沢区" },
  { value: "kohoku", label: "港北区" },
  { value: "midori", label: "緑区" },
  { value: "aoba", label: "青葉区" },
  { value: "tsuzuki", label: "都筑区" },
  { value: "totsuka", label: "戸塚区" },
  { value: "sakae", label: "栄区" },
  { value: "izumi", label: "泉区" },
  { value: "seya", label: "瀬谷区" },
] as const;

export type Ward = (typeof WARD_OPTIONS)[number]["value"];

/** 区に属さない市域全体の窓口を表示するときのラベル。 */
export const CITYWIDE_LABEL = "市全域";

/**
 * 区の隣接関係（暫定マスタ）。
 *
 * 正本データセット（data/seed/*.json）は `ward_adjacency: not_included` として
 * 隣接関係を持たない（行政区境界の公式地理データによる検証が未了のため）。
 * ここでは通いやすさの目安として暫定値を保持しており、公式地理データでの検証は
 * Step 4 の課題とする。
 */
export const ADJACENT_WARDS: Readonly<Record<Ward, readonly Ward[]>> = {
  tsurumi: ["kohoku", "kanagawa"],
  kanagawa: ["tsurumi", "kohoku", "midori", "hodogaya", "nishi"],
  nishi: ["kanagawa", "hodogaya", "minami", "naka"],
  naka: ["nishi", "minami", "isogo"],
  minami: ["hodogaya", "nishi", "naka", "isogo", "konan", "totsuka"],
  konan: ["minami", "isogo", "sakae", "totsuka"],
  hodogaya: ["midori", "kanagawa", "nishi", "minami", "totsuka", "asahi"],
  asahi: ["midori", "hodogaya", "totsuka", "izumi", "seya"],
  isogo: ["naka", "minami", "konan", "sakae", "kanazawa"],
  kanazawa: ["isogo", "sakae"],
  kohoku: ["tsurumi", "kanagawa", "midori", "tsuzuki"],
  midori: ["aoba", "tsuzuki", "kohoku", "kanagawa", "hodogaya", "asahi", "seya"],
  aoba: ["tsuzuki", "midori"],
  tsuzuki: ["aoba", "midori", "kohoku"],
  totsuka: ["asahi", "hodogaya", "minami", "konan", "sakae", "izumi"],
  sakae: ["totsuka", "konan", "isogo", "kanazawa"],
  izumi: ["seya", "asahi", "totsuka"],
  seya: ["midori", "asahi", "izumi"],
};

export function getWardLabel(ward: Ward): string {
  return WARD_OPTIONS.find((option) => option.value === ward)?.label ?? ward;
}

export function isAdjacentWard(selectedWard: Ward, candidateWard: Ward): boolean {
  return ADJACENT_WARDS[selectedWard].includes(candidateWard);
}

/** 区、または区に属さない市域全体の窓口の表示ラベル。 */
export function getWardOrCitywideLabel(ward: Ward | null): string {
  return ward === null ? CITYWIDE_LABEL : getWardLabel(ward);
}

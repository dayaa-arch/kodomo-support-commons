# ユビキタス言語定義 (Glossary)

> ドメイン用語・UI 用語の日本語／英語／コード命名の対応を定義する。コードとドキュメントはこの表記に従う。

## 1. ドメイン用語

| 日本語 | 英語 / コード命名 | 定義 |
| --- | --- | --- |
| 施設 / 支援先 | Facility | 相談窓口・居場所・学習支援・保護者支援などの地域資源の1単位 |
| 運営主体 | operator | 施設を運営する組織・法人・行政 |
| 運営部署 | operatingDepartment | 運営主体内の担当部署（任意） |
| 区 | ward | 横浜市18区のいずれか |
| 隣接区 | adjacentWard | 選択区に隣接し通いやすい区 |
| 困りごとテーマ | supportTheme | Q2 の相談テーマ分類 |
| 対象者 | targetAudience | Q1 の「誰のために」区分 |
| 相談方法 | consultationMethod | 電話・対面・オンライン等 |
| 費用 | cost | 無料／一部有料／有料／不明 |
| 予約の要否 | reservationRequired | 予約が必要か |
| 匿名相談の可否 | anonymousConsultation | 匿名で相談できるか |
| 保護者のみ相談可否 | guardianOnlyConsultation | 保護者だけでも相談できるか |
| 受付時間 | receptionHours | 相談を受け付ける時間 |
| 利用までの流れ | howToUse | 申し込み〜利用開始の手順 |
| 利用条件 | eligibility | 利用にあたっての条件 |
| 情報の出典 | source (sourceName / sourceUrl) | 掲載情報の根拠 |
| 最終確認日 | lastCheckedAt | 情報を最後に確認した日 |
| 確認状況 | verificationStatus | 情報の信頼性区分（下記） |
| 特徴ラベル | featureLabel | 施設属性から派生する表示ラベル |
| 一致度 | matchScore | 利用者の回答と施設属性の合致度 |

## 2. 確認状況（verificationStatus）

| 日本語 | コード値 | 定義 |
| --- | --- | --- |
| 運営者確認済み | `operator-verified` | 支援機関・団体の担当者が掲載内容を確認 |
| 公式情報確認済み | `official-verified` | 公式情報をもとにプロジェクト参加者が確認 |
| 未確認 | `unverified` | 公開情報から登録されたが十分な確認が未完了 |

## 3. 困りごとテーマ（supportTheme / Q2）

| 日本語 | コード値 |
| --- | --- |
| 学校に行けない・行きづらい | `school-absence` |
| 気分の落ち込み・不安 | `low-mood` |
| 家庭や親子関係 | `family` |
| いじめ・友人関係 | `bullying` |
| 生活や経済面 | `livelihood` |
| 子どもの世話や家族のケア | `caregiving` |
| その他 | `other` |

## 4. 対象者（targetAudience / Q1）

| 日本語 | コード値 |
| --- | --- |
| 子ども本人 | `child` |
| 自分の子ども・家族 | `guardian` |
| 学校の児童・生徒 | `school` |
| 支援している子ども | `supporter` |
| その他 | `other` |

## 5. 相談方法・費用

| 相談方法 | コード値 |  | 費用 | コード値 |
| --- | --- | --- | --- | --- |
| 電話 | `phone` |  | 無料 | `free` |
| 対面 | `inperson` |  | 一部有料 | `partial` |
| オンライン | `online` |  | 有料 | `paid` |
| メール | `email` |  | 不明 | `unknown` |
| チャット | `chat` |  | | |

## 6. 横浜市18区（ward）

| 日本語 | コード値 |  | 日本語 | コード値 |
| --- | --- | --- | --- | --- |
| 鶴見区 | `tsurumi` |  | 金沢区 | `kanazawa` |
| 神奈川区 | `kanagawa` |  | 港北区 | `kohoku` |
| 西区 | `nishi` |  | 緑区 | `midori` |
| 中区 | `naka` |  | 青葉区 | `aoba` |
| 南区 | `minami` |  | 都筑区 | `tsuzuki` |
| 港南区 | `konan` |  | 戸塚区 | `totsuka` |
| 保土ケ谷区 | `hodogaya` |  | 栄区 | `sakae` |
| 旭区 | `asahi` |  | 泉区 | `izumi` |
| 磯子区 | `isogo` |  | 瀬谷区 | `seya` |

## 7. UI / UX 用語

| 日本語 | 英語 / コード命名 | 定義 |
| --- | --- | --- |
| ウィザード | wizard | 3問で絞り込む段階的な質問フロー |
| 検索結果一覧 | results / searchResults | カード形式の結果リスト |
| 施設カード | FacilityCard | 結果一覧の1施設分の表示単位 |
| 施設詳細ページ | facilityDetail | 施設の詳細情報ページ |
| パンくずリスト | breadcrumb | 現在位置を示すナビゲーション |
| 公式サイトへの導線 | officialSiteLink | 「公式サイトを見る」ボタン |
| 情報が古い場合の報告導線 | reportOutdatedLink | Google フォームへのリンク |
| 緊急時の相談先 | emergencyContacts | 「今すぐ助けが必要な場合」共通セクション |
| 絞り込み | filter | 結果画面の条件変更・再検索 UI |

## 8. プロジェクト名称

- 正式名称: **よこはま支援さがし**（英語表記の暫定: Yokohama Support Finder）。リポジトリ名: `kodomo-support-commons`。

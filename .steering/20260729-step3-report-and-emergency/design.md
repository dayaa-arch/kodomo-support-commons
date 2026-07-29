# Step 3（前半）: 情報更新の報告導線と緊急相談先 — 設計

> 関連: [`requirements.md`](./requirements.md)

## 1. 実装アプローチ

緊急相談先を **`shared/domain` のリファレンスデータ**（区マスタ `WARD_OPTIONS` と同じ扱い）として定義し、`shared/presentation` の `EmergencyContacts` が描画する。外部リンク（Google フォーム）の URL も設定値として1箇所にまとめ、UI から直接ハードコードしない。

```
shared/domain/emergency-contacts.ts   ← 相談窓口・通報先の定義（純データ + 型）
shared/domain/external-links.ts       ← Google フォーム等の外部リンク
        ↓
shared/presentation/EmergencyContacts.tsx  ← 描画のみ
facility/presentation/FacilityDetail.tsx   ← 報告リンク・電話リンク
```

## 2. データ構造

```ts
// shared/domain/emergency-contacts.ts
export interface EmergencyContact {
  readonly name: string;
  readonly phone: string;        // 表示用（ハイフンあり）
  readonly availability: string; // 受付時間
  readonly description: string;  // 利用者向けの説明
}

/** 子ども・家族が相談できる窓口。 */
export const CHILD_CONSULTATION_CONTACTS: readonly EmergencyContact[];

/** いのちに関わる危険があるときの通報先（110/119）。 */
export const EMERGENCY_CALL_CONTACTS: readonly EmergencyContact[];
```

掲載内容:

| 区分 | 窓口 | 電話 | 受付 |
| --- | --- | --- | --- |
| 相談 | 24時間こどもSOSダイヤル | 0120-0-78310 | 24時間365日 |
| 相談 | チャイルドライン | 0120-99-7777 | 18歳まで／毎日16時〜21時 |
| 通報 | 警察 | 110 | 24時間 |
| 通報 | 消防・救急 | 119 | 24時間 |

- `tel:` リンクはハイフンを除いた番号を用いる（`tel:0120078310` など）。表示はハイフンありのまま。

### 電話番号の正規化

```ts
/** 表示用の電話番号から tel: リンク用の値を作る。 */
export function toTelHref(phone: string): string; // "0120-0-78310" → "tel:0120078310"
```

`facility/presentation` でも同じ関数を使い、施設の電話番号をリンク化する（AC-6）。`shared/domain` に置き、両モジュールから参照する。

## 3. 外部リンクの定義

```ts
// shared/domain/external-links.ts
/**
 * 掲載情報の修正依頼を受け付ける Google フォーム。
 * 利用者の入力はサイト側で受け取らず、フォーム上で完結する（プライバシー要件）。
 */
export const INFORMATION_REPORT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform";
```

- 指定 URL に付いていた `?usp=publish-editor` は**編集者向けプレビュー用**のため除去する。
- 利用者を識別するクエリパラメータは付けない。

## 4. 変更するコンポーネント

| ファイル | 変更内容 |
| --- | --- |
| `shared/domain/emergency-contacts.ts`（新規） | 相談窓口・通報先の定義、`toTelHref` |
| `shared/domain/external-links.ts`（新規） | Google フォーム URL |
| `shared/presentation/EmergencyContacts.tsx` | 定義を描画。相談窓口（主）と通報先（副）を区別して配置 |
| `facility/presentation/FacilityDetail.tsx` | 報告ボタンをリンク化。電話番号を `tel:` リンクに |

## 5. 表示設計（EmergencyContacts）

```
┌─ 今すぐ助けが必要な場合 ───────────────┐
│ つらいとき、話を聞いてくれるところがあります。 │
│ ┌─────────────────┐ ┌─────────────────┐ │
│ │ 24時間こどもSOSダイヤル │ │ チャイルドライン    │ │
│ │ 0120-0-78310 (tel:)  │ │ 0120-99-7777(tel:) │ │
│ │ 24時間365日           │ │ 18歳まで／16-21時  │ │
│ │ いじめや学校生活の…    │ │ ちょっとしたことでも…│ │
│ └─────────────────┘ └─────────────────┘ │
│ ── いのちに関わる危険があるとき ──          │
│ [110番（警察）] [119番（救急・消防）]        │
└────────────────────────────────┘
```

- 相談窓口を上に置き、通報先は区切り線の下に小さく配置する（緊急度と性質の違いを視覚的に区別）。
- 説明文はそのまま掲載する（要約・改変しない）。
- モバイル1カラム、`sm` 以上で2カラム。

## 6. 影響範囲

| 領域 | 影響 |
| --- | --- |
| 表示 | 緊急セクションと詳細ページの2箇所。検索・データ層への影響なし |
| データ | シード JSON は変更しない |
| プライバシー | 変更なし。フォームへ利用者情報を渡さない |
| アクセシビリティ | 電話リンクにはテキストで番号と用途を併記。リンクの用途が読み上げでも分かるようにする |

### シード JSON の `emergency_resources` との関係

シードにも緊急相談先が5件あるが、**チャイルドラインが未収録**であり、これらは施設検索の対象外の固定案内である。区マスタ（`wards.ts`）と同様、`shared/domain` を UI の情報源とする。将来 `emergency_resources` に統一する場合は Step 4 以降の課題とし、docs に明記する。

## 7. `docs/` の更新

| ファイル | 更新内容 |
| --- | --- |
| `functional-design.md` | 緊急相談先の情報源（`shared/domain` の参照データであること、シード `emergency_resources` との関係）を明記 |
| `development-roadmap.md` | Step 3 の進捗（報告導線・緊急相談先が完了、アクセス解析が残）を反映 |
| `product-requirements.md` | AC-11（報告導線）・AC-12（緊急相談先）の実装状況に合わせて記述を具体化 |

## 8. リスクと対応

| リスク | 対応 |
| --- | --- |
| Google フォームの URL が誤っていると報告が届かない | 承認時に URL を提示して確認する。パラメータを除いた標準形を使う |
| 掲載した電話番号・受付時間が変わる | 単体テストで形式を検証しつつ、`shared/domain` の1箇所にまとめて更新しやすくする |
| 緊急窓口の説明文が指定と変わる | 指定文言をそのまま定数に置き、テストで内容を固定する |

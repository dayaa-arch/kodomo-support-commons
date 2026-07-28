# Step 2: データ基盤（JSON / 検証 / 静的生成） — タスクリスト

> 関連: [`requirements.md`](./requirements.md) ／ [`design.md`](./design.md)

## 1. ドメイン型・共通語彙の拡張

- [x] `src/shared/domain/support-taxonomy.ts` に `line` / `web-form` / `phone-callback` を追加（ラベル付き）
- [x] `src/modules/facility/domain/facility.ts` の `ward` / `operator` / `summary` を nullable 化
- [x] `Facility` に `address` / `phone` / `alternatePhone` / `costDetail` / `notes` を追加
- [x] `src/shared/domain/wards.ts` に「市域全体（ward: null）」の扱いと、隣接区マスタが暫定である旨のコメントを追加

## 2. infrastructure（検証・写像・リポジトリ）

- [x] `seed-schema.ts`: シード JSON の型 + 検証（必須欠落・enum 不一致・id 重複で throw、違反箇所を明示）
- [x] `seed-mapper.ts`: 検証済みレコード → `Facility` への写像（[design.md](./design.md) §4 のマッピング表どおり）
- [x] `JsonFacilityRepository.ts`: `node:fs` で正本 JSON を読み、検証 → 写像 → メモ化して `FacilityRepository` を実装
- [x] `mock-facilities.ts` を削除（`InMemoryFacilityRepository` は残す）
- [x] `src/composition-root.ts` を `JsonFacilityRepository` に差し替え

## 3. 検索ドメインの更新

- [x] `LocationMatch` に `citywide` を追加
- [x] `ward === null` の施設を常に候補へ含める
- [x] 並び順を 選択区 → 市域全体 → 隣接区（各グループ内は一致度降順 → 名称昇順）に変更

## 4. 表示（presentation）の対応

- [x] `FacilityCard`: 市域全体バッジ、`ward` / `summary` の null 対応
- [x] `FacilityDetail`: `ward` / `summary` の null 表示、住所・電話・費用補足（`costDetail`）・補足（`notes`）の表示
- [x] `app/facilities/[slug]/page.tsx`: `generateMetadata` の description が null を許容
- [x] 未掲載項目が「公式サイトで確認してください」と表示されることを確認

## 5. テスト

- [x] `seed-schema.test.ts`: 必須欠落・未知の enum 値・id 重複を確実に弾く
- [x] `seed-mapper.test.ts`: コード値マッピング（`young_person`→`child`、`in_person`→`inperson`、費用文字列→enum＋原文保持、`official_source`→`official-verified`、`ward_code: null`→市域全体）
- [x] `search-facilities.test.ts`: 市域全体を含む並び順（選択区 → 市域全体 → 隣接区）
- [x] 既存テストのフィクスチャを新しい `Facility` 型に追随
- [x] **実データ検証テスト**: 正本 JSON が現行スキーマを満たし、84件すべて写像できる

## 6. 永続的ドキュメントの更新

- [x] `docs/architecture.md`（データ形式・取り込み図・検証方針）
- [x] `docs/repository-structure.md`（`data/` 構成、配置ルール）
- [x] `docs/functional-design.md`（構成図・ER図・検索順序）
- [x] `docs/glossary.md`（シード値 ↔ ドメイン値の対応表、相談方法の追加、「市域全体」）
- [x] `docs/development-guidelines.md`（Git 規約のデータ更新パス）
- [x] `docs/development-roadmap.md`（Step 2 の内容と完了状態）
- [x] `docs/product-requirements.md`（AC-05 に市域全体の扱いを追記）

## 7. 品質チェック

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm test`
- [x] `npm run build`（84件の静的生成が成功することを確認）
- [x] アーキテクチャ原則との整合確認（SRP・一方向依存・疎結合・DIP・ドメイン分割）

## 8. 動作検証

- [x] `npm run dev` で起動し、トップ → 3問ウィザード → 検索結果 → 施設詳細 を実データで確認
- [x] 市域全体の窓口が結果に含まれ、区の施設と区別されることを確認
- [x] 未掲載項目が「公式サイトで確認してください」と表示されることを確認
- [x] 検索条件が URL に出ないこと（プライバシー要件の維持）を確認

## 完了条件

- 受け入れ条件 AC-1 〜 AC-14（[requirements.md](./requirements.md) §4）をすべて満たす。
- lint / typecheck / test / build がすべて green。
- 実データ84件で、トップ → 結果 → 詳細の導線が破綻なく動作する。

## 進捗

**完了（2026-07-28）**

- lint / typecheck / test（30件）/ build すべて green。
- `npm run build` で施設84件を含む89ページを静的生成。
- 開発サーバで トップ → 3問 → 検索結果28件（選択区 → 市全域 → 隣接区）→ 施設詳細 を実データで確認。検索条件が URL に出ないことも確認。

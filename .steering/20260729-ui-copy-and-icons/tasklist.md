# UI の文言・アイコン・重複の改善 — タスクリスト

> 関連: [`requirements.md`](./requirements.md) ／ [`design.md`](./design.md)

## 1. ドメイン（表示判断のロジック）

- [x] `facility/domain/facility.ts`: `COST_LABELS.unknown` を「公式サイトで確認してください」に（指摘15）
- [x] `facility/domain/derive-feature-labels.ts`: 費用 `unknown` を特徴タグから除外
- [x] `facility/domain/unpublished-fields.ts`（新規）: `collectUnpublishedFields` を実装
- [x] `facility/index.ts` に公開バレルを追加

## 2. アイコン

- [x] `shared/presentation/Icon.tsx`: `hand-heart` / `dots` / `backpack` / `cloud-rain` / `coins` / `help-circle` を追加
- [x] `sparkles` を削除し、参照箇所を置き換え（指摘10）
- [x] Q1・Q2 のアイコン割り当てを [design.md](./design.md) §5 のとおりに変更（指摘8・9）
- [x] トップ3ステップの2番目を `help-circle` に

## 3. 重複の解消

- [x] `FacilityCard`: `dl`（費用・主な対象）を廃止し費用はタグへ一本化（指摘4）
- [x] `FacilityCard`: 説明行を `summary ?? whoCanUse`、どちらも無ければ非表示（指摘5）
- [x] `FacilityDetail`: タグと重複する5行を表から削除（指摘3）
- [x] `FacilityDetail`: 末尾に「公式サイトで確認が必要な項目」を追加（指摘5）
- [x] `SearchResultsScreen`: サマリー内の「条件を変更する」リンクを削除（指摘6）
- [x] `HomeIntro`: 本文末尾のプライバシー文を削除（指摘7）

## 4. 文言

- [x] `HomeIntro`: 見出しの語順（指摘11）、ステップ文言を「困っていること」に（指摘12）
- [x] `WizardScreen`: Q1 見出し上の視点を揃える（指摘14）
- [x] `WizardScreen`: Q2 の「気になること／相談したいこと」を「困っていること」に（指摘12）
- [x] `WizardScreen`: Q3 の説明に市全域の窓口を追加（指摘13）
- [x] `EmergencyContacts`: 開発者向け文言を撤去し 110番・119番の案内に（指摘2）

## 5. テスト

- [x] `unpublished-fields.test.ts`（新規）: 未掲載項目が正しく抽出される／すべて揃っていれば空になる
- [x] `derive-feature-labels.test.ts`: 費用 `unknown` がタグに出ないことを追加検証し、既存期待値を更新
- [x] 「費用は要確認」「sparkles」がコードに残っていないことを確認

## 6. `docs/` の更新

- [x] `docs/product-requirements.md`: AC-09（未掲載項目の表示方法）
- [x] `docs/functional-design.md`: カード表示項目・詳細ページの構成（タグと表の役割分担）

## 7. 品質チェック

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm test`
- [x] `npm run build`

## 8. 動作検証

- [x] トップ: 見出し・ステップ文言・バッジのアイコンを確認
- [x] ウィザード Q1〜Q3: 文言とアイコンの重複が無いことを確認
- [x] 検索結果: カードに重複が無く、対象年齢が表示されることを確認（デスクトップ／モバイル）
- [x] モバイル: 「条件を変更する」が1つだけであることを確認
- [x] 施設詳細: タグと表が重複せず、未掲載項目が末尾にまとまることを確認
- [x] 緊急セクション: 開発者向け文言が無いことを全ページで確認

## 完了条件

- 受け入れ条件 AC-1 〜 AC-14（[requirements.md](./requirements.md) §4）をすべて満たす。
- lint / typecheck / test / build がすべて green。

## 進捗

**完了（2026-07-29）**

- lint / typecheck / test（39件）/ build すべて green。
- DOM 検証で確認: Q2 内のアイコン重複なし・Q1 との衝突は「その他」のみ（AC-7）、検索結果カードの `dl` 全廃（AC-3）、
  「公式サイトで確認してください」を含むカードは28件中5件（以前は全件・AC-4）、詳細ページの表から重複5行が消え
  未掲載5項目が末尾に集約（AC-2/AC-5）、モバイルの条件変更導線は1つ（AC-6）、緊急セクションに開発者向け文言なし（AC-1）。
- 「費用は要確認」「sparkles」「気になること」「相談したいこと」「UI表示モック」はコード上0件（AC-8〜10）。

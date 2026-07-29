# Step 3（前半）: 情報更新の報告導線と緊急相談先 — タスクリスト

> 関連: [`requirements.md`](./requirements.md) ／ [`design.md`](./design.md)

## 1. ドメイン（参照データ）

- [x] `shared/domain/emergency-contacts.ts`（新規）: `EmergencyContact` 型、相談窓口2件、通報先2件（110/119）を定義
- [x] `toTelHref`: 表示用の電話番号から `tel:` リンク値を作る純粋関数
- [x] `shared/domain/external-links.ts`（新規）: Google フォーム URL（`?usp=publish-editor` を除去した標準形）

## 2. 表示

- [x] `shared/presentation/EmergencyContacts.tsx`: 相談窓口を主・通報先を副として描画。電話は `tel:` リンク、受付時間と説明文を併記
- [x] `facility/presentation/FacilityDetail.tsx`: 「この情報が古い場合は知らせる」をリンク化（新しいタブ・`rel="noopener noreferrer"`・外部遷移の明示）
- [x] `facility/presentation/FacilityDetail.tsx`: 電話番号を `tel:` リンクに（UI レビュー項目1）

## 3. テスト

- [x] `emergency-contacts.test.ts`（新規）: 指定された電話番号・受付時間・説明文が欠けていないこと
- [x] `toTelHref` がハイフンを除去し `tel:` 形式を返すこと
- [x] 報告フォーム URL が https で、編集者向けパラメータを含まないこと

## 4. `docs/` の更新

- [x] `docs/functional-design.md`: 緊急相談先の情報源とシード `emergency_resources` との関係
- [x] `docs/development-roadmap.md`: Step 3 の進捗（アクセス解析が残ることを明記）
- [x] `docs/product-requirements.md`: AC-11 / AC-12 の記述を実装に合わせて具体化

## 5. 品質チェック

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm test`
- [x] `npm run build`

## 6. 動作検証

- [x] 施設詳細: 報告リンクが Google フォームへ新しいタブで開くこと（`target="_blank"` / `rel` を確認）
- [x] 施設詳細: 電話番号が `tel:` リンクになっていること
- [x] 緊急セクション: 2つの相談窓口が指定文言・受付時間つきで表示され、`tel:` リンクであること
- [x] 緊急セクション: 110/119 が区別して表示されること
- [x] 全ページ（トップ・検索結果・施設詳細）で緊急セクションが表示されること
- [x] モバイル／デスクトップの両方でレイアウトが破綻しないこと
- [x] 「準備中」など未実装を示す文言が残っていないこと

## 完了条件

- 受け入れ条件 AC-1 〜 AC-10（[requirements.md](./requirements.md) §4）をすべて満たす。
- lint / typecheck / test / build がすべて green。

## 進捗

**完了（2026-07-29）**

- lint / typecheck / test（46件）/ build すべて green。
- DOM 検証で確認: 報告リンクが Google フォームへ `target="_blank"` `rel="noopener noreferrer"` で開く（クエリパラメータなし）、
  施設の電話が `tel:0455101840`、緊急セクションが `tel:0120078310` / `tel:0120997777` / `tel:110` / `tel:119` の4リンク、
  「準備中」の文言は全ページで0件。トップ・検索結果・施設詳細のいずれでも緊急セクションを表示。
- 検証中に、モバイルで 110/119 のラベルが不自然に折り返す問題を見つけ、縦積みレイアウトに修正した。

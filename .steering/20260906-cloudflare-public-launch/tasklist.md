# Cloudflare 公開準備と運用基盤 — タスクリスト

## 0. 承認と作業開始

- [x] 本ステアリング3文書の承認を得る
- [x] 承認後に GitHub 公開手順のスキル参照を読み、Issue を作成する
- [x] `codex/` 接頭辞の作業ブランチを作成する
- [x] 既存の未追跡ファイルと利用者の変更を作業対象から分離する

## 1. Next.js / Cloudflare 配信基盤

- [x] インストール済み Next.js 16.3.4 の Static Export、metadata、production checklist を確認する
- [x] `next.config.ts` を Static Export 対応にする
- [x] canonical、robots、sitemap を環境別に生成する
- [x] Cloudflare Pages 用 `public/_headers` を追加する
- [x] Node 24.18.0 と Pages build 設定を README / 運用文書へ記載する
- [x] `out/` の生成内容を検査するテストまたは検証スクリプトを用意する

## 2. 掲載データの是正

- [x] チャイルドラインの年末年始休止を公式ページに合わせる
- [x] 24時間子供SOSダイヤルを公式ページで再確認する
- [x] 「児童家庭支援センター みたけ」の URL、名称、電話番号を横浜市と運営法人で照合し修正する
- [x] 緊急相談先の重複定義を単一データモデルへ統合する
- [x] 緊急相談先の出典 URL と最終確認日を表示・検証可能にする

## 3. データ検証と定期監査

- [x] seed JSON の件数・日付・URL・区・重複を検証する
- [x] `source_catalog` とレコードの `source_url` 対応を検証する
- [x] seed mapper の参照元タイトル解決を URL 基準へ修正する
- [x] 緊急相談先30日、施設90日の鮮度基準を実装する
- [x] URL の TLS、HTTP status、redirect を確認するリンク監査を追加する
- [x] 正常系・異常系のテスト fixture を追加する

## 4. 匿名イベント分析

- [x] 分析送信ポートとブラウザ adapter を追加する
- [x] 詳細表示イベントを1回送信する client 境界を追加する
- [x] 公式サイトクリックイベントを遷移非阻害で送信する
- [x] Pages Function の POST endpoint と Analytics Engine binding 型を追加する
- [x] event、slug、body サイズ、余分なフィールドを検証する
- [x] binding 未設定・書き込み失敗時の安全な挙動を実装する
- [x] fake binding を用いた endpoint テストを追加する
- [x] Cloudflare 側の binding、dataset、環境変数の設定手順を文書化する

## 5. 公開ポリシーと OSS 文書

- [x] プライバシーポリシーページを追加する
- [x] 利用上の注意・免責ページを追加する
- [x] データ出典・更新方針ページを追加する
- [x] 共通フッターから各ポリシーへリンクする
- [x] コード用 MIT `LICENSE` を追加する
- [x] データをコードライセンスから分離する `DATA_NOTICE.md` を追加する
- [x] `SECURITY.md` と `CONTRIBUTING.md` を追加する
- [x] README のデータ権利、保存方式、公開・更新手順を現状に合わせる

## 6. CI / GitHub 運用

- [x] PR / push 用の品質 GitHub Actions を追加する
- [x] 週次・手動実行のリンク / 鮮度監査 Actions を追加する
- [x] workflow permissions と外部入力の扱いを最小権限で確認する
- [ ] PR 上で全 required checks が成功することを確認する
- [ ] `main` branch protection に required check を設定する

## 7. 公開前検証

- [x] lint、typecheck、unit test、data audit、link audit、build を実行する
- [x] 生成された全静的ルート、robots、sitemap、headers を確認する
- [x] モバイル幅とデスクトップ幅で主要利用導線を通す
- [x] キーボード操作、フォーカス、見出し、ランドマーク、リンク名を確認する
- [x] 404 と不正な分析 API request を確認する
- [x] 分析停止時も公式サイトへの遷移が成立することを確認する
- [x] Cloudflare Pages Preview で response headers と noindex を確認する
- [x] Analytics Engine に許可した2イベントだけが記録されることを確認する

## 8. 公開反映

- [ ] 検証結果と残余リスクを Pull Request に記載する
- [ ] Pull Request を `main` へ merge する
- [ ] ローカル・リモート作業ブランチを削除する
- [ ] Cloudflare Pages production deployment を確認する
- [ ] 公開 URL、更新方法、監査方法を README / 運用文書へ反映する

## 9. ドメイン取得（別確認）

- [ ] 利用者と候補ドメインを決定する
- [ ] Cloudflare Registrar で初年度価格、更新価格、対象文字列を確認する
- [ ] 購入確定操作の直前に利用者の明示確認を得る
- [ ] apex / `www` の canonical と redirect 方針を決定する
- [ ] Pages custom domain、production URL、index 許可を設定する
- [ ] HTTPS、DNS、canonical、robots、sitemap を独自ドメインで最終確認する

## 完了条件

- [ ] 要求定義の受け入れ条件をすべて満たす
- [ ] Cloudflare Pages の production deployment が正常である
- [ ] ドメイン未取得の場合でも、Pages URL で安全な公開ベータとして利用できる
- [ ] ドメイン購入が未実施の場合、その理由と次の操作が明確に記録されている

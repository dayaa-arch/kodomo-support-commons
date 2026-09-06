# Cloudflare 公開準備と運用基盤 — 設計

## 全体方針

アプリケーション本体は Next.js の Static Export とし、施設検索・詳細表示は引き続きブラウザ内の静的データだけで動かす。動的処理は、許可した2種類の匿名イベントを受け取る Cloudflare Pages Function だけに限定する。検索条件や相談内容をサーバーへ送らない現在のプライバシー特性を維持する。

```text
利用者のブラウザ
  ├─ 静的ページ・JSON ────── Cloudflare Pages (out/)
  ├─ 公式サイトへの遷移 ──── 各施設・行政の公式サイト
  └─ 2種類のイベント ─────── /api/analytics
                                 └─ Analytics Engine
                                    event + facility slug のみ
```

## 1. 静的配信構成

### Next.js

- `next.config.ts` に `output: "export"` を設定する。
- build は Next.js 標準の `next build` を使用し、成果物を `out/` に生成する。
- 画像最適化など Static Export 非対応 API は導入しない。
- 実装前に、セキュリティ修正版へ更新した Next.js 16.3.4 の以下のローカルガイドを確認する。
  - `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`
  - `node_modules/next/dist/docs/01-app/03-building-your-application/06-optimizing/04-metadata.mdx` 配下の robots / sitemap 関連文書
  - production checklist

### URL と検索エンジン公開

- `NEXT_PUBLIC_SITE_URL` を canonical と sitemap の基準 URL にする。
- `NEXT_PUBLIC_ALLOW_INDEXING=true` のときだけ robots で index を許可する。
- URL 未設定またはプレビュー環境は `noindex` とし、誤ってプレビュー URL が検索結果に残らないようにする。
- sitemap はトップ、検索、全施設詳細、公開ポリシーを含める。

### Cloudflare Pages

- Framework preset: Next.js (Static HTML Export)
- Build command: `npm run build`
- Build output directory: `out`
- Node version: `24.18.0`
- production branch: `main`
- Pull Request では Preview Deployment を利用する。
- Pages project と GitHub repository の接続は、権限範囲を画面で確認してから行う。

### HTTP セキュリティ

`public/_headers` から少なくとも以下を配信する。CSP は Next.js の生成物と分析 API を実ブラウザで確認し、機能を壊さない最小値に調整する。

- `Content-Security-Policy`: default-src / script-src / style-src / img-src / connect-src / frame-ancestors を明示
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy`: camera、microphone、geolocation、payment、usb を無効化

## 2. 最小分析の境界

### クライアント

- アプリケーション層に分析送信ポートを定義し、ブラウザ実装をインフラ層に置く。
- 詳細ページ表示時に `facility_detail_view`、公式サイトリンク操作時に `official_site_click` を送る。
- payload は `{ event, slug }` のみとする。
- `fetch(..., { keepalive: true })` 等で非同期送信し、例外は UI に波及させない。
- `NEXT_PUBLIC_ANALYTICS_ENABLED=true` のときだけ有効化する。

### Pages Function

- `functions/api/analytics.ts` が POST のみ受け付ける。
- Content-Type、body サイズ、JSON 構造、イベント名、slug の存在を検証する。
- slug は build 時データに存在するものだけを許可する。
- 成功時は Analytics Engine binding の `writeDataPoint` にイベント名と slug を文字列列として書き込み、`204` を返す。
- IP、User-Agent、Referer、Cookie、時刻以外のリクエスト属性は書き込まない。時刻は Analytics Engine 側の記録時刻を利用する。
- CORS を開放せず same-origin のみで利用する。失敗時は適切な 4xx/5xx を返す。
- binding が未設定の環境は利用者の操作を阻害しない応答とし、運用ログで構成不備を把握できるようにする。

### テスト

- 正しい2イベントの受理、不正イベント、未知 slug、余分な個人情報フィールド、不正 JSON、過大 body、GET の拒否を fake binding で検証する。
- 公式サイトクリックは分析送信が失敗しても遷移できることを確認する。

## 3. データモデルと監査

### seed 検証

既存の seed mapper に依存しすぎない独立した検証入口を用意し、以下を fail-fast で確認する。

- メタデータの宣言件数と実件数
- ISO 8601 として実在する日付
- `http:` または `https:` の URL
- 施設 ID、slug、公式 URL の重複
- 区コードと区名の正規対応
- 必須配列・文字列の空値
- 各 `source_url` に対応する `source_catalog` の存在

参照元タイトルは `source_catalog` を URL で索引化して取得する。`provider_type` は施設種別であり、出典 ID としては使用しない。

### 緊急相談先

UI 内の重複定数を単一の公開データへ寄せ、少なくとも以下を持つ。

- 表示 ID、名称、説明、電話番号、受付案内
- 公式 URL、参照元名、最終確認日
- 表示優先度と対象者

公式情報で確認後、チャイルドラインの「12月29日から1月3日は休止」を短く明示する。みたけのリンクは有効な運営法人ページ `https://www.ynakazato.jp/child.html` を候補とし、施設名・電話番号を横浜市一覧と照合してから確定する。

### 監査コマンド

- `audit:data`: schema、参照、重複、鮮度を検査
- `audit:links`: 公式 URL と出典 URL をネットワーク検査
- ネットワーク監査は短い timeout、1回までの再試行、明示的な User-Agent を用いる。
- リダイレクト先を記録し、TLS エラー、4xx、5xx は失敗扱いにする。429 や一時的障害は再試行後の結果を明示する。
- 日次ではなく週次実行とし、外部サイトへの負荷を抑える。

## 4. 公開ページと権利表示

次の静的ページを App Router 内に追加し、共通フッターからリンクする。

- `/privacy`: 収集する2イベント、収集しない情報、Cloudflare の処理、保存目的、問い合わせ方法
- `/terms`: 情報の性質、緊急時の案内、免責、外部リンク、禁止事項
- `/data-policy`: 出典、確認日、更新頻度、訂正受付、再利用条件

リポジトリには以下を追加する。

- `LICENSE`: ソースコードに対する MIT License
- `DATA_NOTICE.md`: 掲載データは出典ごとの権利条件に従い、コードの MIT License の対象外であることを明記
- `SECURITY.md`: 公開 Issue に機微情報を書かない報告手順
- `CONTRIBUTING.md`: コード変更と施設データ訂正の検証要件

README では「公開情報を整理したデータ」であることを説明し、すべてがオープンライセンスであるかのような表現を避ける。

## 5. CI と運用

### GitHub Actions

品質ワークフローを Pull Request と `main` push で実行する。

1. Node 24.18.0 をセットアップ
2. `npm ci`
3. lint
4. typecheck
5. unit tests
6. data audit
7. static production build

週次監査ワークフローは手動実行にも対応し、リンク監査と鮮度監査を行う。失敗時は Actions の失敗として通知可能な状態にする。外部 URL を検査するため、通常の PR 品質検査にはリンク監査を含めない。

### GitHub 運用

- 承認後に GitHub Issue を作成し、`codex/` 接頭辞の作業ブランチで実装する。
- Pull Request に受け入れ条件と検証結果を記載する。
- CI 成功とレビュー後に `main` へ merge し、作業ブランチを削除する。
- `main` の branch protection は、CI job を required check として設定する。

### Cloudflare 公開手順

1. GitHub 連携と Pages project 作成
2. PR Preview へ配信
3. Pages Function binding と環境変数を設定
4. Preview で全受け入れ試験
5. `main` を Pages の production branch として配信
6. ドメイン名決定後、Cloudflare Registrar で購入
7. Pages の Custom domains から apex と `www` の扱いを決定し接続
8. `NEXT_PUBLIC_SITE_URL` と index 許可を production に設定して再配信

ドメイン購入は課金を伴うため、この実装承認には含めず、候補名・金額・更新条件を表示した最終購入操作の直前に別途確認する。

## 6. 検証設計

- コマンド: lint、typecheck、全テスト、data audit、link audit、production build
- 静的成果物: ルート一覧、全施設ページ数、robots、sitemap、`_headers`
- ブラウザ: トップ → 利用者選択 → 困りごと → 区 → 検索 → 詳細 → 公式サイト
- 画面幅: モバイル相当とデスクトップ相当
- 操作: キーボードだけで主要導線を進める、フォーカス表示、外部リンク表示
- アクセシビリティ: 見出し階層、ランドマーク、リンク名、フォームラベル、コントラストを確認
- エラー: 存在しない施設、分析 API の不正入力、binding 未設定
- 配信: Preview URL の response headers、noindex、Pages Function、最終的な production URL

## 参考にする一次資料

- Cloudflare Pages: Static Next.js guide — https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
- Cloudflare Pages: Custom domains — https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare Pages Functions bindings — https://developers.cloudflare.com/pages/functions/bindings/
- Cloudflare Analytics Engine pricing — https://developers.cloudflare.com/analytics/analytics-engine/pricing/
- チャイルドライン公式電話案内 — https://childline.or.jp/tel/
- 文部科学省 24時間子供SOSダイヤル — https://www.mext.go.jp/a_menu/shotou/seitoshidou/1306988.htm
- 横浜市 児童家庭支援センター一覧 — https://www.city.yokohama.lg.jp/kosodate-kyoiku/oyakokenko/shido/sodan/jikasen_list.html

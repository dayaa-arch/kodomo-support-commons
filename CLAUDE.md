@AGENTS.md

# よこはま支援さがし (kodomo-support-commons)

横浜市の子ども・家庭向け支援情報を整理・公開する OSS。MVP は「横浜市内の不登校支援」。
**起点の要求メモ（真の情報源）**: [`docs/ideas/initial-requirements.md`](docs/ideas/initial-requirements.md)
**永続的ドキュメント**: [`docs/`](docs/)（product-requirements / functional-design / architecture / repository-structure / development-guidelines / glossary / development-roadmap）

## 技術スタック / コマンド

- Next.js 16.2.12（App Router, Server Components デフォルト）/ React 19.2.4 / TypeScript 5(strict) / Tailwind CSS v4 / Node.js 24.18.0（`.nvmrc` / Volta）
- 開発: `npm run dev` ／ ビルド: `npm run build` ／ 本番起動: `npm run start` ／ Lint: `npm run lint`
- **Next.js 16 は破壊的変更あり**。実装前に `node_modules/next/dist/docs/01-app/` の該当ガイドを参照（`params`/`searchParams` は Promise、Server Component は `await`・Client は `use()`）。

## アーキテクチャ（要点）

- ドメイン駆動 × レイヤード（モジュラモノリス）: `src/modules/<domain>/{domain,application,infrastructure,presentation}` ＋ `src/shared/`。`app/**` は薄いルーティング層。
- 依存方向は一方向（`app → presentation → application → domain`）。ポートは `application/ports` に定義し `infrastructure` で実装、`composition-root` で注入（DIP）。詳細は [`docs/architecture.md`](docs/architecture.md) / [`docs/repository-structure.md`](docs/repository-structure.md)。
- **プライバシー最優先**: 検索条件を URL/Cookie/Storage/サーバに保存しない。行動追跡・セッションリプレイなし。外部送信はアクセス解析2種（詳細閲覧数・公式クリック数）のみ。
- 施設情報の正本は `data/seed/*.json`（データセット単位の JSON。PR で更新、公開前レビュー必須）。正本のコード値は `facility/infrastructure` の境界でドメイン値へ写像する。DB・管理画面は MVP では持たない。

## ステアリング規則（作業単位ドキュメント）

- 機能追加・修正は `.steering/<YYYYMMDD>-<開発タイトル>/` に `requirements.md` / `design.md` / `tasklist.md` の3ファイルを作成してから実装する。
- 例: `.steering/20250727-initial-implementation/`。
- コード変更後は必ず lint・型チェック・関連テストを実施し、アーキテクチャ原則（SRP・一方向依存・疎結合・DIP・ドメイン分割）との整合を確認する。

## 開発プロセス

開発プロセスの詳細ルール（ドキュメント構成・承認手順・図表規約・アーキテクチャ原則の担保）は `/dev-docs` に従う。

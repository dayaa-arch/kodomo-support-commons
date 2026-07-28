# 開発ガイドライン (Development Guidelines)

> 関連: [`architecture.md`](./architecture.md) / [`repository-structure.md`](./repository-structure.md) / [`glossary.md`](./glossary.md)

## 1. コーディング規約

- **TypeScript strict** を前提。`any` を避け、`unknown` ＋絞り込みを使う。外部データは境界で検証してから型付けする。
- **Server Components 優先**: App Router のデフォルト（Server Component）で書き、状態・イベント・ブラウザ API が必要な箇所のみ `'use client'`。
- **Next.js 16 の作法**: `params` / `searchParams` は Promise。Server では `await`、Client では `use()`。実装前に `node_modules/next/dist/docs/01-app/` の該当ガイドを確認する。
- **純粋関数中心**: ドメインロジック（スコアリング・確認状況判定）は副作用のない純粋関数にし、単体テストしやすくする。
- **エラー処理**: データ検証エラーはビルド時に落とす。UI では未掲載項目を「公式サイトで確認してください」に置換し、決して推測で埋めない。

## 2. 命名規則

| 対象 | 規則 | 例 |
| --- | --- | --- |
| ディレクトリ | kebab-case | `facility/application/ports` |
| 一般ファイル (.ts) | kebab-case | `facility-repository.ts` |
| React コンポーネントファイル (.tsx) | PascalCase | `FacilityCard.tsx` |
| 型・interface・コンポーネント | PascalCase | `Facility`, `FacilityRepository` |
| 変数・関数 | camelCase | `searchFacilities` |
| 定数（列挙的な固定値） | UPPER_SNAKE または as const | `WARDS`, `SUPPORT_THEMES` |
| ドメイン用語 | [`glossary.md`](./glossary.md) の英語対応に従う | `verificationStatus` |

- ポート interface は役割で命名（`FacilityRepository`, `AnalyticsGateway`）。実装は手段を接尾辞に（`YamlFacilityRepository` 等）。

## 3. スタイリング規約（Tailwind CSS v4）

- ユーティリティクラスを基本とし、デザイントークン（色・間隔・タイポ）を一元管理する。
- **モバイルファースト**: ベースはモバイル、`md:` 以上で拡張（結果画面の2カラム等）。
- 共通 UI（ボタン・タグ・パンくず・緊急セクション）は `src/shared/presentation` に集約し再利用する。
- アクセシビリティ: 十分なコントラスト・フォーカスリング・タップ領域（最低44px目安）。

## 4. アーキテクチャ運用規約（原則の遵守）

- **層またぎ禁止を ESLint で強制**: `no-restricted-imports` / `eslint-plugin-import` により
  - `domain` は上位・外部（`react`/`next`/`infrastructure`/`presentation`）を import 不可。
  - `application` は `infrastructure`/`presentation` の具象を import 不可（ポート経由）。
  - 他ドメインの `infrastructure`/`presentation` 内部への import 禁止（`index.ts` 公開バレルと `shared` 経由のみ）。
- **SDK/ライブラリ型の境界越え禁止**: 外部ライブラリ固有の型を `domain`/`application` の公開シグネチャに出さない。`infrastructure` で DTO/ドメイン型へ変換。
- **DIP の徹底**: ポートは `application/ports`（またはドメインルール直結なら `domain`）に定義、実装は `infrastructure`、注入は `composition-root`。
- **単一責任**: 1ファイル1責務。表示・調停・ドメイン・I/O を混在させない。

## 5. テスト規約

- **ドメインロジックは単体テスト必須**: 一致度スコアリング、区・隣接区・市域全体の抽出と並び順、確認状況・特徴ラベル導出、未掲載項目の表示置換。
- **データ検証テスト**: スキーマ検証が必須項目欠落・未知の enum 値・id 重複を確実に弾くこと。
- **写像テスト**: 正本のコード値がドメイン値へ正しく変換され、出典に無い項目が推測で埋められないこと。
- **正本データテスト**: 正本 JSON そのものが現行スキーマを満たし、全件写像できること（データ追加の PR をここで検知する）。
- **プライバシー回帰テスト**: 検索条件が URL・Cookie・localStorage に出ないこと、外部送信がアクセス解析2種のみであることを確認するテストを置く。
- テスト配置は対象の近く（`*.test.ts`）。Node.js 24 の組み込みテストランナーを使用し、`npm test` で実行する。

## 6. Git 規約

- **ブランチ**: `main` へ直接コミットしない。作業は feature ブランチで行い PR を出す。
- **施設情報の更新**: `data/seed/*.json` の追加・修正は PR で行う。公開前に運営者または承認メンテナーのレビューを**必須**とする。スキーマ検証（`npm test`）が通ることを確認してから提出する。
- **コミットメッセージ**: 変更意図が分かる簡潔な記述。関連 Issue/ステアリングを参照。
- **レビュー**: コード・データともにレビューを経てマージ。

## 7. セキュリティ・プライバシー

- ユーザーの相談内容を保存・送信しない（URL/Cookie/Storage/サーバいずれも）。
- 外部リンクは `rel="noopener noreferrer"`＋新規タブ、外部遷移と分かる表示。
- `dangerouslySetInnerHTML` を避け、React の既定エスケープに委ねる（XSS 対策）。
- 追加依存は監査容易性を優先し最小限に。

## 8. 品質チェック（変更後に必ず実施）

1. `npm run lint`（ESLint。層またぎ違反を含む）
2. `npm run typecheck`（`tsc --noEmit`）
3. `npm test`（Node.js 組み込みテストランナー）
4. `npm run build`（Next.js 本番ビルド）
5. アーキテクチャ原則（SRP・一方向依存・疎結合・DIP・ドメイン分割）とドキュメントの整合を確認

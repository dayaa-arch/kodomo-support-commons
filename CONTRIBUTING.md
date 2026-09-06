# Contributing

よこはま支援さがしへの改善提案を歓迎します。変更前にIssueで目的と影響範囲を共有してください。

## 開発環境

- Node.js 24.18.0
- `npm ci`
- `npm run dev`

Pull Requestの前に次を実行してください。

```bash
npm run lint
npm run typecheck
npm test
npm run audit:data
npm run build
```

外部サイトへアクセスできる環境では `npm run audit:links` も実行してください。

## データ訂正

- 事実情報は公式な一次情報で確認し、`source_url` と `checked_at` を更新してください。
- 公開情報で確認できない項目を推測で補わないでください。
- 相談者や施設利用者の氏名、相談内容、健康情報などをリポジトリへ追加しないでください。
- 掲載データの権利は `DATA_NOTICE.md` を確認してください。

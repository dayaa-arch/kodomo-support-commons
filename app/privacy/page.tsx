import type { Metadata } from "next";

import { PolicyPage } from "@/src/shared/presentation/PolicyPage";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="プライバシーポリシー"
      description="このサイトは、相談内容や検索条件を保存せず、必要最小限の匿名イベントだけを扱います。"
    >
      <section>
        <h2>サイト内で保存しない情報</h2>
        <p>
          3つの質問への回答と検索条件はブラウザのメモリ内だけで扱い、サーバーやデータベースへ送信しません。ページを再読み込みすると回答状態は失われます。氏名、住所、電話番号、相談内容を入力・保存する機能はありません。
        </p>
      </section>
      <section>
        <h2>匿名の利用状況</h2>
        <p>
          公開環境で計測を有効にした場合、「施設詳細を表示した」「公式サイトへのリンクを選んだ」という2種類のイベントと施設識別子だけをCloudflare Analytics Engineへ送ります。Cookie、端末ID、セッションID、検索条件、相談内容、IPアドレス、User-Agentを分析データとして保存しません。
        </p>
      </section>
      <section>
        <h2>配信事業者</h2>
        <p>
          サイトの配信と不正アクセス対策にはCloudflareを利用します。通信に伴う情報はCloudflareの基盤上で処理される場合があります。初期公開ではCloudflare Web Analyticsを使用しません。
        </p>
      </section>
      <section>
        <h2>外部サービス</h2>
        <p>
          「この情報が古い場合は知らせる」からGoogleフォームへ移動した後に入力した内容はGoogle上で処理され、このサイトでは保存しません。各施設の公式サイトも、それぞれの運営者の方針に従います。
        </p>
      </section>
      <section>
        <h2>問い合わせ</h2>
        <p>
          本方針やデータの訂正については、GitHubリポジトリのIssueからお知らせください。相談そのものは受け付けていないため、緊急相談先または各施設の公式窓口をご利用ください。
        </p>
      </section>
      <p>制定日: 2026年9月6日</p>
    </PolicyPage>
  );
}

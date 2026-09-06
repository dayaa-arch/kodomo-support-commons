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
      description="質問への回答や検索条件は保存しません。利用状況を調べるために記録する情報について説明します。"
    >
      <section>
        <h2>サイト内で保存しない情報</h2>
        <p>
          3つの質問への回答は、サイトを使っている間だけブラウザのメモリ内で扱います。「その他」に入力した内容も含め、サーバーには送信せず、端末にも保存しません。ページを再読み込みすると回答は消えます。
        </p>
      </section>
      <section>
        <h2>匿名の利用状況</h2>
        <p>
          計測を有効にした場合、施設の詳細が何回見られたか、公式サイトのリンクが何回選ばれたかを記録します。分析サービスのCloudflare Analytics Engineへ送るのは、この2種類の操作と、対象の施設を表すコードだけです。
        </p>
        <p>
          質問への回答、検索条件、相談内容は分析データに含めません。Cookieや利用者・端末を区別するID、IPアドレス、ブラウザの種類などの情報（User-Agent）も、分析データとして保存しません。
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
          この方針についてのご質問や情報の訂正は、<a className="underline underline-offset-4" href="https://github.com/dayaa-arch/kodomo-support-commons/issues">GitHubの公開問い合わせページ（Issue）</a>からお知らせください。投稿は誰でも読めるため、氏名や個人的な相談内容は書かないでください。悩みのご相談は、各施設やこのサイトで紹介している相談窓口へお願いします。
        </p>
      </section>
      <p>制定日: 2026年9月6日</p>
    </PolicyPage>
  );
}

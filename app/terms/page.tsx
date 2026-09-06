import type { Metadata } from "next";

import { PolicyPage } from "@/src/shared/presentation/PolicyPage";

export const metadata: Metadata = {
  title: "利用上の注意",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PolicyPage
      title="利用上の注意"
      description="安心して利用できるよう、このサイトが提供する情報の範囲と注意点をまとめています。"
    >
      <section>
        <h2>情報の位置づけ</h2>
        <p>
          このサイトは、公開されている子ども・家庭向け支援情報を探しやすく整理する非公式のOSSプロジェクトです。横浜市および掲載施設が運営する公式サイトではありません。
        </p>
      </section>
      <section>
        <h2>利用前の確認</h2>
        <p>
          受付時間、対象者、費用、予約方法などは変更される場合があります。実際に利用する前に、詳細ページに記載した公式サイトまたは電話窓口で最新情報をご確認ください。
        </p>
      </section>
      <section>
        <h2>緊急の場合</h2>
        <p>
          生命や身体に差し迫った危険がある場合は110番または119番を利用してください。このサイトは緊急通報、医療・法律・福祉上の専門的判断を代行しません。
        </p>
      </section>
      <section>
        <h2>外部リンク</h2>
        <p>
          外部サイトの内容、可用性、個人情報の取扱いは各運営者が管理します。リンク先の利用条件とプライバシーポリシーをご確認ください。
        </p>
      </section>
      <section>
        <h2>免責と訂正</h2>
        <p>
          正確性と鮮度の維持に努めますが、掲載情報の完全性を保証するものではありません。誤りや変更を見つけた場合は、詳細ページの報告導線またはGitHub Issueからお知らせください。
        </p>
      </section>
      <p>制定日: 2026年9月6日</p>
    </PolicyPage>
  );
}

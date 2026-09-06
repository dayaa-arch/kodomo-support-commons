import type { Metadata } from "next";

import { PolicyPage } from "@/src/shared/presentation/PolicyPage";

export const metadata: Metadata = {
  title: "データの出典と更新方針",
  alternates: { canonical: "/data-policy" },
};

export default function DataPolicyPage() {
  return (
    <PolicyPage
      title="データの出典と更新方針"
      description="掲載する事実情報の由来、確認頻度、再利用時の注意を説明します。"
    >
      <section>
        <h2>情報源</h2>
        <p>
          横浜市、国の機関、各施設・運営法人が公開するページを参照し、名称、連絡先、対象、受付時間などの事実情報を中心に整理しています。各施設ページに出典URLと最終確認日を表示します。
        </p>
      </section>
      <section>
        <h2>推測しない方針</h2>
        <p>
          公開情報で確認できない項目は推測で補いません。「公式サイトで確認してください」と表示し、確認できた内容と区別します。検索結果は支援の適否を断定するものではありません。
        </p>
      </section>
      <section>
        <h2>確認頻度</h2>
        <p>
          緊急相談先は30日以内、施設情報は90日以内を目安に再確認します。週次の自動監査で期限超過とリンク切れを検知し、データ変更はPull Requestで履歴を残します。
        </p>
      </section>
      <section>
        <h2>データの権利</h2>
        <p>
          公開Webページの情報がすべてオープンライセンスとは限りません。ソースコードのMIT Licenseは掲載データや出典元の文章・画像には適用されません。再利用する場合は、各出典元の著作権・利用条件を確認してください。
        </p>
      </section>
      <section>
        <h2>訂正の提案</h2>
        <p>
          情報の誤りや変更は、施設詳細ページのGoogleフォームまたはGitHub Issueから報告できます。個人的な相談内容や健康情報などの機微情報はGitHubへ書き込まないでください。
        </p>
      </section>
      <p>最終更新日: 2026年9月6日</p>
    </PolicyPage>
  );
}

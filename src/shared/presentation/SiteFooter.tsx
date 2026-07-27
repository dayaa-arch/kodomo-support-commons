import Link from "next/link";

import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-brand-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <BrandMark />
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            横浜市内の子ども・家庭向け支援情報を、探しやすく、比べやすく。
            現在はUI確認用のモックデータで表示しています。
          </p>
        </div>
        <nav aria-label="フッターナビゲーション">
          <ul className="grid gap-2 text-sm font-bold text-slate-600 sm:grid-cols-3 md:grid-cols-1">
            <li><Link className="hover:text-brand-700" href="/#finder">支援先を探す</Link></li>
            <li><Link className="hover:text-brand-700" href="/#about">このサイトについて</Link></li>
            <li><Link className="hover:text-brand-700" href="/#guide">はじめての方へ</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-100 px-4 py-4 text-center text-xs text-slate-500">
        © 2026 よこはま支援さがし — OSS project
      </div>
    </footer>
  );
}

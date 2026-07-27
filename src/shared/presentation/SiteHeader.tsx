import Link from "next/link";

import { BrandMark } from "./BrandMark";
import { Icon } from "./Icon";

const navigation = [
  { href: "/#finder", label: "支援先を探す" },
  { href: "/#about", label: "このサイトについて" },
  { href: "/#guide", label: "はじめての方へ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 shadow-[0_1px_12px_rgba(21,77,112,0.06)] backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandMark />
        <nav aria-label="メインナビゲーション" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <details className="relative md:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-xl border border-brand-200 text-brand-800 transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">メニューを開く</span>
            <Icon name="menu" />
          </summary>
          <nav
            aria-label="モバイルナビゲーション"
            className="absolute right-0 mt-2 w-64 rounded-2xl border border-brand-100 bg-white p-2 shadow-xl"
          >
            <ul>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-slate-700 hover:bg-brand-50 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}

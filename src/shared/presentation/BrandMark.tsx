import Link from "next/link";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="group inline-flex min-h-11 items-center gap-2 rounded-xl text-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
      aria-label="よこはま支援さがし トップへ"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 44 44"
        className="size-10 shrink-0 transition-transform group-hover:-rotate-3 group-hover:scale-105"
      >
        <circle cx="11" cy="9" r="6" fill="#83b84a" />
        <path d="M17 23c0-7 5-12 13-13 1 8-3 14-10 16Z" fill="#2a9bbb" />
        <path d="M6 25c6-6 13-7 21-3-4 8-12 12-21 11Z" fill="#166faf" />
        <path d="M17 33c6-4 12-4 19 0-5 7-12 9-19 6Z" fill="#0f5d96" />
        <circle cx="31" cy="7" r="3" fill="#f2b84b" />
      </svg>
      <span className="text-[1.05rem] font-black tracking-[0.08em] sm:text-xl">
        よこはま支援さがし
      </span>
    </Link>
  );
}

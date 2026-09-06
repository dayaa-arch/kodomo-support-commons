import type { ReactNode } from "react";

import { Breadcrumbs } from "./Breadcrumbs";

export function PolicyPage({
  title,
  description,
  children,
}: {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="bg-[linear-gradient(180deg,#f7fbfe_0%,#fff_42%)]">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Breadcrumbs items={[{ href: "/", label: "ホーム" }, { label: title }]} />
        <article className="mt-6 rounded-3xl border border-brand-100 bg-white p-5 shadow-[0_12px_36px_rgba(29,85,119,0.08)] sm:p-9">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-700">{description}</p>
          <div className="policy-content mt-8 space-y-8 text-sm leading-7 text-slate-700 sm:text-base">
            {children}
          </div>
        </article>
      </div>
    </div>
  );
}

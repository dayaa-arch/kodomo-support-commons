import type { ReactNode } from "react";

export type TagTone = "blue" | "green" | "orange" | "purple" | "gray";

const toneClassNames: Record<TagTone, string> = {
  blue: "border-brand-200 bg-brand-50 text-brand-800",
  green: "border-leaf-200 bg-leaf-50 text-leaf-800",
  orange: "border-sun-200 bg-sun-50 text-sun-800",
  purple: "border-violet-200 bg-violet-50 text-violet-800",
  gray: "border-slate-200 bg-slate-50 text-slate-700",
};

export function Tag({
  children,
  tone = "blue",
}: {
  readonly children: ReactNode;
  readonly tone?: TagTone;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold ${toneClassNames[tone]}`}
    >
      {children}
    </span>
  );
}

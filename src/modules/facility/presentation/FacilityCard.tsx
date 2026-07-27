import Link from "next/link";

import {
  CONSULTATION_METHOD_LABELS,
  getTargetAudienceLabel,
} from "@/src/shared/domain/support-taxonomy";
import { getWardLabel } from "@/src/shared/domain/wards";
import { Icon } from "@/src/shared/presentation/Icon";
import { Tag } from "@/src/shared/presentation/Tag";

import {
  COST_LABELS,
  deriveFeatureLabels,
  type Facility,
} from "../index";

export function FacilityCard({
  facility,
  rank,
  locationMatch,
}: {
  readonly facility: Facility;
  readonly rank: number;
  readonly locationMatch: "selected" | "adjacent";
}) {
  const featureLabels = deriveFeatureLabels(facility).slice(0, 4);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-[0_5px_20px_rgba(29,85,119,0.08)] transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_12px_30px_rgba(29,85,119,0.13)]">
      <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-br-xl bg-brand-700 text-base font-black text-white">
        <span className="sr-only">表示順</span>{rank}
      </div>
      <div className="p-5 pl-14 sm:p-6 sm:pl-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black leading-7 text-brand-900 sm:text-xl">
                <Link
                  href={`/facilities/${facility.slug}`}
                  className="rounded underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
                >
                  {facility.name}
                </Link>
              </h2>
              <Tag tone={locationMatch === "selected" ? "blue" : "gray"}>
                {locationMatch === "selected" ? "選択した区" : "隣接区"}
              </Tag>
            </div>
            <p className="mt-1 text-xs font-bold text-slate-500">{facility.operator}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-slate-600 sm:flex-col sm:gap-2">
            <span className="inline-flex items-center gap-1.5"><Icon name="map-pin" className="size-4 text-brand-600" />{getWardLabel(facility.ward)}</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="chat" className="size-4 text-brand-600" />{facility.consultationMethods.map((method) => CONSULTATION_METHOD_LABELS[method]).join(" / ")}</span>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-650">{facility.summary}</p>

        <dl className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-2">
          <div className="flex gap-2"><dt className="shrink-0 font-black text-slate-500">費用</dt><dd className="font-bold text-slate-800">{COST_LABELS[facility.cost]}</dd></div>
          <div className="flex gap-2"><dt className="shrink-0 font-black text-slate-500">主な対象</dt><dd className="font-bold text-slate-800">{facility.targetAudiences.slice(0, 2).map(getTargetAudienceLabel).join("・")}</dd></div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          {featureLabels.map((feature) => (
            <Tag key={feature.label} tone={feature.tone}>{feature.label}</Tag>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Icon name="calendar" className="size-4" />
            最終確認: {facility.lastCheckedAt.replace(/-(\d{2})-(\d{2})$/, "年$1月$2日").replace("-", "年")}
          </p>
          <Link
            href={`/facilities/${facility.slug}`}
            className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-brand-200 bg-white px-4 text-sm font-black text-brand-700 transition group-hover:border-brand-400 group-hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
          >
            詳細を見る <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

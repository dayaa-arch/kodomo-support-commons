import {
  CONSULTATION_METHOD_LABELS,
} from "@/src/shared/domain/support-taxonomy";
import type { ReactNode } from "react";
import { getWardOrCitywideLabel } from "@/src/shared/domain/wards";
import { Breadcrumbs } from "@/src/shared/presentation/Breadcrumbs";
import { EmergencyContacts } from "@/src/shared/presentation/EmergencyContacts";
import { Icon } from "@/src/shared/presentation/Icon";
import { SupportIllustration } from "@/src/shared/presentation/SupportIllustration";
import { Tag } from "@/src/shared/presentation/Tag";

import {
  collectUnpublishedFields,
  deriveFeatureLabels,
  UNPUBLISHED_INFORMATION_LABEL,
  type Facility,
} from "../index";

/** 運営部署と運営主体を、欠けている側を補わずに連結する。 */
function formatOperator(facility: Facility): string {
  const parts = [facility.operatingDepartment, facility.operator].filter(
    (part): part is string => Boolean(part?.trim()),
  );
  return parts.length > 0 ? parts.join(" / ") : UNPUBLISHED_INFORMATION_LABEL;
}

function DetailRow({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <div className="grid border-b border-brand-100 last:border-b-0 sm:grid-cols-[12rem_1fr]">
      <dt className="bg-brand-50 px-4 py-4 font-black text-brand-900 sm:px-5">{label}</dt>
      <dd className="px-4 py-4 leading-7 text-slate-700 sm:px-5">{children}</dd>
    </div>
  );
}

export function FacilityDetail({ facility }: { readonly facility: Facility }) {
  const featureLabels = deriveFeatureLabels(facility);
  const unpublishedFields = collectUnpublishedFields(facility);

  return (
    <div className="bg-[linear-gradient(180deg,#f7fbfe_0%,#fff_42%)]">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "ホーム" },
            { href: "/search", label: "検索結果" },
            { label: facility.name },
          ]}
        />

        <div className="mt-6 overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-[0_12px_36px_rgba(29,85,119,0.1)]">
          <div className="grid items-center gap-6 p-5 sm:p-8 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500"><Icon name="map-pin" className="size-4" />{getWardOrCitywideLabel(facility.ward)}</span>
              </div>
              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">{facility.name}</h1>
              <p className="mt-2 font-bold text-slate-600">{formatOperator(facility)}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {featureLabels.map((feature) => (
                  <Tag key={feature.label} tone={feature.tone}>{feature.label}</Tag>
                ))}
              </div>
              {facility.summary ? (
                <p className="mt-6 text-base leading-8 text-slate-700">{facility.summary}</p>
              ) : null}
            </div>
            <SupportIllustration variant={facility.imageVariant} className="w-full" />
          </div>

          <dl className="border-t border-brand-100 text-sm sm:text-base">
            {/*
              上部の特徴ラベルに出した項目（費用・予約・匿名相談・保護者のみの相談・確認状況）は
              ここでは繰り返さない。値が無い項目は末尾の「公式サイトで確認が必要な項目」に集約する。
            */}
            {facility.whatYouCanConsult ? (
              <DetailRow label="何を相談できるか">{facility.whatYouCanConsult}</DetailRow>
            ) : null}
            {facility.whoCanUse ? (
              <DetailRow label="誰が利用できるか">{facility.whoCanUse}</DetailRow>
            ) : null}
            {facility.howToUse ? (
              <DetailRow label="利用までの流れ">{facility.howToUse}</DetailRow>
            ) : null}
            <DetailRow label="相談方法">{facility.consultationMethods.map((method) => CONSULTATION_METHOD_LABELS[method]).join(" / ")}</DetailRow>
            {facility.phone ? (
              <DetailRow label="電話番号">
                <span className="font-bold text-slate-900">
                  {[facility.phone, facility.alternatePhone].filter(Boolean).join(" / ")}
                </span>
              </DetailRow>
            ) : null}
            {facility.address ? (
              <DetailRow label="所在地">{facility.address}</DetailRow>
            ) : null}
            {facility.eligibility ? (
              <DetailRow label="利用条件">{facility.eligibility}</DetailRow>
            ) : null}
            {facility.receptionHours ? (
              <DetailRow label="受付時間">{facility.receptionHours}</DetailRow>
            ) : null}
            {facility.notes.length > 0 ? (
              <DetailRow label="補足">
                <ul className="list-disc space-y-1 pl-5">
                  {facility.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </DetailRow>
            ) : null}
            <DetailRow label="情報の出典">
              {facility.sourceUrl ? (
                <a className="inline-flex items-center gap-1 font-bold text-brand-700 underline underline-offset-4" href={facility.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {facility.sourceName}<Icon name="external-link" className="size-4" />
                </a>
              ) : facility.sourceName}
            </DetailRow>
            <DetailRow label="最終確認日">{facility.lastCheckedAt}</DetailRow>
          </dl>

          {unpublishedFields.length > 0 ? (
            <section
              aria-labelledby="unpublished-heading"
              className="border-t border-brand-100 bg-slate-50 px-4 py-5 sm:px-5"
            >
              <h2 id="unpublished-heading" className="font-black text-slate-900">
                公式サイトで確認が必要な項目
              </h2>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                次の項目は公開情報で確認できませんでした。推測で補わずそのまま掲載しています。
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {unpublishedFields.map((field) => (
                  <li
                    key={field}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600"
                  >
                    {field}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          {facility.officialUrl ? (
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 font-black text-white shadow-[0_8px_20px_rgba(22,111,175,0.2)] transition hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
              href={facility.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              公式サイトを見る<Icon name="external-link" className="size-4" />
              <span className="sr-only">（新しいタブで開きます）</span>
            </a>
          ) : null}
          <button
            type="button"
            disabled
            title="報告の受け付けはまもなく開始します。それまでは公式サイトの連絡先をご利用ください。"
            className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-brand-300 bg-white px-6 py-3 font-black text-brand-700 opacity-70"
          >
            <Icon name="chat" className="size-4" />この情報が古い場合は知らせる（準備中）
          </button>
        </div>

        <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-6 text-slate-500">
          掲載内容は公開情報をもとに整理したものです。受付時間や条件は変更される場合があるため、
          利用前に公式サイトまたは電話でご確認ください。
        </p>

        <div className="mt-8"><EmergencyContacts /></div>
      </div>
    </div>
  );
}

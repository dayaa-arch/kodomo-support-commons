"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Facility } from "@/src/modules/facility";
import { FacilityCard } from "@/src/modules/facility/presentation/FacilityCard";
import { getSupportThemeLabel, getTargetAudienceLabel } from "@/src/shared/domain/support-taxonomy";
import { getWardLabel } from "@/src/shared/domain/wards";
import { Breadcrumbs } from "@/src/shared/presentation/Breadcrumbs";
import { Button, LinkButton } from "@/src/shared/presentation/Button";
import { Icon } from "@/src/shared/presentation/Icon";

import { searchFacilitiesUseCase } from "../application/usecases/search-facilities";
import type { SearchAnswers } from "../domain/search-answers";
import { FilterPanel } from "./FilterPanel";
import { useSearchSession } from "./SearchSessionProvider";

export function SearchResultsScreen({
  facilities,
}: {
  readonly facilities: readonly Facility[];
}) {
  const router = useRouter();
  const { answers, setAnswers, clearAnswers } = useSearchSession();
  const [filters, setFilters] = useState<SearchAnswers | null>(answers);
  const [filterOpen, setFilterOpen] = useState(false);

  if (!answers || !filters) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon name="search" className="size-8" /></span>
        <h1 className="mt-6 text-2xl font-black text-slate-950 sm:text-3xl">検索条件がまだありません</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">検索内容を保存しないため、直接この画面を開いた場合や再読み込み後は、3問の回答からもう一度始めてください。</p>
        <LinkButton href="/#finder" className="mt-7"><Icon name="arrow-left" className="size-4" />3問の検索をはじめる</LinkButton>
      </div>
    );
  }

  const results = searchFacilitiesUseCase(facilities, answers);

  function resetSearch() {
    clearAnswers();
    router.push("/#finder");
  }

  return (
    <div className="min-h-[70vh] bg-slate-50/70">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        <Breadcrumbs items={[{ href: "/", label: "ホーム" }, { label: "検索結果" }]} />
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-brand-700">あなたに合いそうな支援先</p>
            <h1 id="search-results-heading" className="mt-1 text-3xl font-black text-slate-950">検索結果 {results.length}件</h1>
          </div>
          <Button variant="secondary" className="lg:hidden" aria-expanded={filterOpen} aria-controls="search-filters" onClick={() => setFilterOpen((current) => !current)}>
            <Icon name="search" className="size-4" />条件を変更する<Icon name="chevron-down" className={`size-4 transition ${filterOpen ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <div className="mt-5 rounded-2xl border border-sun-200 bg-sun-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm leading-7 text-sun-900">
            <strong>{getTargetAudienceLabel(answers.targetAudience)}</strong>のために、<strong>{getWardLabel(answers.ward)}</strong>周辺で、<strong>{getSupportThemeLabel(answers.supportTheme)}</strong>について探しています。
          </p>
          <button type="button" onClick={() => setFilterOpen(true)} className="mt-2 inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-black text-brand-700 underline underline-offset-4 sm:mt-0 lg:hidden">条件を変更する<Icon name="arrow-right" className="size-4" /></button>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside id="search-filters" className={`${filterOpen ? "block" : "hidden"} lg:sticky lg:top-24 lg:block`}>
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onSubmit={() => {
                setAnswers(filters);
                setFilterOpen(false);
              }}
              onReset={resetSearch}
            />
          </aside>

          <section aria-labelledby="search-results-heading">
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <FacilityCard key={result.facility.slug} facility={result.facility} rank={index + 1} locationMatch={result.locationMatch} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-brand-100 bg-white px-5 py-14 text-center shadow-sm">
                <Icon name="map-pin" className="mx-auto size-10 text-brand-500" />
                <h2 className="mt-4 text-xl font-black text-slate-950">この条件に合う表示用データはありません</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">地域や困りごとを変えて、もう一度検索してください。</p>
                <Button variant="secondary" className="mt-5" onClick={() => setFilterOpen(true)}>条件を変更する</Button>
              </div>
            )}
            <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs leading-6 text-violet-900">
              <strong>表示用モック:</strong> この結果はUI確認用の架空データです。実際の相談先情報は今後のステップで掲載します。
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

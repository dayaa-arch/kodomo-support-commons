import {
  SUPPORT_THEME_OPTIONS,
  TARGET_AUDIENCE_OPTIONS,
} from "@/src/shared/domain/support-taxonomy";
import { WARD_OPTIONS } from "@/src/shared/domain/wards";
import { Button } from "@/src/shared/presentation/Button";
import { Icon } from "@/src/shared/presentation/Icon";

import type { SearchAnswers } from "../domain/search-answers";

const selectClassName =
  "mt-2 min-h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 pr-9 text-sm font-bold text-slate-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export function FilterPanel({
  filters,
  onChange,
  onSubmit,
  onReset,
}: {
  readonly filters: SearchAnswers;
  readonly onChange: (answers: SearchAnswers) => void;
  readonly onSubmit: () => void;
  readonly onReset: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-2xl border border-brand-100 bg-white p-5 shadow-[0_5px_20px_rgba(29,85,119,0.07)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <h2 className="font-black text-slate-950">絞り込み条件</h2>
        <button type="button" onClick={onReset} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-black text-brand-700 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200">
          <Icon name="reset" className="size-4" />最初から
        </button>
      </div>
      <div className="mt-5 space-y-5">
        <label className="block text-sm font-black text-slate-700">
          誰のために
          <span className="relative block">
            <select className={selectClassName} value={filters.targetAudience} onChange={(event) => onChange({ ...filters, targetAudience: event.target.value as SearchAnswers["targetAudience"] })}>
              {TARGET_AUDIENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <Icon name="chevron-down" className="pointer-events-none absolute bottom-3 right-3 size-4 text-slate-500" />
          </span>
        </label>
        <label className="block text-sm font-black text-slate-700">
          困っていること
          <span className="relative block">
            <select className={selectClassName} value={filters.supportTheme} onChange={(event) => onChange({ ...filters, supportTheme: event.target.value as SearchAnswers["supportTheme"] })}>
              {SUPPORT_THEME_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <Icon name="chevron-down" className="pointer-events-none absolute bottom-3 right-3 size-4 text-slate-500" />
          </span>
        </label>
        <label className="block text-sm font-black text-slate-700">
          地域（区）
          <span className="relative block">
            <select className={selectClassName} value={filters.ward} onChange={(event) => onChange({ ...filters, ward: event.target.value as SearchAnswers["ward"] })}>
              {WARD_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <Icon name="chevron-down" className="pointer-events-none absolute bottom-3 right-3 size-4 text-slate-500" />
          </span>
        </label>
      </div>
      <Button type="submit" className="mt-6 w-full"><Icon name="search" />この条件で再検索</Button>
      <p className="mt-4 text-xs leading-6 text-slate-500">変更した条件もURLや端末には保存されません。</p>
    </form>
  );
}

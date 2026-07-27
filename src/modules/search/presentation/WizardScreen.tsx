"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  SUPPORT_THEME_OPTIONS,
  TARGET_AUDIENCE_OPTIONS,
} from "@/src/shared/domain/support-taxonomy";
import { WARD_OPTIONS } from "@/src/shared/domain/wards";
import { Button } from "@/src/shared/presentation/Button";
import { Icon, type IconName } from "@/src/shared/presentation/Icon";

import {
  toSearchAnswers,
  validateWizardStep,
  type SearchAnswersDraft,
  type WizardStep,
} from "../domain/search-answers";
import { useSearchSession } from "./SearchSessionProvider";

const audienceIcons: Record<string, IconName> = {
  child: "user",
  guardian: "family",
  school: "school",
  supporter: "users",
  other: "sparkles",
};

const themeIcons: Record<string, IconName> = {
  "school-absence": "school",
  "low-mood": "heart",
  family: "family",
  bullying: "users",
  livelihood: "home",
  caregiving: "shield-check",
  other: "sparkles",
};

function ChoiceCard({
  name,
  value,
  label,
  description,
  icon,
  checked,
  onChange,
}: {
  readonly name: string;
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly icon: IconName;
  readonly checked: boolean;
  readonly onChange: () => void;
}) {
  return (
    <label className={`relative flex min-h-18 cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${checked ? "border-brand-500 bg-brand-50 shadow-[0_0_0_1px_#3b91c6]" : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40"}`}>
      <input
        className="peer sr-only"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:ring-4 peer-focus-visible:ring-brand-200" />
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${checked ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-700"}`}>
        <Icon name={icon} />
      </span>
      <span className="min-w-0">
        <span className="block font-black leading-6 text-slate-900">{label}</span>
        {description ? <span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span> : null}
      </span>
      {checked ? <Icon name="check" className="ml-auto size-5 shrink-0 text-brand-700" /> : null}
    </label>
  );
}

export function WizardScreen() {
  const router = useRouter();
  const { answers, setAnswers } = useSearchSession();
  const [step, setStep] = useState<WizardStep>(1);
  const [draft, setDraft] = useState<SearchAnswersDraft>(answers ?? {});
  const [error, setError] = useState<string | null>(null);

  function goNext() {
    const validationError = validateWizardStep(step, draft);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    if (step < 3) {
      setStep((step + 1) as WizardStep);
      return;
    }

    const completedAnswers = toSearchAnswers(draft);
    if (completedAnswers) {
      setAnswers(completedAnswers);
      router.push("/search");
    }
  }

  function goBack() {
    setError(null);
    setStep((step - 1) as WizardStep);
  }

  const question = {
    1: {
      eyebrow: "まず、あなたの立場を教えてください",
      title: "どなたのための支援を探していますか？",
      description: "選んだ立場に合わせて、見やすい情報を優先します。",
    },
    2: {
      eyebrow: "いちばん気になることを1つ",
      title: "どんなことで困っていますか？",
      description: "今もっとも相談したいことに近いものを選んでください。",
    },
    3: {
      eyebrow: "最後の質問です",
      title: "どの地域で探していますか？",
      description: "選んだ区を優先し、通いやすい隣接区の支援先も表示します。",
    },
  }[step];

  return (
    <section id="finder" aria-labelledby="finder-heading" className="scroll-mt-24 bg-slate-50/70 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-[0_16px_48px_rgba(29,85,119,0.11)]">
          <div className="border-b border-brand-100 bg-brand-50/60 px-5 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black tracking-[0.12em] text-brand-700">支援先を探す</p>
                <p className="mt-1 text-sm font-bold text-slate-600">3問中 {step}問目</p>
              </div>
              <ol className="flex items-center gap-2" aria-label={`3問中${step}問目`}>
                {[1, 2, 3].map((number) => (
                  <li key={number} className={`h-2.5 rounded-full transition-all ${number <= step ? "w-9 bg-brand-700" : "w-5 bg-brand-200"}`}>
                    <span className="sr-only">質問{number}{number === step ? "（現在）" : ""}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="px-5 py-7 sm:px-8 sm:py-9">
            <p className="text-sm font-black text-brand-700">{question.eyebrow}</p>
            <h2 id="finder-heading" className="mt-2 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">{question.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{question.description}</p>

            <fieldset className="mt-7">
              <legend className="sr-only">{question.title}</legend>
              {step === 1 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {TARGET_AUDIENCE_OPTIONS.map((option) => (
                    <ChoiceCard
                      key={option.value}
                      name="targetAudience"
                      value={option.value}
                      label={option.label}
                      description={option.description}
                      icon={audienceIcons[option.value]}
                      checked={draft.targetAudience === option.value}
                      onChange={() => {
                        setError(null);
                        setDraft((current) => ({ ...current, targetAudience: option.value }));
                      }}
                    />
                  ))}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {SUPPORT_THEME_OPTIONS.map((option) => (
                    <ChoiceCard
                      key={option.value}
                      name="supportTheme"
                      value={option.value}
                      label={option.label}
                      icon={themeIcons[option.value]}
                      checked={draft.supportTheme === option.value}
                      onChange={() => {
                        setError(null);
                        setDraft((current) => ({ ...current, supportTheme: option.value }));
                      }}
                    />
                  ))}
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                  {WARD_OPTIONS.map((option) => (
                    <label key={option.value} className={`relative flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-center text-sm font-black transition ${draft.ward === option.value ? "border-brand-500 bg-brand-700 text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50"}`}>
                      <input
                        className="peer sr-only"
                        type="radio"
                        name="ward"
                        value={option.value}
                        checked={draft.ward === option.value}
                        onChange={() => {
                          setError(null);
                          setDraft((current) => ({ ...current, ward: option.value }));
                        }}
                      />
                      <span className="pointer-events-none absolute inset-0 rounded-xl peer-focus-visible:ring-4 peer-focus-visible:ring-brand-200" />
                      <Icon name="map-pin" className="size-4 shrink-0" />{option.label}
                    </label>
                  ))}
                </div>
              ) : null}
            </fieldset>

            {step === 1 && draft.targetAudience === "other" ? (
              <div className="mt-5">
                <label htmlFor="target-audience-other" className="text-sm font-black text-slate-800">どなたのために探していますか？</label>
                <input id="target-audience-other" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100" value={draft.targetAudienceOther ?? ""} onChange={(event) => setDraft((current) => ({ ...current, targetAudienceOther: event.target.value }))} aria-describedby={error ? "wizard-error" : undefined} />
              </div>
            ) : null}

            {step === 2 && draft.supportTheme === "other" ? (
              <div className="mt-5">
                <label htmlFor="support-theme-other" className="text-sm font-black text-slate-800">困っていることを入力してください</label>
                <input id="support-theme-other" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100" value={draft.supportThemeOther ?? ""} onChange={(event) => setDraft((current) => ({ ...current, supportThemeOther: event.target.value }))} aria-describedby={error ? "wizard-error" : undefined} />
              </div>
            ) : null}

            <div id="wizard-error" aria-live="polite" className="mt-4 min-h-6 text-sm font-bold text-coral-700">
              {error ? <span className="inline-flex items-center gap-2"><Icon name="alert" className="size-4" />{error}</span> : null}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              {step > 1 ? (
                <Button variant="quiet" onClick={goBack}><Icon name="arrow-left" className="size-4" />前の質問へ</Button>
              ) : <span />}
              <Button onClick={goNext} className="min-w-36">
                {step === 3 ? <Icon name="search" className="size-5" /> : null}
                {step === 3 ? "この条件で探す" : "次の質問へ"}
                {step < 3 ? <Icon name="arrow-right" className="size-4" /> : null}
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs leading-6 text-slate-500">
          <Icon name="shield-check" className="size-4 text-leaf-700" />回答はこの画面を開いている間だけ保持され、URLや端末には保存されません。
        </p>
      </div>
    </section>
  );
}

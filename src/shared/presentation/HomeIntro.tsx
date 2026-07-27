import { Icon, type IconName } from "./Icon";
import { SupportIllustration } from "./SupportIllustration";

const finderSteps: readonly [IconName, string, string][] = [
  ["user", "誰のために", "立場に合う情報へ"],
  ["heart", "どんな困りごと", "一番気になることから"],
  ["map-pin", "どの地域で", "選んだ区と隣接区を表示"],
];

export function HomeIntro() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-brand-100 bg-[radial-gradient(circle_at_15%_15%,#e7f5fb_0,transparent_35%),radial-gradient(circle_at_85%_25%,#fff4d9_0,transparent_30%),linear-gradient(180deg,#fff_0%,#f7fbfe_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white px-3 py-1.5 text-xs font-black text-leaf-800 shadow-sm">
              <Icon name="sparkles" className="size-4" />
              3問で、自分に合う支援先へ
            </span>
            <h1 className="mt-5 text-3xl font-black leading-[1.35] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              困りごとに合う支援先を
              <span className="block text-brand-700">ひとりで抱え込む前に。</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-650 sm:text-lg">
              不登校や学校に行きづらい気持ち、家族の悩みを、安心して相談できる場所から探せます。検索内容は保存されません。
            </p>
            <a
              href="#finder"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-700 px-6 py-3 font-black text-white shadow-[0_10px_24px_rgba(22,111,175,0.25)] transition hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
            >
              <Icon name="search" />
              支援先を探しはじめる
              <Icon name="arrow-right" className="size-4" />
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <SupportIllustration className="w-full drop-shadow-[0_18px_28px_rgba(47,102,127,0.12)]" />
            <div className="absolute -bottom-3 left-4 flex items-center gap-2 rounded-xl border border-brand-100 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-lg sm:left-8 sm:text-sm">
              <Icon name="shield-check" className="size-5 text-leaf-700" />
              登録不要・検索履歴を保存しません
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-brand-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
          {finderSteps.map(([icon, title, description], index) => (
            <div key={title} className="flex items-center gap-3 rounded-xl bg-brand-50/70 px-4 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-black text-white">
                {index + 1}
              </span>
              <Icon name={icon} className="size-5 text-brand-700" />
              <div><p className="font-black text-slate-900">{title}</p><p className="text-xs text-slate-600">{description}</p></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

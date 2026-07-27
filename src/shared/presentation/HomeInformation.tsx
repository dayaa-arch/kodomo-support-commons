import { EmergencyContacts } from "./EmergencyContacts";
import { Icon, type IconName } from "./Icon";

export function HomeInformation() {
  const principles: readonly [IconName, string, string][] = [
    ["shield-check", "検索内容を保存しない", "回答はURL・Cookie・端末の保存領域・サーバへ残しません。"],
    ["check", "確認状況をわかりやすく", "出典と最終確認日、確認済みかどうかを支援先ごとに示します。"],
    ["users", "人の判断を置き換えない", "自動判定や人気ランキングではなく、利用者が比較できる情報を整えます。"],
  ];

  return (
    <>
      <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black tracking-[0.12em] text-leaf-700">このサイトについて</p>
            <h2 id="about-heading" className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">安心して支援先を比べられる、公共的な情報基盤へ</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">よこはま支援さがしは、横浜市内の不登校支援を、問い合わせる前から分かりやすく確認できるようにするOSSプロジェクトです。</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {principles.map(([icon, title, description]) => (
              <article key={title} className="rounded-2xl border border-brand-100 bg-[linear-gradient(145deg,#fff,#f7fbfe)] p-5 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon name={icon} /></span>
                <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="guide" aria-labelledby="guide-heading" className="scroll-mt-24 border-y border-brand-100 bg-brand-50/60 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-black tracking-[0.12em] text-brand-700">はじめての方へ</p>
            <h2 id="guide-heading" className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">正解を選ばなくても大丈夫です</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">今の気持ちにいちばん近い選択肢を選んでください。検索結果から何度でも条件を変えられます。</p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-3">
            {["立場を選ぶ", "困りごとを選ぶ", "地域を選ぶ"].map((label, index) => (
              <li key={label} className="relative rounded-2xl border border-brand-100 bg-white p-5 text-center shadow-sm">
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand-700 font-black text-white">{index + 1}</span>
                <p className="mt-3 font-black text-slate-900">{label}</p>
                {index < 2 ? <Icon name="arrow-right" className="absolute -right-4 top-1/2 z-10 hidden size-5 -translate-y-1/2 text-brand-400 sm:block" /> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><EmergencyContacts /></div>
      </section>
    </>
  );
}

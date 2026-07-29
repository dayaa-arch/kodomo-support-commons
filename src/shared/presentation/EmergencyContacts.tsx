import { Icon } from "./Icon";

export function EmergencyContacts() {
  return (
    <section
      aria-labelledby="emergency-heading"
      className="rounded-2xl border border-coral-300 bg-coral-50 p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-coral-700 shadow-sm">
          <Icon name="alert" />
        </span>
        <div>
          <h2 id="emergency-heading" className="text-lg font-black text-coral-900">
            今すぐ助けが必要な場合
          </h2>
          <p className="mt-1 text-sm leading-6 text-coral-800">
            いのちや身体に関わる危険があるときは、このサイトで探すより先に、下の番号へ連絡してください。
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href="tel:110"
          className="flex items-center gap-3 rounded-xl border border-coral-200 bg-white p-4 transition hover:border-coral-400 hover:bg-coral-50/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200"
        >
          <Icon name="phone" className="size-6 shrink-0 text-coral-600" />
          <div>
            <p className="font-black text-slate-900">110番（警察）</p>
            <p className="text-xs text-slate-500">事件や事故など、身の危険があるとき</p>
          </div>
        </a>
        <a
          href="tel:119"
          className="flex items-center gap-3 rounded-xl border border-coral-200 bg-white p-4 transition hover:border-coral-400 hover:bg-coral-50/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral-200"
        >
          <Icon name="phone" className="size-6 shrink-0 text-coral-600" />
          <div>
            <p className="font-black text-slate-900">119番（救急・消防）</p>
            <p className="text-xs text-slate-500">けがや急な体調の悪化があるとき</p>
          </div>
        </a>
      </div>
    </section>
  );
}

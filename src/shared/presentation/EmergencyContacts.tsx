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
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="emergency-heading" className="text-lg font-black text-coral-900">
              今すぐ助けが必要な場合
            </h2>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-coral-700">
              UI表示モック
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-coral-800">
            実際の緊急通報・公的相談窓口は Step 3 で確認後に接続します。
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-coral-200 bg-white p-4">
          <Icon name="phone" className="size-6 text-coral-600" />
          <div><p className="font-black text-slate-900">緊急時の公的窓口</p><p className="text-xs text-slate-500">接続先は準備中です</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-white p-4">
          <Icon name="chat" className="size-6 text-violet-600" />
          <div><p className="font-black text-slate-900">子ども向け相談窓口</p><p className="text-xs text-slate-500">接続先は準備中です</p></div>
        </div>
      </div>
    </section>
  );
}

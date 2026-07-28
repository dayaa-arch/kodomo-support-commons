import { LinkButton } from "@/src/shared/presentation/Button";
import { Icon } from "@/src/shared/presentation/Icon";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon name="map-pin" className="size-8" /></span>
      <p className="mt-6 text-sm font-black tracking-[0.12em] text-brand-700">404 NOT FOUND</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950">ページが見つかりません</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">URLが変わったか、掲載されていない支援先です。</p>
      <LinkButton href="/" className="mt-7"><Icon name="home" className="size-4" />トップへ戻る</LinkButton>
    </div>
  );
}

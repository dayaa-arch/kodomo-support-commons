export default function FacilityLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-4 w-56 rounded bg-slate-200" />
      <div className="mt-6 rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
        <div className="mt-8 h-56 rounded-2xl bg-brand-50" />
      </div>
    </div>
  );
}

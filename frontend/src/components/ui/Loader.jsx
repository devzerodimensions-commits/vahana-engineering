export default function Loader({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-navy/20 border-t-brand-navy" />
      <p className="mt-4 text-sm">{label}</p>
    </div>
  );
}

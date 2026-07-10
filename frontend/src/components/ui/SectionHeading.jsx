export default function SectionHeading({ eyebrow, title, subtitle, center, light }) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} mb-10`}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-brand-red/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-red">
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl font-extrabold sm:text-4xl ${light ? "text-white" : "text-brand-navy"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-slate-200" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
      {!light && <div className={`mt-5 h-1 w-20 rounded bg-brand-red ${center ? "mx-auto" : ""}`} />}
    </div>
  );
}

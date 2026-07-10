import { Link } from "react-router-dom";

// Reusable inner-page hero banner with breadcrumb.
export default function PageHeader({ title, subtitle, crumb }) {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-16 sm:py-20">
      <div className="absolute inset-0 opacity-20" style={gridBg} />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
      <div className="container-x relative">
        <nav className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-brand-red">{crumb || title}</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-slate-200">{subtitle}</p>}
      </div>
    </section>
  );
}

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

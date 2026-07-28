import { Link } from "react-router-dom";

// Reusable inner-page title banner — uses the industrial banner image as the
// background (with a navy overlay so the white title stays readable).
export default function PageHeader({ title, subtitle, crumb }) {
  return (
    <section
      className="relative overflow-hidden bg-brand-navy bg-cover bg-center py-16 sm:py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,26,77,0.78), rgba(11,19,56,0.86)), url(/page-banner.jpg)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/40 to-transparent" />
      <div className="container-x relative">
        <nav className="mb-3 flex items-center gap-2 text-sm text-slate-200">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-brand-red">{crumb || title}</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-white drop-shadow sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-slate-100">{subtitle}</p>}
      </div>
    </section>
  );
}

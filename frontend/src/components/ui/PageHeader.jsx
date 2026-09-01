import { Link } from "react-router-dom";

// Reusable inner-page title banner.
//
// Flat #F0F4F8 background — no photo, no scrim. Because the surface is now very
// light, every colour in here had to invert: white type measured 1.11:1 against
// it and would have been invisible. Title uses brand navy (12.57:1) and the
// supporting text slate-600 (6.86:1).
//
// The active breadcrumb uses red-DARK, not brand red: the standard red only
// reaches 4.29:1 here, under the 4.5 minimum for small text. It reads as the
// same colour but measures 5.99:1.
export default function PageHeader({ title, subtitle, crumb }) {
  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 py-16 sm:py-20"
      style={{ backgroundColor: "#F0F4F8" }}
    >
      <div className="container-x relative">
        <nav className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
          <Link to="/" className="transition hover:text-brand-red-dark">Home</Link>
          <span className="text-slate-400">/</span>
          <span className="text-brand-red-dark">{crumb || title}</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-brand-navy sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-slate-600">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

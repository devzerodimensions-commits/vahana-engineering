import { Link } from "react-router-dom";

// Reusable inner-page title banner — uses the industrial banner image as the
// background (no overlay). A text shadow keeps the title readable.
export default function PageHeader({ title, subtitle, crumb }) {
  return (
    <section
      className="relative overflow-hidden bg-brand-navy bg-cover bg-center py-16 sm:py-20"
      style={{ backgroundImage: "url(/page-banner.jpg)" }}
    >
      <div className="container-x relative">
        <nav className="mb-3 flex items-center gap-2 text-sm font-medium text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
          <Link to="/" className="hover:text-brand-red">Home</Link>
          <span>/</span>
          <span className="text-brand-red">{crumb || title}</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.7)] sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

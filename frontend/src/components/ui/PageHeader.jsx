import { Link } from "react-router-dom";

// Reusable inner-page title banner.
//
// The photo carries a brand-navy scrim rather than sitting bare. Without one the
// white heading lands on whatever the photo happens to be — on this image that
// is a bright lab coat, and the title washed out. The scrim is heaviest on the
// left where the text sits and eases off to the right so the machine still
// reads. It also means the photo can be swapped later without re-checking
// contrast every time, which the old text-shadow approach could not promise.
export default function PageHeader({ title, subtitle, crumb }) {
  return (
    <section
      className="relative overflow-hidden bg-brand-navy bg-cover bg-center py-16 sm:py-20"
      style={{ backgroundImage: "url(/page-banner-testing.jpg)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(22,37,107,0.92) 0%, rgba(22,37,107,0.72) 55%, rgba(15,26,77,0.55) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="container-x relative">
        <nav className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
          <Link to="/" className="transition hover:text-brand-red">Home</Link>
          <span className="text-white/60">/</span>
          <span className="text-brand-red">{crumb || title}</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-slate-200">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

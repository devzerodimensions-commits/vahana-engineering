import { Link } from "react-router-dom";
import { site, navLinks } from "../../data/site.js";
import Icon from "../ui/Icon.jsx";

export default function Footer() {
  const year = 2026; // build-time year; update as needed
  return (
    // Light footer. The page above it is white, so it needs a top border to
    // read as a distinct band rather than blending into the last section.
    <footer className="border-t border-slate-200 bg-slate-100 text-slate-600">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            {/* Transparent logo — logo.png is opaque white and would show as a
                pale rectangle against the grey. */}
            <img src={site.logoTransparent} alt={site.name} className="h-14 w-auto" />
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{site.description}</p>
          <div className="mt-5 flex gap-3">
            {[
              ["linkedin", site.social.linkedin],
              ["facebook", site.social.facebook],
              ["instagram", site.social.instagram],
              ["youtube", site.social.youtube],
            ].map(([name, href]) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy transition hover:bg-brand-red hover:text-white"
              >
                <Icon name={name} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-navy">Company</h4>
          <ul className="space-y-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="text-slate-600 transition hover:text-brand-red">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products / domains */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-navy">Testing Domains</h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li>Universal &amp; Tensile Testing</li>
            <li>Impact Testing</li>
            <li>Melt Flow &amp; Rheology</li>
            <li>Thermal &amp; Ageing</li>
            <li>Pressure &amp; Pipe Testing</li>
            <li>
              {/* red-dark, not red: on this light grey the standard brand red
                  only reaches 4.33:1 contrast, under the 4.5 AA minimum for
                  small text. red-dark reads the same but measures 6.05:1. */}
              <Link to="/products" className="font-semibold text-brand-red-dark hover:underline">
                View all products →
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-navy">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <Icon name="location" className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <span>{site.addressLong}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="phone" className="h-4 w-4 shrink-0 text-brand-red" />
              <a href={`tel:${site.phone}`} className="transition hover:text-brand-red">{site.phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="mail" className="h-4 w-4 shrink-0 text-brand-red" />
              <a href={`mailto:${site.email}`} className="transition hover:text-brand-red">{site.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-600 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            {site.tagline} · Designed &amp; built for polymer &amp; pipe testing labs.
          </p>
        </div>
      </div>
    </footer>
  );
}

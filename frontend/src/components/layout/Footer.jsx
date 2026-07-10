import { Link } from "react-router-dom";
import { site, navLinks } from "../../data/site.js";
import Icon from "../ui/Icon.jsx";

export default function Footer() {
  const year = 2026; // build-time year; update as needed
  return (
    <footer className="bg-brand-navy-dark text-slate-300">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-lg bg-white px-2 py-1">
              <img src={site.logo} alt={site.name} className="h-10 w-auto" />
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">{site.description}</p>
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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-red"
              >
                <Icon name={name} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Company</h4>
          <ul className="space-y-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="text-slate-400 transition hover:text-brand-red">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products / domains */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Testing Domains</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>Universal & Tensile Testing</li>
            <li>Impact Testing</li>
            <li>Melt Flow & Rheology</li>
            <li>Thermal & Ageing</li>
            <li>Pressure & Pipe Testing</li>
            <li>
              <Link to="/products" className="font-semibold text-brand-red hover:underline">
                View all products →
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <Icon name="location" className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <span>{site.addressLong}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="phone" className="h-4 w-4 shrink-0 text-brand-red" />
              <a href={`tel:${site.phone}`} className="hover:text-white">{site.phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="mail" className="h-4 w-4 shrink-0 text-brand-red" />
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
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

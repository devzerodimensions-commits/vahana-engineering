import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site, navLinks } from "../../data/site.js";
import Icon from "../ui/Icon.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="hidden bg-brand-navy text-white md:block">
        <div className="container-x flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <a href={`tel:${site.phone}`} className="flex items-center gap-1.5 hover:text-brand-red">
              <Icon name="phone" className="h-3.5 w-3.5" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 hover:text-brand-red">
              <Icon name="mail" className="h-3.5 w-3.5" /> {site.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Icon name="clock" className="h-3.5 w-3.5" /> {site.hours}
            </span>
            <div className="flex items-center gap-3">
              <a href={site.social.linkedin} aria-label="LinkedIn" className="hover:text-brand-red">
                <Icon name="linkedin" className="h-4 w-4" />
              </a>
              <a href={site.social.facebook} aria-label="Facebook" className="hover:text-brand-red">
                <Icon name="facebook" className="h-4 w-4" />
              </a>
              <a href={site.social.instagram} aria-label="Instagram" className="hover:text-brand-red">
                <Icon name="instagram" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`bg-white transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}
      >
        <div className="container-x flex h-24 items-center justify-between lg:h-28">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={site.logoHeader}
              alt={site.name}
              className="h-16 w-auto sm:h-20 lg:h-24"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <li key={l.path}>
                <NavLink
                  to={l.path}
                  end={l.path === "/"}
                  className={({ isActive }) =>
                    `rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-brand-red"
                        : "text-brand-navy hover:bg-slate-50 hover:text-brand-red"
                    }`
                  }
                >
                  {l.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Link to="/contact" className="btn-primary">
              Get a Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-brand-navy lg:hidden"
            aria-label="Toggle menu"
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-slate-100 bg-white lg:hidden">
            <ul className="container-x flex flex-col py-3">
              {navLinks.map((l) => (
                <li key={l.path}>
                  <NavLink
                    to={l.path}
                    end={l.path === "/"}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                        isActive ? "bg-brand-navy/5 text-brand-red" : "text-brand-navy"
                      }`
                    }
                  >
                    {l.name}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2">
                <Link to="/contact" className="btn-primary w-full">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

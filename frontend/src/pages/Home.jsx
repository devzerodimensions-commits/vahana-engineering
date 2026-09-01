import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import {
  getCategories,
  getServices,
  getTestimonials,
  getClients,
} from "../services/api.js";
import { site } from "../data/site.js";
import manifest from "../data/products.json";
import { categoryIcon, serviceIcon, industryIcon } from "../lib/ui.js";
import Icon from "../components/ui/Icon.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import HeroSlider from "../components/HeroSlider.jsx";
import Counter from "../components/ui/Counter.jsx";

export default function Home() {
  const { data: categories } = useFetch(getCategories, []);
  const { data: services } = useFetch(getServices, []);
  const { data: testimonials } = useFetch(getTestimonials, []);
  const { data: clients } = useFetch(getClients, []);

  return (
    <>
      {/* ---------------- Hero (image slider — no text, per client) ---------------- */}
      <HeroSlider />

      {/* ---------------- About Vihaana Engineering ----------------
          Sits directly under the hero: the slider carries no text, so without
          this the first words on the page were "Testing Domains We Cover" and a
          first-time visitor had nothing telling them who the company is.
          Copy is deliberately a summary, not a repeat of the About page — the
          same paragraphs on two pages would compete in search results. */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-block rounded-full bg-brand-red/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-red-dark">
              About {site.shortName}
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-brand-navy sm:text-4xl">
              {site.businessLine}
            </h2>
            <div className="mt-5 space-y-4 text-slate-600">
              <p>
                {site.name} designs and manufactures precision material-testing instruments for the
                plastics, polymer, pipe, film and geosynthetics industries — relied on by
                quality-control departments, R&amp;D centres and accredited laboratories across India.
              </p>
              <p>
                From a single instrument to a complete turnkey laboratory, every machine is built
                in-house to Indian Standards and backed by nationwide installation, calibration and
                service.
              </p>
            </div>

            <ul className="mt-6 space-y-3">
              {ABOUT_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red-dark">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/about" className="btn-primary">
                More about us <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-outline">Talk to our team</Link>
            </div>
          </div>

          {/* One large machine rather than a grid — the About page already uses a
              2x2 tile collage, and repeating it would make the pages look alike. */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-slate-50" aria-hidden="true" />
            <div className="relative flex aspect-[4/3] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
              <img
                src="/machines/universal-testing-machine-10-ton.webp"
                alt="Vihaana Engineering Universal Testing Machine – 10 Ton"
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Testing Categories ---------------- */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="What we test"
            title="Testing Domains We Cover"
            subtitle="From tensile strength to melt flow, our instruments span every major polymer and pipe testing standard."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(categories || []).map((c) => (
              <Link
                key={c.slug}
                to={`/products?category=${c.slug}`}
                className="card group p-6 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy transition group-hover:bg-brand-red group-hover:text-white">
                  <Icon name={categoryIcon(c.slug)} className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-brand-navy">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-3">{c.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(c.standards || []).slice(0, 3).map((s) => (
                    <span key={s} className="badge">{s}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Stats ----------------
          Sits under Testing Domains rather than under the hero. The numbers land
          better as proof after the visitor has seen the range than as the first
          thing on the page. Top border added because the section above it is
          slate-50, not white, so it now needs its own edge on both sides. */}
      <section className="border-y border-slate-100 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {site.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-brand-navy sm:text-4xl">
                <Counter value={s.value} />
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Standards & compliance ----------------
          Replaces the old "Why Vihaana" block. The standards listed are read
          from the real product data rather than written by hand, so this can
          never drift out of step with what the instruments actually certify to.
          Deliberately not another icon-card grid — Testing Domains, Services and
          Industries already use that shape, and a fourth would read as filler. */}
      {/* Light #F0F4F8 panel — the same tone used for the page-title bands, so the
          site reads consistently. Bordered top and bottom because the sections
          either side are slate-50 and white, which are close enough to blend. */}
      <section
        className="border-y border-slate-200 py-16 sm:py-20"
        style={{ backgroundColor: "#F0F4F8" }}
      >
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            {/* red-dark, not red: brand red is only 4.29:1 on this panel. */}
            <span className="inline-block rounded-full bg-brand-red/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-red-dark">
              Standards &amp; Compliance
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-brand-navy sm:text-4xl">
              Every instrument, built to Indian Standards
            </h2>
            <p className="mt-4 text-slate-600">
              Our machines are engineered and verified against IS / BIS test methods, so your results
              stand up to audit, certification and customer scrutiny — first time, every time.
            </p>
          </div>

          {/* Each chip is a real filter link, not a label — clicking one lists the
              instruments certified to that standard. The count sets expectations
              before the click. Hover fills navy rather than red: white on navy is
              13.9:1 against red's 4.74, and it avoids competing with the red CTA. */}
          <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {STANDARDS.map((s) => (
              <li key={s.code}>
                <Link
                  to={`/products?standard=${encodeURIComponent(s.code)}`}
                  className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white py-2 pl-4 pr-2.5 text-sm font-semibold text-brand-navy shadow-sm transition hover:border-brand-navy hover:bg-brand-navy hover:text-white"
                  aria-label={`View the ${s.count} instruments certified to ${s.code}`}
                >
                  {s.code}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs tabular-nums text-slate-600 transition group-hover:bg-white/20 group-hover:text-white">
                    {s.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 border-t border-slate-200 pt-10 sm:grid-cols-3">
            {ASSURANCES.map((a) => (
              <div key={a.title} className="text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red text-white">
                  <Icon name={a.icon} className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-brand-navy">{a.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{a.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/products" className="btn-primary">
              Browse all instruments <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Services ---------------- */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            center
            eyebrow="How we help"
            title="Our Services"
            subtitle="Beyond instruments — we set up labs, calibrate, service and train your team end to end."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(services || []).map((s) => (
              <div key={s._id || s.slug} className="card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  <Icon name={serviceIcon(s.icon)} className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-brand-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading center eyebrow="Client feedback" title="Trusted by Testing Labs" />
          <div className="grid gap-6 lg:grid-cols-3">
            {(testimonials || []).map((t) => (
              <figure key={t._id} className="card flex flex-col p-6">
                <Icon name="quote" className="h-8 w-8 text-brand-red/30" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  “{t.message}”
                </blockquote>
                <div className="mt-5 flex items-center gap-1 text-brand-red">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="h-4 w-4" />
                  ))}
                </div>
                <figcaption className="mt-3 border-t border-slate-100 pt-3">
                  <p className="font-bold text-brand-navy">{t.name}</p>
                  <p className="text-xs text-slate-500">
                    {t.role}{t.company ? `, ${t.company}` : ""}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          {clients?.length > 0 && (
            <div className="mt-16">
              <div className="mx-auto mb-9 max-w-xl text-center">
                <span className="mb-2 inline-block rounded-full bg-brand-red/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-red">
                  Industries We Serve
                </span>
                <h3 className="text-2xl font-extrabold text-brand-navy">Trusted across the polymer &amp; pipe industry</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {clients.map((c) => (
                  <div
                    key={c._id}
                    className="group flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-card ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy/5 text-brand-navy transition group-hover:bg-brand-red group-hover:text-white">
                      <Icon name={industryIcon(c.industry, c.name)} className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-bold leading-snug text-brand-navy">{c.name}</p>
                    {c.industry && <p className="mt-1 text-xs font-medium text-slate-400">{c.industry}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <CtaBanner />
    </>
  );
}

// Read the IS/BIS codes straight off the catalogue instead of hard-coding them,
// so the section always reflects what the instruments actually certify to.
// Sorted numerically ("IS 2508" before "IS 13360") — a plain string sort would
// put IS 12235 ahead of IS 2508, which looks like a mistake to anyone in the trade.
// Each standard carries how many instruments certify to it, so the chip tells
// the visitor what they'll get before they click rather than after.
const STANDARDS = Object.entries(
  manifest.products.reduce((acc, p) => {
    for (const s of p.standards || []) acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {})
)
  .map(([code, count]) => ({ code, count }))
  .sort((a, b) => {
    const num = (s) => parseFloat(String(s).replace(/^IS\s*/i, "")) || 0;
    return num(a.code) - num(b.code) || a.code.localeCompare(b.code);
  });

// Counts come from the catalogue so the claims can't go stale as products change.
const DOMAIN_COUNT = new Set(manifest.products.map((p) => p.category)).size;

const ABOUT_POINTS = [
  `${manifest.products.length} testing instruments across ${DOMAIN_COUNT} testing domains`,
  "Engineered and verified to IS / BIS test methods",
  "Installation, calibration, AMC and genuine spares across India",
];

const ASSURANCES = [
  { icon: "target", title: "Calibrated & Verified", text: "Every unit validated against the relevant IS test method before dispatch." },
  { icon: "shield", title: "ISO 9001 Quality System", text: "Manufactured under a certified quality management system." },
  { icon: "wrench", title: "Support Across India", text: "Installation, calibration, AMC and genuine spares." },
];

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-red py-14">
      <div className="absolute inset-0 opacity-10" style={gridBg} />
      <div className="container-x relative flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Ready to equip your testing lab?
          </h2>
          <p className="mt-2 text-white/90">
            Tell us your application and we’ll recommend the right instrument.
          </p>
        </div>
        <Link
          to="/contact"
          className="btn bg-white text-brand-red hover:bg-brand-navy hover:text-white"
        >
          Get a Free Consultation <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

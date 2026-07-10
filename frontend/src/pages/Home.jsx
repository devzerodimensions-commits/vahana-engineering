import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import {
  getCategories,
  getProducts,
  getServices,
  getTestimonials,
  getClients,
} from "../services/api.js";
import { site } from "../data/site.js";
import { categoryIcon, serviceIcon } from "../lib/ui.js";
import Icon from "../components/ui/Icon.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const { data: categories } = useFetch(getCategories, []);
  const { data: featured } = useFetch(() => getProducts({ featured: true }), []);
  const { data: services } = useFetch(getServices, []);
  const { data: testimonials } = useFetch(getTestimonials, []);
  const { data: clients } = useFetch(getClients, []);

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy-dark">
        <div className="absolute inset-0 opacity-[0.15]" style={gridBg} />
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-red/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-navy-light/40 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-brand-red" /> {site.tagline}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Precision <span className="text-brand-red">Testing Instruments</span> for Plastics &amp; Pipes
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">
              {site.name} designs and manufactures universal testing machines, melt-flow, impact,
              thermal and hydrostatic pressure equipment — engineered for accurate, standard-compliant results.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary">
                Explore Products <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-ghost-white">
                Request a Quote
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {["ASTM / ISO / IS compliant", "In-house manufacturing", "Pan-India service"].map((t) => (
                <span key={t} className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <Icon name="check" className="h-4 w-4 text-brand-red" /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="overflow-hidden rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur">
              <img
                src="/products/universal-testing-machine-10-ton.jpg"
                alt="Universal Testing Machine"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl bg-white p-4 shadow-xl sm:block">
              <p className="text-3xl font-extrabold text-brand-navy">25+</p>
              <p className="text-xs font-semibold text-slate-500">Testing Instruments</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {site.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-brand-navy sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
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

      {/* ---------------- Featured Products ---------------- */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Our range" title="Featured Instruments" />
            <Link to="/products" className="btn-outline mb-10">
              View all products <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featured || []).slice(0, 6).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Why choose us ---------------- */}
      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading light eyebrow="Why Vihana" title="Engineered for Accuracy & Reliability" />
            <div className="grid gap-5 sm:grid-cols-2">
              {WHY.map((w) => (
                <div key={w.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red text-white">
                    <Icon name={w.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{w.title}</h4>
                    <p className="mt-1 text-sm text-slate-300">{w.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              "melt-flow-index-mfi-test-apparatus",
              "izod-and-charpy-impact-test-apparatus",
              "hydrostatic-pressure-testing-machine-3-station",
              "vicat-softening-point-test-apparatus",
            ].map((slug, i) => (
              <img
                key={slug}
                src={`/products/${slug}.jpg`}
                alt=""
                className={`aspect-square w-full rounded-xl object-cover ring-1 ring-white/10 ${
                  i % 2 ? "translate-y-6" : ""
                }`}
              />
            ))}
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
            <div className="mt-14">
              <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
                Industries we serve
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {clients.map((c) => (
                  <span
                    key={c._id}
                    className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-navy shadow-sm ring-1 ring-slate-100"
                  >
                    {c.name}
                  </span>
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

const WHY = [
  { icon: "target", title: "Standard Compliant", text: "Built to ASTM, ISO and IS test methods for audit-ready results." },
  { icon: "wrench", title: "Robust Build", text: "Industrial-grade construction for years of dependable service." },
  { icon: "gauge", title: "Digital Precision", text: "Accurate load, temperature and speed control with digital readouts." },
  { icon: "shield", title: "After-Sales Support", text: "Calibration, AMC and genuine spares across India." },
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

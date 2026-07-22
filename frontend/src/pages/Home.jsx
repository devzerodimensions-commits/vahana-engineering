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
import HeroSlider from "../components/HeroSlider.jsx";

export default function Home() {
  const { data: categories } = useFetch(getCategories, []);
  const { data: featured } = useFetch(() => getProducts({ featured: true }), []);
  const { data: services } = useFetch(getServices, []);
  const { data: testimonials } = useFetch(getTestimonials, []);
  const { data: clients } = useFetch(getClients, []);

  return (
    <>
      {/* ---------------- Hero (image slider — no text, per client) ---------------- */}
      <HeroSlider />

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

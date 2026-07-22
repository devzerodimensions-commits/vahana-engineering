import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import manifest from "../data/products.json";
import Icon from "./ui/Icon.jsx";

// Machines shown in the hero carousel (must have a /machines/<slug>.webp cutout).
const SLUGS = [
  "universal-testing-machine-10-ton",
  "melt-flow-index-mfi-test-apparatus",
  "hydrostatic-pressure-testing-machine-3-station",
  "izod-and-charpy-impact-test-apparatus",
  "dart-impact-testing-machine",
  "hot-air-oven",
  "universal-testing-machine-2-ton",
  "tensile-testing-machine",
  "vicat-softening-point-test-apparatus",
  "two-roll-mill",
  "compression-moulding-press",
  "oxidation-induction-time-oit-test-apparatus",
];

const bySlug = Object.fromEntries(manifest.products.map((p) => [p.slug, p]));
const ITEMS = SLUGS.map((slug) => ({
  slug,
  name: bySlug[slug]?.name || slug,
  image: `/machines/${slug}.webp`,
  to: `/products/${slug}`,
}));

const perViewFor = (w) => (w >= 1024 ? 3 : w >= 640 ? 2 : 1);
const INTERVAL = 3500;

export default function HeroSlider() {
  const [perView, setPerView] = useState(
    typeof window !== "undefined" ? perViewFor(window.innerWidth) : 3
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  const n = ITEMS.length;
  const maxIndex = Math.max(0, n - perView);
  const basis = 100 / perView;

  // Responsive columns.
  useEffect(() => {
    const onResize = () => setPerView(perViewFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Keep index valid when column count changes.
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, n - perView)));
  }, [perView, n]);

  // Auto-play.
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, maxIndex]);

  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));

  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  return (
    <section className="border-b border-slate-100 bg-slate-50 py-8 sm:py-10">
      <div
        className="container-x relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * basis}%)` }}
          >
            {ITEMS.map((it, i) => (
              <div key={it.slug} className="flex-none px-2 sm:px-3" style={{ width: `${basis}%` }}>
                <Link
                  to={it.to}
                  aria-label={it.name}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="flex h-56 items-center justify-center p-5 sm:h-64 lg:h-72">
                    <img
                      src={it.image}
                      alt={it.name}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute -left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-navy shadow-md ring-1 ring-slate-200 transition hover:bg-brand-navy hover:text-white sm:-left-3 sm:h-12 sm:w-12"
        >
          <Icon name="arrowLeft" className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute -right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-navy shadow-md ring-1 ring-slate-200 transition hover:bg-brand-navy hover:text-white sm:-right-3 sm:h-12 sm:w-12"
        >
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to position ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-7 bg-brand-red" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

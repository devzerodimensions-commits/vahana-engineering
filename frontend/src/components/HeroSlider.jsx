import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import manifest from "../data/products.json";
import Icon from "./ui/Icon.jsx";

// Machines shown in the carousel (transparent cutouts on the industrial background).
// Order is client-specified — keep in sync with _scripts/make-cutouts.mjs and
// _scripts/make-machine-cards.mjs, which generate /machines/<slug>.webp for each.
const SLUGS = [
  "universal-testing-machine-2-ton",
  "tensile-testing-machine-wst",
  "hydrostatic-pressure-testing-machine-3-station",
  "universal-testing-machine-geomembrane-and-fabric",
  "melt-flow-index-mfi-test-apparatus",
  "carbon-black-content-test-apparatus",
  "oxidation-induction-time-oit-test-apparatus",
  "vicat-softening-point-test-apparatus",
  "emission-flow-variation-test-apparatus",
  "contour-cutter",
  "hot-air-oven",
  "two-roll-mill",
];

const bySlug = Object.fromEntries(manifest.products.map((p) => [p.slug, p]));
const ITEMS = SLUGS.map((slug) => ({
  slug,
  name: bySlug[slug]?.name || slug,
  image: `/machines/${slug}.webp`,
  to: `/products/${slug}`,
}));

const perViewFor = (w) => (w >= 1024 ? 4 : w >= 640 ? 2 : 1);
const INTERVAL = 3000;

export default function HeroSlider() {
  const [perView, setPerView] = useState(
    typeof window !== "undefined" ? perViewFor(window.innerWidth) : 4
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  const n = ITEMS.length;
  const maxIndex = Math.max(0, n - perView);
  const basis = 100 / perView;

  useEffect(() => {
    const onResize = () => setPerView(perViewFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, n - perView)));
  }, [perView, n]);

  // Auto-scroll one machine at a time.
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
    <section className="relative overflow-hidden border-b-4 border-brand-red bg-gradient-to-b from-slate-100 to-slate-200">
      <div
        className="container-x relative py-16 sm:py-24"
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
                  className="group block"
                >
                  {/* uniform box — all machines are normalised to the same size (no crop) */}
                  <div className="flex aspect-[11/10] items-center justify-center">
                    <img
                      src={it.image}
                      alt={it.name}
                      loading={i < 4 ? "eager" : "lazy"}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
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
          className="absolute -left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-navy shadow-md ring-1 ring-slate-300 transition hover:bg-brand-red hover:text-white sm:left-1 sm:h-12 sm:w-12"
        >
          <Icon name="arrowLeft" className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute -right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-navy shadow-md ring-1 ring-slate-300 transition hover:bg-brand-red hover:text-white sm:right-1 sm:h-12 sm:w-12"
        >
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

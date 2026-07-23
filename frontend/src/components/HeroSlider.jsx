import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "./ui/Icon.jsx";

// Full-width hero banners built from industrial stock photos + brand overlay (no text).
const SLIDES = [
  { image: "/banners/banner-1.jpg", alt: "Precision engineering — Vihana Engineering", to: "/products" },
  { image: "/banners/banner-2.jpg", alt: "Advanced machining — Vihana Engineering", to: "/products" },
  { image: "/banners/banner-3.jpg", alt: "Quality testing & control — Vihana Engineering", to: "/products" },
  { image: "/banners/banner-4.jpg", alt: "Manufacturing precision — Vihana Engineering", to: "/products" },
  { image: "/banners/banner-5.jpg", alt: "Production & inspection — Vihana Engineering", to: "/products" },
];

const INTERVAL = 4500;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SLIDES.length;
  const touchX = useRef(null);

  const goTo = (i) => setIndex(((i % n) + n) % n);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setIndex((p) => (p + 1) % n), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, n]);

  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden border-b border-slate-100 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <Link key={s.image} to={s.to} className="block w-full flex-none" aria-label={s.alt} tabIndex={i === index ? 0 : -1}>
            <img
              src={s.image}
              alt={s.alt}
              loading={i === 0 ? "eager" : "lazy"}
              className="aspect-[20/7] w-full object-cover"
            />
          </Link>
        ))}
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md ring-1 ring-slate-200 transition hover:bg-brand-navy hover:text-white sm:left-5 sm:h-12 sm:w-12"
      >
        <Icon name="arrowLeft" className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md ring-1 ring-slate-200 transition hover:bg-brand-navy hover:text-white sm:right-5 sm:h-12 sm:w-12"
      >
        <Icon name="arrowRight" className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-7 bg-brand-red" : "w-2.5 bg-brand-navy/25 hover:bg-brand-navy/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from "react";
import Icon from "./ui/Icon.jsx";

// Image-only hero slider (auto-play, arrows, dots) — no text, per client request.
const SLIDES = [
  { image: "/slides/universal-testing-machine-10-ton.jpg", alt: "Universal Testing Machine – 10 Ton" },
  { image: "/slides/melt-flow-index-mfi-test-apparatus.jpg", alt: "Melt Flow Index Test Apparatus" },
  { image: "/slides/izod-and-charpy-impact-test-apparatus.jpg", alt: "Izod & Charpy Impact Test Apparatus" },
  { image: "/slides/hydrostatic-pressure-testing-machine-3-station.jpg", alt: "Hydrostatic Pressure Testing Machine" },
  { image: "/slides/dart-impact-testing-machine.jpg", alt: "Dart Impact Testing Machine" },
  { image: "/slides/tensile-testing-machine.jpg", alt: "Tensile Testing Machine" },
];

const INTERVAL = 4000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SLIDES.length;
  const touchX = useRef(null);

  const goTo = (i) => setIndex(((i % n) + n) % n);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Auto-advance; timer re-arms whenever the slide changes and pauses on hover.
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setIndex((p) => (p + 1) % n), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, n]);

  // Basic swipe support for touch devices.
  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden border-b border-slate-100 bg-slate-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div className="relative h-[340px] sm:h-[440px] lg:h-[560px]">
        {/* Track */}
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.image}
              className="flex h-full w-full flex-none items-center justify-center bg-gradient-to-b from-white to-slate-100 p-6 sm:p-10"
            >
              <img
                src={s.image}
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                className="max-h-full w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md ring-1 ring-slate-200 transition hover:bg-brand-navy hover:text-white sm:left-5"
        >
          <Icon name="arrowLeft" className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md ring-1 ring-slate-200 transition hover:bg-brand-navy hover:text-white sm:right-5"
        >
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
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

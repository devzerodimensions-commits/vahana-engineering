import { useEffect, useRef, useState } from "react";

// Animated count-up. Parses "500+" into 500 + "+" suffix, then counts up from 0
// when the element scrolls into view (or immediately if already visible).
// A safety fallback guarantees the final number always shows.
export default function Counter({ value, duration = 1600 }) {
  const target = parseInt(String(value).replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = String(value).replace(/[0-9]/g, ""); // "+", "" etc.
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      if (started.current) return;
      started.current = true;
      const startTime = performance.now();
      const step = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setDisplay(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
        else setDisplay(target);
      };
      requestAnimationFrame(step);
    };

    // Already in view on mount?
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) animate();

    // Otherwise, start when scrolled into view.
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && animate(),
      { threshold: 0.2 }
    );
    io.observe(el);

    // Safety net: never leave it stuck on 0.
    const fallback = setTimeout(() => {
      if (!started.current) {
        started.current = true;
        setDisplay(target);
      }
    }, 4000);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [target, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

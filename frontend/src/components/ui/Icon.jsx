// Lightweight inline SVG icon set (no external icon dependency).
const paths = {
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 18l-6-6 6-6",
  check: "M20 6L9 17l-5-5",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16v16H4zM22 6l-10 7L2 6",
  location:
    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  menu: "M3 12h18M3 6h18M3 18h18",
  close: "M18 6L6 18M6 6l12 12",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  flask: "M9 2h6M10 2v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V2M7 15h10",
  building: "M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M9 7h2M9 11h2M9 15h2M19 21V11h-4",
  wrench:
    "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.3-2.3 2.1-2.1z",
  graduation: "M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5",
  quote: "M7 7h5v5H8v2a2 2 0 0 0 2 2v2a4 4 0 0 1-4-4V7zM15 7h5v5h-4v2a2 2 0 0 0 2 2v2a4 4 0 0 1-4-4V7z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  gauge: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 12l4-4",
  layers: "M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  briefcase: "M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  linkedin: "M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6zM6 9H2v11h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  instagram: "M4 4h16v16H4zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01",
  youtube: "M22 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.3 5 12 5 12 5s-4.3 0-7.1.2c-.4 0-1.3 0-2.1.9C2.2 6.6 2 8 2 8S1.8 9.6 1.8 11.2v1.5C1.8 14.4 2 16 2 16s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.7.2 6.8.2 6.8.2s4.3 0 7.1-.2c.4 0 1.3 0 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22.2 9.6 22 8 22 8zM10 14.5v-5l4.5 2.5-4.5 2.5z",
  whatsapp: "M12 2a10 10 0 0 0-8.6 15l-1 4 4.1-1A10 10 0 1 0 12 2zM8 8c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2 0 .4-.1.5l-.5.6c-.1.1-.2.3-.1.5.3.7 1.4 1.8 2.4 2.2.2.1.4 0 .5-.1l.5-.6c.1-.2.3-.2.5-.1l1.6.8c.2.1.3.3.3.5 0 .6-.3 1.2-1 1.4-.6.2-1.4.2-3.3-.6-2.3-1-3.8-3.4-3.9-3.6-.1-.2-.9-1.2-.9-2.3 0-1.1.6-1.6.8-1.8z",
  test: "M9 3h6v2l-1 1v4l4 7a2 2 0 0 1-1.8 3H7.8A2 2 0 0 1 6 17l4-7V6L9 5V3z",
};

export default function Icon({ name, className = "w-5 h-5", strokeWidth = 2, ...props }) {
  const d = paths[name];
  if (!d) return null;
  const filled = ["star", "quote"].includes(name);
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={d} />
    </svg>
  );
}

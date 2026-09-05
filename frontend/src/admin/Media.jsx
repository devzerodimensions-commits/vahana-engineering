import { useMemo, useState } from "react";
import media from "../data/media.json";
import Icon from "../components/ui/Icon.jsx";

// Media library — every image on the website, in one place.
//
// The list is generated at build time by _scripts/make-media-manifest.mjs. It
// is NOT fetched from the API: the images are static files under
// frontend/public, and the deployed API has backend/ as its root directory, so
// it cannot see them. A build-time index also means this page still works while
// the free API instance is asleep.
//
// The point is practical: when adding a product you need the image path for the
// Image field. Before this, you had to know the filename by heart.

const GROUPS = ["All", ...new Set(media.items.map((i) => i.group))];

const kb = (b) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

export default function Media() {
  const [group, setGroup] = useState("All");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return media.items.filter(
      (i) =>
        (group === "All" || i.group === group) &&
        (!q || i.name.toLowerCase().includes(q) || i.file.toLowerCase().includes(q) || (i.usedBy || "").toLowerCase().includes(q))
    );
  }, [group, query]);

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API needs a secure context; fall back so the button still works.
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-ink">Media</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every image on the website. Click <span className="font-semibold">Copy path</span> and paste it into a
        product&apos;s Image field.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {GROUPS.map((g) => {
            const n = g === "All" ? media.items.length : media.items.filter((i) => i.group === g).length;
            return (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                  group === g
                    ? "bg-brand-ink text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-brand-ink"
                }`}
              >
                {g} <span className="opacity-60">{n}</span>
              </button>
            );
          })}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search images…"
          className="field sm:max-w-xs"
        />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing <span className="font-bold text-brand-ink">{items.length}</span> of {media.items.length} images
      </p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-slate-50 py-16 text-center text-slate-500">No images match that search.</div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((i) => (
            <div key={i.url} className="card overflow-hidden">
              {/* Checkerboard: many of these are transparent cutouts, which are
                  invisible on a plain white tile. */}
              <div
                className="flex h-40 items-center justify-center border-b border-slate-100 p-3"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg,#f1f5f9 25%,transparent 25%),linear-gradient(-45deg,#f1f5f9 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#f1f5f9 75%),linear-gradient(-45deg,transparent 75%,#f1f5f9 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
                }}
              >
                <img src={i.url} alt={i.name} loading="lazy" className="h-full w-full object-contain" />
              </div>

              <div className="p-4">
                <p className="truncate text-sm font-bold text-brand-ink" title={i.name}>
                  {i.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400" title={i.url}>
                  {i.url}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  {i.width && <span>{i.width}×{i.height}</span>}
                  <span>{kb(i.bytes)}</span>
                </div>

                {i.usedBy && (
                  <p className="mt-2 truncate text-xs text-slate-500" title={i.usedBy}>
                    Used by <span className="font-semibold text-brand-ink">{i.usedBy}</span>
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => copy(i.url)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      copied === i.url
                        ? "bg-green-600 text-white"
                        : "bg-brand-ink text-white hover:bg-brand-ink-light"
                    }`}
                  >
                    {copied === i.url ? "Copied!" : "Copy path"}
                  </button>
                  <a
                    href={i.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand-ink hover:text-brand-ink"
                    title="Open full size"
                  >
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        <strong className="text-brand-ink">Adding new images:</strong> these files ship with the website, so a new
        photo has to be added to the project and redeployed — it can&apos;t be uploaded here yet. Ask your developer
        to enable uploads if you need to add machines yourself.
      </div>
    </div>
  );
}

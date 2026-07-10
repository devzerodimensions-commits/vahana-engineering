import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import { getGallery } from "../services/api.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Icon from "../components/ui/Icon.jsx";

export default function Gallery() {
  const { data: items } = useFetch(getGallery, []);
  const [active, setActive] = useState(null);

  return (
    <>
      <PageHeader
        title="Gallery"
        crumb="Gallery"
        subtitle="A look at our range of material-testing instruments and laboratory equipment."
      />

      <section className="py-14">
        <div className="container-x">
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {(items || []).map((g) => (
              <button
                key={g._id}
                onClick={() => setActive(g)}
                className="group relative block w-full overflow-hidden rounded-xl ring-1 ring-slate-100"
              >
                <img
                  src={g.image}
                  alt={g.title}
                  loading="lazy"
                  className="w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                  <span className="text-sm font-semibold text-white">{g.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <Icon name="close" className="h-6 w-6" />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-3xl">
            <img src={active.image} alt={active.title} className="max-h-[80vh] w-full rounded-lg object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white">{active.title}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

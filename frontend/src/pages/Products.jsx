import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getProducts, getCategories } from "../services/api.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/ui/Loader.jsx";
import Icon from "../components/ui/Icon.jsx";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [query, setQuery] = useState("");

  const { data: categories } = useFetch(getCategories, []);
  const { data: products, loading } = useFetch(getProducts, []);

  const filtered = useMemo(() => {
    let list = products || [];
    if (activeCategory !== "all") list = list.filter((p) => p.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.summary?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCategory, query]);

  const setCategory = (slug) => {
    if (slug === "all") setSearchParams({});
    else setSearchParams({ category: slug });
  };

  return (
    <>
      <PageHeader
        title="Our Products"
        crumb="Products"
        subtitle="A complete range of material-testing instruments for plastics, polymers, pipes, films and geosynthetics."
      />

      <section className="py-14">
        <div className="container-x">
          {/* Search */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-bold text-brand-navy">{filtered.length}</span> instruments
            </p>
            <div className="relative w-full sm:max-w-xs">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search instruments…"
                className="field pl-10"
              />
              <Icon name="target" className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Category chips */}
          <div className="mb-10 flex flex-wrap gap-2">
            <Chip active={activeCategory === "all"} onClick={() => setCategory("all")}>
              All Products
            </Chip>
            {(categories || []).map((c) => (
              <Chip
                key={c.slug}
                active={activeCategory === c.slug}
                onClick={() => setCategory(c.slug)}
              >
                {c.name}
              </Chip>
            ))}
          </div>

          {loading ? (
            <Loader label="Loading products…" />
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 py-20 text-center text-slate-500">
              No products match your search.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-brand-navy text-white shadow"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

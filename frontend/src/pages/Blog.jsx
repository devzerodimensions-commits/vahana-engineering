import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getBlogs } from "../services/api.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Icon from "../components/ui/Icon.jsx";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

export default function Blog() {
  const { data: blogs } = useFetch(getBlogs, []);

  return (
    <>
      <PageHeader
        title="Insights & Resources"
        crumb="Blog"
        subtitle="Guides and articles on material testing methods, standards and best practices."
      />

      <section className="py-16">
        <div className="container-x grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(blogs || []).map((b) => (
            <article key={b._id} className="card flex flex-col overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden bg-brand-navy/5">
                {b.image ? (
                  <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-navy to-brand-navy-light text-white">
                    <Icon name="flask" className="h-12 w-12 opacity-60" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {(b.tags || []).slice(0, 2).map((t) => (
                    <span key={t} className="badge">{t}</span>
                  ))}
                </div>
                <h3 className="text-lg font-bold leading-snug text-brand-navy">
                  <Link to={`/blog/${b.slug}`} className="hover:text-brand-red">{b.title}</Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">{b.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                  <span>{fmtDate(b.publishedAt || b.createdAt)}</span>
                  <Link to={`/blog/${b.slug}`} className="font-semibold text-brand-red">Read more →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

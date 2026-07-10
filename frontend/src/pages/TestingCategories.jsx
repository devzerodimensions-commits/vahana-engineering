import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getCategories } from "../services/api.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Icon from "../components/ui/Icon.jsx";
import { categoryIcon } from "../lib/ui.js";

export default function TestingCategories() {
  const { data: categories } = useFetch(getCategories, []);

  return (
    <>
      <PageHeader
        title="Testing Categories"
        crumb="Testing"
        subtitle="Explore the polymer and pipe testing domains our instruments cover, with their applicable standards."
      />

      <section className="py-16">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {(categories || []).map((c) => (
            <div key={c.slug} className="card p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white">
                  <Icon name={categoryIcon(c.slug)} className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-navy">{c.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.blurb}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {(c.standards || []).map((s) => (
                  <span key={s} className="badge">{s}</span>
                ))}
              </div>
              <Link
                to={`/products?category=${c.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:gap-2.5"
              >
                View instruments <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

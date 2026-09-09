import { Link, useParams, Navigate } from "react-router-dom";
import { standards } from "../data/standards.json";
import { site } from "../data/site.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Icon from "../components/ui/Icon.jsx";
import { CtaBanner } from "./Home.jsx";

// The full picture for one product standard: what it covers and every
// instrument a manufacturer needs to test to it.
//
// Reached from the home page cards. Instruments that exist as products link to
// their page; the rest are shown as "available on request" rather than linking
// somewhere wrong — several are genuinely absent from the current catalogue.
export default function StandardDetail() {
  const { slug } = useParams();
  const standard = standards.find((s) => s.slug === slug);

  // Unknown slug goes to the products page rather than a dead end.
  if (!standard) return <Navigate to="/products" replace />;

  const { product, codes, note, instruments, instrumentCount, linkedCount } = standard;
  const others = standards.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHeader
        title={product}
        crumb={product}
        subtitle={`${codes.join(" · ")} — the complete set of ${instrumentCount} testing instruments required to manufacture and certify to this standard.`}
      />

      {/* Summary strip */}
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="container-x grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Standard</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {codes.map((c) => (
                <span key={c} className="badge">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Application</p>
            <p className="mt-2 font-semibold text-brand-navy">{note}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Instruments required</p>
            <p className="mt-2 font-semibold text-brand-navy">
              {instrumentCount} <span className="font-normal text-slate-500">({linkedCount} supplied by us)</span>
            </p>
          </div>
        </div>
      </section>

      {/* Instruments we supply */}
      <section className="py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Testing equipment"
            title={`Instruments for ${product}`}
            subtitle={`Everything below is called for by ${codes.join(" / ")}. Click any instrument for its full specification.`}
          />

          {/* EVERY instrument appears in this one grid. Splitting the
              catalogue-only machines into a separate box below meant the header
              said "10 instruments" while the grid showed 9, and the client
              reasonably read that as a missing product. Machines without a page
              are still shown — greyed, marked "Available on request" — so the
              count on screen always reconciles with the stated total. */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instruments.map((i) =>
              i.slug ? (
                <Link
                  key={i.model}
                  to={`/products/${i.slug}`}
                  className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="flex h-44 items-center justify-center border-b border-slate-100 bg-slate-50 p-4">
                    {i.image ? (
                      <img
                        src={i.image}
                        alt={i.productName || i.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Icon name="layers" className="h-10 w-10 text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-brand-navy">{i.productName || i.name}</h3>
                    <p className="mt-1 text-xs font-medium text-slate-400">Model {i.model}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-red-dark">
                      View specification <Icon name="arrowRight" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ) : (
                <div key={i.model} className="card flex flex-col overflow-hidden">
                  <div className="flex h-44 items-center justify-center border-b border-slate-100 bg-slate-50 p-4">
                    <Icon name="layers" className="h-10 w-10 text-slate-300" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-brand-navy">{i.name}</h3>
                    <p className="mt-1 text-xs font-medium text-slate-400">Model {i.model}</p>
                    <span className="mt-3 inline-block w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      Available on request
                    </span>
                    <Link
                      to="/contact"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-red-dark hover:underline"
                    >
                      Enquire <Icon name="arrowRight" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Other standards */}
      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="container-x">
          <h2 className="text-xl font-bold text-brand-navy">Other product standards</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((s) => (
              <Link
                key={s.slug}
                to={`/standards/${s.slug}`}
                className="card p-4 transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex flex-wrap gap-1">
                  {s.codes.map((c) => (
                    <span key={c} className="badge">{c}</span>
                  ))}
                </div>
                <p className="mt-2 text-sm font-bold text-brand-navy">{s.product}</p>
                <p className="text-xs text-slate-500">{s.instrumentCount} instruments</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

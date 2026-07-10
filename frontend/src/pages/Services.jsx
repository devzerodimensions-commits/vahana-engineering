import useFetch from "../hooks/useFetch.js";
import { getServices } from "../services/api.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Icon from "../components/ui/Icon.jsx";
import { serviceIcon } from "../lib/ui.js";
import { CtaBanner } from "./Home.jsx";

export default function Services() {
  const { data: services } = useFetch(getServices, []);

  return (
    <>
      <PageHeader
        title="Our Services"
        crumb="Services"
        subtitle="From instrument supply to complete laboratory setup, calibration and training."
      />

      <section className="py-16">
        <div className="container-x grid gap-8">
          {(services || []).map((s, i) => (
            <div
              key={s._id || s.slug}
              className={`card grid items-center gap-6 p-6 md:grid-cols-[auto,1fr] ${
                i % 2 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy text-white">
                <Icon name={serviceIcon(s.icon)} className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy">{s.title}</h3>
                <p className="mt-2 text-slate-600">{s.summary}</p>
                {s.features?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Icon name="check" className="h-4 w-4 text-brand-red" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

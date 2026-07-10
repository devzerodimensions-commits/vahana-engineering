import useFetch from "../hooks/useFetch.js";
import { getCertifications } from "../services/api.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Icon from "../components/ui/Icon.jsx";

export default function Certifications() {
  const { data: certs } = useFetch(getCertifications, []);

  return (
    <>
      <PageHeader
        title="Certifications & Quality"
        crumb="Certifications"
        subtitle="Our commitment to quality is backed by recognised certifications and standards."
      />

      <section className="py-16">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(certs || []).map((c) => (
            <div key={c._id} className="card p-7 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy">
                <Icon name="shield" className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-brand-navy">{c.title}</h3>
              {c.issuer && <p className="mt-1 text-sm font-medium text-brand-red">{c.issuer}</p>}
              {c.description && <p className="mt-3 text-sm text-slate-500">{c.description}</p>}
              {c.file && (
                <a href={c.file} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-red">
                  <Icon name="download" className="h-4 w-4" /> Download
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="container-x mt-14">
          <div className="rounded-2xl bg-brand-navy px-8 py-10 text-center text-white">
            <h2 className="text-2xl font-extrabold">Quality You Can Measure</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-200">
              Every instrument is tested and calibrated before dispatch, with traceable calibration
              support to help you maintain NABL and ISO compliance in your own laboratory.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Icon from "../components/ui/Icon.jsx";
import { site } from "../data/site.js";
import { CtaBanner } from "./Home.jsx";

const VALUES = [
  { icon: "target", title: "Accuracy First", text: "Every instrument is calibrated and validated against recognised test standards." },
  { icon: "shield", title: "Reliability", text: "Rugged, industrial-grade builds that perform consistently for years." },
  { icon: "wrench", title: "Support", text: "Responsive installation, calibration and after-sales service across India." },
  { icon: "graduation", title: "Expertise", text: "Deep application knowledge in polymer, pipe and geosynthetic testing." },
];

export default function About() {
  return (
    <>
      <PageHeader
        title="About Vihana Engineering"
        crumb="About"
        subtitle="Your trusted manufacturing partner for material-testing instruments."
      />

      <section className="py-16">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Who we are" title="Building the instruments labs rely on" />
            <div className="space-y-4 text-slate-600">
              <p>
                {site.name} is a manufacturer and supplier of precision material-testing equipment for
                the plastics, polymer, pipe, film and geosynthetics industries. Guided by our promise —
                <span className="font-semibold text-brand-navy"> “{site.tagline}” </span> — we help
                quality-control departments, R&amp;D centres and accredited laboratories test to the
                highest standards.
              </p>
              <p>
                Our range spans universal &amp; tensile testing machines, impact testers, melt-flow
                index apparatus, hydrostatic pressure rigs, ovens, baths, chambers and specimen
                preparation equipment — all engineered for accuracy, repeatability and compliance with
                ASTM, ISO and IS methods.
              </p>
              <p>
                From single instruments to complete turnkey laboratories, we support our customers with
                installation, calibration, training and dependable after-sales service.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <Link to="/products" className="btn-primary">Our Products</Link>
              <Link to="/contact" className="btn-outline">Contact Us</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/products/universal-testing-machine-2-ton.jpg" alt="" className="rounded-xl object-cover shadow-card" />
            <img src="/products/hot-air-oven.jpg" alt="" className="mt-8 rounded-xl object-cover shadow-card" />
            <img src="/products/melt-flow-index-mfi-test-apparatus.jpg" alt="" className="rounded-xl object-cover shadow-card" />
            <img src="/products/dart-impact-testing-machine.jpg" alt="" className="mt-8 rounded-xl object-cover shadow-card" />
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-slate-50 py-16">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-white">
              <Icon name="target" className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Our Mission</h3>
            <p className="mt-3 text-slate-600">
              To deliver accurate, standard-compliant and affordable testing instruments that empower
              manufacturers and laboratories to guarantee product quality.
            </p>
          </div>
          <div className="card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red text-white">
              <Icon name="gauge" className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Our Vision</h3>
            <p className="mt-3 text-slate-600">
              To be the most trusted testing partner for the polymer and pipe industry — recognised for
              precision engineering and outstanding support.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container-x">
          <SectionHeading center eyebrow="What drives us" title="Our Core Values" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  <Icon name={v.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-brand-navy">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

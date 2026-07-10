import { useState } from "react";
import { submitContact } from "../services/api.js";
import { site } from "../data/site.js";
import PageHeader from "../components/ui/PageHeader.jsx";
import Icon from "../components/ui/Icon.jsx";

const CONTACTS = [
  { icon: "location", title: "Visit Us", lines: [site.addressLong] },
  { icon: "phone", title: "Call Us", lines: [site.phone], href: `tel:${site.phone}` },
  { icon: "mail", title: "Email Us", lines: [site.email], href: `mailto:${site.email}` },
  { icon: "clock", title: "Working Hours", lines: [site.hours] },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    try {
      await submitContact(form);
      setStatus({ state: "success", msg: "Thanks for reaching out! We’ll respond within one business day." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus({ state: "error", msg: "Could not send your message. Please email or call us directly." });
    }
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        crumb="Contact"
        subtitle="Tell us about your testing requirement and our team will recommend the right instrument."
      />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr,1.2fr]">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy">Get in Touch</h2>
            <p className="mt-2 text-slate-600">
              We’re here to help with product selection, quotations, calibration and support.
            </p>

            <div className="mt-6 flex items-center gap-4 rounded-xl bg-brand-navy px-5 py-4 text-white">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg font-bold">
                {site.contactPerson.split(" ").slice(-1)[0][0]}
              </div>
              <div>
                <p className="font-bold">{site.contactPerson}</p>
                <p className="text-sm text-slate-300">{site.contactPersonRole}</p>
              </div>
              <a href={`tel:${site.phone}`} className="ml-auto flex items-center gap-1.5 rounded-lg bg-brand-red px-3 py-2 text-sm font-semibold hover:bg-brand-red-dark">
                <Icon name="phone" className="h-4 w-4" /> Call
              </a>
            </div>

            <div className="mt-6 space-y-4">
              {CONTACTS.map((c) => (
                <div key={c.title} className="card flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-navy">{c.title}</h3>
                    {c.lines.map((l) =>
                      c.href ? (
                        <a key={l} href={c.href} className="block text-sm text-slate-600 hover:text-brand-red">{l}</a>
                      ) : (
                        <p key={l} className="text-sm text-slate-600">{l}</p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card p-7">
            <h2 className="text-xl font-bold text-brand-navy">Send a Message</h2>
            {status.state === "success" ? (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-4 text-sm font-medium text-green-700">
                <Icon name="check" className="h-5 w-5" /> {status.msg}
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Full Name *</label>
                  <input required name="name" value={form.name} onChange={change} className="field" />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input required type="email" name="email" value={form.email} onChange={change} className="field" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input name="phone" value={form.phone} onChange={change} className="field" />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input name="subject" value={form.subject} onChange={change} className="field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Message *</label>
                  <textarea required name="message" value={form.message} onChange={change} rows={5} className="field" />
                </div>
                {status.state === "error" && (
                  <p className="text-sm text-brand-red sm:col-span-2">{status.msg}</p>
                )}
                <button disabled={status.state === "loading"} className="btn-primary sm:col-span-2">
                  {status.state === "loading" ? "Sending…" : "Send Message"}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

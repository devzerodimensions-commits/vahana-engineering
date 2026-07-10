import { useEffect, useState } from "react";
import { resource as resourceApi } from "../services/admin.js";
import Icon from "../components/ui/Icon.jsx";
import Loader from "../components/ui/Loader.jsx";

const fmt = (d) => (d ? new Date(d).toLocaleString("en-IN") : "");

// Shared inbox screen for inquiries and contact messages.
export default function Inbox({ type }) {
  const isInquiry = type === "inquiries";
  const api = resourceApi(type);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    setError("");
    api
      .list()
      .then((d) => setItems(d || []))
      .catch((e) => setError(e?.response?.data?.message || "Could not load. Is the backend running?"))
      .finally(() => setLoading(false));
  };
  useEffect(load, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (id) => {
    if (!confirm("Delete this record?")) return;
    await api.remove(id);
    setItems((l) => l.filter((i) => i._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const updateStatus = async (item, patch) => {
    const updated = await api.update(item._id, patch);
    setItems((l) => l.map((i) => (i._id === updated._id ? updated : i)));
    setSelected((s) => (s?._id === updated._id ? updated : s));
  };

  const open = (item) => {
    setSelected(item);
    if (!isInquiry && !item.read) updateStatus(item, { read: true });
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-navy">
        {isInquiry ? "Product Inquiries" : "Contact Messages"}
      </h1>
      <p className="mb-6 text-sm text-slate-500">{items.length} record(s)</p>

      {error && <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
        {/* List */}
        <div className="card divide-y divide-slate-100 overflow-hidden">
          {items.length === 0 && <p className="py-10 text-center text-sm text-slate-400">No records yet.</p>}
          {items.map((it) => {
            const unread = !isInquiry && !it.read;
            const isNew = isInquiry && it.status === "new";
            return (
              <button
                key={it._id}
                onClick={() => open(it)}
                className={`flex w-full items-start justify-between gap-3 p-4 text-left hover:bg-slate-50 ${
                  selected?._id === it._id ? "bg-slate-50" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold text-brand-navy">
                    {(unread || isNew) && <span className="h-2 w-2 rounded-full bg-brand-red" />}
                    {it.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {isInquiry ? it.product || it.email : it.subject || it.message}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{fmt(it.createdAt)}</p>
                </div>
                {isInquiry && (
                  <span className="shrink-0 rounded-full bg-brand-navy/5 px-2 py-0.5 text-[11px] font-semibold capitalize text-brand-navy">
                    {it.status}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="card p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-brand-navy">{selected.name}</h2>
                  <p className="text-sm text-slate-500">{fmt(selected.createdAt)}</p>
                </div>
                <button onClick={() => remove(selected._id)} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-brand-red hover:text-brand-red">
                  Delete
                </button>
              </div>

              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <Info label="Email" value={<a href={`mailto:${selected.email}`} className="text-brand-red">{selected.email}</a>} />
                {selected.phone && <Info label="Phone" value={<a href={`tel:${selected.phone}`} className="text-brand-red">{selected.phone}</a>} />}
                {selected.company && <Info label="Company" value={selected.company} />}
                {isInquiry && selected.product && <Info label="Product" value={selected.product} />}
                {isInquiry && selected.quantity && <Info label="Quantity" value={selected.quantity} />}
                {!isInquiry && selected.subject && <Info label="Subject" value={selected.subject} />}
              </dl>

              {selected.message && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Message</p>
                  <p className="mt-1.5 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">{selected.message}</p>
                </div>
              )}

              {isInquiry && (
                <div className="mt-5">
                  <label className="label">Update status</label>
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected, { status: e.target.value })}
                    className="field max-w-xs"
                  >
                    {["new", "in-progress", "quoted", "closed"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || selected.product || "Your enquiry")}`}
                className="btn-primary mt-6"
              >
                <Icon name="mail" className="h-4 w-4" /> Reply by Email
              </a>
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-slate-400">
              Select a record to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-slate-700">{value}</dd>
    </div>
  );
}

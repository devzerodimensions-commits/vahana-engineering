import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { resource as resourceApi } from "../services/admin.js";
import { resources } from "./resources.js";
import Icon from "../components/ui/Icon.jsx";
import Loader from "../components/ui/Loader.jsx";

export default function ResourceManager() {
  const { resource: key } = useParams();
  const config = resources[key];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // object being edited, or {} for new

  const api = useMemo(() => resourceApi(config?.api), [config?.api]);

  const load = () => {
    if (!config) return;
    setLoading(true);
    setError("");
    api
      .list()
      .then((data) => setItems(data || []))
      .catch((e) => setError(e?.response?.data?.message || "Could not load. Is the backend running & seeded?"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!config) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
        Unknown section: <span className="font-semibold">{key}</span>
      </div>
    );
  }

  const remove = async (id) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    try {
      await api.remove(id);
      setItems((list) => list.filter((i) => i._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed.");
    }
  };

  const save = async (payload) => {
    if (editing._id) {
      const updated = await api.update(editing._id, payload);
      setItems((list) => list.map((i) => (i._id === updated._id ? updated : i)));
    } else {
      const created = await api.create(payload);
      setItems((list) => [created, ...list]);
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">{config.label}</h1>
          <p className="text-sm text-slate-500">{items.length} item(s)</p>
        </div>
        <button onClick={() => setEditing({})} className="btn-primary">
          <Icon name="check" className="h-4 w-4" /> Add New
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  {config.columns.map((col) => (
                    <th key={col} className="px-4 py-3 font-semibold">{col}</th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    {config.columns.map((col) => (
                      <td key={col} className="px-4 py-3 text-slate-700">
                        <Cell value={item[col]} />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(item)} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-brand-navy hover:text-brand-navy">
                          Edit
                        </button>
                        <button onClick={() => remove(item._id)} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-brand-red hover:text-brand-red">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-slate-400">
                      No items yet. Click “Add New” to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <ResourceForm
          config={config}
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function Cell({ value }) {
  if (typeof value === "boolean")
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${value ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
        {value ? "Yes" : "No"}
      </span>
    );
  if (Array.isArray(value)) return <span>{value.join(", ")}</span>;
  return <span className="line-clamp-1">{value ?? "—"}</span>;
}

function ResourceForm({ config, initial, onClose, onSave }) {
  const build = () => {
    const state = {};
    for (const f of config.fields) {
      const v = initial[f.key];
      if (f.type === "tags") state[f.key] = Array.isArray(v) ? v.join(", ") : v || "";
      else if (f.type === "checkbox") state[f.key] = v ?? false;
      else state[f.key] = v ?? "";
    }
    return state;
  };
  const [form, setForm] = useState(build);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    const payload = {};
    for (const f of config.fields) {
      let v = form[f.key];
      if (f.type === "tags") v = String(v).split(",").map((s) => s.trim()).filter(Boolean);
      else if (f.type === "number") v = v === "" ? undefined : Number(v);
      payload[f.key] = v;
    }
    try {
      await onSave(payload);
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-brand-navy">
            {initial._id ? "Edit" : "Add"} {config.label.replace(/s$/, "")}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="grid max-h-[70vh] gap-4 overflow-y-auto p-6 sm:grid-cols-2">
          {config.fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <label className="label">
                {f.label}
                {f.required && <span className="text-brand-red"> *</span>}
              </label>
              <Field field={f} value={form[f.key]} onChange={(v) => set(f.key, v)} />
              {f.help && <p className="mt-1 text-xs text-slate-400">{f.help}</p>}
            </div>
          ))}
          {err && <p className="text-sm text-brand-red sm:col-span-2">{err}</p>}
          <div className="flex justify-end gap-3 sm:col-span-2">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ field, value, onChange }) {
  if (field.type === "textarea")
    return <textarea rows={field.rows || 3} value={value} onChange={(e) => onChange(e.target.value)} className="field" required={field.required} />;
  if (field.type === "checkbox")
    return (
      <label className="flex items-center gap-2 pt-1.5">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-navy" />
        <span className="text-sm text-slate-600">Enabled</span>
      </label>
    );
  if (field.type === "select")
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field">
        <option value="">— select —</option>
        {field.options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  const type = field.type === "number" ? "number" : "text";
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="field" required={field.required} placeholder={field.type === "tags" ? "comma, separated, values" : ""} />;
}

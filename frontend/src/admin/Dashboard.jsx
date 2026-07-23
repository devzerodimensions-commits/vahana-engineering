import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../services/admin.js";
import Icon from "../components/ui/Icon.jsx";
import Loader from "../components/ui/Loader.jsx";

const CARDS = [
  { key: "products", label: "Products", icon: "layers", to: "/admin/products", color: "bg-brand-navy" },
  { key: "categories", label: "Categories", icon: "test", to: "/admin/testing-categories", color: "bg-brand-red" },
  { key: "blogs", label: "Blog Posts", icon: "quote", to: "/admin/blogs", color: "bg-emerald-600" },
  { key: "services", label: "Services", icon: "wrench", to: "/admin/services", color: "bg-amber-500" },
  { key: "inquiries", label: "Inquiries", icon: "briefcase", to: "/admin/inquiries", color: "bg-indigo-600" },
  { key: "contacts", label: "Messages", icon: "mail", to: "/admin/contacts", color: "bg-sky-600" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((e) => setError(e?.response?.data?.message || "Could not load stats. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard…" />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Overview of your website content and enquiries.</p>

      {error && (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">{error}</div>
      )}

      {/* Alerts */}
      {stats?.alerts && (stats.alerts.newInquiries > 0 || stats.alerts.unreadContacts > 0) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {stats.alerts.newInquiries > 0 && (
            <Link to="/admin/inquiries" className="rounded-lg bg-brand-red/10 px-4 py-2 text-sm font-semibold text-brand-red">
              {stats.alerts.newInquiries} new inquiry(s)
            </Link>
          )}
          {stats.alerts.unreadContacts > 0 && (
            <Link to="/admin/contacts" className="rounded-lg bg-brand-navy/10 px-4 py-2 text-sm font-semibold text-brand-navy">
              {stats.alerts.unreadContacts} unread message(s)
            </Link>
          )}
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link key={c.key} to={c.to} className="card flex items-center gap-4 p-5 hover:shadow-card-hover">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${c.color}`}>
              <Icon name={c.icon} className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand-navy">{stats?.totals?.[c.key] ?? 0}</p>
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <RecentList
          title="Recent Inquiries"
          to="/admin/inquiries"
          items={stats?.recentInquiries}
          render={(i) => (
            <>
              <p className="font-semibold text-brand-navy">{i.name}</p>
              <p className="text-xs text-slate-500">{i.product || i.email}</p>
            </>
          )}
        />
        <RecentList
          title="Recent Messages"
          to="/admin/contacts"
          items={stats?.recentContacts}
          render={(c) => (
            <>
              <p className="font-semibold text-brand-navy">{c.name}</p>
              <p className="text-xs text-slate-500 line-clamp-1">{c.subject || c.message}</p>
            </>
          )}
        />
      </div>
    </div>
  );
}

function RecentList({ title, items, render, to }) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-brand-navy">{title}</h2>
        <Link to={to} className="text-xs font-semibold text-brand-red">View all</Link>
      </div>
      {items?.length ? (
        <ul className="divide-y divide-slate-100">
          {items.map((it) => (
            <li key={it._id} className="py-2.5">{render(it)}</li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-sm text-slate-400">No records yet.</p>
      )}
    </div>
  );
}

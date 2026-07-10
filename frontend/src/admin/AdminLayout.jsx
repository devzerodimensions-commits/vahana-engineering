import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { site } from "../data/site.js";
import { resources, contentNav } from "./resources.js";
import Icon from "../components/ui/Icon.jsx";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const doLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive ? "bg-brand-red text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-brand-navy-dark transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <span className="rounded bg-white px-1.5 py-1">
            <img src={site.logo} alt="" className="h-7 w-auto" />
          </span>
          <span className="text-sm font-bold text-white">Admin Panel</span>
        </div>
        <nav className="flex h-[calc(100%-4rem)] flex-col gap-1 overflow-y-auto p-3">
          <NavLink to="/admin" end className={linkClass} onClick={() => setOpen(false)}>
            <Icon name="gauge" className="h-4 w-4" /> Dashboard
          </NavLink>
          <p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-slate-500">Content</p>
          {contentNav.map((key) => (
            <NavLink key={key} to={`/admin/${key}`} className={linkClass} onClick={() => setOpen(false)}>
              <Icon name={resources[key].icon} className="h-4 w-4" /> {resources[key].label}
            </NavLink>
          ))}
          <p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-slate-500">Inbox</p>
          <NavLink to="/admin/inquiries" className={linkClass} onClick={() => setOpen(false)}>
            <Icon name="briefcase" className="h-4 w-4" /> Inquiries
          </NavLink>
          <NavLink to="/admin/contacts" className={linkClass} onClick={() => setOpen(false)}>
            <Icon name="mail" className="h-4 w-4" /> Contact Messages
          </NavLink>
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-brand-navy lg:hidden" aria-label="Menu">
            <Icon name="menu" className="h-6 w-6" />
          </button>
          <Link to="/" target="_blank" className="hidden text-sm font-medium text-slate-500 hover:text-brand-red sm:block">
            View website ↗
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-brand-navy">{user?.name}</p>
              <p className="text-xs capitalize text-slate-400">{user?.role}</p>
            </div>
            <button onClick={doLogout} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-brand-red hover:text-brand-red">
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { site } from "../data/site.js";
import Icon from "../components/ui/Icon.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Check your credentials and that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-white">
          <span className="rounded-lg bg-white px-2 py-1">
            <img src={site.logo} alt={site.name} className="h-9 w-auto" />
          </span>
        </Link>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h1 className="text-2xl font-extrabold text-brand-navy">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage the website content.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="field"
                placeholder="admin@vihaanaengineering.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="field"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-brand-red">{error}</p>
            )}
            <button disabled={loading} className="btn-navy w-full">
              {loading ? "Signing in…" : "Sign In"}
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Default seed credentials: <br />
            <span className="font-semibold text-brand-navy">admin@vihaanaengineering.com</span> /{" "}
            <span className="font-semibold text-brand-navy">Admin@12345</span>
            <br />Requires the backend + MongoDB running &amp; seeded.
          </p>
        </div>
        <Link to="/" className="mt-6 block text-center text-sm text-slate-300 hover:text-white">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

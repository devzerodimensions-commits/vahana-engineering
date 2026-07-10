import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon.jsx";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="container-x text-center">
        <p className="text-7xl font-extrabold text-brand-navy">404</p>
        <h1 className="mt-4 text-2xl font-bold text-brand-navy">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you’re looking for doesn’t exist or has moved.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          <Icon name="arrowLeft" className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import Icon from "./ui/Icon.jsx";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="card group flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.categoryName && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-navy shadow-sm">
            {product.categoryName}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-brand-navy line-clamp-2 group-hover:text-brand-red">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
          {product.summary}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red">
          View details
          <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

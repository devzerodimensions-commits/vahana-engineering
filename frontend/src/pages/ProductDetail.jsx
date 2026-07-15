import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getProduct, getProducts, submitInquiry } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import Icon from "../components/ui/Icon.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { site } from "../data/site.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, loading } = useFetch(() => getProduct(slug), [slug]);
  const { data: all } = useFetch(getProducts, []);

  if (loading) return <Loader label="Loading product…" />;
  if (!product)
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-bold text-brand-navy">Product not found</h1>
        <Link to="/products" className="btn-primary mt-6 inline-flex">Back to products</Link>
      </div>
    );

  const related = (all || [])
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="container-x flex items-center gap-2 py-4 text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-red">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-red">Products</Link>
          <span>/</span>
          <span className="text-brand-navy line-clamp-1">{product.name}</span>
        </div>
      </div>

      <section className="py-12">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100">
              <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div>
            {product.categoryName && (
              <Link
                to={`/products?category=${product.category}`}
                className="badge hover:bg-brand-navy/10"
              >
                {product.categoryName}
              </Link>
            )}
            <h1 className="mt-3 text-3xl font-extrabold text-brand-navy">{product.name}</h1>
            {product.model && (
              <p className="mt-2 inline-block rounded-md bg-brand-red/10 px-3 py-1 text-sm font-bold text-brand-red">
                Model: {product.model}
              </p>
            )}
            <p className="mt-4 leading-relaxed text-slate-600">{product.description || product.summary}</p>

            {product.standards?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Applicable Standards
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.standards.map((s) => (
                    <span key={s} className="rounded-lg bg-brand-navy/5 px-3 py-1.5 text-sm font-semibold text-brand-navy">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.specifications?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                  Technical Specifications
                </h3>
                <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                        <td className="px-4 py-2.5 font-medium text-slate-600">{spec.label}</td>
                        <td className="px-4 py-2.5 text-slate-800">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-brand-navy/5 px-5 py-4">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase text-slate-500">Price</p>
                <p className="text-lg font-extrabold text-brand-navy">{product.price || "On Request"}</p>
              </div>
              <a href={`tel:${site.phone}`} className="btn-outline">
                <Icon name="phone" className="h-4 w-4" /> Call Us
              </a>
            </div>

            <InquiryForm productName={product.name} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-14">
          <div className="container-x">
            <h2 className="mb-8 text-2xl font-extrabold text-brand-navy">Related Instruments</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function InquiryForm({ productName }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", quantity: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    try {
      await submitInquiry({ ...form, product: productName });
      setStatus({ state: "success", msg: "Thank you! Our team will get back to you shortly." });
      setForm({ name: "", email: "", phone: "", quantity: "", message: "" });
    } catch {
      setStatus({
        state: "error",
        msg: "Could not submit right now. Please email or call us directly.",
      });
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-brand-navy">Request a Quote</h3>
      <p className="mt-1 text-sm text-slate-500">
        Enquire about the <span className="font-semibold">{productName}</span>.
      </p>
      {status.state === "success" ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <Icon name="check" className="h-4 w-4" /> {status.msg}
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input required name="name" value={form.name} onChange={change} placeholder="Your name *" className="field" />
          <input required type="email" name="email" value={form.email} onChange={change} placeholder="Email *" className="field" />
          <input name="phone" value={form.phone} onChange={change} placeholder="Phone" className="field" />
          <input name="quantity" value={form.quantity} onChange={change} placeholder="Quantity" className="field" />
          <textarea name="message" value={form.message} onChange={change} rows={3} placeholder="Message" className="field sm:col-span-2" />
          {status.state === "error" && (
            <p className="text-sm text-brand-red sm:col-span-2">{status.msg}</p>
          )}
          <button disabled={status.state === "loading"} className="btn-primary sm:col-span-2">
            {status.state === "loading" ? "Sending…" : "Send Inquiry"}
          </button>
        </form>
      )}
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getBlog } from "../services/api.js";
import Loader from "../components/ui/Loader.jsx";
import Icon from "../components/ui/Icon.jsx";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: blog, loading } = useFetch(() => getBlog(slug), [slug]);

  if (loading) return <Loader label="Loading article…" />;
  if (!blog)
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-bold text-brand-navy">Article not found</h1>
        <Link to="/blog" className="btn-primary mt-6 inline-flex">Back to blog</Link>
      </div>
    );

  return (
    <article className="py-14">
      <div className="container-x max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red">
          <Icon name="arrowLeft" className="h-4 w-4" /> Back to blog
        </Link>
        <div className="mt-4 mb-2 flex flex-wrap gap-1.5">
          {(blog.tags || []).map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">{blog.title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          By {blog.author || "Vihana Engineering"} · {fmtDate(blog.publishedAt || blog.createdAt)}
        </p>
        {blog.image && (
          <img src={blog.image} alt={blog.title} className="mt-6 w-full rounded-2xl object-cover" />
        )}
        <div className="prose-content mt-8 text-slate-700">
          {(blog.content || "").split("\n").filter(Boolean).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

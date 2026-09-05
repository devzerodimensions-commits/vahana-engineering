import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/db.js";
import slugify from "../utils/slugify.js";

/**
 * Generic CRUD controller factory, backed by Prisma / PostgreSQL.
 *
 * The response shape is deliberately IDENTICAL to the previous Mongo version —
 * { success, count, total, page, pages, data }, with an `_id` on every record —
 * because the admin screens and the public site already consume that contract.
 * Postgres names the key `id`, so toApi() renames it on the way out; that single
 * decision is why no frontend file had to change in this migration.
 *
 * Takes a Prisma model NAME (e.g. "product") rather than a Mongoose model.
 *
 * options:
 *   searchFields  - fields matched by ?q= (case-insensitive contains)
 *   filterFields  - query params mapped to exact-match filters
 *   defaultSort   - Mongo-style sort string, e.g. "order -createdAt"
 *   slugFrom      - field the slug derives from, for models that have one
 */

// id -> _id for API compatibility; never leak password hashes.
const toApi = (row) => {
  if (!row) return row;
  const { id, password, ...rest } = row;
  return { _id: id, ...rest };
};

// "order -createdAt" -> [{ order: "asc" }, { createdAt: "desc" }]
const parseSort = (sort) =>
  String(sort || "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((t) => (t.startsWith("-") ? { [t.slice(1)]: "desc" } : { [t]: "asc" }));

// Slugs must stay unique. Rather than throw on a duplicate name — which the
// client would see as an unexplained failure when adding a similar product —
// fall back to name-2, name-3, and so on.
const uniqueSlug = async (delegate, base, currentId = null) => {
  const root = base || "item";
  let candidate = root;
  for (let n = 2; ; n++) {
    const clash = await delegate.findUnique({ where: { slug: candidate } });
    if (!clash || clash.id === currentId) return candidate;
    candidate = `${root}-${n}`;
  }
};

// Models with no `published` column — their privacy is enforced by route auth.
const UNPUBLISHED_MODELS = ["contact", "inquiry"];

export const crudControllers = (modelName, options = {}) => {
  const {
    searchFields = [],
    filterFields = [],
    defaultSort = "-createdAt",
    slugFrom = null,
  } = options;

  const delegate = () => prisma[modelName];
  const label = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  // GET / — list with pagination, search and filters.
  const getAll = asyncHandler(async (req, res) => {
    const where = {};

    if (!UNPUBLISHED_MODELS.includes(modelName)) {
      if (req.query.published !== undefined) {
        where.published = req.query.published === "true";
      } else if (!req.user) {
        where.published = true; // anonymous callers never see drafts
      }
    }

    for (const field of filterFields) {
      const val = req.query[field];
      if (val === undefined) continue;
      where[field] = val === "true" ? true : val === "false" ? false : val;
    }

    if (req.query.q && searchFields.length) {
      where.OR = searchFields.map((f) => ({
        [f]: { contains: req.query.q, mode: "insensitive" },
      }));
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 100, 200);
    const orderBy = parseSort(req.query.sort || defaultSort);

    const [items, total] = await Promise.all([
      delegate().findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
      delegate().count({ where }),
    ]);

    res.json({
      success: true,
      count: items.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: items.map(toApi),
    });
  });

  // GET /:idOrSlug — accepts either, because the public site links by slug.
  const getOne = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    let row = await delegate().findUnique({ where: { id: idOrSlug } }).catch(() => null);
    if (!row && slugFrom) {
      row = await delegate().findUnique({ where: { slug: idOrSlug } }).catch(() => null);
    }
    if (!row) throw new ApiError(404, `${label} not found.`);
    res.json({ success: true, data: toApi(row) });
  });

  // POST /
  const createOne = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    delete data._id;
    delete data.id;

    if (slugFrom) {
      data.slug = await uniqueSlug(delegate(), slugify(data.slug || data[slugFrom] || ""));
    }

    const row = await delegate().create({ data });
    res.status(201).json({ success: true, data: toApi(row) });
  });

  // PUT /:id
  const updateOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await delegate().findUnique({ where: { id } }).catch(() => null);
    if (!existing) throw new ApiError(404, `${label} not found.`);

    const data = { ...req.body };
    delete data._id;
    delete data.id;
    delete data.createdAt;

    // Only regenerate the slug when the source field actually changed, so
    // editing any other field can never silently break a live product URL.
    if (slugFrom && data[slugFrom] && data[slugFrom] !== existing[slugFrom]) {
      data.slug = await uniqueSlug(delegate(), slugify(data[slugFrom]), id);
    } else {
      delete data.slug;
    }

    const row = await delegate().update({ where: { id }, data });
    res.json({ success: true, data: toApi(row) });
  });

  // DELETE /:id
  const deleteOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await delegate().findUnique({ where: { id } }).catch(() => null);
    if (!existing) throw new ApiError(404, `${label} not found.`);
    await delegate().delete({ where: { id } });
    res.json({ success: true, message: `${label} deleted.` });
  });

  return { getAll, getOne, createOne, updateOne, deleteOne };
};

export { toApi };
export default crudControllers;

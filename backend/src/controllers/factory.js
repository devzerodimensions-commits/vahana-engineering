import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

/**
 * Generic CRUD controller factory. Every content model (products, services,
 * blogs, …) reuses these handlers, keeping the codebase DRY and consistent.
 *
 * options:
 *   searchFields  - fields matched by the ?q= keyword search
 *   filterFields  - query params that map directly to exact-match filters
 *   defaultSort   - default sort string (e.g. "order -createdAt")
 */
export const crudControllers = (Model, options = {}) => {
  const {
    searchFields = [],
    filterFields = [],
    defaultSort = "-createdAt",
  } = options;

  // GET /  — list with pagination, search & filters.
  const getAll = asyncHandler(async (req, res) => {
    const query = {};

    // Public callers only ever see published documents.
    if (req.query.published !== undefined) {
      query.published = req.query.published === "true";
    } else if (!req.user) {
      query.published = true;
    }

    // Exact-match filters (e.g. ?category=impact&featured=true)
    for (const field of filterFields) {
      if (req.query[field] !== undefined) {
        const val = req.query[field];
        query[field] = val === "true" ? true : val === "false" ? false : val;
      }
    }

    // Keyword search across the configured fields.
    if (req.query.q && searchFields.length) {
      query.$or = searchFields.map((f) => ({
        [f]: { $regex: req.query.q, $options: "i" },
      }));
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 100, 200);
    const skip = (page - 1) * limit;
    const sort = req.query.sort || defaultSort;

    const [items, total] = await Promise.all([
      Model.find(query).sort(sort).skip(skip).limit(limit),
      Model.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: items.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: items,
    });
  });

  // GET /:idOrSlug
  const getOne = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const doc = isObjectId
      ? await Model.findById(idOrSlug)
      : await Model.findOne({ slug: idOrSlug });

    if (!doc) throw new ApiError(404, `${Model.modelName} not found.`);
    res.json({ success: true, data: doc });
  });

  // POST /
  const createOne = asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc });
  });

  // PUT /:id
  const updateOne = asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw new ApiError(404, `${Model.modelName} not found.`);
    Object.assign(doc, req.body);
    await doc.save(); // runs pre-save hooks (slugs, hashing, validation)
    res.json({ success: true, data: doc });
  });

  // DELETE /:id
  const deleteOne = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, `${Model.modelName} not found.`);
    res.json({ success: true, message: `${Model.modelName} deleted.` });
  });

  return { getAll, getOne, createOne, updateOne, deleteOne };
};

export default crudControllers;

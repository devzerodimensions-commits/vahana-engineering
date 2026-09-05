import { Router } from "express";
import { crudControllers } from "../controllers/factory.js";
import { protect, authorize, attachUser } from "../middleware/auth.js";

/**
 * Builds a standard REST router for a content model.
 *
 * config:
 *   publicRead    - GET list & detail are public (default true)
 *   publicCreate  - POST is public, e.g. contact/inquiry forms (default false)
 *   writeRoles    - roles allowed to create/update/delete (default admin, editor)
 */
export const resourceRouter = (Model, options = {}, config = {}) => {
  const {
    publicRead = true,
    publicCreate = false,
    writeRoles = ["admin", "editor"],
  } = config;

  const c = crudControllers(Model, options);
  const router = Router();
  const write = [protect, authorize(...writeRoles)];

  // Reads
  if (publicRead) {
    // attachUser, not protect: anyone may read, but a signed-in admin must be
    // recognised so they can also see unpublished drafts.
    router.get("/", attachUser, c.getAll);
    router.get("/:idOrSlug", attachUser, c.getOne);
  } else {
    router.get("/", protect, c.getAll);
    router.get("/:idOrSlug", protect, c.getOne);
  }

  // Create
  if (publicCreate) {
    router.post("/", c.createOne);
  } else {
    router.post("/", write, c.createOne);
  }

  // Update / delete are always protected
  router.put("/:id", write, c.updateOne);
  router.delete("/:id", write, c.deleteOne);

  return router;
};

export default resourceRouter;

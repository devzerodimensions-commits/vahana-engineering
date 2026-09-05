import { Router } from "express";

import authRoutes from "./authRoutes.js";
import resourceRouter from "./resourceRouter.js";
import { protect, authorize } from "../middleware/auth.js";
import { getStats } from "../controllers/statsController.js";

// Resources are identified by Prisma model NAME rather than a Mongoose model
// object. The blogs / gallery / jobs routes are gone with their models: those
// pages were removed from the site and nothing in the frontend calls them.

const router = Router();

router.use("/auth", authRoutes);

// Admin dashboard analytics
router.get("/stats", protect, authorize("admin", "editor", "viewer"), getStats);

// Content resources (public read, protected write)
router.use(
  "/products",
  resourceRouter("product", {
    searchFields: ["name", "summary", "description"],
    filterFields: ["category", "featured", "published"],
    defaultSort: "order -createdAt",
    slugFrom: "name",
  })
);

router.use(
  "/testing-categories",
  resourceRouter("testingCategory", {
    searchFields: ["name", "blurb"],
    defaultSort: "order name",
    slugFrom: "name",
  })
);

router.use(
  "/services",
  resourceRouter("service", {
    searchFields: ["title", "summary", "description"],
    defaultSort: "order -createdAt",
    slugFrom: "title",
  })
);

router.use("/clients", resourceRouter("client", { defaultSort: "order name" }));
router.use("/testimonials", resourceRouter("testimonial", { defaultSort: "order -createdAt" }));
router.use("/certifications", resourceRouter("certification", { defaultSort: "order -createdAt" }));

// Form submissions: anyone can create, only staff can read or manage.
router.use(
  "/inquiries",
  resourceRouter(
    "inquiry",
    {
      searchFields: ["name", "email", "product", "company"],
      filterFields: ["status"],
      defaultSort: "-createdAt",
    },
    { publicRead: false, publicCreate: true }
  )
);

router.use(
  "/contacts",
  resourceRouter(
    "contact",
    {
      searchFields: ["name", "email", "subject"],
      filterFields: ["read"],
      defaultSort: "-createdAt",
    },
    { publicRead: false, publicCreate: true }
  )
);

export default router;

import { Router } from "express";

import authRoutes from "./authRoutes.js";
import resourceRouter from "./resourceRouter.js";
import { protect, authorize } from "../middleware/auth.js";
import { getStats } from "../controllers/statsController.js";

import Product from "../models/Product.js";
import TestingCategory from "../models/TestingCategory.js";
import Service from "../models/Service.js";
import Blog from "../models/Blog.js";
import Client from "../models/Client.js";
import Testimonial from "../models/Testimonial.js";
import Gallery from "../models/Gallery.js";
import Certification from "../models/Certification.js";
import Inquiry from "../models/Inquiry.js";
import Contact from "../models/Contact.js";
import Job from "../models/Job.js";

const router = Router();

router.use("/auth", authRoutes);

// Admin dashboard analytics
router.get("/stats", protect, authorize("admin", "editor", "viewer"), getStats);

// Content resources (public read, protected write)
router.use(
  "/products",
  resourceRouter(Product, {
    searchFields: ["name", "summary", "description"],
    filterFields: ["category", "featured", "published"],
    defaultSort: "order -createdAt",
  })
);

router.use(
  "/testing-categories",
  resourceRouter(TestingCategory, {
    searchFields: ["name", "blurb"],
    defaultSort: "order name",
  })
);

router.use(
  "/services",
  resourceRouter(Service, {
    searchFields: ["title", "summary", "description"],
    defaultSort: "order -createdAt",
  })
);

router.use(
  "/blogs",
  resourceRouter(Blog, {
    searchFields: ["title", "excerpt", "content", "tags"],
    filterFields: ["published"],
    defaultSort: "-publishedAt",
  })
);

router.use("/clients", resourceRouter(Client, { defaultSort: "order name" }));
router.use("/testimonials", resourceRouter(Testimonial, { defaultSort: "order -createdAt" }));
router.use("/gallery", resourceRouter(Gallery, { filterFields: ["category"], defaultSort: "order -createdAt" }));
router.use("/certifications", resourceRouter(Certification, { defaultSort: "order -createdAt" }));
router.use("/jobs", resourceRouter(Job, { searchFields: ["title", "department", "location"], defaultSort: "-createdAt" }));

// Form submissions: anyone can create, only staff can read/manage.
router.use(
  "/inquiries",
  resourceRouter(
    Inquiry,
    { searchFields: ["name", "email", "product", "company"], filterFields: ["status"], defaultSort: "-createdAt" },
    { publicRead: false, publicCreate: true }
  )
);

router.use(
  "/contacts",
  resourceRouter(
    Contact,
    { searchFields: ["name", "email", "subject"], filterFields: ["read"], defaultSort: "-createdAt" },
    { publicRead: false, publicCreate: true }
  )
);

export default router;

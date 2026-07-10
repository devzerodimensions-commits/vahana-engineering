import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/Product.js";
import Service from "../models/Service.js";
import TestingCategory from "../models/TestingCategory.js";
import Blog from "../models/Blog.js";
import Client from "../models/Client.js";
import Testimonial from "../models/Testimonial.js";
import Gallery from "../models/Gallery.js";
import Certification from "../models/Certification.js";
import Inquiry from "../models/Inquiry.js";
import Contact from "../models/Contact.js";
import Job from "../models/Job.js";

// GET /api/stats  (admin dashboard analytics)
export const getStats = asyncHandler(async (req, res) => {
  const [
    products,
    services,
    categories,
    blogs,
    clients,
    testimonials,
    gallery,
    certifications,
    inquiries,
    newInquiries,
    contacts,
    unreadContacts,
    jobs,
  ] = await Promise.all([
    Product.countDocuments(),
    Service.countDocuments(),
    TestingCategory.countDocuments(),
    Blog.countDocuments(),
    Client.countDocuments(),
    Testimonial.countDocuments(),
    Gallery.countDocuments(),
    Certification.countDocuments(),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "new" }),
    Contact.countDocuments(),
    Contact.countDocuments({ read: false }),
    Job.countDocuments(),
  ]);

  // Inquiries grouped by product category (join through products).
  const recentInquiries = await Inquiry.find().sort("-createdAt").limit(5);
  const recentContacts = await Contact.find().sort("-createdAt").limit(5);

  // Inquiry counts for the last 6 months for a simple trend chart.
  const trend = await Inquiry.aggregate([
    {
      $group: {
        _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
    { $limit: 12 },
  ]);

  res.json({
    success: true,
    data: {
      totals: {
        products,
        services,
        categories,
        blogs,
        clients,
        testimonials,
        gallery,
        certifications,
        inquiries,
        contacts,
        jobs,
      },
      alerts: { newInquiries, unreadContacts },
      recentInquiries,
      recentContacts,
      trend,
    },
  });
});

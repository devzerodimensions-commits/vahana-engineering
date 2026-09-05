import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../config/db.js";
import { toApi } from "./factory.js";

// GET /api/stats — admin dashboard analytics.
//
// The blogs / gallery / jobs counts are gone with those models; the dashboard
// reads totals defensively, so absent keys simply don't render a tile.
export const getStats = asyncHandler(async (req, res) => {
  const [
    products,
    services,
    categories,
    clients,
    testimonials,
    certifications,
    inquiries,
    newInquiries,
    contacts,
    unreadContacts,
    recentInquiries,
    recentContacts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.service.count(),
    prisma.testingCategory.count(),
    prisma.client.count(),
    prisma.testimonial.count(),
    prisma.certification.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "new" } }),
    prisma.contact.count(),
    prisma.contact.count({ where: { read: false } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contact.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  // Enquiries per month for the trend chart. Mongo did this with an aggregation
  // pipeline; in SQL it's a date_trunc group-by, which is both simpler and
  // correctly ordered by actual date rather than by year/month tuple.
  const trendRows = await prisma.$queryRaw`
    SELECT date_trunc('month', "createdAt") AS month, COUNT(*)::int AS count
    FROM inquiries
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `;

  const trend = trendRows
    .map((r) => ({
      _id: { y: new Date(r.month).getUTCFullYear(), m: new Date(r.month).getUTCMonth() + 1 },
      count: r.count,
    }))
    .reverse(); // oldest first, as the chart expects

  res.json({
    success: true,
    data: {
      totals: {
        products,
        services,
        categories,
        clients,
        testimonials,
        certifications,
        inquiries,
        contacts,
      },
      alerts: { newInquiries, unreadContacts },
      recentInquiries: recentInquiries.map(toApi),
      recentContacts: recentContacts.map(toApi),
      trend,
    },
  });
});

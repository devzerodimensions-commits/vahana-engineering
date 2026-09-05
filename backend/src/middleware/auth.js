import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/db.js";

// Verifies the Bearer JWT and attaches the user to req.user.
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) throw new ApiError(401, "Not authorised — no token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new ApiError(401, "The user for this token no longer exists.");
    // A deactivated account must stop working immediately, not at token expiry.
    if (!user.active) throw new ApiError(403, "This account has been deactivated.");
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, "Not authorised — invalid or expired token.");
  }
});

/**
 * Optional auth for PUBLIC read routes.
 *
 * Those routes have no `protect`, so req.user was never set even when a valid
 * token was sent — meaning the admin panel was treated as an anonymous visitor
 * and silently filtered to published records only. The practical effect:
 * unpublishing a product made it disappear from the admin's own list, leaving
 * no way to publish it again.
 *
 * This attaches the user when a valid token is present and otherwise carries on
 * silently, so anonymous access is unaffected. A bad or expired token is ignored
 * rather than rejected — these routes are public by design.
 */
export const attachUser = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();

  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (user?.active) req.user = user;
  } catch {
    // Ignored on purpose: an invalid token on a public route is just anonymous.
  }
  next();
});

// Restricts a route to one or more roles, e.g. authorize("admin").
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, `Role '${req.user?.role}' is not allowed to access this resource.`);
  }
  next();
};

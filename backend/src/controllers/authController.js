import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/db.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

// Password hashing lived on the Mongoose model as a pre-save hook. Prisma has
// no model hooks, so it moves here — the only two places a password is written
// are register() and the seed script, and both call this.
export const hashPassword = (plain) => bcrypt.hash(plain, 10);

const sanitize = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password are required.");

  const user = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase().trim() },
  });

  // Same message whether the email is unknown or the password is wrong, so the
  // response can't be used to discover which accounts exist.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid email or password.");
  }
  if (!user.active) throw new ApiError(403, "This account has been deactivated.");

  res.json({ success: true, token: signToken(user.id), user: sanitize(user) });
});

// POST /api/auth/register — admin only, for creating additional staff accounts.
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required.");
  }
  if (String(password).length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters.");
  }

  const normalised = String(email).toLowerCase().trim();
  const exists = await prisma.user.findUnique({ where: { email: normalised } });
  if (exists) throw new ApiError(409, "A user with that email already exists.");

  const user = await prisma.user.create({
    data: {
      name,
      email: normalised,
      password: await hashPassword(password),
      role: role || "editor",
    },
  });

  res.status(201).json({ success: true, user: sanitize(user) });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitize(req.user) });
});

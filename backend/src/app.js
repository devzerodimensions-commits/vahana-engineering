import express from "express";
import cors from "cors";
import morgan from "morgan";

import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

// Core middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Serve uploaded/static files if present
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/api/health", (req, res) =>
  res.json({ success: true, service: "Vihana Engineering API", status: "ok", time: new Date().toISOString() })
);

// API
app.use("/api", apiRoutes);

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

export default app;

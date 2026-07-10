import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-fatal: the server still boots so the health check and
// clear error messages are available even if the database is unreachable).
connectDB();

const server = app.listen(PORT, () => {
  console.log(
    `\n Vihana Engineering API running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`
  );
});

// Fail loudly on unhandled promise rejections.
process.on("unhandledRejection", (err) => {
  console.error(` Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

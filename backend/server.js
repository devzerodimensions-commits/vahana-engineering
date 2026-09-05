import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to PostgreSQL. Unlike the old Mongo setup this IS fatal: without a
// database every content route errors anyway, so exiting with a clear message
// beats a server that looks healthy and 500s on every request.
connectDB();

const server = app.listen(PORT, () => {
  console.log(
    `\n Vihaana Engineering API running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`
  );
});

// Fail loudly on unhandled promise rejections.
process.on("unhandledRejection", (err) => {
  console.error(` Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

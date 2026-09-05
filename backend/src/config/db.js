// Prisma client (PostgreSQL / Neon).
//
// A single shared instance: Prisma opens a connection pool, and creating a
// client per import would exhaust Neon's connection limit. In dev, nodemon
// re-imports modules on reload, so the instance is cached on globalThis to stop
// every reload leaking another pool.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__vePrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.__vePrisma = prisma;

/**
 * Connects at boot. Unlike the old Mongo setup this does NOT keep serving on a
 * failed connection: without a database every content route returns an error
 * anyway, so failing loudly here is clearer than a server that looks healthy
 * and 500s on each request.
 */
export const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("\nDATABASE_URL is not set.");
    console.error("   Fix: copy backend/.env.example to backend/.env and paste your Neon");
    console.error("   connection string into DATABASE_URL.\n");
    process.exit(1);
  }

  try {
    await prisma.$connect();
    const host = process.env.DATABASE_URL.replace(/^.*@/, "").replace(/[/?].*$/, "");
    console.log(`PostgreSQL connected (${host})`);
  } catch (err) {
    console.error(`\nPostgreSQL connection failed: ${err.message}`);
    console.error("   Check DATABASE_URL in backend/.env — Neon requires ?sslmode=require\n");
    process.exit(1);
  }
};

export default connectDB;

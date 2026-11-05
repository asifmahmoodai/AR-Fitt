import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/index.js";

// Single long-lived PrismaClient for the life of the Node process — the
// standard pattern for a traditional server (as opposed to the per-request
// construction Workers/edge runtimes require, since there's no per-isolate
// churn here and reusing one connection pool avoids exhausting Postgres).
let client;

export function buildPrismaClient() {
  if (!client) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    client = new PrismaClient({ adapter });
  }
  return client;
}

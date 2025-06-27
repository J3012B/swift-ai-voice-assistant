import type { Config } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables from .env.dev
config({ path: ".env.dev" });

export default {
  schema: "./drizzle/schema.ts",
  out: "./supabase/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config; 
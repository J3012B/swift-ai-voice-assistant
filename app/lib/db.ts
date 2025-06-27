import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// IMPORTANT: DATABASE_URL should point to your Supabase Postgres instance, e.g.
// postgres://postgres:<password>@db.<project>.supabase.co:5432/postgres

const queryClient = postgres(process.env.DATABASE_URL ?? "", {
  prepare: false, // Supabase's connection string doesn't play nicely with prepare by default
});

export const db = drizzle(queryClient);

export type DbInstance = typeof db; 
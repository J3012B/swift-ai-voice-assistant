import { pgTable, pgSchema, uuid, timestamp, text } from "drizzle-orm/pg-core";

// Reference to the existing Supabase `auth.users` table so we can create a proper FK.
const auth = pgSchema("auth");
export const authUsers = auth.table("users", {
  id: uuid("id")
    .notNull(),
  email: text("email"),
});

// Public users table that stores additional profile information for each Supabase user.
export const users = pgTable("users", {
  // Primary key re-uses the same UUID as the Supabase Auth user.
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Table to track individual interactions/requests made by users
export const interactions = pgTable("interactions", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // Convention: use timestamp without timezone for simplicity
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
}); 
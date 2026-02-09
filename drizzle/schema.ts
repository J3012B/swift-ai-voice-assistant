import { pgTable, pgSchema, uuid, timestamp, text, boolean, integer } from "drizzle-orm/pg-core";

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
	disableUsageLimit: boolean("disable_usage_limit"),

	// Stripe subscription fields
	stripeCustomerId: text("stripe_customer_id"),
	stripeSubscriptionId: text("stripe_subscription_id"),
	subscriptionStatus: text("subscription_status").default("inactive"), // 'active' | 'inactive' | 'cancelled' | 'past_due'
	subscriptionStartDate: timestamp("subscription_start_date", { withTimezone: true }),
	subscriptionEndDate: timestamp("subscription_end_date", { withTimezone: true }),
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

// Table to collect feedback from paying subscribers
export const feedback = pgTable("feedback", {
	id: uuid("id")
		.primaryKey()
		.defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	problemSolved: text("problem_solved"),       // "What problem are you solving?"
	mostImportantFeature: text("most_important_feature"), // "Which feature matters most?"
	improvement: text("improvement"),             // "How could it be better?"
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

// Table to track analytics events (subscriptions, churn, refunds)
export const analyticsEvents = pgTable("analytics_events", {
	id: uuid("id")
		.primaryKey()
		.defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "set null" }),
	eventType: text("event_type").notNull(), // 'subscription_created' | 'subscription_cancelled' | 'refund' | 'feedback_submitted' | 'paywall_view' | 'paywall_click'
	metadata: text("metadata"), // JSON string for additional event data
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
}); 
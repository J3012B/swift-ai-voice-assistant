import { db } from "./db";
import { users, analyticsEvents } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { TRIAL_DAYS } from "./constants";

export type SubscriptionStatus = "active" | "inactive" | "cancelled" | "past_due" | "trialing";

export interface AccessInfo {
	/** Stripe-paid subscription is active (or trialing on Stripe). */
	isSubscribed: boolean;
	/** Inside the no-card free trial window. */
	inTrial: boolean;
	/** When the no-card trial ends (null if never started). */
	trialEndsAt: Date | null;
	/** No-card trial has never been started and the user could start one now. */
	trialAvailable: boolean;
	/** Subscribed OR in trial OR admin-unlimited — i.e. no daily limit applies. */
	hasUnlimitedAccess: boolean;
}

interface SubscriptionInfo {
	isSubscribed: boolean;
	status: SubscriptionStatus;
	stripeCustomerId: string | null;
	stripeSubscriptionId: string | null;
	subscriptionStartDate: Date | null;
	subscriptionEndDate: Date | null;
}

class SubscriptionService {
	/**
	 * Check if a user has an active subscription
	 */
	async isSubscribed(userId: string): Promise<boolean> {
		try {
			const result = await db
				.select({ subscriptionStatus: users.subscriptionStatus, disableUsageLimit: users.disableUsageLimit })
				.from(users)
				.where(eq(users.id, userId));

			if (!result[0]) return false;

			// Users with disableUsageLimit bypass subscription check (admin override)
			if (result[0].disableUsageLimit === true) return true;

			return result[0].subscriptionStatus === "active" || result[0].subscriptionStatus === "trialing";
		} catch (error) {
			console.error("Failed to check subscription status:", error);
			// Fail closed: don't grant access on DB errors (avoids giving away unlimited).
			return false;
		}
	}

	/**
	 * Combined access info: paid subscription, no-card trial state, and whether
	 * the daily free limit applies. This is the source of truth for gating.
	 */
	async getAccessInfo(userId: string): Promise<AccessInfo> {
		const empty: AccessInfo = {
			isSubscribed: false,
			inTrial: false,
			trialEndsAt: null,
			trialAvailable: true,
			hasUnlimitedAccess: false,
		};
		try {
			const result = await db
				.select({
					subscriptionStatus: users.subscriptionStatus,
					disableUsageLimit: users.disableUsageLimit,
					trialEndsAt: users.trialEndsAt,
				})
				.from(users)
				.where(eq(users.id, userId));

			if (!result[0]) return empty;

			const row = result[0];
			const isSubscribed =
				row.disableUsageLimit === true ||
				row.subscriptionStatus === "active" ||
				row.subscriptionStatus === "trialing";

			const now = Date.now();
			const trialEndsAt = row.trialEndsAt ?? null;
			const inTrial = !!trialEndsAt && trialEndsAt.getTime() > now;
			// Trial can be started only if it was never started (null) and they aren't already subscribed.
			const trialAvailable = !isSubscribed && trialEndsAt === null;
			const hasUnlimitedAccess = isSubscribed || inTrial;

			return { isSubscribed, inTrial, trialEndsAt, trialAvailable, hasUnlimitedAccess };
		} catch (error) {
			console.error("Failed to get access info:", error);
			// Fail closed.
			return { ...empty, trialAvailable: false };
		}
	}

	/**
	 * Start the one-time, no-card free trial. Returns the trial end date,
	 * or null if a trial was already used or the user is subscribed.
	 */
	async startTrial(userId: string): Promise<Date | null> {
		try {
			const endsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

			// Only set trial_ends_at if it has never been set (one trial per user).
			const updated = await db
				.update(users)
				.set({ trialEndsAt: endsAt })
				.where(sql`${users.id} = ${userId} AND ${users.trialEndsAt} IS NULL`)
				.returning({ trialEndsAt: users.trialEndsAt });

			if (!updated[0]) {
				// Already used (or row missing) — report current value, don't reset it.
				return null;
			}

			await this.trackEvent(userId, "trial_started", { days: TRIAL_DAYS });
			return updated[0].trialEndsAt ?? endsAt;
		} catch (error) {
			console.error("Failed to start trial:", error);
			return null;
		}
	}

	/**
	 * Get full subscription info for a user
	 */
	async getSubscriptionInfo(userId: string): Promise<SubscriptionInfo> {
		try {
			const result = await db
				.select({
					subscriptionStatus: users.subscriptionStatus,
					stripeCustomerId: users.stripeCustomerId,
					stripeSubscriptionId: users.stripeSubscriptionId,
					subscriptionStartDate: users.subscriptionStartDate,
					subscriptionEndDate: users.subscriptionEndDate,
					disableUsageLimit: users.disableUsageLimit,
				})
				.from(users)
				.where(eq(users.id, userId));

			if (!result[0]) {
				return {
					isSubscribed: false,
					status: "inactive",
					stripeCustomerId: null,
					stripeSubscriptionId: null,
					subscriptionStartDate: null,
					subscriptionEndDate: null,
				};
			}

			const user = result[0];
			const isSubscribed = user.disableUsageLimit === true || user.subscriptionStatus === "active";

			return {
				isSubscribed,
				status: (user.subscriptionStatus as SubscriptionStatus) || "inactive",
				stripeCustomerId: user.stripeCustomerId,
				stripeSubscriptionId: user.stripeSubscriptionId,
				subscriptionStartDate: user.subscriptionStartDate,
				subscriptionEndDate: user.subscriptionEndDate,
			};
		} catch (error) {
			console.error("Failed to get subscription info:", error);
			return {
				isSubscribed: false,
				status: "inactive",
				stripeCustomerId: null,
				stripeSubscriptionId: null,
				subscriptionStartDate: null,
				subscriptionEndDate: null,
			};
		}
	}

	/**
	 * Update subscription status from Stripe webhook
	 */
	async updateSubscription(
		stripeCustomerId: string,
		data: {
			stripeSubscriptionId?: string;
			subscriptionStatus: SubscriptionStatus;
			subscriptionStartDate?: Date;
			subscriptionEndDate?: Date;
		}
	): Promise<void> {
		try {
			await db
				.update(users)
				.set({
					stripeSubscriptionId: data.stripeSubscriptionId,
					subscriptionStatus: data.subscriptionStatus,
					subscriptionStartDate: data.subscriptionStartDate,
					subscriptionEndDate: data.subscriptionEndDate,
				})
				.where(eq(users.stripeCustomerId, stripeCustomerId));
		} catch (error) {
			console.error("Failed to update subscription:", error);
			throw error;
		}
	}

	/**
	 * Link a Stripe customer ID to a user by userId (most reliable)
	 */
	async linkStripeCustomerByUserId(userId: string, stripeCustomerId: string): Promise<void> {
		try {
			await db
				.update(users)
				.set({ stripeCustomerId })
				.where(eq(users.id, userId));
			console.log(`Linked Stripe customer ${stripeCustomerId} to user ${userId}`);
		} catch (error) {
			console.error("Failed to link Stripe customer by userId:", error);
			throw error;
		}
	}

	/**
	 * Link a Stripe customer ID to a user (by email lookup) - fallback method
	 */
	async linkStripeCustomer(email: string, stripeCustomerId: string): Promise<void> {
		try {
			await db
				.update(users)
				.set({ stripeCustomerId })
				.where(eq(users.email, email));
			console.log(`Linked Stripe customer ${stripeCustomerId} to user with email ${email}`);
		} catch (error) {
			console.error("Failed to link Stripe customer by email:", error);
			throw error;
		}
	}

	/**
	 * Activate subscription for a user by Stripe customer ID
	 */
	async activateSubscription(
		stripeCustomerId: string,
		stripeSubscriptionId: string,
		periodStart: Date,
		periodEnd: Date,
		eventMeta?: { plan?: string; amount?: number; interval?: string }
	): Promise<void> {
		try {
			await db
				.update(users)
				.set({
					stripeSubscriptionId,
					subscriptionStatus: "active",
					subscriptionStartDate: periodStart,
					subscriptionEndDate: periodEnd,
				})
				.where(eq(users.stripeCustomerId, stripeCustomerId));

			// Track analytics event
			const user = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.stripeCustomerId, stripeCustomerId));

			if (user[0]) {
				await this.trackEvent(user[0].id, "subscription_created", {
					stripeSubscriptionId,
					// Real amount/interval when known (handles annual vs monthly); defaults to $19/mo.
					amount: eventMeta?.amount ?? 1900,
					interval: eventMeta?.interval ?? "month",
					plan: eventMeta?.plan ?? "monthly",
				});
			}
		} catch (error) {
			console.error("Failed to activate subscription:", error);
			throw error;
		}
	}

	/**
	 * Cancel/deactivate a subscription
	 */
	async deactivateSubscription(stripeCustomerId: string, reason: string = "cancelled"): Promise<void> {
		try {
			const status: SubscriptionStatus = reason === "past_due" ? "past_due" : "cancelled";

			await db
				.update(users)
				.set({ subscriptionStatus: status })
				.where(eq(users.stripeCustomerId, stripeCustomerId));

			// Track analytics event
			const user = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.stripeCustomerId, stripeCustomerId));

			if (user[0]) {
				await this.trackEvent(user[0].id, "subscription_cancelled", { reason });
			}
		} catch (error) {
			console.error("Failed to deactivate subscription:", error);
			throw error;
		}
	}

	/**
	 * Track an analytics event
	 */
	async trackEvent(userId: string | null, eventType: string, metadata?: Record<string, any>): Promise<void> {
		try {
			await db.insert(analyticsEvents).values({
				userId,
				eventType,
				metadata: metadata ? JSON.stringify(metadata) : null,
			});
		} catch (error) {
			console.error("Failed to track analytics event:", error);
			// Don't throw - analytics should never block the main flow
		}
	}
}

// Export as singleton
export const subscriptionService = new SubscriptionService();

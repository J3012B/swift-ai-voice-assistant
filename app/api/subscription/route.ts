import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { subscriptionService } from "../../lib/subscription-service";
import { interactionService } from "../../lib/interaction-service";
import { db } from "../../lib/db";
import { feedback, users } from "../../../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { FREE_DAILY_LIMIT } from "../../lib/constants";

export async function GET(_request: Request) {
	// Get user session
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
	const { data: { session } } = await supabase.auth.getSession();

	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		const [subscriptionInfo, access] = await Promise.all([
			subscriptionService.getSubscriptionInfo(session.user.id),
			subscriptionService.getAccessInfo(session.user.id),
		]);

		// Today's usage (UTC day) for the free tier.
		const { count: dailyUsed, exceeded: dailyExceeded } =
			await interactionService.checkDailyLimit(session.user.id, FREE_DAILY_LIMIT);

		// Lifetime interaction count drives the feedback/onboarding prompts.
		const interactionCount = await interactionService.getUserInteractionCount(session.user.id);

		// Check if user has already submitted feedback
		const feedbackResult = await db
			.select({ count: sql<number>`count(*)` })
			.from(feedback)
			.where(eq(feedback.userId, session.user.id));
		const hasFeedback = Number(feedbackResult[0]?.count) > 0;

		// Check if user has already answered the onboarding question
		const userRow = await db
			.select({ useCase: users.useCase })
			.from(users)
			.where(eq(users.id, session.user.id))
			.limit(1);
		const hasOnboarding = !!userRow[0]?.useCase;

		// Free tier is "exhausted" only if the user has no unlimited access (paid/trial)
		// AND has used today's allowance.
		const freeTierExhausted = !access.hasUnlimitedAccess && dailyExceeded;
		const freeTierRemaining = access.hasUnlimitedAccess
			? Number.MAX_SAFE_INTEGER
			: Math.max(0, FREE_DAILY_LIMIT - dailyUsed);

		return new Response(JSON.stringify({
			// Access
			isSubscribed: access.isSubscribed,
			hasUnlimitedAccess: access.hasUnlimitedAccess,
			inTrial: access.inTrial,
			trialEndsAt: access.trialEndsAt,
			trialAvailable: access.trialAvailable,
			status: subscriptionInfo.status,
			subscriptionStartDate: subscriptionInfo.subscriptionStartDate,
			subscriptionEndDate: subscriptionInfo.subscriptionEndDate,
			interactionCount,
			hasFeedback,
			// Free tier (now a daily allowance)
			freeTierLimit: FREE_DAILY_LIMIT,
			freeTierUsed: dailyUsed,
			freeTierRemaining,
			freeTierExhausted,
			// Show feedback prompt after 3-10 interactions if subscribed and no feedback yet
			shouldShowFeedback: access.isSubscribed && interactionCount >= 3 && interactionCount <= 10 && !hasFeedback,
			// Show onboarding question after 1st interaction if not yet answered
			shouldShowOnboarding: interactionCount >= 1 && !hasOnboarding,
		}), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Failed to fetch subscription info:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { subscriptionService } from "../../lib/subscription-service";
import { interactionService } from "../../lib/interaction-service";
import { db } from "../../lib/db";
import { feedback, users } from "../../../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { FREE_TIER_LIMIT } from "../../lib/constants";

export async function GET(_request: Request) {
	// Get user session
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
	const { data: { session } } = await supabase.auth.getSession();

	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		const subscriptionInfo = await subscriptionService.getSubscriptionInfo(session.user.id);
		
		// Get total interaction count for this user (for feedback prompt logic)
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

		const freeTierUsed = interactionCount;
		const freeTierRemaining = Math.max(0, FREE_TIER_LIMIT - freeTierUsed);
		const freeTierExhausted = freeTierUsed >= FREE_TIER_LIMIT;

		return new Response(JSON.stringify({
			isSubscribed: subscriptionInfo.isSubscribed,
			status: subscriptionInfo.status,
			subscriptionStartDate: subscriptionInfo.subscriptionStartDate,
			subscriptionEndDate: subscriptionInfo.subscriptionEndDate,
			interactionCount,
			hasFeedback,
			// Free tier info
			freeTierLimit: FREE_TIER_LIMIT,
			freeTierUsed,
			freeTierRemaining,
			freeTierExhausted,
			// Show feedback prompt after 3-5 interactions if no feedback yet
			shouldShowFeedback: subscriptionInfo.isSubscribed && interactionCount >= 3 && interactionCount <= 10 && !hasFeedback,
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

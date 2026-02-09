import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { subscriptionService } from "../../lib/subscription-service";
import { interactionService } from "../../lib/interaction-service";
import { db } from "../../lib/db";
import { feedback } from "../../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(_request: Request) {
	// Get user session
	const supabase = createRouteHandlerClient({ cookies });
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

		return new Response(JSON.stringify({
			isSubscribed: subscriptionInfo.isSubscribed,
			status: subscriptionInfo.status,
			subscriptionStartDate: subscriptionInfo.subscriptionStartDate,
			subscriptionEndDate: subscriptionInfo.subscriptionEndDate,
			interactionCount,
			hasFeedback,
			// Show feedback prompt after 3-5 interactions if no feedback yet
			shouldShowFeedback: subscriptionInfo.isSubscribed && interactionCount >= 3 && interactionCount <= 10 && !hasFeedback,
		}), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Failed to fetch subscription info:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

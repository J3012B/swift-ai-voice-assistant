import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { db } from "../../lib/db";
import { feedback } from "../../../drizzle/schema";
import { subscriptionService } from "../../lib/subscription-service";

export async function POST(request: Request) {
	// Get user session
	const supabase = createRouteHandlerClient({ cookies });
	const { data: { session } } = await supabase.auth.getSession();

	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		const body = await request.json();
		const { problemSolved, mostImportantFeature, improvement } = body;

		// Save feedback to database
		await db.insert(feedback).values({
			userId: session.user.id,
			problemSolved: problemSolved || null,
			mostImportantFeature: mostImportantFeature || null,
			improvement: improvement || null,
		});

		// Track analytics event
		await subscriptionService.trackEvent(session.user.id, "feedback_submitted", {
			hasResponse: {
				problemSolved: !!problemSolved,
				mostImportantFeature: !!mostImportantFeature,
				improvement: !!improvement,
			},
		});

		return new Response(JSON.stringify({ success: true }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Failed to save feedback:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

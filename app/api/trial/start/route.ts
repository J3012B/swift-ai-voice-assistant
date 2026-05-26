import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { subscriptionService } from "../../../lib/subscription-service";
import { TRIAL_DAYS } from "../../../lib/constants";

/**
 * POST /api/trial/start
 * Starts the one-time, no-card free trial for the authenticated user.
 */
export async function POST(_request: Request) {
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
	const { data: { session } } = await supabase.auth.getSession();

	if (!session?.user?.id) {
		return new Response(
			JSON.stringify({ success: false, message: "Please sign in to start your trial." }),
			{ status: 401, headers: { "Content-Type": "application/json" } }
		);
	}

	const trialEndsAt = await subscriptionService.startTrial(session.user.id);

	if (!trialEndsAt) {
		return new Response(
			JSON.stringify({
				success: false,
				message: "Your free trial has already been used. Subscribe for unlimited access.",
			}),
			{ status: 409, headers: { "Content-Type": "application/json" } }
		);
	}

	return new Response(
		JSON.stringify({
			success: true,
			trialEndsAt: trialEndsAt.toISOString(),
			trialDays: TRIAL_DAYS,
			message: `Your ${TRIAL_DAYS}-day free trial is active. Enjoy unlimited access!`,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } }
	);
}

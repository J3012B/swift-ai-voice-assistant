import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { interactionService } from "../../lib/interaction-service";

export async function GET(_request: Request) {
	// Get user session
	const supabase = createRouteHandlerClient({ cookies });
	const { data: { session } } = await supabase.auth.getSession();
	
	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}
	
	try {
		const DAILY_LIMIT = 10;
		const { count } = await interactionService.checkDailyLimit(session.user.id, DAILY_LIMIT);
		const remaining = Math.max(0, DAILY_LIMIT - count);
		
		return new Response(JSON.stringify({
			count,
			remaining,
			limit: DAILY_LIMIT,
			percentage: Math.round((count / DAILY_LIMIT) * 100)
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error("Failed to fetch usage:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
} 
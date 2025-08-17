import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { interactionService } from "../../lib/interaction-service";
import { db } from "../../lib/db";
import { users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";

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
		// Determine if this user has limits disabled
		const userSettings = await db
			.select({ disableUsageLimit: users.disableUsageLimit })
			.from(users)
			.where(eq(users.id, session.user.id));
		const isUnlimited = userSettings[0]?.disableUsageLimit === true;
		const remaining = isUnlimited ? Number.MAX_SAFE_INTEGER : Math.max(0, DAILY_LIMIT - count);
		
		return new Response(JSON.stringify({
			count,
			remaining,
			limit: DAILY_LIMIT,
			percentage: isUnlimited ? 0 : Math.round((count / DAILY_LIMIT) * 100),
			unlimited: isUnlimited,
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error("Failed to fetch usage:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
} 
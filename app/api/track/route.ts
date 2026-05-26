import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { subscriptionService } from "../../lib/subscription-service";

/**
 * POST /api/track
 * Records a client-side funnel event into analytics_events for the
 * authenticated user. Only a whitelist of event types is accepted so the
 * table can't be polluted from the client.
 */
const ALLOWED_EVENTS = new Set<string>([
	"paywall_viewed",
	"upgrade_clicked",
	"trial_cta_clicked",
]);

export async function POST(request: Request) {
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
	const { data: { session } } = await supabase.auth.getSession();

	if (!session?.user?.id) {
		return new Response(JSON.stringify({ ok: false }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	let event: string | undefined;
	let metadata: Record<string, any> | undefined;
	try {
		const body = await request.json();
		event = typeof body?.event === "string" ? body.event : undefined;
		metadata = body?.metadata && typeof body.metadata === "object" ? body.metadata : undefined;
	} catch {
		// fall through to validation below
	}

	if (!event || !ALLOWED_EVENTS.has(event)) {
		return new Response(JSON.stringify({ ok: false, error: "invalid_event" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	await subscriptionService.trackEvent(session.user.id, event, metadata);

	return new Response(JSON.stringify({ ok: true }), {
		headers: { "Content-Type": "application/json" },
	});
}

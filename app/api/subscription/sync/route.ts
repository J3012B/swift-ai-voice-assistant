import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { subscriptionService } from "../../../lib/subscription-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/subscription/sync
 * Manually sync subscription status from Stripe
 * Used when user has subscribed but webhook hasn't processed yet,
 * or when user already had a subscription that wasn't linked
 */
export async function POST(_request: Request) {
	// Get user session
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user?.id || !session?.user?.email) {
		return new Response(
			JSON.stringify({ error: "Unauthorized" }),
			{ status: 401, headers: { "Content-Type": "application/json" } }
		);
	}

	try {
		// Search for customers with this email in Stripe
		const customers = await stripe.customers.list({
			email: session.user.email,
			limit: 1,
		});

		if (customers.data.length === 0) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "No Stripe customer found with your email",
				}),
				{ status: 404, headers: { "Content-Type": "application/json" } }
			);
		}

		const customer = customers.data[0];

		// Link this customer to the user
		await subscriptionService.linkStripeCustomerByUserId(
			session.user.id,
			customer.id
		);

		// Get this customer's subscriptions (active or trialing both count).
		const subscriptions = await stripe.subscriptions.list({
			customer: customer.id,
			status: "all",
			limit: 10,
		});

		const subscription = subscriptions.data.find(
			(s) => s.status === "active" || s.status === "trialing"
		);

		if (!subscription) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "No active subscription found. If you just subscribed, please wait a moment and try again.",
				}),
				{ status: 404, headers: { "Content-Type": "application/json" } }
			);
		}

		// Activate the subscription in our database
		const startDate = new Date(subscription.start_date * 1000);
		const periodEnd = (subscription as any).current_period_end as number | undefined;
		const endDate = periodEnd
			? new Date(periodEnd * 1000)
			: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

		await subscriptionService.activateSubscription(
			customer.id,
			subscription.id,
			startDate,
			endDate
		);

		console.log(
			`Manual sync: activated subscription for user ${session.user.id} (${session.user.email})`
		);

		return new Response(
			JSON.stringify({
				success: true,
				message: "Subscription synced successfully!",
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error) {
		console.error("Failed to sync subscription:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to sync subscription",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}

import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { db } from "../../lib/db";
import { users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
	// Get user session
	const supabase = createRouteHandlerClient({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		// Look up the user's Stripe customer ID
		const result = await db
			.select({ stripeCustomerId: users.stripeCustomerId })
			.from(users)
			.where(eq(users.id, session.user.id));

		const stripeCustomerId = result[0]?.stripeCustomerId;

		if (!stripeCustomerId) {
			return new Response(
				JSON.stringify({ error: "No Stripe customer found. Please subscribe first." }),
				{ status: 404, headers: { "Content-Type": "application/json" } }
			);
		}

		const { origin } = new URL(request.url);

		// Create a Stripe Customer Portal session
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: stripeCustomerId,
			return_url: origin,
		});

		return new Response(
			JSON.stringify({ url: portalSession.url }),
			{ headers: { "Content-Type": "application/json" } }
		);
	} catch (error) {
		console.error("Failed to create portal session:", error);
		return new Response(
			JSON.stringify({ error: "Failed to create portal session" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}

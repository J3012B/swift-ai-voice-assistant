import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
	// Get user session
	const supabase = createRouteHandlerClient({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user?.id || !session?.user?.email) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		const { origin } = new URL(request.url);

		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "subscription",
			customer_email: session.user.email,
			line_items: [
				{
					price: process.env.STRIPE_PRICE_ID!,
					quantity: 1,
				},
			],
			success_url: `${origin}?subscribed=true`,
			cancel_url: `${origin}?cancelled=true`,
			metadata: {
				userId: session.user.id,
			},
		});

		return new Response(
			JSON.stringify({ url: checkoutSession.url }),
			{
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("Failed to create checkout session:", error);
		return new Response(
			JSON.stringify({ error: "Failed to create checkout session" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}

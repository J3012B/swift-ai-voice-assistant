import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
	// Get user session
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user?.id || !session?.user?.email) {
		return new Response("Unauthorized", { status: 401 });
	}

	try {
		const { origin } = new URL(request.url);

		// Plan selection: "annual" or "monthly" (default).
		let plan: "monthly" | "annual" = "monthly";
		try {
			const body = await request.json();
			if (body?.plan === "annual") plan = "annual";
		} catch {
			// No/invalid body — default to monthly.
		}

		const monthlyPrice = process.env.STRIPE_PRICE_ID_MONTHLY || process.env.STRIPE_PRICE_ID;
		const annualPrice = process.env.STRIPE_PRICE_ID_ANNUAL;
		const priceId = plan === "annual" ? annualPrice : monthlyPrice;

		if (!priceId) {
			console.error(`Missing Stripe price ID for plan "${plan}"`);
			return new Response(
				JSON.stringify({ error: `The ${plan} plan is not available right now.` }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "subscription",
			customer_email: session.user.email,
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			success_url: `${origin}?subscribed=true`,
			cancel_url: `${origin}?cancelled=true`,
			metadata: {
				userId: session.user.id,
				plan,
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

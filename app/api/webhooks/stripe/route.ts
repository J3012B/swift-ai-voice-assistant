import Stripe from "stripe";
import { subscriptionService } from "../../../lib/subscription-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
	const body = await request.text();
	const signature = request.headers.get("stripe-signature");

	if (!signature) {
		console.error("Missing Stripe signature");
		return new Response("Missing signature", { status: 400 });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err) {
		console.error("Webhook signature verification failed:", err);
		return new Response("Invalid signature", { status: 400 });
	}

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;
				
				if (session.mode === "subscription") {
					const userId = session.metadata?.userId;
					const customerEmail = session.customer_email;
					
					// Link the Stripe customer to our user
					// Try userId first (most reliable), fallback to email
					if (userId) {
						await subscriptionService.linkStripeCustomerByUserId(
							userId,
							session.customer as string
						);
					} else if (customerEmail) {
						await subscriptionService.linkStripeCustomer(
							customerEmail,
							session.customer as string
						);
					} else {
						console.error("Cannot link customer: missing userId and email");
						return new Response("Missing userId or email", { status: 400 });
					}

					// Activate the subscription
					const subscription = await stripe.subscriptions.retrieve(
						session.subscription as string
					);

					const startDate = new Date(subscription.start_date * 1000);
					// Estimate period end as 30 days from start for monthly
					const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

					await subscriptionService.activateSubscription(
						session.customer as string,
						subscription.id,
						startDate,
						endDate
					);

					console.log(`Subscription activated for user ${userId || customerEmail}`);
				}
				break;
			}

			case "customer.subscription.updated": {
				const subscription = event.data.object as Stripe.Subscription;
				const customerId = subscription.customer as string;

				if (subscription.status === "active") {
					const startDate = new Date(subscription.start_date * 1000);
					const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

					await subscriptionService.updateSubscription(customerId, {
						stripeSubscriptionId: subscription.id,
						subscriptionStatus: "active",
						subscriptionStartDate: startDate,
						subscriptionEndDate: endDate,
					});
				} else if (subscription.status === "past_due") {
					await subscriptionService.deactivateSubscription(customerId, "past_due");
				}

				console.log(`Subscription updated for customer ${customerId}: ${subscription.status}`);
				break;
			}

			case "customer.subscription.deleted": {
				const subscription = event.data.object as Stripe.Subscription;
				const customerId = subscription.customer as string;

				await subscriptionService.deactivateSubscription(customerId, "cancelled");
				console.log(`Subscription cancelled for customer ${customerId}`);
				break;
			}

			case "charge.refunded": {
				const charge = event.data.object as Stripe.Charge;
				const customerId = charge.customer as string;

				if (customerId) {
					await subscriptionService.deactivateSubscription(customerId, "cancelled");
					await subscriptionService.trackEvent(null, "refund", {
						stripeCustomerId: customerId,
						amount: charge.amount_refunded,
					});
					console.log(`Refund processed for customer ${customerId}`);
				}
				break;
			}

			case "invoice.payment_failed": {
				const invoice = event.data.object as Stripe.Invoice;
				const customerId = invoice.customer as string;

				await subscriptionService.deactivateSubscription(customerId, "past_due");
				console.log(`Payment failed for customer ${customerId}`);
				break;
			}

			default:
				console.log(`Unhandled webhook event: ${event.type}`);
		}
	} catch (error) {
		console.error(`Error processing webhook ${event.type}:`, error);
		return new Response("Webhook handler error", { status: 500 });
	}

	return new Response("OK", { status: 200 });
}

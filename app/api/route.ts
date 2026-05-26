import { headers } from "next/headers";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { after } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { openAIService } from "../lib/openai-service";
import { telegramErrorNotifier } from "../lib/telegram-error-notifier";
import { interactionService } from "../lib/interaction-service";
import { subscriptionService } from "../lib/subscription-service";
import { FREE_DAILY_LIMIT } from "../lib/constants";
import { ANON_FREE_TURNS, anonTurnsUsed, getClientIp, hashIp, recordAnonTurn } from "../lib/anon-service";

const schema = zfd.formData({
	input: z.union([zfd.text(), zfd.file()]),
	message: zfd.repeatableOfType(
		zfd.json(
			z.object({
				role: z.enum(["user", "assistant"]),
				content: z.string(),
			})
		)
	),
	screenshot: zfd.text().optional(),
});

export async function POST(request: Request) {
	const requestId = request.headers.get("x-vercel-id") || "local";
	
	// Get user session for interaction tracking
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
	const { data: { session } } = await supabase.auth.getSession();
	
	// Anonymous visitors get a small "taste" allowance before the signup wall.
	// Set when there's no session so we can record the consumed turn later.
	let anonIpHash: string | null = null;

	// Check subscription / trial / daily free tier for authenticated users
	if (session?.user?.id) {
		const access = await subscriptionService.getAccessInfo(session.user.id);

		if (!access.hasUnlimitedAccess) {
			// Free tier: a daily allowance that resets each UTC day.
			const { exceeded, count } = await interactionService.checkDailyLimit(session.user.id, FREE_DAILY_LIMIT);

			if (exceeded) {
				// Daily limit reached — track and block. The client decides whether to
				// offer the no-card trial (if available) or the subscribe paywall.
				await subscriptionService.trackEvent(session.user.id, "paywall_blocked", {
					trialAvailable: access.trialAvailable,
				});

				return new Response(
					JSON.stringify({
						error: "limit_reached",
						message: access.trialAvailable
							? "You've used your free conversations for today. Start your free 7-day trial to keep going."
							: "You've used your free conversations for today. Subscribe for unlimited access.",
						trialAvailable: access.trialAvailable,
						dailyUsed: count,
						dailyLimit: FREE_DAILY_LIMIT,
					}),
					{ status: 403, headers: { "Content-Type": "application/json", "X-Limit-Reached": "true" } }
				);
			}
			// else: still within today's free allowance, allow the request through
		}
	} else {
		// Anonymous: allow ANON_FREE_TURNS free turn(s) per IP per window, then require signup.
		const headersList = await headers();
		anonIpHash = hashIp(getClientIp(headersList));
		const used = await anonTurnsUsed(anonIpHash);

		if (used >= ANON_FREE_TURNS) {
			// Funnel: anonymous visitor used their free turn and is being asked to sign up.
			await subscriptionService.trackEvent(null, "signup_wall_shown", { ipHash: anonIpHash });
			return new Response(
				JSON.stringify({
					error: "signup_required",
					message: "Sign up free to keep talking to your computer.",
				}),
				{ status: 403, headers: { "Content-Type": "application/json", "X-Signup-Required": "true" } }
			);
		}
		// else: free turn available — consumed below once we have a valid transcript.
	}
	
	console.time("transcribe " + requestId);

	const { data, success } = schema.safeParse(await request.formData());
	if (!success) return new Response("Invalid request", { status: 400 });

	// Save screenshot locally if it exists [for debugging]
	// let screenshotPath;
	// if (data.screenshot) {
	// 	screenshotPath = await saveScreenshot(data.screenshot);
	// }

	const transcript = await getTranscript(data.input, requestId);
	if (!transcript) return new Response("Invalid audio", { status: 400 });

	// Consume the anonymous free turn only once we have a valid transcript,
	// so empty / too-short audio doesn't burn the visitor's single free try.
	if (anonIpHash) {
		await recordAnonTurn(anonIpHash);
	}

	console.timeEnd(
		"transcribe " + request.headers.get("x-vercel-id") || "local"
	);
	console.time(
		"text completion " + request.headers.get("x-vercel-id") || "local"
	);

	// Prepare the messages array with system and history
	const messages: any[] = [
		{
			role: "system",
			content: `${data.screenshot ? "- You are Grace, a friendly and helpful voice assistant and the user is sharing their desktop screen with you." :
				"- You are Grace, a friendly and helpful voice assistant. The user is not sharing their screen with you right now, so tell them to share their screen with you by clicking on 'Share Screen' so you can help them."}
		- Respond briefly, human-like, to the user's request, and do not provide unnecessary information. Only 2-3 sentences maximum.
		${data.screenshot ? "- You can see the user's screen, so you can help them with their request. Look at it and give them the best possible answer." : ""}
		- Use a conversational and friendly tone.
		- If you don't understand the user's request, ask for clarification.
		- If needed 1x question or instruction per response maximum.
		- You are not capable of performing actions other than ${data.screenshot ? "seeing the users screen and responding to their request" : "responding to the users request"}.
		- Do not use markdown, emojis, or other formatting in your responses. Respond in a way easily spoken by text-to-speech software.
		- User location is ${await location()}.
		- The current time is ${await time()}.`,
		},
		...data.message,
	];

	// Add the user's message with any screenshot if available
	const userMessage: any = {
		role: "user",
		content: [
			{
				type: "text",
				text: transcript,
			},
		],
	};

	// Add screenshot to the message content if it exists
	if (data.screenshot) {
		userMessage.content.push({
			type: "image_url",
			image_url: { url: data.screenshot },
		});
	}

	messages.push(userMessage);

	// Use our OpenAI service instead of Groq for chat completion
	let response: string;
	try {
		response = await openAIService.getChatCompletion(messages as any, { max_output_tokens: 150 });
		
		if (!response) {
			throw new Error("OpenAI returned empty response");
		}
	} catch (error) {
		console.error("OpenAI chat completion error:", error);
		
		// Send error notification to admin
		await telegramErrorNotifier.notifyOpenAIError(
			"Chat completion failed",
			error instanceof Error ? error.message : String(error),
			requestId
		);
		
		return new Response("AI service temporarily unavailable", { status: 500 });
	}

	console.timeEnd("text completion " + requestId);

	// Track interaction in database if user is authenticated
	const interactionId = await interactionService.trackInteraction(session);

	console.time("cartesia request " + requestId);

	let voice: Response;
	try {
		voice = await fetch("https://api.cartesia.ai/tts/bytes", {
			method: "POST",
			headers: {
				"Cartesia-Version": "2024-06-30",
				"Content-Type": "application/json",
				"X-API-Key": process.env.CARTESIA_API_KEY!,
			},
			body: JSON.stringify({
				model_id: "sonic-turbo",
				transcript: response,
				voice: {
					mode: "id",
					id: "79a125e8-cd45-4c13-8a67-188112f4dd22",
				},
				output_format: {
					container: "raw",
					encoding: "pcm_f32le",
					sample_rate: 24000,
				},
			}),
		});

		if (!voice.ok) {
			const errorText = await voice.text();
			console.error("Cartesia API error:", errorText);
			
			// Send error notification to admin
			await telegramErrorNotifier.notifyCartesiaError(
				`Voice synthesis failed (${voice.status}: ${voice.statusText})`,
				errorText,
				requestId
			);
			
			return new Response("Voice synthesis failed", { status: 500 });
		}
	} catch (error) {
		console.error("Cartesia fetch error:", error);
		
		// Send error notification to admin
		await telegramErrorNotifier.notifyCartesiaError(
			"Failed to connect to Cartesia API",
			error instanceof Error ? error.message : String(error),
			requestId
		);
		
		return new Response("Voice synthesis unavailable", { status: 500 });
	}

	console.timeEnd("cartesia request " + requestId);

	console.time("stream " + requestId);
	after(() => {
		console.timeEnd("stream " + requestId);
	});

	return new Response(voice.body, {
		headers: {
			"X-Transcript": encodeURIComponent(transcript),
			"X-Response": encodeURIComponent(response),
			...(interactionId && { "X-Interaction-Id": interactionId }),
		},
	});
}

async function location() {
	const headersList = await headers();

	const country = headersList.get("x-vercel-ip-country");
	const region = headersList.get("x-vercel-ip-country-region");
	const city = headersList.get("x-vercel-ip-city");

	if (!country || !region || !city) return "unknown";

	return `${city}, ${region}, ${country}`;
}

async function time() {
	const headersList = await headers();
	const timeZone = headersList.get("x-vercel-ip-timezone") || undefined;
	return new Date().toLocaleString("en-US", { timeZone });
}

async function getTranscript(input: string | File, requestId?: string) {
	if (typeof input === "string") return input;

	try {
		// Use our OpenAI service instead of Groq
		const text = await openAIService.getTranscription(input);

		return text.trim() || null;
	} catch (error) {
		console.error("Transcription error:", error);
		
		// Send error notification to admin
		await telegramErrorNotifier.notifyOpenAIError(
			"Transcription failed",
			error instanceof Error ? error.message : String(error),
			requestId
		);

		return null; // Empty audio file
	}
}

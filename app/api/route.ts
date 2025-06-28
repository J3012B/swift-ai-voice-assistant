import { headers } from "next/headers";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { after } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import { openAIService } from "../lib/openai-service";
import { telegramErrorNotifier } from "../lib/telegram-error-notifier";
import { interactionService } from "../lib/interaction-service";

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
	const supabase = createRouteHandlerClient({ cookies });
	const { data: { session } } = await supabase.auth.getSession();
	
	// Check daily limit for authenticated users
	if (session?.user?.id) {
		const DAILY_LIMIT = 10;
		const { exceeded, count } = await interactionService.checkDailyLimit(session.user.id, DAILY_LIMIT);
		
		if (exceeded) {
			// Return prerecorded limit message
			const limitMessage = "You've reached your daily limit of interactions for 'Talk To Your Computer'. Your usage resets at midnight, or you can upgrade now for unlimited access. Thanks for using the app!";
			
			try {
				// Serve prerecorded audio file from assets directory
				const audioPath = path.join(process.cwd(), 'app', 'api', 'assets', 'limit-reached.raw');
				const audioBuffer = fs.readFileSync(audioPath);
				
				return new Response(audioBuffer, {
					headers: {
						"X-Transcript": encodeURIComponent(""), // No user transcript since limit reached
						"X-Response": encodeURIComponent(limitMessage),
						"X-Rate-Limited": "true",
						"X-Usage-Count": count.toString(),
						"X-Daily-Limit": DAILY_LIMIT.toString(),
					},
				});
			} catch (error) {
				console.error("Failed to serve prerecorded limit audio:", error);
				
				// Fallback: generate the message on-the-fly
				const voice = await fetch("https://api.cartesia.ai/tts/bytes", {
					method: "POST",
					headers: {
						"Cartesia-Version": "2024-06-30",
						"Content-Type": "application/json",
						"X-API-Key": process.env.CARTESIA_API_KEY!,
					},
					body: JSON.stringify({
						model_id: "sonic-english",
						transcript: limitMessage,
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

				return new Response(voice.body, {
					headers: {
						"X-Transcript": encodeURIComponent(""),
						"X-Response": encodeURIComponent(limitMessage),
						"X-Rate-Limited": "true",
						"X-Usage-Count": count.toString(),
						"X-Daily-Limit": DAILY_LIMIT.toString(),
					},
				});
			}
		}
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
				type: "input_text",
				text: transcript,
			},
		],
	};

	// Add screenshot to the message content if it exists
	if (data.screenshot) {
		userMessage.content.push({
			type: "input_image",
			image_url: data.screenshot,
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
				model_id: "sonic-english",
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
		// Create a File object from the Blob which is compatible with OpenAI's API
		const file = new File([input], "audio.wav", { type: "audio/wav" });

		// Use our OpenAI service instead of Groq
		const text = await openAIService.getTranscription(file);

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

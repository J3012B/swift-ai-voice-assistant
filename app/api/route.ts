import Groq from "groq-sdk";
import { headers } from "next/headers";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { after } from "next/server";

const groq = new Groq();

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
	console.time("transcribe " + request.headers.get("x-vercel-id") || "local");

	const { data, success } = schema.safeParse(await request.formData());
	if (!success) return new Response("Invalid request", { status: 400 });

	const transcript = await getTranscript(data.input);
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
			content: `${data.screenshot ? "- You are Swift, a friendly and helpful voice assistant and the user is sharing their desktop screen with you." :
				"- You are Swift, a friendly and helpful voice assistant. The user is not sharing their screen with you right now, so tell them to share their screen with you so you can help them."}
		- Respond briefly to the user's request, and do not provide unnecessary information.
		- Use a conversational and friendly tone.
		- If you don't understand the user's request, ask for clarification.
		- If needed 1x question per response maximum.
		- You are not capable of performing actions other than responding to the user.
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
			image_url: {
				url: data.screenshot
			}
		});
	}

	messages.push(userMessage);

	const completion = await groq.chat.completions.create({
		model: "meta-llama/llama-4-scout-17b-16e-instruct",
		messages: messages as any,
	});

	const response = completion.choices[0].message.content;
	console.timeEnd(
		"text completion " + request.headers.get("x-vercel-id") || "local"
	);

	if (!response) return new Response("Invalid response", { status: 500 });

	console.time(
		"cartesia request " + request.headers.get("x-vercel-id") || "local"
	);

	const voice = await fetch("https://api.cartesia.ai/tts/bytes", {
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

	console.timeEnd(
		"cartesia request " + request.headers.get("x-vercel-id") || "local"
	);

	if (!voice.ok) {
		console.error(await voice.text());
		return new Response("Voice synthesis failed", { status: 500 });
	}

	console.time("stream " + request.headers.get("x-vercel-id") || "local");
	after(() => {
		console.timeEnd("stream " + request.headers.get("x-vercel-id") || "local");
	});

	return new Response(voice.body, {
		headers: {
			"X-Transcript": encodeURIComponent(transcript),
			"X-Response": encodeURIComponent(response),
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

async function getTranscript(input: string | File) {
	if (typeof input === "string") return input;

	try {
		// Create a File object from the Blob which is compatible with Groq's API
		const file = new File([input], "audio.wav", { type: "audio/wav" });

		const { text } = await groq.audio.transcriptions.create({
			file: file,
			model: "whisper-large-v3",
		});

		return text.trim() || null;
	} catch (error) {
		const errorHandler = {
			handleError: (err: any) => {
				console.error("Transcription error:", err);
				return null; // Empty audio file
			}
		};

		return errorHandler.handleError(error);
	}
}

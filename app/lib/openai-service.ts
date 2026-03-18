import OpenAI from 'openai';
import Groq from 'groq-sdk';

/**
 * OpenAI API service
 * Provides methods to interact with OpenAI's APIs
 */
class OpenAIService {
	private client: OpenAI;
	private groq: Groq;

	constructor() {
		this.client = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
		this.groq = new Groq({
			apiKey: process.env.GROQ_API_KEY,
		});
	}

	/**
	 * Get a chat completion from OpenAI
	 */
	async getChatCompletion(messages: any[], options?: { max_output_tokens?: number }) {
		try {
			const response = await this.client.chat.completions.create({
				model: "gpt-4o",
				messages: messages as any,
				max_tokens: options?.max_output_tokens,
			});

			return response.choices[0].message.content ?? "";
		} catch (error) {
			console.error('OpenAI API error:', error);
			throw error;
		}
	}

	/**
	 * Get a transcription from audio using Groq Whisper (faster than OpenAI Whisper-1)
	 */
	async getTranscription(file: File) {
		try {
			const transcription = await this.groq.audio.transcriptions.create({
				file: file,
				model: 'whisper-large-v3-turbo',
			});

			return transcription.text;
		} catch (error) {
			console.error('Groq transcription error:', error);
			throw error;
		}
	}
}

// Export as singleton
export const openAIService = new OpenAIService(); 
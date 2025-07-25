import OpenAI from 'openai';

/**
 * OpenAI API service
 * Provides methods to interact with OpenAI's APIs
 */
class OpenAIService {
	private client: OpenAI;

	constructor() {
		this.client = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
	}

	/**
	 * Get a chat completion from OpenAI
	 */
	async getChatCompletion(messages: any[], options?: { max_output_tokens?: number }) {
		// console.log('messages', JSON.stringify(messages, null, 2));

		try {
			const response = await this.client.responses.create({
				model: "gpt-4o",
				tools: [{ type: "web_search_preview" }],
				input: messages as any,
				max_output_tokens: options?.max_output_tokens,
			});

			return response.output_text;
		} catch (error) {
			console.error('OpenAI API error:', error);
			throw error;
		}
	}

	/**
	 * Get a transcription from audio
	 */
	async getTranscription(file: File) {
		try {
			const transcription = await this.client.audio.transcriptions.create({
				file: file,
				model: 'whisper-1',
			});

			return transcription.text;
		} catch (error) {
			console.error('OpenAI transcription error:', error);
			throw error;
		}
	}
}

// Export as singleton
export const openAIService = new OpenAIService(); 
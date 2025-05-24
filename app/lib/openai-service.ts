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
		console.log('messages', JSON.stringify(messages, null, 2));

		try {
			const response = await this.client.responses.create({
				model: "gpt-4o",
				tools: [{ type: "web_search_preview" }],
				input: messages,
				max_output_tokens: options?.max_output_tokens,
			});

			return response.output_text;
		} catch (error) {
			const errorHandler = {
				handleError: (err: any) => {
					console.error('OpenAI API error:', err);
					throw err;
				}
			};

			return errorHandler.handleError(error);
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
			const errorHandler = {
				handleError: (err: any) => {
					console.error('OpenAI transcription error:', err);
					throw err;
				}
			};

			return errorHandler.handleError(error);
		}
	}
}

// Export as singleton
export const openAIService = new OpenAIService(); 
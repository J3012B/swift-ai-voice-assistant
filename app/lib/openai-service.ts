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
	async getChatCompletion(messages: any[]) {
		try {
			const completion = await this.client.chat.completions.create({
				model: 'gpt-4o-search-preview',
				messages: messages,
				web_search_options: {}
			});

			return completion.choices[0].message.content;
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
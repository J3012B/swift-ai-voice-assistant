interface TelegramMessage {
	chat_id: string | number;
	text: string;
	parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
	disable_web_page_preview?: boolean;
	disable_notification?: boolean;
	reply_to_message_id?: number;
}

interface TelegramApiResponse {
	ok: boolean;
	result?: any;
	error_code?: number;
	description?: string;
}

interface TelegramBot {
	id: number;
	is_bot: boolean;
	first_name: string;
	username: string;
	can_join_groups: boolean;
	can_read_all_group_messages: boolean;
	supports_inline_queries: boolean;
}

class TelegramService {
	private botToken: string;
	private baseUrl: string;

	constructor(botToken?: string) {
		this.botToken = botToken || process.env.TELEGRAM_ADMIN_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
		this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
	}

	/**
	 * Verify bot token and get bot information
	 */
	async getBotInfo(): Promise<TelegramBot | null> {
		try {
			const response = await fetch(`${this.baseUrl}/getMe`);
			const data: TelegramApiResponse = await response.json();

			if (data.ok) {
				return data.result;
			} else {
				console.error('Telegram API Error:', data.description);
				return null;
			}
		} catch (error) {
			console.error('Error fetching bot info:', error);
			return null;
		}
	}

	/**
	 * Send a text message to a specific chat or user
	 */
	async sendMessage(params: TelegramMessage): Promise<boolean> {
		try {
			const response = await fetch(`${this.baseUrl}/sendMessage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			});

			const data: TelegramApiResponse = await response.json();

			if (data.ok) {
				console.log('Message sent successfully:', data.result);
				return true;
			} else {
				console.error('Failed to send message:', data.description);
				return false;
			}
		} catch (error) {
			console.error('Error sending message:', error);
			return false;
		}
	}

	/**
	 * Send a simple text message to a user by their chat ID
	 */
	async sendTextMessage(chatId: string | number, text: string): Promise<boolean> {
		return await this.sendMessage({
			chat_id: chatId,
			text: text,
		});
	}

	/**
	 * Send a formatted message with HTML parsing
	 */
	async sendHtmlMessage(chatId: string | number, html: string): Promise<boolean> {
		return await this.sendMessage({
			chat_id: chatId,
			text: html,
			parse_mode: 'HTML',
		});
	}

	/**
	 * Send a message with Markdown formatting
	 */
	async sendMarkdownMessage(chatId: string | number, markdown: string): Promise<boolean> {
		return await this.sendMessage({
			chat_id: chatId,
			text: markdown,
			parse_mode: 'Markdown',
		});
	}

	/**
	 * Get updates from the bot (for testing/debugging)
	 */
	async getUpdates(offset?: number, limit?: number): Promise<any[]> {
		try {
			const params = new URLSearchParams();
			if (offset) params.append('offset', offset.toString());
			if (limit) params.append('limit', limit.toString());

			const response = await fetch(`${this.baseUrl}/getUpdates?${params}`);
			const data: TelegramApiResponse = await response.json();

			if (data.ok) {
				return data.result || [];
			} else {
				console.error('Failed to get updates:', data.description);
				return [];
			}
		} catch (error) {
			console.error('Error getting updates:', error);
			return [];
		}
	}

	/**
	 * Get chat information by chat ID
	 */
	async getChat(chatId: string | number): Promise<any | null> {
		try {
			const response = await fetch(`${this.baseUrl}/getChat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ chat_id: chatId }),
			});

			const data: TelegramApiResponse = await response.json();

			if (data.ok) {
				return data.result;
			} else {
				console.error('Failed to get chat info:', data.description);
				return null;
			}
		} catch (error) {
			console.error('Error getting chat info:', error);
			return null;
		}
	}
}

// Export a singleton instance
export const telegramService = new TelegramService();

// Export the class for custom instances
export { TelegramService };

// Export types for use in other files
export type { TelegramMessage, TelegramApiResponse, TelegramBot }; 
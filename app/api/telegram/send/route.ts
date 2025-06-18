import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { telegramService } from '../../../lib/telegram-service';

const sendMessageSchema = z.object({
	chatId: z.union([z.string(), z.number()]),
	message: z.string().min(1, 'Message cannot be empty'),
	parseMode: z.enum(['HTML', 'Markdown', 'MarkdownV2']).optional(),
	disableWebPagePreview: z.boolean().optional(),
	disableNotification: z.boolean().optional(),
	replyToMessageId: z.number().optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = sendMessageSchema.parse(body);

		const success = await telegramService.sendMessage({
			chat_id: validatedData.chatId,
			text: validatedData.message,
			parse_mode: validatedData.parseMode,
			disable_web_page_preview: validatedData.disableWebPagePreview,
			disable_notification: validatedData.disableNotification,
			reply_to_message_id: validatedData.replyToMessageId,
		});

		if (success) {
			return NextResponse.json(
				{ success: true, message: 'Message sent successfully' },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ success: false, error: 'Failed to send message' },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Telegram send message error:', error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ success: false, error: 'Invalid request data', details: error.errors },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// GET endpoint for testing bot connectivity
export async function GET() {
	try {
		const botInfo = await telegramService.getBotInfo();

		if (botInfo) {
			return NextResponse.json({
				success: true,
				bot: {
					id: botInfo.id,
					name: botInfo.first_name,
					username: botInfo.username,
					isBot: botInfo.is_bot,
				}
			});
		} else {
			return NextResponse.json(
				{ success: false, error: 'Failed to connect to Telegram bot' },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Telegram bot info error:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
} 
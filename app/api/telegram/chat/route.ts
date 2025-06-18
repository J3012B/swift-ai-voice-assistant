import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { telegramService } from '../../../lib/telegram-service';

const getChatSchema = z.object({
	chatId: z.union([z.string(), z.number()]),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = getChatSchema.parse(body);

		const chatInfo = await telegramService.getChat(validatedData.chatId);

		if (chatInfo) {
			return NextResponse.json({
				success: true,
				chat: {
					id: chatInfo.id,
					type: chatInfo.type,
					title: chatInfo.title || null,
					username: chatInfo.username || null,
					first_name: chatInfo.first_name || null,
					last_name: chatInfo.last_name || null,
					bio: chatInfo.bio || null,
					description: chatInfo.description || null,
				}
			});
		} else {
			return NextResponse.json(
				{ success: false, error: 'Chat not found or bot has no access' },
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error('Telegram get chat error:', error);

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

// GET endpoint to retrieve recent updates (for debugging/testing)
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
		const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

		const updates = await telegramService.getUpdates(offset, limit);

		return NextResponse.json({
			success: true,
			updates: updates.map(update => ({
				update_id: update.update_id,
				message: update.message ? {
					message_id: update.message.message_id,
					from: {
						id: update.message.from?.id,
						first_name: update.message.from?.first_name,
						username: update.message.from?.username,
					},
					chat: {
						id: update.message.chat?.id,
						type: update.message.chat?.type,
						title: update.message.chat?.title,
					},
					date: update.message.date,
					text: update.message.text,
				} : null,
			})),
		});
	} catch (error) {
		console.error('Telegram get updates error:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
} 
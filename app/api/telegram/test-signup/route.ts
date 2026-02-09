import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
	const debug: Record<string, unknown> = {};

	try {
		// 1. Check env vars (mask values for safety)
		const botToken = process.env.TELEGRAM_ADMIN_BOT_TOKEN;
		const userId = process.env.TELEGRAM_ADMIN_USER_ID;

		debug.hasBotToken = Boolean(botToken);
		debug.botTokenLength = botToken?.length ?? 0;
		debug.botTokenPrefix = botToken?.slice(0, 8) + '...';
		debug.hasUserId = Boolean(userId);
		debug.userId = userId ?? '(not set)';

		console.log('[telegram-debug] env check:', JSON.stringify(debug));

		if (!botToken || !userId) {
			return NextResponse.json(
				{ success: false, error: 'Missing env vars', debug },
				{ status: 400 }
			);
		}

		// 2. Call Telegram getMe to verify the bot token works
		const getMeUrl = `https://api.telegram.org/${botToken}/getMe`;
		console.log('[telegram-debug] calling getMe...');
		const getMeRes = await fetch(getMeUrl);
		const getMeData = await getMeRes.json();
		debug.getMe = getMeData;
		console.log('[telegram-debug] getMe response:', JSON.stringify(getMeData));

		if (!getMeData.ok) {
			return NextResponse.json(
				{ success: false, error: 'Bot token invalid - getMe failed', debug },
				{ status: 400 }
			);
		}

		// 3. Try sending a test message directly (bypass service classes)
		const sendUrl = `https://api.telegram.org/${botToken}/sendMessage`;
		const payload = {
			chat_id: userId,
			text: 'Test signup notification from debug endpoint',
			parse_mode: 'HTML',
		};

		console.log('[telegram-debug] sending message to chat_id:', userId);
		const sendRes = await fetch(sendUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
		const sendData = await sendRes.json();
		debug.sendMessage = sendData;
		console.log('[telegram-debug] sendMessage response:', JSON.stringify(sendData));

		if (sendData.ok) {
			return NextResponse.json(
				{ success: true, message: 'Test message sent!', debug },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ success: false, error: 'sendMessage failed', debug },
				{ status: 400 }
			);
		}
	} catch (error) {
		debug.exception = error instanceof Error ? error.message : String(error);
		console.error('[telegram-debug] exception:', error);
		return NextResponse.json(
			{ success: false, error: 'Exception thrown', debug },
			{ status: 500 }
		);
	}
} 
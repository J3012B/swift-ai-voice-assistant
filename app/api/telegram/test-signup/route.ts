import { NextRequest, NextResponse } from 'next/server';
import { telegramErrorNotifier } from '../../../lib/telegram-error-notifier';

export async function POST(request: NextRequest) {
	try {
		// Test the signup notification with dummy data
		const success = await telegramErrorNotifier.notifyUserSignup(
			'test-user@example.com',
			'email'
		);

		if (success) {
			return NextResponse.json(
				{ success: true, message: 'Test signup notification sent successfully' },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ 
					success: false, 
					error: 'Failed to send test notification - check your TELEGRAM_ADMIN_BOT_TOKEN and TELEGRAM_ADMIN_USER_ID environment variables' 
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Test signup notification error:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
} 
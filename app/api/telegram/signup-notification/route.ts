import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { telegramErrorNotifier } from '../../../lib/telegram-error-notifier';

const signupNotificationSchema = z.object({
	email: z.string().email('Invalid email address'),
	method: z.enum(['email', 'google']).optional().default('email'),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = signupNotificationSchema.parse(body);

		const success = await telegramErrorNotifier.notifyUserSignup(
			validatedData.email,
			validatedData.method
		);

		if (success) {
			return NextResponse.json(
				{ success: true, message: 'Signup notification sent successfully' },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{ success: false, error: 'Failed to send signup notification' },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Signup notification error:', error);

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
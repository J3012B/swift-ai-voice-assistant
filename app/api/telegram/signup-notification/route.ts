import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { telegramErrorNotifier } from '../../../lib/telegram-error-notifier';
import { db } from '../../../lib/db';
import { users } from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

const signupNotificationSchema = z.object({
	email: z.string().email('Invalid email address'),
	method: z.enum(['email', 'google']).optional().default('email'),
	userId: z.string().uuid().optional(), // Optional userId for checking if user is new
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validatedData = signupNotificationSchema.parse(body);

		// If userId is provided, check if user already exists in database
		// If they exist, this is a sign-in, not a sign-up, so don't send notification
		if (validatedData.userId) {
			const existingUser = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.id, validatedData.userId))
				.limit(1);

			if (existingUser.length > 0) {
				console.log(`User ${validatedData.userId} already exists. Skipping signup notification.`);
				return NextResponse.json(
					{ success: true, message: 'User already exists, notification skipped' },
					{ status: 200 }
				);
			}
		}

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
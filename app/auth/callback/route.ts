import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { telegramErrorNotifier } from '../../lib/telegram-error-notifier';

export async function GET(request: Request) {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get('code');

	if (code) {
		const supabase = createRouteHandlerClient({ cookies });

		try {
			const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

			// Send Telegram notification for brand-new signups.
			// We check created_at: if the auth user was created less than 60 seconds ago
			// this is a genuine new signup, not a returning sign-in.
			if (session?.user) {
				const createdAt = new Date(session.user.created_at);
				const ageMs = Date.now() - createdAt.getTime();

				if (ageMs < 60_000) {
					const provider = session.user.app_metadata?.provider;
					const method = provider === 'google' ? 'google' : 'email';

					// Fire-and-forget — don't block the redirect on notification delivery
					telegramErrorNotifier.notifyUserSignup(
						session.user.email || 'unknown',
						method
					).catch(err => console.error('Failed to send signup notification:', err));
				}
			}
		} catch (error) {
			console.error('Auth callback error:', error);
		}
	}

	// Always redirect home — even on error the user should land on the app
	return NextResponse.redirect(requestUrl.origin);
}

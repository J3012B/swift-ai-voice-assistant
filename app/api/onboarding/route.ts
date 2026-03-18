import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '../../lib/db';
import { users } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendOnboardingNotificationEmail } from '../../lib/postmark';

export async function POST(request: NextRequest) {
	const cookieStore = await cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
	const { data: { session } } = await supabase.auth.getSession();

	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { useCase } = await request.json();

		if (!useCase?.trim()) {
			return NextResponse.json({ error: 'useCase is required' }, { status: 400 });
		}

		// Save to DB
		await db
			.update(users)
			.set({ useCase: useCase.trim() })
			.where(eq(users.id, session.user.id));

		// Forward to Josef (fire-and-forget) — skip if user dismissed without answering
		if (useCase.trim() !== 'skipped') {
			sendOnboardingNotificationEmail(session.user.email || 'unknown', useCase.trim())
				.catch(err => console.error('Failed to send onboarding notification:', err));
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Onboarding submission error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

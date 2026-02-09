import { NextResponse, NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // Initialize Supabase client with cookies
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // No redirect; UI handles auth via modal overlay

  return res;
}

export const config = {
  matcher: ['/((?!_next/.*|favicon.ico|api/tele.*|api/webhooks/.*|api/.*|vercel\.json).*)'],
}; 
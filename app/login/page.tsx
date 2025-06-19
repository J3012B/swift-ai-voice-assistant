'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function LoginPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      const redirectTo = searchParams.get('redirectedFrom') || '/';
      router.replace(redirectTo);
    }
  }, [session, router, searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
    }
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/login`,
      },
    });
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
      <h1 className="text-2xl font-semibold">{isSignUp ? 'Sign up' : 'Sign in'}</h1>
      <button
        className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
        onClick={handleGoogle}
      >
        Sign in with Google
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
        <input
          className="border rounded px-3 py-2 text-black"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 text-black"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : isSignUp ? 'Sign up' : 'Sign in'}
        </button>
        <button
          type="button"
          className="text-blue-600 text-sm underline"
          onClick={() => {
            setIsSignUp((prev) => !prev);
            setMessage(null);
          }}
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
      </form>
      {message && <p className="text-center text-sm text-gray-500 max-w-xs">{message}</p>}
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

type AuthTab = 'signin' | 'signup' | 'forgot';

export default function AuthModal() {
  const session = useSession();
  const supabase = useSupabaseClient();
  
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [isInitializing, setIsInitializing] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're still waiting for initial session
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100); // Small delay to prevent flash

    if (session) {
      // Clear form states when authenticated
      setEmail('');
      setPassword('');
      setMessage(null);
      setIsInitializing(false);

      // Check if this is an OAuth signup (not email, which is handled in handleSubmit)
      // Send notification with userId so the API can check if user already exists
      const provider = session.user?.app_metadata?.provider;
      const isOAuthUser = provider && provider !== 'email';
      
      if (isOAuthUser && session.user?.email && session.user?.id) {
        // Send Telegram notification for OAuth signup
        // The API will check if user exists and only send notification for new users
        fetch('/api/telegram/signup-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: session.user.email, 
            method: provider === 'google' ? 'google' : 'email',
            userId: session.user.id // Pass userId to check if user is new
          }),
        }).catch(error => {
          console.error('Failed to send OAuth signup notification:', error);
        });
      }
    }

    return () => clearTimeout(timer);
  }, [session]);

  // Don't render if user is authenticated
  if (session) return null;
  
  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Backdrop layer */}
        <div className="absolute inset-0 backdrop-blur-lg backdrop-brightness-90 backdrop-saturate-150" />

        {/* Modal container */}
        <div className="relative flex items-center justify-center min-h-screen pointer-events-auto">
          <div className="rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4 border border-neutral-200/50 dark:border-neutral-700/50">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-white mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (activeTab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (activeTab === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email to confirm your account!');
        
        // Send Telegram notification for new signup
        try {
          await fetch('/api/telegram/signup-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, method: 'email' }),
          });
        } catch (notificationError) {
          console.error('Failed to send signup notification:', notificationError);
          // Don't fail the signup if notification fails
        }
      } else if (activeTab === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}`,
        });
        if (error) throw error;
        setMessage('Check your email for password reset instructions!');
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
    
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}`,
      },
    });
  }

  const tabContent = {
    signin: {
      title: 'Welcome back',
      subtitle: 'Talk to your computer in real-time. Let\'s get you signed in.',
      buttonText: 'Sign in',
      loadingText: 'Signing in...',
      showPassword: true,
    },
    signup: {
      title: 'Create account',
      subtitle: 'Talk to your computer in real-time. Let\'s get you started.',
      buttonText: 'Create account',
      loadingText: 'Creating account...',
      showPassword: true,
    },
    forgot: {
      title: 'Reset password',
      subtitle: 'Enter your email and we\'ll send you reset instructions.',
      buttonText: 'Send reset email',
      loadingText: 'Sending...',
      showPassword: false,
    },
  };

  const content = tabContent[activeTab];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop layer */}
      <div className="absolute inset-0 backdrop-blur-lg backdrop-brightness-90 backdrop-saturate-150" />

      {/* Modal container */}
      <div className="relative flex items-center justify-center min-h-screen pointer-events-auto">
        <div className="rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4 border border-neutral-200/50 dark:border-neutral-700/50">
          {/* Tab Navigation */}
          <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setMessage(null);
              }}
              className={`flex-1 text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'signin'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setMessage(null);
              }}
              className={`flex-1 text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'signup'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              {content.title}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {content.subtitle}
            </p>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300 dark:border-neutral-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-neutral-900 text-neutral-500">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {content.showPassword && (
              <div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? content.loadingText : content.buttonText}
            </button>
          </form>

          {/* Forgot password link */}
          {activeTab === 'signin' && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('forgot');
                setMessage(null);
              }}
              className="w-full text-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mt-4 transition-colors"
            >
              Forgot your password?
            </button>
          )}

          {/* Back to sign in link */}
          {activeTab === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setMessage(null);
              }}
              className="w-full text-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mt-4 transition-colors"
            >
              Back to sign in
            </button>
          )}

          {/* Message */}
          {message && (
            <div className="mt-4 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <p className="text-sm text-neutral-700 dark:text-neutral-300 text-center">
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
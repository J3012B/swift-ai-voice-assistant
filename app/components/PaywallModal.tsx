'use client';

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

interface PaywallModalProps {
  isOpen: boolean;
  userEmail?: string;
  onRefreshStatus: () => void;
  freeTierUsed?: number;
  freeTierLimit?: number;
}

export default function PaywallModal({ isOpen, userEmail, onRefreshStatus, freeTierUsed = 0, freeTierLimit = 5 }: PaywallModalProps) {
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/subscription/sync', { method: 'POST' });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Subscription synced successfully!');
        onRefreshStatus();
      } else {
        toast.error(data.message || 'No active subscription found. Please subscribe or try again in a moment.');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync subscription. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  return (
    <div className="fixed inset-0 z-9999 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-xl backdrop-brightness-[0.85] backdrop-saturate-150" />

      {/* Modal */}
      <div className="relative flex items-center justify-center min-h-screen pointer-events-auto">
        <div className="w-full max-w-md mx-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/95 dark:bg-neutral-950/95 p-10 animate-[rise_0.4s_ease-out]">

          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
              Keep talking.
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-[15px] leading-relaxed">
              You&apos;ve used your {freeTierLimit} free conversations.<br />
              Subscribe for unlimited access.
            </p>
          </div>

          {/* Price */}
          <div className="text-center mb-10">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">$19</span>
              <span className="text-lg text-neutral-400 dark:text-neutral-500 font-medium">/month</span>
            </div>
            <p className="text-sm text-neutral-400 dark:text-neutral-600 mt-2">Cancel anytime</p>
          </div>

          {/* Benefits */}
          <div className="mb-10 space-y-4">
            {[
              'Unlimited conversations',
              'Screen sharing with AI vision',
              'Shape the product with your feedback',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 shrink-0" />
                <span className="text-[15px] text-neutral-600 dark:text-neutral-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? 'Redirecting...' : 'Subscribe'}
          </button>

          {/* Trust */}
          <p className="text-center text-sm text-neutral-400 dark:text-neutral-600 mt-4">
            14-day money-back guarantee. No questions asked.
          </p>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800/50 text-center space-y-2">
            <button
              type="button"
              className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors flex items-center justify-center gap-1.5 w-full"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Checking...
                </>
              ) : (
                'Already subscribed? Refresh'
              )}
            </button>

            {userEmail && (
              <div className="space-y-1">
                <p className="text-xs text-neutral-300 dark:text-neutral-700">
                  {userEmail}
                </p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}

            <a
              href="mailto:josef@heliconsolutions.net?subject=Refund%20Request"
              className="block text-xs text-neutral-300 dark:text-neutral-700 hover:text-neutral-500 dark:hover:text-neutral-500 transition-colors"
            >
              Refund policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

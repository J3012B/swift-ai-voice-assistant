'use client';

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

interface PaywallModalProps {
  isOpen: boolean;
  userEmail?: string;
  onRefreshStatus: () => void;
}

export default function PaywallModal({ isOpen, userEmail, onRefreshStatus }: PaywallModalProps) {
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
        // Redirect to Stripe Checkout — user will return to our app via success_url
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
        // Now refresh the local state
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
      {/* Backdrop layer */}
      <div className="absolute inset-0 backdrop-blur-lg backdrop-brightness-90 backdrop-saturate-150" />

      {/* Modal container */}
      <div className="relative flex items-center justify-center min-h-screen pointer-events-auto">
        <div className="rounded-2xl p-8 shadow-2xl w-full max-w-lg mx-4 border border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-900">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Get Unlimited Access
            </h1>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
              $9/month
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              TalkToYourComputer is now subscription-only.<br />
              Experience unlimited interactions and shape the product you use.
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">Unlimited voice interactions</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Talk to your AI assistant as much as you want</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">Screen sharing + AI vision</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Share your screen and get real-time help</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">Shape the product</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Your feedback directly influences development</p>
              </div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="mb-6 p-4 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  Risk-Free: 14-day money-back guarantee
                </p>
                <p className="text-xs text-green-700 dark:text-green-400">
                  Not satisfied? Email{' '}
                  <a href="mailto:josef@heliconsolutions.net?subject=Refund%20Request" className="underline font-medium">
                    josef@heliconsolutions.net
                  </a>
                  {' '}within 14 days for a full refund, no questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? 'Redirecting to checkout...' : 'Subscribe Now — $9/month'}
            </button>

            {/* Already subscribed? Refresh status */}
            <button
              type="button"
              className="w-full text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 py-2 transition-colors flex items-center justify-center gap-2"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Checking subscription status...
                </>
              ) : (
                'Already subscribed? Click to refresh'
              )}
            </button>

            <div className="text-center">
              <a
                href="mailto:josef@heliconsolutions.net?subject=Refund%20Policy%20Question"
                className="text-xs text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 underline transition-colors"
              >
                Questions about the refund policy?
              </a>
            </div>
          </div>

          {/* Small print */}
          <p className="text-xs text-neutral-400 dark:text-neutral-600 text-center mt-5">
            Cancel anytime. 14-day money-back guarantee — email{' '}
            <a href="mailto:josef@heliconsolutions.net?subject=Refund%20Request" className="underline hover:text-neutral-500 dark:hover:text-neutral-400">
              josef@heliconsolutions.net
            </a>
            . Billed monthly.
          </p>

          {/* Sign out link */}
          {userEmail && (
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700/50 text-center">
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">
                Signed in as {userEmail}
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs text-neutral-500 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 underline transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import {
  SUBSCRIPTION_PRICE,
  ANNUAL_PRICE,
  ANNUAL_MONTHLY_EQUIVALENT,
  TRIAL_DAYS,
} from '../lib/constants';

interface PaywallModalProps {
  isOpen: boolean;
  userEmail?: string;
  onRefreshStatus: () => void;
  freeTierUsed?: number;
  freeTierLimit?: number;
  /** Whether the no-card free trial can still be started. */
  trialAvailable?: boolean;
  /** Called after the trial is successfully started. */
  onTrialStarted?: () => void;
}

type Plan = 'monthly' | 'annual';

export default function PaywallModal({
  isOpen,
  userEmail,
  onRefreshStatus,
  freeTierLimit = 5,
  trialAvailable = false,
  onTrialStarted,
}: PaywallModalProps) {
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isTrialLoading, setIsTrialLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [plan, setPlan] = useState<Plan>('annual');
  // When a trial is available we lead with it; this reveals the plans instead.
  const [showPlans, setShowPlans] = useState(!trialAvailable);

  if (!isOpen) return null;

  const handleStartTrial = async () => {
    setIsTrialLoading(true);
    try {
      const response = await fetch('/api/trial/start', { method: 'POST' });
      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        toast.success(data.message || 'Your free trial is active!');
        onTrialStarted?.();
        onRefreshStatus();
      } else if (response.status === 409) {
        // Trial already used — fall back to the subscribe view.
        toast.info(data?.message || 'Your trial was already used.');
        setShowPlans(true);
      } else {
        toast.error(data?.message || 'Could not start your trial. Please try again.');
      }
    } catch (error) {
      console.error('Trial start error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsTrialLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.error || 'Failed to start checkout. Please try again.');
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

  const annualSavingsPct = Math.round((1 - ANNUAL_PRICE / (SUBSCRIPTION_PRICE * 12)) * 100);

  return (
    <div className="fixed inset-0 z-9999 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-xl backdrop-brightness-[0.85] backdrop-saturate-150" />

      {/* Modal */}
      <div className="relative flex items-center justify-center min-h-screen pointer-events-auto">
        <div className="w-full max-w-md mx-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/95 dark:bg-neutral-950/95 p-10 animate-[rise_0.4s_ease-out]">

          {/* ---- TRIAL-FIRST VIEW ---- */}
          {!showPlans && trialAvailable ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
                  Keep talking — free.
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-[15px] leading-relaxed">
                  You&apos;ve used your {freeTierLimit} free conversations for today.<br />
                  Start your {TRIAL_DAYS}-day free trial — unlimited, no card required.
                </p>
              </div>

              <div className="mb-8 space-y-4">
                {[
                  `Unlimited conversations for ${TRIAL_DAYS} days`,
                  'Screen sharing with AI vision',
                  'No credit card needed',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 shrink-0" />
                    <span className="text-[15px] text-neutral-600 dark:text-neutral-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handleStartTrial}
                disabled={isTrialLoading}
              >
                {isTrialLoading ? 'Starting…' : `Start ${TRIAL_DAYS}-day free trial`}
              </button>

              <button
                type="button"
                className="w-full text-center text-sm text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors mt-4"
                onClick={() => setShowPlans(true)}
              >
                Or subscribe now
              </button>
            </>
          ) : (
            /* ---- SUBSCRIBE VIEW (monthly / annual) ---- */
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
                  Keep talking.
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-[15px] leading-relaxed">
                  Subscribe for unlimited access to TalkToYourComputer.
                </p>
              </div>

              {/* Plan toggle */}
              <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-900 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setPlan('monthly')}
                  className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                    plan === 'monthly'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setPlan('annual')}
                  className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    plan === 'annual'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  Annual
                  <span className="text-[10px] font-bold uppercase tracking-wide text-green-600 dark:text-green-500">
                    Save {annualSavingsPct}%
                  </span>
                </button>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                {plan === 'monthly' ? (
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">${SUBSCRIPTION_PRICE}</span>
                    <span className="text-lg text-neutral-400 dark:text-neutral-500 font-medium">/month</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">${ANNUAL_PRICE}</span>
                      <span className="text-lg text-neutral-400 dark:text-neutral-500 font-medium">/year</span>
                    </div>
                    <p className="text-sm text-neutral-400 dark:text-neutral-600 mt-2">
                      Just ${ANNUAL_MONTHLY_EQUIVALENT}/mo · billed annually
                    </p>
                  </>
                )}
              </div>

              {/* Benefits */}
              <div className="mb-8 space-y-4">
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

              <p className="text-center text-sm text-neutral-400 dark:text-neutral-600 mt-4">
                14-day money-back guarantee. No questions asked.
              </p>
            </>
          )}

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

'use client';

import { STRIPE_PAYMENT_LINK } from '../lib/constants';

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  usageCount: number;
  dailyLimit: number;
  userEmail?: string;
}

export default function LimitModal({ isOpen, onClose, usageCount, dailyLimit, userEmail }: LimitModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    const emailParam = userEmail ? `?prefilled_email=${encodeURIComponent(userEmail)}` : '';
    const upgradeUrl = `${STRIPE_PAYMENT_LINK}${emailParam}`;
    window.open(upgradeUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop layer */}
      <div className="absolute inset-0 backdrop-blur-lg backdrop-brightness-90 backdrop-saturate-150" />

      {/* Modal container */}
      <div className="relative flex items-center justify-center min-h-screen pointer-events-auto">
        <div className="rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4 border border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-900">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Daily Limit Reached
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              You&apos;ve used {usageCount} of {dailyLimit} daily interactions
            </p>
          </div>

          {/* Content */}
          <div className="mb-6 space-y-4">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
              <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                Free Plan Includes:
              </h3>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>• {dailyLimit} interactions per day</li>
                <li>• Full access to voice assistant</li>
                <li>• Screen sharing capabilities</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-900 dark:text-green-300">
                  🚀 Launch Special Offer
                </h3>
                <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full font-medium">
                  Limited Time
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-green-700 dark:text-green-400">$49</span>
                <span className="text-lg text-neutral-500 dark:text-neutral-400 line-through">$69</span>
                <span className="text-sm text-green-600 dark:text-green-400">/ year</span>
              </div>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                <li>• Unlimited interactions</li>
                <li>• Priority support</li>
                <li>• One-time payment</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                Usage Resets:
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Your daily limit resets at midnight UTC. Come back tomorrow for more interactions!
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={handleUpgrade}
            >
              Get Launch Special - $49/year
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Continue with Free Plan
            </button>
          </div>

          {/* Small print */}
          <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center mt-4">
            Launch special: Save $20 on your first year • One-time payment • No subscriptions
          </p>
        </div>
      </div>
    </div>
  );
} 
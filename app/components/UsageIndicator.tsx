'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { STRIPE_PAYMENT_LINK } from '../lib/constants';

interface UsageData {
  count: number;
  remaining: number;
  limit: number;
  percentage: number;
  unlimited?: boolean;
}

interface UsageIndicatorProps {
  onUpgrade?: () => void;
}

export default function UsageIndicator({ onUpgrade }: UsageIndicatorProps) {
  const session = useSession();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/usage');
        if (response.ok) {
          const data = await response.json();
          setUsage(data);
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [session?.user?.id]);

  const handleUpgrade = () => {
    const emailParam = session?.user?.email ? `?prefilled_email=${encodeURIComponent(session.user.email)}` : '';
    const upgradeUrl = `${STRIPE_PAYMENT_LINK}${emailParam}`;
    window.open(upgradeUrl, '_blank');
    onUpgrade?.();
  };

  // Don't show if not authenticated or loading
  if (!session?.user || loading) return null;

  // Don't show if no usage data
  if (!usage) return null;

  const isUnlimited = usage.unlimited === true;
  const isNearLimit = !isUnlimited && usage.percentage >= 80;
  const isAtLimit = !isUnlimited && usage.remaining === 0;
  const progressDash = isUnlimited ? '100, 100' : `${usage.percentage}, 100`;

  return (
    <div className="fixed bottom-4 left-4 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-200/30 dark:border-neutral-700/30 p-4 shadow-xl">
      <div className="flex items-center gap-4">
        {/* Circular Progress */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-neutral-200 dark:text-neutral-700"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress circle */}
            <path
              className={`transition-all duration-300 ${
                isAtLimit 
                  ? 'text-red-500' 
                  : isNearLimit 
                    ? 'text-orange-500' 
                    : 'text-blue-500'
              }`}
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={progressDash}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold ${
              isAtLimit 
                ? 'text-red-600 dark:text-red-400' 
                : isNearLimit 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-blue-600 dark:text-blue-400'
            }`}>
              {usage.count}
            </span>
          </div>
        </div>

        {/* Usage Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Daily Usage
            </span>
            {isAtLimit && (
              <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-medium">
                Limit Reached
              </span>
            )}
            {isUnlimited && (
              <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                Unlimited
              </span>
            )}
          </div>
          
          <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {isUnlimited ? (
              <span className="font-medium">{usage.count} interactions today</span>
            ) : (
              <>
                <span className="font-medium">{usage.count} of {usage.limit}</span> interactions used
                {usage.remaining > 0 && (
                  <span className="block text-neutral-500 dark:text-neutral-500">
                    {usage.remaining} remaining today
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Upgrade Button */}
        {!isUnlimited && (
          <button
            onClick={handleUpgrade}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap transform hover:scale-105 ${
              isAtLimit
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/25'
                : isNearLimit
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25'
            }`}
          >
            {isAtLimit ? '🚀 Upgrade' : '✨ Go Pro'}
          </button>
        )}
      </div>
    </div>
  );
} 
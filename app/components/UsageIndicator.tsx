'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

interface SubscriptionData {
  isSubscribed: boolean;
  status: string;
  interactionCount: number;
}

interface UsageIndicatorProps {
  onUpgrade?: () => void;
}

export default function UsageIndicator({ onUpgrade }: UsageIndicatorProps) {
  const session = useSession();
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/subscription');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const result = await response.json();
      if (response.ok && result.url) {
        window.location.href = result.url;
      } else {
        toast.error('Failed to start checkout. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
    onUpgrade?.();
  };

  // Don't show if not authenticated or loading
  if (!session?.user || loading) return null;
  if (!data) return null;

  // For subscribed users, show a simple "Subscribed" badge (handled in page.tsx)
  // This component is kept for backward compatibility but can be removed
  if (data.isSubscribed) return null;

  // For unsubscribed users, show subscribe prompt
  return (
    <div className="fixed bottom-4 left-4 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-200/30 dark:border-neutral-700/30 p-4 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Subscribe to access
          </span>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            $9/month &middot; 14-day money-back guarantee
          </p>
        </div>

        <button
          onClick={handleSubscribe}
          className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap transform hover:scale-105 bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
}

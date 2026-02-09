'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

interface ProfileDropdownProps {
  subscriptionStatus?: string;
  subscriptionEndDate?: string | null;
}

export default function ProfileDropdown({ subscriptionStatus, subscriptionEndDate }: ProfileDropdownProps) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session) return null;

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
    }
    setIsOpen(false);
  }

  async function handleManageSubscription() {
    setIsPortalLoading(true);
    try {
      const response = await fetch('/api/portal', { method: 'POST' });
      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to open subscription management.');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsPortalLoading(false);
    }
  }

  const userEmail = session.user?.email || 'User';
  const userInitials = userEmail
    .split('@')[0]
    .split(/[^a-zA-Z]/)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isActive = subscriptionStatus === 'active';

  // Format renewal date
  const renewalDate = subscriptionEndDate
    ? new Date(subscriptionEndDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full text-sm font-medium transition-colors"
        aria-label="Profile menu"
      >
        {userInitials}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              {userEmail}
            </p>
            {isActive && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  Active subscription
                </span>
              </div>
            )}
          </div>

          {/* Subscription management */}
          {isActive && (
            <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              {renewalDate && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  Renews on {renewalDate}
                </p>
              )}
              <button
                onClick={handleManageSubscription}
                disabled={isPortalLoading}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
              >
                {isPortalLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Opening...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Subscription
                  </>
                )}
              </button>
            </div>
          )}

          {/* Refund policy */}
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              14-day money-back guarantee. Request a refund at{' '}
              <a
                href="mailto:josef@heliconsolutions.net?subject=Refund%20Request"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                josef@heliconsolutions.net
              </a>
            </p>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

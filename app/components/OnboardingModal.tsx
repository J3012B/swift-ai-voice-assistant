'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [useCase, setUseCase] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSkip() {
    // Save "skipped" so the modal never reappears
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ useCase: 'skipped' }),
    }).catch(() => {});
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!useCase.trim()) return;
    setSubmitting(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useCase }),
      });

      if (response.ok) {
        toast.success('Thanks for sharing!');
        onClose();
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit onboarding response:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-md backdrop-brightness-95 backdrop-saturate-150" />

      {/* Modal */}
      <div className="relative flex items-center justify-center min-h-screen pointer-events-auto">
        <div className="rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4 border border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-900">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
              Quick question from Josef
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              I built this — I'm curious what brought you here.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                What are you planning to use Talk To Your Computer for?
              </label>
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="e.g., I want help while coding, navigating my desktop hands-free..."
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                rows={3}
                autoFocus
              />
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                disabled={submitting || !useCase.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send to Josef'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={submitting}
                className="w-full text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 py-2 transition-colors"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

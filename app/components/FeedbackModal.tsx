'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [problemSolved, setProblemSolved] = useState('');
  const [mostImportantFeature, setMostImportantFeature] = useState('');
  const [improvement, setImprovement] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemSolved,
          mostImportantFeature,
          improvement,
        }),
      });

      if (response.ok) {
        toast.success('Thanks for your feedback!');
        onClose();
      } else {
        toast.error('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    // Mark as dismissed so we don't show again this session
    onClose();
  }

  return (
    <div className="fixed inset-0 z-9998 pointer-events-none">
      {/* Backdrop layer */}
      <div className="absolute inset-0 backdrop-blur-md backdrop-brightness-95 backdrop-saturate-150" />

      {/* Modal container */}
      <div className="relative flex items-center justify-center min-h-screen pointer-events-auto">
        <div className="rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4 border border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-900">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
              Thanks for subscribing!
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Help us improve — answer 3 quick questions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                1. What problem are you solving with TalkToYourComputer?
              </label>
              <textarea
                value={problemSolved}
                onChange={(e) => setProblemSolved(e.target.value)}
                placeholder="e.g., I need help debugging code while I work..."
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                2. Which feature matters most to you?
              </label>
              <textarea
                value={mostImportantFeature}
                onChange={(e) => setMostImportantFeature(e.target.value)}
                placeholder="e.g., Voice chat, screen sharing, quick answers..."
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                3. How could it be better for you?
              </label>
              <textarea
                value={improvement}
                onChange={(e) => setImprovement(e.target.value)}
                placeholder="e.g., Faster responses, remember my preferences..."
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="w-full text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 py-2 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

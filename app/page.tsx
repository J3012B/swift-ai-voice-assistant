'use client';

import clsx from 'clsx';
import {
	useActionState,
	useEffect,
	useRef,
	useState,
	startTransition,
	useCallback,
	useMemo,
} from 'react';
import { toast } from 'sonner';
import { LoadingIcon } from '@/lib/icons';
import { usePlayer } from '@/lib/usePlayer';
import { useMicAnalyser } from '@/lib/useMicAnalyser';
import { playNotificationSound, playShutterSound } from '@/lib/playBuzz';
import { track } from '@vercel/analytics';
import { useMicVAD, utils } from '@ricky0123/vad-react';
import ProfileDropdown from './components/ProfileDropdown';
import PaywallModal from './components/PaywallModal';
import FeedbackModal from './components/FeedbackModal';
import PictureInPictureContent, { usePictureInPicture } from './components/PictureInPicture';
import AuthModal from './components/AuthModal';
import { useSession } from '@supabase/auth-helpers-react';

type Message = {
	role: 'user' | 'assistant';
	content: string;
	latency?: number;
};

interface SubscriptionData {
	isSubscribed: boolean;
	status: string;
	subscriptionEndDate: string | null;
	interactionCount: number;
	hasFeedback: boolean;
	shouldShowFeedback: boolean;
	freeTierLimit: number;
	freeTierUsed: number;
	freeTierRemaining: number;
	freeTierExhausted: boolean;
}

export default function Home() {
	const session = useSession();
	const [isSharing, setIsSharing] = useState(false);
	const [isPaused, setIsPaused] = useState(true);
	const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
	const [showAuth, setShowAuth] = useState(false);
	const [showPaywall, setShowPaywall] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);
	const [feedbackDismissed, setFeedbackDismissed] = useState(false);
	const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
	const [subscriptionLoading, setSubscriptionLoading] = useState(true);
	const [lastScreenshot, setLastScreenshot] = useState<string | null>(null);
	const [lastResponseText, setLastResponseText] = useState<string | null>(null);
	const [quotaExhausted, setQuotaExhausted] = useState(false);
	const quotaExhaustedRef = useRef(false);
	const [volume, setVolume] = useState(0);
	const player = usePlayer();
	const mic = useMicAnalyser();
	const pip = usePictureInPicture();
	const volumeAnimRef = useRef<number>(0);
	// Stable refs for animation loops — avoids stale closures and effect restarts
	const playerRef = useRef(player);
	const micRef = useRef(mic);
	playerRef.current = player;
	micRef.current = mic;

	// Detect ?subscribed=true or ?cancelled=true in the URL (return from Stripe Checkout)
	const searchParams = useMemo(() => {
		if (typeof window === 'undefined') return null;
		return new URLSearchParams(window.location.search);
	}, []);
	const returnedFromCheckout = searchParams?.get('subscribed') === 'true';
	const cancelledCheckout = searchParams?.get('cancelled') === 'true';

	// Clean up URL params after reading them
	useEffect(() => {
		if (returnedFromCheckout || cancelledCheckout) {
			const url = new URL(window.location.href);
			url.searchParams.delete('subscribed');
			url.searchParams.delete('cancelled');
			window.history.replaceState({}, '', url.pathname);
		}
		if (cancelledCheckout) {
			toast.info('Checkout cancelled. You can subscribe anytime.');
		}
	}, [returnedFromCheckout, cancelledCheckout]);

	// Fetch subscription status
	const fetchSubscription = useCallback(async () => {
		if (!session?.user?.id) {
			setSubscriptionLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/subscription');
			if (response.ok) {
				const data: SubscriptionData = await response.json();
				setSubscriptionData(data);
				// Only show paywall if not subscribed AND free tier is exhausted
				setShowPaywall(!data.isSubscribed && data.freeTierExhausted);

				// Show feedback prompt if conditions are met and not already dismissed
				if (data.shouldShowFeedback && !feedbackDismissed) {
					setShowFeedback(true);
				}
			}
		} catch (error) {
			console.error('Failed to fetch subscription status:', error);
		} finally {
			setSubscriptionLoading(false);
		}
	}, [session?.user?.id, feedbackDismissed]);

	useEffect(() => {
		fetchSubscription();
	}, [fetchSubscription]);

	// If user returned from Stripe Checkout, poll for subscription activation
	// (webhook may take a moment to process)
	useEffect(() => {
		if (!returnedFromCheckout || !session?.user?.id) return;

		toast.info('Verifying your subscription...');

		let attempts = 0;
		const maxAttempts = 10;

		const pollInterval = setInterval(async () => {
			attempts++;
			try {
				const response = await fetch('/api/subscription');
				if (response.ok) {
					const data: SubscriptionData = await response.json();
					if (data.isSubscribed) {
						setSubscriptionData(data);
						setShowPaywall(false);
						toast.success('Subscription activated! Welcome aboard.');
						clearInterval(pollInterval);
						return;
					}
				}
			} catch {
				// Ignore fetch errors during polling
			}

			if (attempts >= maxAttempts) {
				clearInterval(pollInterval);
				toast.info(
					'Subscription is still being processed. It may take a minute — use the refresh button on the paywall.',
				);
			}
		}, 2000); // Poll every 2 seconds

		return () => clearInterval(pollInterval);
	}, [returnedFromCheckout, session?.user?.id]);

	// Re-check subscription when window regains focus (user may have just paid in another tab)
	useEffect(() => {
		function handleFocus() {
			if (session?.user?.id) {
				fetchSubscription();
			}
		}

		window.addEventListener('focus', handleFocus);
		return () => window.removeEventListener('focus', handleFocus);
	}, [session?.user?.id, fetchSubscription]);

	// Track paywall view for analytics
	useEffect(() => {
		if (showPaywall && session?.user?.id) {
			track('Paywall viewed');
		}
	}, [showPaywall, session?.user?.id]);

	const vad = useMicVAD({
		startOnLoad: false,
		onSpeechEnd: (audio) => {
			if (quotaExhaustedRef.current) return;
			player.stop();
			const wav = utils.encodeWAV(audio);
			const blob = new Blob([wav], { type: 'audio/wav' });
			startTransition(() => submit(blob));
			const isFirefox = navigator.userAgent.includes('Firefox');
			if (isFirefox) vad.pause();
		},
		positiveSpeechThreshold: 0.6,
		minSpeechFrames: 4,
		baseAssetPath: '/vad/',
		onnxWASMBasePath: '/vad/',
	});

	// Volume tracking loop — reads mic or AI audio volume at ~60fps
	// Uses refs to avoid effect restarts from changing object references
	useEffect(() => {
		if (isPaused) {
			setVolume(0);
			return;
		}

		function tick() {
			// Try AI audio output first — if it has signal, use it
			const freq = playerRef.current.getFrequencyData();
			if (freq) {
				let sum = 0;
				for (let i = 0; i < freq.length; i++) sum += freq[i];
				const aiVol = sum / (freq.length * 255);
				if (aiVol > 0.01) {
					setVolume(aiVol);
					volumeAnimRef.current = requestAnimationFrame(tick);
					return;
				}
			}
			// Fall back to mic volume
			setVolume(micRef.current.getVolume());
			volumeAnimRef.current = requestAnimationFrame(tick);
		}

		tick();
		return () => cancelAnimationFrame(volumeAnimRef.current);
	}, [isPaused]);

	// Handle stopping and resuming conversation
	useEffect(() => {
		if (isPaused) {
			vad.pause();
			player.stop();
			if (!vad.loading && !vad.errored) {
				toast.info('Conversation stopped');
			}
		} else if (!vad.listening && !vad.loading && !vad.errored) {
			vad.start();
			toast.success('Conversation started');
		}
	}, [isPaused, vad, player]);

	async function startConversation() {
		// Gate on authentication
		if (!session) {
			setShowAuth(true);
			return;
		}

		// Step 1: Request screen sharing
		try {
			const mediaStream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true,
			});

			setIsSharing(true);
			setScreenStream(mediaStream);

			// Handle when user stops sharing via browser UI
			mediaStream.getTracks().forEach(t => {
				t.onended = () => {
					stopConversation();
				};
			});
		} catch {
			// User cancelled screen share picker — don't start conversation
			toast.info('Screen sharing is required to start a conversation.');
			return;
		}

		// Step 2: Open PiP mini player (requires user gesture — we're still in the click handler)
		if (pip.isSupported) {
			await pip.open();
		}

		// Step 3: Start mic analyser for volume visualization
		await mic.start();

		// Step 4: Start listening
		setIsPaused(false);
		setQuotaExhausted(false);
		quotaExhaustedRef.current = false;
		track('Start conversation');
	}

	function stopConversation() {
		// Stop screen sharing
		if (screenStream) {
			screenStream.getTracks().forEach(t => t.stop());
		}
		setIsSharing(false);
		setScreenStream(null);

		// Stop mic analyser
		mic.stop();

		// Close PiP
		pip.close();

		// Pause conversation
		setIsPaused(true);
		track('Pause conversation');
	}

	// Function to capture screenshot from screen sharing stream
	async function captureScreenshot(): Promise<string | null> {
		if (!isSharing || !screenStream) return null;
		
		try {
			// Create a video element to capture the stream
			const video = document.createElement('video');
			video.srcObject = screenStream;
			video.autoplay = true;
			
			// Wait for video to be ready
			await new Promise(resolve => {
				video.onloadedmetadata = resolve;
				// If already loaded, resolve immediately
				if (video.readyState >= 2) resolve(null);
			});
			
			// Create a canvas to draw the video frame
			const canvas = document.createElement('canvas');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			
			// Draw the current video frame to the canvas
			const ctx = canvas.getContext('2d');
			if (!ctx) return null;
			
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			
			// Convert canvas to data URL (base64 image)
			const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
			
			return dataUrl;
		} catch (error) {
			const errorHandler = {
				handleError: (err: any) => {
					console.error('Screenshot capture error:', err);
					return null;
				}
			};
			
			return errorHandler.handleError(error);
		}
	}

	const [messages, submit, isPending] = useActionState<
		Array<Message>,
		string | Blob
	>(async (prevMessages, data) => {
		const formData = new FormData();

		if (typeof data === 'string') {
			formData.append('input', data);
			track('Text input');
		} else {
			formData.append('input', data, 'audio.wav');
			track('Speech input');
		}

		// Capture screenshot if screen sharing is active
		const screenshot = await captureScreenshot();
		if (screenshot) {
			formData.append('screenshot', screenshot);
			setLastScreenshot(screenshot);
			playShutterSound();
			track('Screenshot captured');
		}

		for (const message of prevMessages) {
			formData.append('message', JSON.stringify(message));
		}

		const submittedAt = Date.now();

		const response = await fetch('/api', {
			method: 'POST',
			body: formData,
		});

		// Handle free tier exhausted / subscription required
		if (response.status === 403) {
			const data = await response.json().catch(() => null);
			if (data?.error === 'subscription_required') {
				// Stop any playing audio immediately
				player.stop();
				// Pause VAD so it stops recording
				vad.pause();
				// Show quota exhausted in PiP and main UI
				setQuotaExhausted(true);
				quotaExhaustedRef.current = true;
				setShowPaywall(true);
				fetchSubscription();
				toast.error('You\'ve used all your free interactions. Subscribe to continue.');

				// Play gentle chime, then the voice limit-reached message
				playNotificationSound();
				setTimeout(() => {
					const audio = new Audio('/api/limit-reached-audio');
					audio.play().catch(() => {});
				}, 600);

				return prevMessages;
			}
		}

		const transcript = decodeURIComponent(
			response.headers.get('X-Transcript') || ''
		);
		const text = decodeURIComponent(response.headers.get('X-Response') || '');

		if (!response.ok || !transcript || !text || !response.body) {
			if (response.status === 429) {
				toast.error('Too many requests. Please try again later.');
			} else {
				toast.error((await response.text()) || 'An error occurred.');
			}

			return prevMessages;
		}

		const latency = Date.now() - submittedAt;
		
		// Only play audio if conversation is not paused
		if (!isPaused) {
			player.play(response.body, () => {
				const isFirefox = navigator.userAgent.includes('Firefox');
				if (isFirefox) vad.start();
			});
		}
		
		setLastResponseText(text);

		// After successful interaction, re-check if we should show feedback prompt
		// (refreshes interaction count)
		fetchSubscription();

		// Normal flow: show both user and assistant messages
		return [
			...prevMessages,
			{
				role: 'user',
				content: transcript,
			},
			{
				role: 'assistant',
				content: text,
				latency,
			},
		];
	}, []);

	function handleFeedbackClose() {
		setShowFeedback(false);
		setFeedbackDismissed(true);
		// Refresh subscription data (marks feedback as submitted)
		fetchSubscription();
	}

	return (
		<div className='flex flex-col items-center'>
			{/* Auth Modal — shown when unauthenticated user tries to start */}
			<AuthModal
				isOpen={showAuth}
				onClose={() => setShowAuth(false)}
			/>

			{/* Paywall Modal — blocks all access if not subscribed */}
			<PaywallModal
				isOpen={showPaywall && !subscriptionLoading}
				userEmail={session?.user?.email}
				onRefreshStatus={fetchSubscription}
				freeTierUsed={subscriptionData?.freeTierUsed ?? 0}
				freeTierLimit={subscriptionData?.freeTierLimit ?? 5}
			/>

			{/* Feedback Modal — shown after 3-5 interactions for subscribers */}
			<FeedbackModal
				isOpen={showFeedback && !showPaywall}
				onClose={handleFeedbackClose}
			/>

			{/* Profile button in very top-right of screen — z-10000 so it's always above the paywall */}
			<div className="fixed top-4 right-4 z-10000">
				<ProfileDropdown
					subscriptionStatus={subscriptionData?.status}
					subscriptionEndDate={subscriptionData?.subscriptionEndDate}
				/>
			</div>

			{/* Subscription / free tier status badge */}
			<div className="fixed bottom-4 left-4 z-30">
				{subscriptionData?.isSubscribed ? (
					<div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1.5 rounded-full font-medium">
						Subscribed
					</div>
				) : subscriptionData && !subscriptionData.freeTierExhausted ? (
					<div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium">
						{subscriptionData.freeTierRemaining} of {subscriptionData.freeTierLimit} free interactions left
					</div>
				) : null}
			</div>
			
			{/* Made by Josef Büttgen in bottom-right */}
			<div className="fixed bottom-4 right-4 z-10">
				<p className="text-xs text-neutral-400 dark:text-neutral-600">
					Made by{' '}
					<A href='https://x.com/josefbuettgen'>Josef Büttgen</A>
				</p>
			</div>
			
			<button
				type='button'
				onClick={isPaused ? startConversation : stopConversation}
				className={clsx(
					'flex items-center justify-center gap-3 rounded-full text-lg font-semibold transition-all',
					isPaused
						? 'px-10 py-4 bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 dark:bg-green-600 dark:hover:bg-green-500'
						: 'px-8 py-3 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50'
				)}
			>
				{isPaused ? (
					<>
						<MicIcon />
						Start Conversation
					</>
				) : (
					<>
						{isPending ? <LoadingIcon /> : <StopIcon />}
						Stop Conversation
					</>
				)}
			</button>

			{/* Status indicator when conversation is active */}
			{!isPaused && (
				<div className='flex items-center gap-2 mt-4'>
					{isPending ? (
						<>
							<span className='inline-block size-2.5 rounded-full bg-amber-500 animate-pulse' />
							<span className='text-sm text-amber-600 dark:text-amber-400 font-medium'>Thinking...</span>
						</>
					) : player.isPlaying ? (
						<>
							<span className='inline-block size-2.5 rounded-full bg-blue-500 animate-pulse' />
							<span className='text-sm text-blue-600 dark:text-blue-400 font-medium'>AI is speaking</span>
						</>
					) : vad.userSpeaking ? (
						<>
							<span className='inline-block size-2.5 rounded-full bg-red-500 animate-pulse' />
							<span className='text-sm text-red-600 dark:text-red-400 font-medium'>Recording...</span>
						</>
					) : (
						<>
							<span className='inline-block size-2.5 rounded-full bg-green-500' />
							<span className='text-sm text-neutral-500 dark:text-neutral-400 font-medium'>Listening</span>
						</>
					)}
				</div>
			)}

			<div className='text-neutral-400 dark:text-neutral-600 pt-4 text-center max-w-xl text-balance min-h-28 space-y-4'>
				{messages.length > 0 && (
					<p>
						{messages.at(-1)?.content}
						<span className='text-xs font-mono text-neutral-300 dark:text-neutral-700'>
							{' '}
							({messages.at(-1)?.latency}ms)
						</span>
					</p>
				)}

				{messages.length === 0 && (
					<div>
						{vad.loading ? (
							<p>Loading speech detection...</p>
						) : vad.errored ? (
							<p>Failed to load speech detection.</p>
						) : isPaused ? (
							<p>Share your screen and start talking to your computer.</p>
						) : (
							<p>Start talking to chat.</p>
						)}
					</div>
				)}
			</div>

			{/* Volume-reactive background orb */}
			<div
				className={clsx(
					'absolute rounded-full bg-linear-to-b -z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors duration-300',
					isPaused || vad.loading || vad.errored
						? 'opacity-0'
						: isPending
						? 'from-amber-200 to-amber-400 dark:from-amber-600 dark:to-amber-800'
						: player.isPlaying
						? 'from-blue-200 to-blue-400 dark:from-blue-600 dark:to-blue-800'
						: 'from-red-200 to-red-400 dark:from-red-600 dark:to-red-800'
				)}
				style={{
					width: `${9 + volume * 12}rem`,
					height: `${9 + volume * 12}rem`,
					opacity: isPaused || vad.loading || vad.errored ? 0 : 0.15 + volume * 0.85,
					filter: `blur(${2.5 + volume * 1.5}rem)`,
					transition: 'width 0.1s ease-out, height 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out',
				}}
			/>

			{/* Picture-in-Picture floating window */}
			{pip.isOpen && pip.pipWindow && (
				<PictureInPictureContent
					status={isPending ? 'thinking' : player.isPlaying ? 'speaking' : 'idle'}
					userSpeaking={vad.userSpeaking}
					quotaExhausted={quotaExhausted}
					lastScreenshot={lastScreenshot}
					lastResponseText={lastResponseText}
					getFrequencyData={player.getFrequencyData}
					getMicFrequencyData={mic.getFrequencyData}
					usageUsed={subscriptionData?.freeTierUsed ?? null}
					usageLimit={subscriptionData?.freeTierLimit ?? null}
					isSubscribed={subscriptionData?.isSubscribed ?? false}
					onClose={pip.close}
					pipWindow={pip.pipWindow}
				/>
			)}
		</div>
	);
}

function A(props: any) {
	return (
		<a
			{...props}
			className='text-neutral-500 dark:text-neutral-500 hover:underline font-medium'
		/>
	);
}

function MicIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
			<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
			<line x1="12" x2="12" y1="19" y2="22" />
		</svg>
	);
}

function StopIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
			<rect x="4" y="4" width="16" height="16" rx="2" />
		</svg>
	);
}


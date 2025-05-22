'use client';

import clsx from 'clsx';
import {
	useActionState,
	useEffect,
	useRef,
	useState,
	startTransition,
} from 'react';
import { toast } from 'sonner';
import { EnterIcon, LoadingIcon, ScreenShareIcon } from '@/lib/icons';
import { usePlayer } from '@/lib/usePlayer';
import { track } from '@vercel/analytics';
import { useMicVAD, utils } from '@ricky0123/vad-react';

type Message = {
	role: 'user' | 'assistant';
	content: string;
	latency?: number;
};

export default function Home() {
	const [input, setInput] = useState('');
	const [isSharing, setIsSharing] = useState(false);
	const [isPaused, setIsPaused] = useState(true);
	const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const player = usePlayer();

	const vad = useMicVAD({
		startOnLoad: false,
		onSpeechEnd: (audio) => {
			player.stop();
			const wav = utils.encodeWAV(audio);
			const blob = new Blob([wav], { type: 'audio/wav' });
			startTransition(() => submit(blob));
			const isFirefox = navigator.userAgent.includes('Firefox');
			if (isFirefox) vad.pause();
		},
		positiveSpeechThreshold: 0.6,
		minSpeechFrames: 4,
	});

	useEffect(() => {
		function keyDown(e: KeyboardEvent) {
			if (e.key === 'Enter') return inputRef.current?.focus();
			if (e.key === 'Escape') return setInput('');
		}

		window.addEventListener('keydown', keyDown);
		return () => window.removeEventListener('keydown', keyDown);
	});

	// Handle pausing and resuming conversation
	useEffect(() => {
		if (isPaused) {
			vad.pause();
			player.stop();
			if (!vad.loading && !vad.errored) {
				toast.info('Conversation paused');
			}
		} else if (!vad.listening && !vad.loading && !vad.errored) {
			vad.start();
			toast.success('Conversation started');
		}
	}, [isPaused, vad, player]);

	function togglePause() {
		setIsPaused(!isPaused);
		track(isPaused ? 'Start conversation' : 'Pause conversation');
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

	async function startScreenShare() {
		try {
			const mediaStream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true,
			});
			
			setIsSharing(true);
			setScreenStream(mediaStream);
			
			// Handle when user stops sharing
			mediaStream.getTracks().forEach(track => {
				track.onended = () => {
					setIsSharing(false);
					setScreenStream(null);
					toast.info('Screen sharing stopped');
				};
			});
			
			toast.success('Screen sharing started');
			track('Screen sharing');
		} catch (error) {
			const errorHandler = {
				handleError: (err: any) => {
					console.error('Screen sharing error:', err);
					toast.error('Failed to start screen sharing');
					setIsSharing(false);
					setScreenStream(null);
				}
			};
			
			errorHandler.handleError(error);
		}
	}

	function stopScreenShare() {
		if (isSharing && screenStream) {
			// Stop all tracks in the stream
			screenStream.getTracks().forEach(track => track.stop());
			setIsSharing(false);
			setScreenStream(null);
			toast.info('Screen sharing stopped');
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
		
		setInput(transcript);

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

	function handleFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (isPaused) {
			// Auto-start conversation when user submits text while paused
			setIsPaused(false);
		}
		startTransition(() => submit(input));
	}

	return (
		<>
			<div className='pb-4 min-h-28' />

			<div className='flex items-center justify-center gap-2 w-full max-w-3xl mb-4'>
				<button
					type='button'
					onClick={isSharing ? stopScreenShare : startScreenShare}
					className={clsx(
						'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
						isSharing
							? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50'
							: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
					)}
				>
					<ScreenShareIcon />
					{isSharing ? 'Stop Sharing' : 'Share Screen'}
				</button>
				
				<button
					type='button'
					onClick={togglePause}
					className={clsx(
						'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
						isPaused
							? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50'
							: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
					)}
				>
					{isPaused ? 'Start Conversation' : 'Pause Conversation'}
				</button>
			</div>

			<form
				className='rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 flex items-center w-full max-w-3xl border border-transparent hover:border-neutral-300 focus-within:border-neutral-400 hover:focus-within:border-neutral-400 dark:hover:border-neutral-700 dark:focus-within:border-neutral-600 dark:hover:focus-within:border-neutral-600'
				onSubmit={handleFormSubmit}
			>
				<input
					type='text'
					className='bg-transparent focus:outline-hidden p-4 w-full placeholder:text-neutral-600 dark:placeholder:text-neutral-400'
					required
					placeholder='Ask me anything'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					ref={inputRef}
				/>

				<button
					type='submit'
					className='p-4 text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white'
					disabled={isPending}
					aria-label='Submit'
				>
					{isPending ? <LoadingIcon /> : <EnterIcon />}
				</button>
			</form>

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
					<>
						<p>
							Made by{' '}
							<A href='https://x.com/josefbuettgen'>Josef Büttgen</A>.
						</p>

						{vad.loading ? (
							<p>Loading speech detection...</p>
						) : vad.errored ? (
							<p>Failed to load speech detection.</p>
						) : isPaused ? (
							<p>Click 'Start Conversation' to begin.</p>
						) : (
							<p>Start talking to chat.</p>
						)}
					</>
				)}
			</div>

			<div
				className={clsx(
					'absolute size-36 blur-3xl rounded-full bg-linear-to-b from-red-200 to-red-400 dark:from-red-600 dark:to-red-800 -z-50 transition ease-in-out',
					{
						'opacity-0': vad.loading || vad.errored || isPaused,
						'opacity-30': !vad.loading && !vad.errored && !vad.userSpeaking && !isPaused,
						'opacity-100 scale-110': vad.userSpeaking && !isPaused,
					}
				)}
			/>
		</>
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

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

type AIStatus = 'idle' | 'thinking' | 'speaking';

interface PictureInPictureProps {
	status: AIStatus;
	userSpeaking: boolean;
	quotaExhausted: boolean;
	lastScreenshot: string | null;
	lastResponseText: string | null;
	getFrequencyData: () => Uint8Array | null;
	getMicFrequencyData: () => Uint8Array | null;
	usageUsed: number | null;
	usageLimit: number | null;
	isSubscribed: boolean;
	onClose: () => void;
}

// Check if Document PiP API is available
function isPipSupported(): boolean {
	return typeof window !== 'undefined' && 'documentPictureInPicture' in window;
}

export function usePictureInPicture() {
	const [pipWindow, setPipWindow] = useState<Window | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(async () => {
		if (!isPipSupported()) return false;

		try {
			const pip = await (window as any).documentPictureInPicture.requestWindow({
				width: 320,
				height: 420,
			});

			// Copy stylesheets for dark mode support
			const style = pip.document.createElement('style');
			style.textContent = getPipStyles();
			pip.document.head.appendChild(style);
			pip.document.body.className = 'pip-body';

			// Detect dark mode preference
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				pip.document.body.classList.add('dark');
			}

			pip.addEventListener('pagehide', () => {
				setPipWindow(null);
				setIsOpen(false);
			});

			setPipWindow(pip);
			setIsOpen(true);
			return true;
		} catch (e) {
			console.error('Failed to open PiP window:', e);
			return false;
		}
	}, []);

	const close = useCallback(() => {
		pipWindow?.close();
		setPipWindow(null);
		setIsOpen(false);
	}, [pipWindow]);

	return { pipWindow, isOpen, open, close, isSupported: isPipSupported() };
}

export default function PictureInPictureContent({
	status,
	userSpeaking,
	quotaExhausted,
	lastScreenshot,
	lastResponseText,
	getFrequencyData,
	getMicFrequencyData,
	usageUsed,
	usageLimit,
	isSubscribed,
	onClose,
	pipWindow,
}: PictureInPictureProps & { pipWindow: Window }) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationRef = useRef<number>(0);

	// Determine what to visualize
	const shouldVisualize = status === 'speaking' || (status === 'idle' && userSpeaking);

	// Audio visualization loop — works for both AI speaking and user speaking
	useEffect(() => {
		if (!shouldVisualize) {
			cancelAnimationFrame(animationRef.current);
			const canvas = canvasRef.current;
			if (canvas) {
				const ctx = canvas.getContext('2d');
				if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			return;
		}

		const isMic = status === 'idle' && userSpeaking;

		function draw() {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const frequencyData = isMic ? getMicFrequencyData() : getFrequencyData();
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (!frequencyData) {
				animationRef.current = requestAnimationFrame(draw);
				return;
			}

			const barCount = 32;
			const barWidth = canvas.width / barCount;
			const step = Math.floor(frequencyData.length / barCount);

			for (let i = 0; i < barCount; i++) {
				const value = frequencyData[i * step] / 255;
				const barHeight = Math.max(2, value * canvas.height * 0.8);
				const x = i * barWidth;
				const y = (canvas.height - barHeight) / 2;

				if (isMic) {
					// Red for user voice
					const lightness = 45 + value * 20;
					ctx.fillStyle = `hsl(0, 80%, ${lightness}%)`;
				} else {
					// Blue for AI voice
					const lightness = 45 + value * 20;
					ctx.fillStyle = `hsl(220, 80%, ${lightness}%)`;
				}
				ctx.beginPath();
				ctx.roundRect(x + 1, y, barWidth - 2, barHeight, 2);
				ctx.fill();
			}

			animationRef.current = requestAnimationFrame(draw);
		}

		draw();
		return () => cancelAnimationFrame(animationRef.current);
	}, [shouldVisualize, status, userSpeaking, getFrequencyData, getMicFrequencyData]);

	// Assign canvas ref after portal renders
	useEffect(() => {
		const canvas = pipWindow.document.getElementById('pip-visualizer') as HTMLCanvasElement | null;
		canvasRef.current = canvas;
	}, [pipWindow]);

	// Determine status label
	let statusLabel: string;
	let statusClass: string;
	if (quotaExhausted) {
		statusLabel = 'Quota used up';
		statusClass = 'quota';
	} else if (status === 'thinking') {
		statusLabel = 'Thinking...';
		statusClass = 'thinking';
	} else if (status === 'speaking') {
		statusLabel = 'AI speaking';
		statusClass = 'speaking';
	} else if (userSpeaking) {
		statusLabel = 'Recording...';
		statusClass = 'recording';
	} else {
		statusLabel = 'Listening';
		statusClass = 'idle';
	}

	const content = (
		<div className="pip-container">
			{/* Quota exhausted banner */}
			{quotaExhausted && (
				<div className="pip-quota-banner">
					<span className="pip-quota-icon">!</span>
					<div className="pip-quota-content">
						<div className="pip-quota-title">Free quota used up</div>
						<button
							className="pip-quota-button"
							onClick={() => {
								// Focus the main browser window and close PiP
								window.opener?.focus?.();
								onClose();
							}}
						>
							Upgrade to continue
						</button>
					</div>
				</div>
			)}

			{/* Status indicator + usage */}
			<div className="pip-status-row">
				<div className="pip-status">
					<div className={`pip-status-dot ${statusClass}`} />
					<span className="pip-status-text">{statusLabel}</span>
				</div>

				{!isSubscribed && usageUsed !== null && usageLimit !== null && (
					<div className="pip-usage">
						<div className="pip-usage-text">{usageUsed}/{usageLimit}</div>
						<div className="pip-usage-bar">
							<div
								className="pip-usage-fill"
								style={{ width: `${Math.min(100, (usageUsed / usageLimit) * 100)}%` }}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Audio visualizer / Thinking spinner */}
			<div className="pip-visualizer-area">
				{status === 'thinking' ? (
					<div className="pip-spinner">
						<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path strokeOpacity="0" d="M0 0h24v24H0z" />
							<path d="M12 3a9 9 0 1 0 9 9" />
						</svg>
					</div>
				) : (
					<canvas id="pip-visualizer" width="280" height="80" />
				)}
			</div>

			{/* Last screenshot */}
			{lastScreenshot && (
				<div className="pip-screenshot-container">
					<div className="pip-section-label">Currently seeing</div>
					<img src={lastScreenshot} className="pip-screenshot" alt="Last screenshot" />
				</div>
			)}

			{/* Last response text */}
			{lastResponseText && (
				<div className="pip-response-container">
					<div className="pip-section-label">Last response</div>
					<p className="pip-response-text">{lastResponseText}</p>
				</div>
			)}
		</div>
	);

	return createPortal(content, pipWindow.document.body);
}

function getPipStyles(): string {
	return `
		*, *::before, *::after {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		.pip-body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
			background: #ffffff;
			color: #1a1a1a;
			overflow-y: auto;
			overflow-x: hidden;
			-webkit-font-smoothing: antialiased;
		}

		.pip-body.dark {
			background: #0a0a0a;
			color: #e5e5e5;
		}

		.pip-container {
			padding: 16px;
			display: flex;
			flex-direction: column;
			gap: 12px;
			min-height: 100%;
		}

		/* Status row */
		.pip-status-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;
		}

		/* Status indicator */
		.pip-status {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 8px 12px;
			border-radius: 20px;
			background: #f5f5f5;
			width: fit-content;
		}

		.dark .pip-status {
			background: #1a1a1a;
		}

		/* Usage indicator */
		.pip-usage {
			display: flex;
			align-items: center;
			gap: 6px;
			padding: 6px 10px;
			border-radius: 20px;
			background: #f5f5f5;
		}

		.dark .pip-usage {
			background: #1a1a1a;
		}

		.pip-usage-text {
			font-size: 11px;
			font-weight: 600;
			color: #525252;
			white-space: nowrap;
		}

		.dark .pip-usage-text {
			color: #a3a3a3;
		}

		.pip-usage-bar {
			width: 40px;
			height: 4px;
			border-radius: 2px;
			background: #e5e5e5;
			overflow: hidden;
		}

		.dark .pip-usage-bar {
			background: #333333;
		}

		.pip-usage-fill {
			height: 100%;
			border-radius: 2px;
			background: #3b82f6;
			transition: width 0.3s ease;
		}

		.pip-status-dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			flex-shrink: 0;
		}

		.pip-status-dot.idle {
			background: #a3a3a3;
		}

		.pip-status-dot.thinking {
			background: #f59e0b;
			animation: pulse 1.5s ease-in-out infinite;
		}

		.pip-status-dot.speaking {
			background: #3b82f6;
			animation: pulse 0.8s ease-in-out infinite;
		}

		.pip-status-dot.recording {
			background: #ef4444;
			animation: pulse 0.6s ease-in-out infinite;
		}

		.pip-status-dot.quota {
			background: #ef4444;
		}

		@keyframes pulse {
			0%, 100% { opacity: 1; transform: scale(1); }
			50% { opacity: 0.5; transform: scale(1.3); }
		}

		.pip-status-text {
			font-size: 13px;
			font-weight: 500;
			color: #525252;
		}

		.dark .pip-status-text {
			color: #a3a3a3;
		}

		/* Visualizer area */
		.pip-visualizer-area {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 80px;
			border-radius: 12px;
			background: #fafafa;
			overflow: hidden;
		}

		.dark .pip-visualizer-area {
			background: #111111;
		}

		.pip-visualizer-area canvas {
			display: block;
			width: 100%;
			height: 80px;
		}

		/* Spinner */
		.pip-spinner {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #f59e0b;
		}

		.pip-spinner svg {
			animation: spin 1s linear infinite;
		}

		@keyframes spin {
			from { transform: rotate(0deg); }
			to { transform: rotate(360deg); }
		}

		/* Screenshot */
		.pip-screenshot-container {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.pip-section-label {
			font-size: 10px;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			color: #a3a3a3;
		}

		.dark .pip-section-label {
			color: #525252;
		}

		.pip-screenshot {
			width: 100%;
			border-radius: 8px;
			border: 1px solid #e5e5e5;
			object-fit: cover;
			max-height: 160px;
		}

		.dark .pip-screenshot {
			border-color: #262626;
		}

		/* Response text */
		.pip-response-container {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.pip-response-text {
			font-size: 13px;
			line-height: 1.5;
			color: #404040;
			display: -webkit-box;
			-webkit-line-clamp: 4;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.dark .pip-response-text {
			color: #a3a3a3;
		}

		/* Quota exhausted banner */
		.pip-quota-banner {
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 12px;
			border-radius: 12px;
			background: #fef2f2;
			border: 1px solid #fecaca;
		}

		.dark .pip-quota-banner {
			background: #1c0a0a;
			border-color: #7f1d1d;
		}

		.pip-quota-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 28px;
			height: 28px;
			border-radius: 50%;
			background: #ef4444;
			color: white;
			font-weight: 700;
			font-size: 16px;
			flex-shrink: 0;
		}

		.pip-quota-content {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		.pip-quota-title {
			font-size: 13px;
			font-weight: 600;
			color: #dc2626;
		}

		.dark .pip-quota-title {
			color: #f87171;
		}

		.pip-quota-button {
			display: inline-block;
			padding: 6px 14px;
			border-radius: 8px;
			border: none;
			background: #dc2626;
			color: white;
			font-size: 12px;
			font-weight: 600;
			cursor: pointer;
			width: fit-content;
		}

		.pip-quota-button:hover {
			background: #b91c1c;
		}
	`;
}

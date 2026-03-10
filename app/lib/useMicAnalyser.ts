import { useEffect, useRef, useCallback, useState } from 'react';

export function useMicAnalyser() {
	const audioContext = useRef<AudioContext | null>(null);
	const analyser = useRef<AnalyserNode | null>(null);
	const sourceNode = useRef<MediaStreamAudioSourceNode | null>(null);
	const [isActive, setIsActive] = useState(false);

	const start = useCallback(async () => {
		if (audioContext.current) return;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioContext.current = new AudioContext();
			analyser.current = audioContext.current.createAnalyser();
			analyser.current.fftSize = 256;
			analyser.current.smoothingTimeConstant = 0.8;

			sourceNode.current = audioContext.current.createMediaStreamSource(stream);
			sourceNode.current.connect(analyser.current);
			// Don't connect to destination — we don't want to hear ourselves
			setIsActive(true);
		} catch (e) {
			console.error('Failed to start mic analyser:', e);
		}
	}, []);

	const stop = useCallback(() => {
		if (sourceNode.current) {
			sourceNode.current.disconnect();
			sourceNode.current.mediaStream.getTracks().forEach(t => t.stop());
			sourceNode.current = null;
		}
		audioContext.current?.close();
		audioContext.current = null;
		analyser.current = null;
		setIsActive(false);
	}, []);

	const getVolume = useCallback((): number => {
		if (!analyser.current) return 0;
		const data = new Uint8Array(analyser.current.frequencyBinCount);
		analyser.current.getByteFrequencyData(data);
		// Average volume across frequency bins
		let sum = 0;
		for (let i = 0; i < data.length; i++) sum += data[i];
		return sum / (data.length * 255); // 0..1
	}, []);

	const getFrequencyData = useCallback((): Uint8Array | null => {
		if (!analyser.current) return null;
		const data = new Uint8Array(analyser.current.frequencyBinCount);
		analyser.current.getByteFrequencyData(data);
		return data;
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (sourceNode.current) {
				sourceNode.current.disconnect();
				sourceNode.current.mediaStream.getTracks().forEach(t => t.stop());
			}
			audioContext.current?.close();
		};
	}, []);

	return { start, stop, getVolume, getFrequencyData, isActive };
}

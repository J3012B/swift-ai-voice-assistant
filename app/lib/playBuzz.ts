// Gentle two-tone notification chime
export function playNotificationSound() {
	const ctx = new AudioContext();
	const gain = ctx.createGain();
	gain.connect(ctx.destination);

	const now = ctx.currentTime;

	// First tone — soft high note
	const osc1 = ctx.createOscillator();
	osc1.type = 'sine';
	osc1.frequency.value = 520;
	osc1.connect(gain);
	osc1.start(now);
	osc1.stop(now + 0.2);

	// Second tone — slightly lower, gentle resolve
	const osc2 = ctx.createOscillator();
	osc2.type = 'sine';
	osc2.frequency.value = 440;
	osc2.connect(gain);
	osc2.start(now + 0.25);
	osc2.stop(now + 0.5);

	// Gentle volume envelope
	gain.gain.setValueAtTime(0, now);
	gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
	gain.gain.linearRampToValueAtTime(0, now + 0.2);
	gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
	gain.gain.linearRampToValueAtTime(0, now + 0.5);

	osc2.onended = () => ctx.close();
}

// Camera shutter sound — plays the real iPhone camera capture MP3
export function playShutterSound() {
	const audio = new Audio('/api/camera-shutter');
	audio.volume = 0.5;
	audio.play().catch(() => {});
}

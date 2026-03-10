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

// Short camera shutter click
export function playShutterSound() {
	const ctx = new AudioContext();
	const gain = ctx.createGain();
	gain.connect(ctx.destination);

	const now = ctx.currentTime;

	// White noise burst for the "click"
	const bufferSize = ctx.sampleRate * 0.06; // 60ms
	const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = (Math.random() * 2 - 1) * 0.3;
	}

	const noise = ctx.createBufferSource();
	noise.buffer = buffer;

	// Bandpass filter to shape the click
	const filter = ctx.createBiquadFilter();
	filter.type = 'bandpass';
	filter.frequency.value = 4000;
	filter.Q.value = 0.5;

	noise.connect(filter);
	filter.connect(gain);

	// Sharp attack, fast decay
	gain.gain.setValueAtTime(0, now);
	gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

	noise.start(now);
	noise.stop(now + 0.06);

	noise.onended = () => ctx.close();
}

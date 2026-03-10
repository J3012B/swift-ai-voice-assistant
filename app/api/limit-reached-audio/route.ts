import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
	const filePath = path.join(process.cwd(), 'app/api/assets/limit_reached.wav');
	const file = await readFile(filePath);
	return new Response(file, {
		headers: {
			'Content-Type': 'audio/wav',
			'Cache-Control': 'public, max-age=31536000',
		},
	});
}

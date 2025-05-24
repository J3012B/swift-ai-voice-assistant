import fs from 'fs';
import path from 'path';

/**
 * Saves a base64 data URL screenshot to the local filesystem
 * @param dataUrl The base64 data URL of the screenshot
 * @returns The path where the screenshot was saved or undefined if failed
 */
export async function saveScreenshot(dataUrl: string): Promise<string | undefined> {
	try {
		// Extract the file extension from the data URL
		const matches = dataUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
		if (!matches || matches.length !== 2) {
			console.error('Invalid data URL format');
			return;
		}

		const extension = matches[1];
		const filename = `screenshot.${extension}`;

		// Remove the data URL prefix to get the base64 data
		const base64Data = dataUrl.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

		// Convert base64 to buffer
		const buffer = Buffer.from(base64Data, 'base64');

		// Save the file
		const filePath = path.join(process.cwd(), filename);
		fs.writeFileSync(filePath, buffer);

		console.log(`Screenshot saved successfully at ${filePath}`);
		return filePath;
	} catch (error) {
		const errorHandler = {
			handleError: (err: any) => {
				console.error("Failed to save screenshot:", err);
			}
		};
		errorHandler.handleError(error);
		return undefined;
	}
} 
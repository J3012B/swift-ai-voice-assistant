/**
 * Composites the TTYC PiP overlay onto a raw screenshot.
 *
 * Usage:
 *   node scripts/composite-screenshot.mjs <input> <output>
 *
 * Example:
 *   node scripts/composite-screenshot.mjs public/screenshots/raw/davinci-pages.png public/screenshots/davinci-pages.png
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OVERLAY = path.join(__dirname, '../public/screenshots/pip-overlay.png');
const MARGIN_LOGICAL = 24; // px from edges in logical (non-retina) space

const [,, input, output] = process.argv;
if (!input || !output) {
  console.error('Usage: node composite-screenshot.mjs <input> <output>');
  process.exit(1);
}

const base = sharp(input);
const { width, height } = await base.metadata();

// Overlay PNG is @2x (640px wide = 320 logical px)
// Scale it to ~25% of base image width, capped between 280-480px
const overlayMeta = await sharp(OVERLAY).metadata();
const targetW = Math.round(Math.min(480, Math.max(280, width * 0.18)));
const targetH = Math.round(targetW * (overlayMeta.height / overlayMeta.width));

const overlayResized = await sharp(OVERLAY)
  .resize(targetW, targetH)
  .toBuffer();

// Scale margin proportionally to image size
const margin = Math.round(MARGIN_LOGICAL * (width / 1400));
const left = width - targetW - margin;
const top = height - targetH - margin;

await base
  .composite([{ input: overlayResized, left, top }])
  .toFile(output);

console.log(`✓ ${output} (${width}x${height}, overlay at ${left},${top})`);

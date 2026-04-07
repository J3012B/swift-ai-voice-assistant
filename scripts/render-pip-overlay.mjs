/**
 * Renders the TTYC PiP window in "recording" state as a PNG.
 * Output: public/screenshots/pip-overlay.png
 */

import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../public/screenshots/pip-overlay.png');

// Pre-build waveform bars as HTML
const barHeights = [8, 18, 32, 55, 72, 88, 76, 60, 48, 65, 80, 92, 70, 50, 38, 60, 78, 90, 68, 44, 30, 52, 74, 88, 66, 42, 28, 46, 70, 85, 62, 40];
const barHtml = barHeights.map(h => {
  const lightness = 45 + (h / 100) * 20;
  return `<div class="bar" style="height:${h}%;background:hsl(0,80%,${lightness}%)"></div>`;
}).join('');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 320px;
    background: transparent;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .pip-container {
    width: 320px;
    background: #0a0a0a;
    border-radius: 16px;
    border: 1px solid #262626;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4);
  }
  .pip-status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .pip-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 20px;
    background: #1a1a1a;
  }
  .pip-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(239,68,68,0.8);
  }
  .pip-status-text {
    font-size: 13px;
    font-weight: 500;
    color: #a3a3a3;
  }
  .pip-mute-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 20px;
    border: 1px solid #333333;
    background: transparent;
    color: #a3a3a3;
    font-size: 12px;
    font-weight: 500;
    font-family: inherit;
  }
  .pip-mic-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: 2px solid #dc2626;
    background: #1c0a0a;
    color: #f87171;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
  }
  .pip-visualizer-area {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    border-radius: 12px;
    background: #111111;
    overflow: hidden;
    padding: 8px;
  }
  .bars {
    display: flex;
    align-items: center;
    gap: 3px;
    width: 100%;
    height: 100%;
  }
  .bar {
    flex: 1;
    border-radius: 2px;
    min-height: 3px;
  }
</style>
</head>
<body>
<div class="pip-container">
  <div class="pip-status-row">
    <div class="pip-status">
      <div class="pip-status-dot"></div>
      <span class="pip-status-text">Recording...</span>
    </div>
    <button class="pip-mute-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <rect x="6" y="4" width="4" height="16" rx="1"/>
        <rect x="14" y="4" width="4" height="16" rx="1"/>
      </svg>
      Pause
    </button>
  </div>

  <button class="pip-mic-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
    Recording...
  </button>

  <div class="pip-visualizer-area">
    <div class="bars">${barHtml}</div>
  </div>
</div>
</body>
</html>`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 320, height: 600, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'domcontentloaded' });

const height = await page.evaluate(() => document.querySelector('.pip-container').offsetHeight);
await page.setViewport({ width: 320, height: height + 2, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'domcontentloaded' });

await page.screenshot({
  path: OUT,
  clip: { x: 0, y: 0, width: 320, height: height + 2 },
  omitBackground: true,
});

await browser.close();
console.log(`✓ PiP overlay saved to ${OUT} (${320}x${height}px @2x)`);

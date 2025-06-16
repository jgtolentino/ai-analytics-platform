import { test, expect } from '@playwright/test';

// URL comes from CI env var PROD_URL; fallback to localhost for dev runs
const URL = process.env.PROD_URL || 'http://localhost:3000';

test.describe('Production Smoke Suite', () => {
  test('loads without console errors', async ({ page }) => {
    const messages: string[] = [];
    page.on('pageerror', (err) => messages.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') messages.push(msg.text());
    });

    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Scout Analytics/);

    // take full-page screenshot for artifact diffing
    await page.screenshot({ path: `screenshots/home.png`, fullPage: true });

    expect(messages, `Console errors on ${URL}`).toEqual([]);
  });
});
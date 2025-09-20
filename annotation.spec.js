// @ts-check
import { test, expect } from '@playwright/test';

// ✅ Example 1: Normal passing test
test('basic test works', async ({ page }) => {
  await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page).toHaveTitle(/Playwright/);
});

// ✅ Example 2: Expected to fail
test.fail('this test is expected to fail', async ({ page }) => {
  await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page).toHaveTitle(/SomethingElse/);
});

// ✅ Example 3: Skipped test
test.skip('this test is skipped', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

// ✅ Example 4: Runs only on Chromium
test('runs only on Chromium', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Only works in Chromium browser');
  await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page).toHaveTitle(/Playwright/);
});

// @ts-check
import { test, expect } from '@playwright/test';

test('basic test works', async ({ page }) => {
  await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page).toHaveTitle(/Playwright/);
});

test.fail('this test is expected to fail', async ({ page }) => {
  await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page).toHaveTitle(/SomethingElse/);
});

test.skip('this test is skipped', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('runs only on Chromium', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Only works in Chromium browser');
  await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page).toHaveTitle(/Playwright/);
});


import { test, expect } from '@playwright/test';

/*1. Stable test - should always pass*/
test('stable text box test', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');
  await page.fill('#userName', 'John Doe');
  await page.click('#submit');

  // Auto-wait assertion (stable)
  await expect(page.locator('#name')).toHaveText('Name:John Doe');
});

/*2. Flaky test - retries help stabilize*/
test('intentionally flaky test with retries', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');
  await page.fill('#userName', 'John Doe');
  await page.click('#submit');

  // 🔄 Simulate random failure
  if (Math.random() > 0.5) {
    throw new Error('Random failure to simulate flakiness');
  }

  await expect(page.locator('#name')).toHaveText('Name:John Doe');
});

/*3. Skipped test using fixme*/
test.fixme('flaky test skipped until fixed', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');
  await page.fill('#userName', 'Jane Doe');
  await page.click('#submit');

  // This would normally work, but we skip it intentionally
  await expect(page.locator('#name')).toHaveText('Name:Jane Doe');
});

/* 4. Expected-to-fail test using fail*/
test.fail('known bug: output mismatch', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');
  await page.fill('#userName', 'John Doe');
  await page.click('#submit');

  // Wrong expectation: we "expect failure" here
  await expect(page.locator('#name')).toHaveText('Name:Jane Doe');
});

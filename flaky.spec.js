import { test, expect } from '@playwright/test';

// 1. Stable test - should always pass

test('stable text box test', async ({ page }) => {
  test.setTimeout(60000); // increase test timeout to 60s

  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('#userName', 'John Doe');
  await page.click('#submit');

  // Auto-wait for text to appear
  await expect(page.locator('#name')).toHaveText('Name:John Doe');
});

//2. Flaky test - retries help stabilize

test('intentionally flaky test with retries', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('#userName', 'John Doe');
  await page.click('#submit');

  // Random failure simulation to test retries
  if (Math.random() > 0.5) {
    throw new Error('Random failure to simulate flakiness');
  }

  await expect(page.locator('#name')).toHaveText('Name:John Doe');
});


//  3. Skipped test using fixme
 
test.fixme('flaky test skipped until fixed', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('#userName', 'Jane Doe');
  await page.click('#submit');

  await expect(page.locator('#name')).toHaveText('Name:Jane Doe');
});

// 4. Expected-to-fail test using fail
 
test.fail('known bug: output mismatch', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('#userName', 'John Doe');
  await page.click('#submit');

  // Intentionally wrong expectation
  await expect(page.locator('#name')).toHaveText('Name:Jane Doe');
});


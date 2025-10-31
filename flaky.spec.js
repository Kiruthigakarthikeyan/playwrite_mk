import { test, expect } from '@playwright/test';

// Stable test 

test('stable text box test', async ({ page }) => {
  test.setTimeout(60000); // increase test timeout to 60s

  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('#userName', 'John Doe');
  await page.click('#submit');
  await expect(page.locator('#name')).toHaveText('Name:John Doe');
});

test('intentionally flaky test with retries', async ({ page }) => {
  test.setTimeout(60000);

  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('#userName', 'John Doe');
  await page.click('#submit');
  if (Math.random() > 0.5) {
    throw new Error('Random failure to simulate flakiness');
  }

  await expect(page.locator('#name')).toHaveText('Name:John Doe');
});


//  Skipped test 
 
test.fixme('flaky test skipped until fixed', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('#userName', 'Jane Doe');
  await page.click('#submit');

  await expect(page.locator('#name')).toHaveText('Name:Jane Doe');
});
 
test.fail('known bug: output mismatch', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.fill('#userName', 'John Doe');
  await page.click('#submit');
  await expect(page.locator('#name')).toHaveText('Name:Jane Doe');
});



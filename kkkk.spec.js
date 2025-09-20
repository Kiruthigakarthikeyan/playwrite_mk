import { test, expect } from '@playwright/test';

// ✅ Example 1: Normal passing test
test('mytest', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/')
  await page.getByPlaceholder("Username").fill("admin")
  await page.getByPlaceholder("Password").fill("admin123")
  await page.locator("button[type='submit']").click
});

import { test, expect } from '@playwright/test';

test('Handle OrangeHRM new tab', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  // Listen for new tab when clicking footer link
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('a[href="http://www.orangehrm.com"]'),
  ]);

  // Use domcontentloaded instead of default (safer)
  await newPage.waitForLoadState('domcontentloaded');

  // Print the new page title
  console.log('New Tab Title:', await newPage.title());

  // Assert the new tab URL contains orangehrm
  await expect(newPage).toHaveURL(/orangehrm/);

  await newPage.close();
  await context.close();
});

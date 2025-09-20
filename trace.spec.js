import { test, expect } from '@playwright/test';

test('Trace Viewer Example', async ({ page, context }) => {
  // Start tracing (with screenshots & snapshots)
  await context.tracing.start({ screenshots: true, snapshots: true });

  // Your test steps
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);

  // Stop tracing and save to file
  await context.tracing.stop({ path: 'trace.zip' });
});

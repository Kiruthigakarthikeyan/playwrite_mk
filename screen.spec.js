// tests/orangehrm.spec.js
import { test, expect } from '@playwright/test';

test('OrangeHRM login with valid credentials', async ({ page }) => {
  // Navigate to OrangeHRM
  await page.goto('https://opensource-demo.orangehrmlive.com/');
  await page.screenshot({ path: 'orangehrm-login.png', fullPage: true });

  // Enter login details
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  // Wait for dashboard to load
  await page.waitForSelector('h6.oxd-topbar-header-breadcrumb-module');

  // Take screenshot after login
  await page.screenshot({ path: 'orangehrm-dashboard.png', fullPage: true });

  // Validate dashboard
  const header = await page.textContent('h6.oxd-topbar-header-breadcrumb-module');
  expect(header).toBe('Dashboard');
});

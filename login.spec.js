// tests/login.spec.js
import { test } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage.js';
import { DashboardPage } from '../Pages/DashboardPage.js';

test('Login to OrangeHRM successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login('Admin', 'admin123'); // demo credentials
  await dashboardPage.assertDashboardVisible();
});

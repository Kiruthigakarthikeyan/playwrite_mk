import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Home page, footer links, and login validation', async ({ page }) => {
  // ---------------------------
  // Step 1: Visit homepage
  // ---------------------------
  await page.goto('https://desicrewdtrial.crystalhr.com/');
  await expect(page).toHaveTitle(/Employee Information Portal/i);
  await page.waitForLoadState('domcontentloaded');
  console.log(' Homepage loaded successfully.');

  // ---------------------------
  // Step 2: Footer links
  // ---------------------------
  const googlePlayLink = page.getByRole('link', { name: 'Get it on Google Play' });
  const appleStoreImg = page.locator('img[alt="Get it on Apple Store"]');

  await expect(googlePlayLink).toBeVisible();
  console.log(' Google Play link visible');
  await googlePlayLink.click();
  await page.goto('https://desicrewdtrial.crystalhr.com/');

  await expect(appleStoreImg).toBeVisible();
  console.log('🔹 Apple Store image visible');
  await appleStoreImg.click();
  await page.goto('https://desicrewdtrial.crystalhr.com/');

  console.log(' Footer links validated successfully');

  // ---------------------------
  // Step 3: Login
  // ---------------------------
  const loginPage = new LoginPage(page);
  await loginPage.openLoginForm();
  await loginPage.login('dc3775', 'Keerthi@123');
  await loginPage.verifyLoginSuccess();

  console.log(' Full homepage, footer links, and login validated successfully!');
});


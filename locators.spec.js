import { test, expect } from '@playwright/test';

test.describe('Locator examples on Practice ExpandTesting', () => {

  test('basic locators with CSS and XPath', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');

    await page.locator('#username').fill('practice');
    await page.locator('#password').fill('SuperSecretPassword!');

    await page.locator('//button[@type="submit"]').click();

    await expect(page).toHaveURL(/secure/);
  });

  test('built-in locators (preferred)', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');

    await page.getByLabel('Username').fill('practice');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    await page.getByRole('button', { name: 'Login' }).click();

    // Precise check on the <h1>
    await expect(page.locator('h1')).toHaveText(
      'Secure Area page for Automation Testing Practice'
    );
  });

});
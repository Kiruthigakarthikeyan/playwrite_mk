import { test, expect } from '@playwright/test';

test.describe('sauce automation', () => {
  test('Login and verify product sort dropdown @filter', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    const filterDropdown = page.locator('.product_sort_container');
    await expect(filterDropdown).toBeVisible();
    await filterDropdown.click();

    const options = filterDropdown.locator('option');
    await expect(options).toHaveCount(4);

    const expectedOptions = [
      'Name (A to Z)',
      'Name (Z to A)',
      'Price (low to high)',
      'Price (high to low)'
    ];
    for (let i = 0; i < expectedOptions.length; i++) {
      await expect(options.nth(i)).toHaveText(expectedOptions[i]);
    }
  });

  test('Login and verify cart button @cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    const cartButton = page.locator('.shopping_cart_link');
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toBeEnabled();
  });

  test('Login and verify footer links @footer', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    const footerLinks = [
      { selector: 'a[href="https://twitter.com/saucelabs"]', expected: /twitter|x\.com/ },
      { selector: 'a[href="https://www.facebook.com/saucelabs"]', expected: /facebook\.com/ },
      { selector: 'a[href="https://www.linkedin.com/company/sauce-labs/"]', expected: /linkedin\.com/ }
    ];

    for (const link of footerLinks) {
      const element = page.locator(link.selector);
      await expect(element).toBeVisible();

      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        element.click()
      ]);

      await expect(newPage).toHaveURL(link.expected);
      await newPage.close();
    }
  });
});

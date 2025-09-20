import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test data
const tstdata = path.join(__dirname, '../Pages/data.json');
const testfile = JSON.parse(fs.readFileSync(tstdata, 'utf8'));

test.describe('sauce automation', () => {
  for (const login of testfile) {
    test(`login with username: ${login.username}`, async ({ page }) => {
      await test.step('Login to SauceDemo', async () => {
        await page.goto('https://www.saucedemo.com/');
        await page.fill('#user-name', login.username);
        await page.fill('#password', login.password);
        await page.click('#login-button');
        await expect(page).toHaveURL(/inventory/);
      });

      await test.step('Verify cart button', async () => {
        const cartButton = page.locator('.shopping_cart_link');
        await expect(cartButton).toBeVisible({ timeout: 10000 });
        await expect(cartButton).toBeEnabled();
      });

      await test.step('Verify footer links open correct pages', async () => {
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
          await newPage.close(); // close new tab to keep test clean
        }
      });

      // Verify filter dropdown exists
      await test.step('Verify product sort dropdown', async () => {
        const filterDropdown = page.locator('.product_sort_container');
        await expect(filterDropdown).toBeVisible();
        await filterDropdown.click();

        // Validate options inside dropdown
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

      // Add products to cart and verify badge count
      await test.step('Add products to cart and verify badge count', async () => {
        await page.click('#add-to-cart-sauce-labs-backpack');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

        await page.click('#add-to-cart-sauce-labs-bike-light');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
      });

      // Verify sidebar links
      await test.step('Verify product menu button and sidebar links', async () => {
        await page.click('#react-burger-menu-btn');
        const sidebarLinks = page.locator('.bm-menu a.bm-item');
        await expect(sidebarLinks).toHaveCount(4);

        const expectedLinks = ['All Items', 'About', 'Logout', 'Reset App State'];
        for (let i = 0; i < expectedLinks.length; i++) {
          await expect(sidebarLinks.nth(i)).toHaveText(expectedLinks[i]);
        }
      });
    });
  }
});

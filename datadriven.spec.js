import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory of this test file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build the correct path to your data.json
const tstdata = path.join(__dirname, '../Pages/data.json');

// Read and parse the JSON file
const testfile = JSON.parse(fs.readFileSync(tstdata, 'utf8'));

// Create one test per dataset
test.describe('Data-driven login tests', () => {
  for (const login of testfile) {
    test(`login with username: ${login.username}`, async ({ page }) => {
      await page.goto('https://www.saucedemo.com/v1/');
      await page.fill('#user-name', login.username);
      await page.fill('#password', login.password);
      await page.click('#login-button');

      // Optional assertion (adjust as needed)
      await expect(page).toHaveURL(/saucedemo/);
    });
  }
});

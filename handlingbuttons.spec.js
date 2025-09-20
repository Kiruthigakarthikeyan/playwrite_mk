import { test, expect } from '@playwright/test';

test.describe('Automation Testing Register Form', () => {

  test('Fill input boxes, select radio buttons, and checkboxes', async ({ page }) => {
    await page.goto('https://demo.automationtesting.in/Register.html');

    // 🔹 Input Boxes
    await page.locator('input[placeholder="First Name"]').fill('John');
    await page.locator('input[placeholder="Last Name"]').fill('Doe');
    await page.locator('textarea[ng-model="Adress"]').fill('123 Test Street, New York');
    await page.locator('input[type="email"]').fill('john.doe@example.com');
    await page.locator('input[type="tel"]').fill('1234567890');

    // 🔹 Radio Buttons (Male/Female)
    const maleRadio = page.locator('input[value="Male"]');
    await maleRadio.check();
    await expect(maleRadio).toBeChecked();

    // 🔹 Checkboxes (Hobbies)
    const cricketCheckbox = page.locator('input[type="checkbox"][value="Cricket"]');
    const moviesCheckbox = page.locator('input[type="checkbox"][value="Movies"]');
    
    await cricketCheckbox.check();
    await moviesCheckbox.check();

    await expect(cricketCheckbox).toBeChecked();
    await expect(moviesCheckbox).toBeChecked();

    // 🔹 Validate some inputs
    await expect(page.locator('input[placeholder="First Name"]')).toHaveValue('John');
    await expect(page.locator('input[placeholder="Last Name"]')).toHaveValue('Doe');
    await expect(page.locator('input[type="email"]')).toHaveValue('john.doe@example.com');
  });

});

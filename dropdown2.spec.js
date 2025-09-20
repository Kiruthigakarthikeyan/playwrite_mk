import { test, expect } from '@playwright/test';

test.describe('Dropdown Handling Examples', () => {

  test('AutoComplete Dropdowns on demo.automationtesting.in', async ({ page }) => {
    await page.goto('https://demo.automationtesting.in/AutoComplete.html');

    // Switch into the iframe (⚠️ this page actually doesn’t use an iframe, 
    // you can directly interact with inputs)
    // const frame = page.frame({ url: /AutoComplete.html/ });

    // 🔸 Single Value AutoComplete
    const singleInput = page.locator('#singleInput');   // no need for frame here
    await singleInput.fill('Ind');
    await page.locator('.ui-menu-item div', { hasText: 'India' }).click();
    await expect(singleInput).toHaveValue('India');

    // 🔸 Multi Value AutoComplete
    const multiInput = page.locator('#multiInput');

    await multiInput.fill('Aus');
    await page.locator('.ui-menu-item div', { hasText: 'Australia' }).click();

    await multiInput.fill('Uni');
    await page.locator('.ui-menu-item div', { hasText: 'United States Minor Outlying Islands' }).click();

    // Verify selections appear
    await expect(page.locator('.ui-autocomplete-multiselect-item')).toContainText([
      'Australia',
      'United States Minor Outlying Islands'
    ]);
  });

});

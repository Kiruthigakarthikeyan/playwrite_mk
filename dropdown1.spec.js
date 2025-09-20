import { test, expect } from '@playwright/test';

test.describe('DemoQA Select Menu Dropdowns', () => {

  test('Handle single dropdown and multi-select dropdowns', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');

    // 🔹 Standard dropdown (old-style <select>)
    const selectColor = page.locator('#oldSelectMenu');
    await selectColor.selectOption('red');
    await expect(selectColor).toHaveValue('red');

    // 🔹 Another dropdown (using selectOption by label)
    const selectCars = page.locator('#cars');
    await selectCars.selectOption(['volvo', 'audi']); // multi-select

    const selectedValues = await selectCars.evaluate(el => Array.from(el.selectedOptions).map(o => o.value));
    expect(selectedValues).toContain('volvo');
    expect(selectedValues).toContain('audi');

    // 🔹 Modern react-style dropdown (with click & type)
    await page.locator('#react-select-2-input').fill('Group 1, option 2');
    await page.keyboard.press('Enter');
    await expect(page.locator('.css-1uccc91-singleValue')).toHaveText('Group 1, option 2');
  });

});

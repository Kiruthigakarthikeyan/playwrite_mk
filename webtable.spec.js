const { test, expect } = require('@playwright/test');

test.describe('Playwright Web Tables Handling', () => {

  test('Read all rows and columns', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');

    // Get all rows (ignoring header)
    const rows = page.locator('.rt-tbody .rt-tr-group');
    const rowCount = await rows.count();
    console.log(`Total rows: ${rowCount}`);

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowText = await row.textContent();
      console.log(`Row ${i + 1}: ${rowText}`);
    }
  });

  test('Read specific cell (Age of first record)', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');

    const firstAge = await page
      .locator('.rt-tbody .rt-tr-group')
      .nth(0)
      .locator('.rt-td')
      .nth(2)
      .textContent();

    console.log('First row Age:', firstAge);

    // ✅ Option 1: Match actual site data
    expect(firstAge.trim()).toBe('39');

    // ✅ Option 2 (better): Just check it's a number (dynamic validation)
    // expect(Number(firstAge.trim())).toBeGreaterThan(0);
  });

  test('Find row by text and perform action (Edit/Delete)', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');

    // Find row where First Name = "Cierra"
    const rows = page.locator('.rt-tbody .rt-tr-group');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const firstName = await row.locator('.rt-td').nth(0).textContent();

      if (firstName.trim() === 'Cierra') {
        console.log('Found Cierra, now clicking Edit');
        await row.locator('[title="Edit"]').click();

        // Edit form appears
        await page.fill('#firstName', 'CierraUpdated');
        await page.click('#submit');
        break;
      }
    }

    // ✅ Verify updated value
    await expect(
      page.locator('.rt-tbody .rt-tr-group').nth(0).locator('.rt-td').nth(0)
    ).toHaveText('CierraUpdated');
  });

  test('Add a new record', async ({ page }) => {
    await page.goto('https://demoqa.com/webtables');

    await page.click('#addNewRecordButton');
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#userEmail', 'john.doe@test.com');
    await page.fill('#age', '35');
    await page.fill('#salary', '5000');
    await page.fill('#department', 'QA');
    await page.click('#submit');

    // ✅ Verify record was added
    await expect(page.locator('.rt-tbody')).toContainText('John');
    await expect(page.locator('.rt-tbody')).toContainText('Doe');
  });

});

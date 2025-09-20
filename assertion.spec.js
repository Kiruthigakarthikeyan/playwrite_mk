const { test, expect } = require('@playwright/test');

test.describe('DemoQA Assertions', () => {

  test('Text Box Form Submission', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    await page.getByPlaceholder('Full Name').fill('Jane Doe');
    await page.getByPlaceholder('name@example.com').fill('jane@example.com');
    await page.locator('#currentAddress').fill('123 Test St');
    await page.locator('#permanentAddress').fill('456 Demo Ave');
    await page.locator('#submit').click();

    await expect(page.locator('#output')).toContainText('Jane Doe');
    await expect(page.locator('#output')).toContainText('jane@example.com');
  });

  test('Alerts', async ({ page }) => {
    await page.goto('https://demoqa.com/alerts');

    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('You clicked a button');
      await dialog.accept();
    });

    await page.locator('#alertButton').click();
  });

  test('Select Menu Dropdown', async ({ page }) => {
    await page.goto('https://demoqa.com/select-menu');

    await page.locator('#oldSelectMenu').selectOption('4');
    await expect(page.locator('#oldSelectMenu')).toHaveValue('4');
  });

  test('Date Picker', async ({ page }) => {
    await page.goto('https://demoqa.com/date-picker');

    await page.locator('#datePickerMonthYearInput').click();
    await page.locator('.react-datepicker__year-select').selectOption('1990');
    await page.locator('.react-datepicker__month-select').selectOption('0'); // January
    await page.locator('.react-datepicker__day--015:not(.react-datepicker__day--outside-month)').click();

    await expect(page.locator('#datePickerMonthYearInput')).toHaveValue('01/15/1990');
  });

});

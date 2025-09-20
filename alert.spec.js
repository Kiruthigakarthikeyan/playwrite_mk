import { test, expect } from '@playwright/test';

test.describe('automationtesting.in Alerts Handling', () => {

  test('Simple Alert', async ({ page }) => {
    await page.goto('https://demo.automationtesting.in/Alerts.html');

    // Click "Alert with OK" tab
    await page.getByText('Alert with OK', { exact: true }).click();

    // Handle alert dialog
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('I am an alert box!'); // expected message
      await dialog.accept();
    });

    await page.locator('button[onclick="alertbox()"]').click();
  });

  test('Confirm Alert - Cancel', async ({ page }) => {
    await page.goto('https://demo.automationtesting.in/Alerts.html');

    // Click "Alert with OK & Cancel" tab
    await page.getByText('Alert with OK & Cancel', { exact: true }).click();

    // Show confirm and then dismiss it
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Press a Button !'); // expected message
      await dialog.dismiss();
    });

    await page.locator('button[onclick="confirmbox()"]').click();

    // Actual site text is without "!"
    await expect(page.locator('#demo')).toHaveText('You Pressed Cancel');
  });

  test('Confirm Alert - OK', async ({ page }) => {
    await page.goto('https://demo.automationtesting.in/Alerts.html');

    // Click "Alert with OK & Cancel" tab
    await page.getByText('Alert with OK & Cancel', { exact: true }).click();

    // Show confirm and then accept it
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Press a Button !');
      await dialog.accept();
    });

    await page.locator('button[onclick="confirmbox()"]').click();

    //  Fix capitalization (match actual text from page)
    await expect(page.locator('#demo')).toHaveText('You pressed Ok');
  });

  test('Prompt Alert', async ({ page }) => {
    await page.goto('https://demo.automationtesting.in/Alerts.html');

    // Click "Alert with Textbox" tab
    await page.getByText('Alert with Textbox', { exact: true }).click();

    const textToSend = 'Hello Playwright';
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Please enter your name'); // partial match
      await dialog.accept(textToSend);
    });

    await page.locator('button[onclick="promptbox()"]').click();

    // Verify the prompt result includes the entered text
    await expect(page.locator('#demo1')).toContainText(textToSend);
  });

});

// tests/mouseActions.spec.js
import { test, expect } from '@playwright/test';

test.describe('Playwright Mouse Actions', () => {

  test('Right Click', async ({ page }) => {
    await page.goto('https://demoqa.com/buttons');

    // Perform right-click on the button
    await page.locator('#rightClickBtn').click({ button: 'right' });

    // ✅ Verify message after right-click
    await expect(page.locator('#rightClickMessage')).toHaveText('You have done a right click');
  });

  test('Double Click', async ({ page }) => {
    await page.goto('https://demoqa.com/buttons');

    // Perform double-click on the button
    await page.dblclick('#doubleClickBtn');

    // ✅ Verify message after double-click
    await expect(page.locator('#doubleClickMessage')).toHaveText('You have done a double click');
  });

  test('Mouse Hover', async ({ page }) => {
    await page.goto('https://demoqa.com/tool-tips');

    // Hover over the button
    await page.locator('#toolTipButton').hover();

    // ✅ Wait for tooltip to appear
    const tooltip = page.locator('.tooltip-inner');
    await expect(tooltip).toHaveText('You hovered over the Button');
  });

});

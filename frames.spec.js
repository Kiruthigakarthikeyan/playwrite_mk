const { test, expect } = require('@playwright/test');

test.describe('Playwright Frames Handling', () => {
  
  test('Handle Single Frame', async ({ page }) => {
    await page.goto('https://demoqa.com/frames');

    // Switch to frame by its id
    const frame1 = page.frame({ name: 'frame1' });

    // Verify content inside frame
    const heading = await frame1.locator('#sampleHeading').textContent();
    expect(heading).toBe('This is a sample page');
  });

  test('Handle Nested Frames (Parent + Child)', async ({ page }) => {
    await page.goto('https://demoqa.com/nestedframes');

    // Switch to parent frame
    const parentFrame = page.frameLocator('iframe[id="frame1"]');

    // Get text inside parent
    const parentText = await parentFrame.locator('body').textContent();
    console.log('Parent Frame Text:', parentText);

    // Switch to child frame inside parent
    const childFrame = parentFrame.frameLocator('iframe');
    const childText = await childFrame.locator('p').textContent();
    console.log('Child Frame Text:', childText);

    // ✅ Assertions
    await expect(parentFrame.locator('body')).toContainText('Parent frame');
    await expect(childFrame.locator('p')).toHaveText('Child Iframe');
  });

});

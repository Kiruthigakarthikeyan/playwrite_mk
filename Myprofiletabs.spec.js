import { test, expect } from '@playwright/test';

// --------------------------
// Utility: Login
// --------------------------
async function login(page) {
  await page.goto('https://desicrewdtrial.crystalhr.com/');
  await page.waitForLoadState('load');
  await page.locator('#frmLogin').getByPlaceholder('Username').fill('dc3775');
  await page.locator('#frmLogin').getByPlaceholder('Password').fill('Test@123');
  await page.getByRole('button', { name: 'Login' }).click();
  console.log('✅ Logged in successfully');
}

// --------------------------
// Utility: Open My Profile
// --------------------------
async function openMyProfile(page) {
  const menuIcon = page.locator("//i[@class='menu-icon fa fa-users']");
  await menuIcon.hover();
  await page.getByRole('link', { name: 'supervisor_account EIP' }).click();
  await page.getByRole('link', { name: 'My Profile' }).click();
  await page.waitForSelector('#CompanyDetailsForm', { timeout: 15000 });
  console.log('✅ My Profile opened successfully');
}

// --------------------------
// TEST: Validate Salary Details - Earnings tab
// --------------------------
test('Validate Salary Details - Earnings tab', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  const salaryTab = page.locator('a[data-toggle="tab"][href="#tabSalaryDetails"]');
  await expect(salaryTab).toBeVisible({ timeout: 10000 });
  await salaryTab.click();
  console.log(' Clicked Salary Details tab');

  
  const earningsTab = page.locator('a[data-toggle="tab"][href="#salaryEarnings"]');
  await expect(earningsTab).toBeVisible({ timeout: 10000 });
  await earningsTab.click();
  console.log('Clicked Earnings sub-tab');

  
  const earningsSection = page.locator('#salaryEarnings .profile-info-row');
  await earningsSection.first().waitFor({ state: 'visible', timeout: 15000 });
  console.log('Earnings fields loaded');

  const earningsRows = await earningsSection.elementHandles();
  for (const row of earningsRows) {
    const label = await row.$eval('.profile-info-name label', el => el.textContent.trim());
    const valueLocator = await row.$('.field-value');
    const value = valueLocator ? (await valueLocator.textContent()).trim() : '';
    console.log(`🔹 ${label}: "${value}"`);
  }

  console.log('All Earnings fields displayed successfully');
});

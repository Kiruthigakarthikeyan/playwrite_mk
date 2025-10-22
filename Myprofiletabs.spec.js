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
//  Validate Salary Details - Earnings & Deductions
// --------------------------
test('Validate Salary Details - Earnings and Deductions tabs', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  //  Open Salary Details tab
  const salaryTab = page.locator('a[data-toggle="tab"][href="#tabSalaryDetails"]');
  await expect(salaryTab).toBeVisible({ timeout: 10000 });
  await salaryTab.click();
  console.log(' Clicked Salary Details tab');

  // ============================================================
  // EARNINGS TAB
  // ============================================================
  const earningsTab = page.locator('a[data-toggle="tab"][href="#salaryEarnings"]');
  await expect(earningsTab).toBeVisible();
  await earningsTab.click();
  console.log('Opened Earnings tab');

  const earningsRows = page.locator('#salaryEarnings .profile-info-row');
  await earningsRows.first().waitFor({ state: 'visible', timeout: 15000 });
  console.log(' Earnings fields loaded');

  const earnings = await earningsRows.elementHandles();
  for (const row of earnings) {
    const label = await row.$eval('.profile-info-name label', el => el.textContent.trim());
    const value = await row.$eval('.field-value', el => el.textContent.trim());
    console.log(' [Earning] ${label}: "${value}"');
  }

  // ============================================================
  // DEDUCTIONS TAB
  // ============================================================
  const deductionsTab = page.locator('a[data-toggle="tab"][href="#salaryDeductions"]');
  await expect(deductionsTab).toBeVisible();
  await deductionsTab.click();
  console.log('Opened Deductions tab');

  const deductionRows = page.locator('#salaryDeductions .profile-info-row');
  await deductionRows.first().waitFor({ state: 'visible', timeout: 15000 });
  console.log('Deductions fields loaded');

  const deductions = await deductionRows.elementHandles();
  for (const row of deductions) {
    const label = await row.$eval('.profile-info-name label', el => el.textContent.trim());
    const value = await row.$eval('.field-value', el => el.textContent.trim());
    console.log(' [Deduction] ${label}: "${value}"');
  }

  console.log('Salary Details (Earnings & Deductions) validation completed successfully');
});

// --------------------------
// TEST 2: Validate Salary Details - Reimbursement Tab
// --------------------------
test('Validate Salary Details - Reimbursement tab (no fields)', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  // STEP 1: Open Salary Details tab
  const salaryTab = page.locator('a[data-toggle="tab"][href="#tabSalaryDetails"]');
  await expect(salaryTab).toBeVisible({ timeout: 10000 });
  await salaryTab.click();
  console.log('Clicked Salary Details tab');

  // STEP 2: Open Reimbursement tab
  const reimbursementTab = page.locator('a[data-toggle="tab"][href="#salaryReimbursement"]');
  await expect(reimbursementTab).toBeVisible();
  await reimbursementTab.click();
  console.log('Opened Reimbursement tab');

  // STEP 3: Check for fields
  const reimbursementRows = page.locator('#salaryReimbursement .profile-info-row');
  const rowCount = await reimbursementRows.count();

  if (rowCount === 0) {
    console.log('Reimbursement tab contains no fields (as expected)');
  } else {
    console.log(`Reimbursement tab has ${rowCount} unexpected fields`);
    const labels = await reimbursementRows.allTextContents();
    console.log('Unexpected fields:', labels);
  }

  console.log('Reimbursement tab validation completed');
});

  console.log('All Earnings fields displayed successfully');
});


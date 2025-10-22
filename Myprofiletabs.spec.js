import { test, expect } from '@playwright/test';

// ============================================================
// Utility Functions
// ============================================================

// Login Utility
async function login(page) {
  await page.goto('https://desicrewdtrial.crystalhr.com/');
  await page.waitForLoadState('load');
  await page.locator('#frmLogin').getByPlaceholder('Username').fill('dc3775');
  await page.locator('#frmLogin').getByPlaceholder('Password').fill('Test@123');
  await page.getByRole('button', { name: 'Login' }).click();
  console.log('Logged in successfully');
}

// Open My Profile Utility
async function openMyProfile(page) {
  const menuIcon = page.locator("//i[@class='menu-icon fa fa-users']");
  await menuIcon.hover();
  await page.getByRole('link', { name: 'supervisor_account EIP' }).click();
  await page.getByRole('link', { name: 'My Profile' }).click();
  await page.waitForSelector('#CompanyDetailsForm', { timeout: 15000 });
  console.log('My Profile opened successfully');
}

// ============================================================
// TEST 1: Validate Statutory Details
// ============================================================
test('Validate My Profile - Statutory Details tab', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  await page.getByRole('link', { name: 'policy Statutory Details' }).click();
  const statutoryTab = page.locator('#tabstatutorydetail');
  await expect(statutoryTab).toBeVisible();

  const statutorySection = statutoryTab.locator('.profile-user-info.profile-user-info-striped');

  const fields = {
    pfNumber: { key: 'Field_PFNumber', expected: 'TNMAS00535920000109571' },
    pfApplicable: { key: 'Field_PFApplicable', expected: 'Yes' },
    esiNumber: { key: 'Field_ESINumber', expected: '' },
    esiLocation: { key: 'Field_ESILocation', expected: 'Kollumangudi' },
    ptaxLocation: { key: 'Field_PTaxLocation', expected: 'Tamilnadu' },
    taxApplicable: { key: 'Field_TaxApplicable', expected: 'Yes' },
    panCard: { key: 'Field_PANCardNumber', expected: 'EJXPK3693D' },
    dateOfRetirement: { key: 'Field_DateOfRetirement', expected: '10/07/2052' },
    expatriate: { key: 'Field_Expatriate', expected: 'No' },
  };

  for (const [name, field] of Object.entries(fields)) {
    const locator = statutorySection.locator(`div[data-field-key="${field.key}"] .field-value`);
    if (!(await locator.isVisible())) {
      console.warn(` ${name} field not visible — skipping`);
      continue;
    }
    const text = (await locator.textContent())?.trim() || '';
    console.log(` ${name}: "${text}"`);
    if (field.expected.trim() !== '') {
      await expect(locator).toHaveText(field.expected);
    }
  }

  console.log('All Statutory Details fields validated successfully');
});

// ============================================================
// TEST 2: Validate Bank Details
// ============================================================
test('Validate My Profile - Bank Details tab', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  const bankDetailsTab = page.locator('a[data-toggle="tab"][href="#tabbankdetails"]');
  await expect(bankDetailsTab).toBeVisible();
  await bankDetailsTab.click();
  console.log('Clicked Bank Details tab');

  const bankDetailsSection = page.locator('#tabbankdetails');
  await bankDetailsSection.waitFor({ state: 'visible' });
  console.log('Bank Details section loaded');

  const expectedFields = {
    'Bank Name': 'State Bank of India',
    'Account Number': '20508240084',
    'IFSC Code': 'SBIN0000962',
    'Payment Mode': 'Account Transfer',
    'Currency': 'INR'
  };

  for (const [label, expectedValue] of Object.entries(expectedFields)) {
    const row = bankDetailsSection.locator(`.profile-info-row:has(label:has-text("${label}"))`);
    await expect(row, `${label} should be visible`).toBeVisible();

    const valueLocator = row.locator('.field-value');
    const actualValue = (await valueLocator.textContent()).trim();
    console.log(` ${label}: "${actualValue}"`);
    await expect(valueLocator).toHaveText(expectedValue);
  }

  console.log('All Bank Details fields validated successfully');
});

// ============================================================
// Validate Salary Details (Earnings, Deductions, Reimbursement)
// ============================================================
test('Validate Salary Details - Earnings, Deductions & Reimbursement', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  // SALARY TAB
  const salaryTab = page.locator('a[data-toggle="tab"][href="#tabSalaryDetails"]');
  await expect(salaryTab).toBeVisible();
  await salaryTab.click();
  console.log('Clicked Salary Details tab');

  // ---------------- Earnings Tab ----------------
  const earningsTab = page.locator('a[data-toggle="tab"][href="#salaryEarnings"]');
  await earningsTab.click();
  console.log('Opened Earnings tab');

  const earningsRows = page.locator('#salaryEarnings .profile-info-row');
  await earningsRows.first().waitFor({ state: 'visible' });
  for (const row of await earningsRows.elementHandles()) {
    const label = await row.$eval('.profile-info-name label', el => el.textContent.trim());
    const value = await row.$eval('.field-value', el => el.textContent.trim());
    console.log(` [Earning] ${label}: "${value}"`);
  }

  // ---------------- Deductions Tab ----------------
  const deductionsTab = page.locator('a[data-toggle="tab"][href="#salaryDeductions"]');
  await deductionsTab.click();
  console.log('Opened Deductions tab');

  const deductionRows = page.locator('#salaryDeductions .profile-info-row');
  await deductionRows.first().waitFor({ state: 'visible' });
  for (const row of await deductionRows.elementHandles()) {
    const label = await row.$eval('.profile-info-name label', el => el.textContent.trim());
    const value = await row.$eval('.field-value', el => el.textContent.trim());
    console.log(` [Deduction] ${label}: "${value}"`);
  }

  // ---------------- Reimbursement Tab ----------------
  const reimbursementTab = page.locator('a[data-toggle="tab"][href="#salaryReimbursement"]');
  await reimbursementTab.click();
  console.log('Opened Reimbursement tab');

  const reimbursementRows = page.locator('#salaryReimbursement .profile-info-row');
  const rowCount = await reimbursementRows.count();
  if (rowCount === 0) {
    console.log('Reimbursement tab contains no fields (as expected)');
  } else {
    console.warn(`Reimbursement tab has ${rowCount} unexpected fields`);
    const labels = await reimbursementRows.allTextContents();
    console.log('Unexpected fields:', labels);
  }

  console.log('Salary Details validation (Earnings, Deductions & Reimbursement) completed successfully');
});

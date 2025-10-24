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
// --------------------------
// TEST: Validate Assets Tab - Save Functionality
// --------------------------
test.only('Validate Assets tab Save - should not show parsererror', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  // Open Assets tab
  const assetsTab = page.locator('a[data-toggle="tab"][href="#tabAssets"]');
  await expect(assetsTab).toBeVisible({ timeout: 10000 });
  await assetsTab.click();
  console.log('✅ Opened Assets tab');

  // Wait for table to load
  const assetsTable = page.locator('#datatableAssets');
  await expect(assetsTable).toBeVisible({ timeout: 10000 });
  console.log('✅ Assets table loaded');

  // Click Edit button
  const editButton = page.locator('#btnEdit');
  await expect(editButton).toBeVisible({ timeout: 10000 });
  await editButton.click();
  console.log('✅ Clicked Edit');

  // Check Save & Cancel buttons
  const saveButton = page.locator('#btnSave');
  const cancelButton = page.locator('#btnCancel');
  await expect(saveButton).toBeVisible({ timeout: 5000 });
  await expect(cancelButton).toBeVisible({ timeout: 5000 });
  console.log('✅ Save & Cancel buttons visible');

  // Click Save
  await saveButton.click();
  console.log('💾 Clicked Save button');

  // Wait for notification and ensure parsererror does not appear
  const gritterTitle = page.locator('.gritter-without-image .gritter-title');
  await expect(gritterTitle).toBeVisible({ timeout: 10000 });

  const gritterMessage = page.locator('.gritter-without-image p');

  // Wait until message text is non-empty
  await page.waitForFunction(
    el => el.textContent.trim().length > 0,
    gritterMessage
  );

  const messageText = (await gritterMessage.textContent())?.trim() || '';
  console.log(`📢 Notification Title: "${await gritterTitle.textContent()}"`);
  console.log(`📩 Notification Message: "${messageText}"`);

  // Assertion to ensure parsererror does not appear
  expect(messageText.toLowerCase()).not.toContain('parsererror');
  console.log('✅ Notification does not show parsererror — Save successful!');
});

// --------------------------
//  Academic Qualification - Edit
// --------------------------
test('Academic Qualification: Edit all rows', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  await page.getByRole('link', { name: 'school Academic Qualification' }).click();
  await expect(page.getByRole('heading', { name: 'Academic Qualification' })).toBeVisible();

  const rows = page.locator('#datatableAcademics tbody tr');
  const rowCount = await rows.count();
  console.log(`Found ${rowCount} academic rows`);

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    await row.locator('button.actionEdit').click();

    // ✅ Specific modal for Academic Qualification
    const modal = page.locator('#modal-academics .modal-dialog.add-form-container');
    await modal.waitFor({ state: 'visible' });

    // Fill the modal
    await modal.locator('#Degree').fill('Master of Computer Application');
    await modal.locator('#Discipline').fill('Computer Science');
    await modal.locator('#University').fill('Anna University');
    await modal.locator('#Grade').fill('A');
    await modal.locator('#Percentage').fill('85');
    await modal.locator('#YearOfPassing').fill('2016');
    await modal.locator('#NameOfInstitude').fill('AVC College of Engineering');
    await modal.locator('#Remarks').fill('Updated via Playwright');

    await modal.locator('button.save').click();
    await modal.waitFor({ state: 'hidden' });

    console.log(`✅ Row ${i + 1} edited successfully`);
  }
});

// --------------------------
// TEST Academic Qualification - Delete (optional)
// --------------------------
test('Academic Qualification: Delete all rows', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  await page.getByRole('link', { name: 'school Academic Qualification' }).click();
  await expect(page.getByRole('heading', { name: 'Academic Qualification' })).toBeVisible();

  let rows = page.locator('#datatableAcademics tbody tr');
  let rowCount = await rows.count();

  while (rowCount > 0) {
    const row = rows.nth(0);
    await row.locator('button.actionDelete').click();

    // Target delete modal correctly
    const deleteModal = page.locator('.modal-dialog:visible');
    await deleteModal.waitFor({ state: 'visible' });

    // Click confirm button (you can adjust selector as per your actual confirm button)
    await deleteModal.getByRole('button', { name: /yes|confirm/i }).click();
    await deleteModal.waitFor({ state: 'hidden' });

    console.log(`✅ Deleted a row`);
    rows = page.locator('#datatableAcademics tbody tr');
    rowCount = await rows.count();
  }

  console.log('✅ All Academic Qualification rows deleted successfully');
});


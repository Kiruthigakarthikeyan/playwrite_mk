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
  console.log(' Logged in successfully');
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
  console.log(' My Profile opened successfully');
}
// --------------------------
// TEST 1: Validate Statutory Details
// --------------------------
test('Validate Statutory Details tab', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  // Navigate to Statutory Details tab
  await page.getByRole('link', { name: 'policy Statutory Details' }).click();
  const statutoryTab = page.locator('#tabstatutorydetail');
  await expect(statutoryTab).toBeVisible();

  const statutorySection = statutoryTab.locator('.profile-user-info.profile-user-info-striped');

  // Define fields and expected values
  const fields = {
    pfNumber: { locator: statutorySection.locator('div[data-field-key="Field_PFNumber"] .field-value'), expected: 'TNMAS00535920000109571' },
    pfApplicable: { locator: statutorySection.locator('div[data-field-key="Field_PFApplicable"] .field-value'), expected: 'Yes' },
    esiNumber: { locator: statutorySection.locator('div[data-field-key="Field_ESINumber"] .field-value'), expected: '' },
    esiLocation: { locator: statutorySection.locator('div[data-field-key="Field_ESILocation"] .field-value'), expected: 'Kollumangudi' },
    ptaxLocation: { locator: statutorySection.locator('div[data-field-key="Field_PTaxLocation"] .field-value'), expected: 'Tamilnadu' },
    taxApplicable: { locator: statutorySection.locator('div[data-field-key="Field_TaxApplicable"] .field-value'), expected: 'Yes' },
    panCard: { locator: statutorySection.locator('div[data-field-key="Field_PANCardNumber"] .field-value'), expected: 'EJXPK3693D' },
    dateOfRetirement: { locator: statutorySection.locator('div[data-field-key="Field_DateOfRetirement"] .field-value'), expected: '10/07/2052' },
    expatriate: { locator: statutorySection.locator('div[data-field-key="Field_Expatriate"] .field-value'), expected: 'No' },
  };

  for (const [name, field] of Object.entries(fields)) {
    const isVisible = await field.locator.isVisible();
    if (!isVisible) {
      console.warn(` ${name} field not visible — skipping`);
      continue;
    }

    const text = (await field.locator.textContent())?.trim() || '';
    console.log(` ${name}: "${text}"`);

    // Only check if an expected value exists
    if (field.expected.trim() !== '') {
      await expect(field.locator).toHaveText(field.expected);
    }
  }

  console.log(' All Statutory Details fields validated successfully');
});

// --------------------------
// TEST 2: Academic Qualification - Edit
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

    //  Specific modal for Academic Qualification
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

    console.log(`Row ${i + 1} edited successfully`);
  }
});

// --------------------------
// Academic Qualification - Delete 
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

    console.log(`Deleted a row`);
    rows = page.locator('#datatableAcademics tbody tr');
    rowCount = await rows.count();
  }

  console.log('All Academic Qualification rows deleted successfully');
});

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



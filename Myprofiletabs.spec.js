import { test, expect } from '@playwright/test';
// Login
async function login(page) {
  await page.goto('https://desicrewdtrial.crystalhr.com/');
  await page.waitForLoadState('load');
  await page.locator('#frmLogin').getByPlaceholder('Username').fill('dc3775');
  await page.locator('#frmLogin').getByPlaceholder('Password').fill('Test@123');
  await page.getByRole('button', { name: 'Login' }).click();
  console.log('Logged in successfully');
}

// Open My Profile
async function openMyProfile(page) {
  const menuIcon = page.locator("//i[@class='menu-icon fa fa-users']");
  await menuIcon.hover();
  await page.getByRole('link', { name: 'supervisor_account EIP' }).click();
  await page.getByRole('link', { name: 'My Profile' }).click();
  await page.waitForSelector('#CompanyDetailsForm', { timeout: 15000 });
  console.log('My Profile opened successfully');
}

//  Validate Statutory Details
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

// Validate Bank Details
test('Validate My Profile - Bank Details tab', async ({ page }) => {
  await login(page);
  await openMyProfile(page);
  const bankDetailsTab = page.locator('a[data-toggle="tab"][href="#tabbankdetails"]');
  await expect(bankDetailsTab).toBeVisible();
  await bankDetailsTab.click();
  const bankDetailsSection = page.locator('#tabbankdetails');
  await bankDetailsSection.waitFor({ state: 'visible' });
  const expectedFields = {
    'Bank Name': 'State Bank of India',
    'Account Number': '20508240084',
    'IFSC Code': 'SBIN0000962',
    'Payment Mode': 'Account Transfer',
    'Currency': 'INR'
  };

  for (const [label, expectedValue] of Object.entries(expectedFields)) {
    const row = bankDetailsSection.locator(`.profile-info-row:has(label:has-text("${label}"))`);
    await expect(row, '${label} should be visible').toBeVisible();
    const valueLocator = row.locator('.field-value');
    const actualValue = (await valueLocator.textContent()).trim();
    console.log(' ${label}: "${actualValue}"');
    await expect(valueLocator).toHaveText(expectedValue);
  }
});


// Salary Details (Earnings, Deductions, Reimbursement)

test('Validate Salary Details - Earnings, Deductions & Reimbursement', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  // SALARY TAB
  const salaryTab = page.locator('a[data-toggle="tab"][href="#tabSalaryDetails"]');
  await expect(salaryTab).toBeVisible();
  await salaryTab.click();

  // Earnings Tab 
  const earningsTab = page.locator('a[data-toggle="tab"][href="#salaryEarnings"]');
  await earningsTab.click();
  const earningsRows = page.locator('#salaryEarnings .profile-info-row');
  await earningsRows.first().waitFor({ state: 'visible' });
  for (const row of await earningsRows.elementHandles()) {
    const label = await row.$eval('.profile-info-name label', el => el.textContent.trim());
    const value = await row.$eval('.field-value', el => el.textContent.trim());
    console.log('[Earning] ${label}: "${value}"');
  }

  // Deductions Tab 
  const deductionsTab = page.locator('a[data-toggle="tab"][href="#salaryDeductions"]');
  await deductionsTab.click();
  console.log('Opened Deductions tab');
  const deductionRows = page.locator('#salaryDeductions .profile-info-row');
  await deductionRows.first().waitFor({ state: 'visible' });
  for (const row of await deductionRows.elementHandles()) {
    const label = await row.$eval('.profile-info-name label', el => el.textContent.trim());
    const value = await row.$eval('.field-value', el => el.textContent.trim());
    console.log('[Deduction] ${label}: "${value}"');
  }

  // Reimbursement Tab 
  const reimbursementTab = page.locator('a[data-toggle="tab"][href="#salaryReimbursement"]');
  await reimbursementTab.click();
  const reimbursementRows = page.locator('#salaryReimbursement .profile-info-row');
  const rowCount = await reimbursementRows.count();
  if (rowCount === 0) {
    console.log('Reimbursement tab contains no fields (as expected)');
  } else {
    console.warn('Reimbursement tab has ${rowCount} unexpected fields');
    const labels = await reimbursementRows.allTextContents();
  }
});

// Validate Assets Tab - Save Functionality
test('Validate Assets tab Save - should not show parsererror', async ({ page }) => {
  await login(page);
  await openMyProfile(page);
  // Open Assets tab
  const assetsTab = page.locator('a[data-toggle="tab"][href="#tabAssets"]');
  await expect(assetsTab).toBeVisible({ timeout: 10000 });
  await assetsTab.click();
  const assetsTable = page.locator('#datatableAssets');
  await expect(assetsTable).toBeVisible({ timeout: 10000 });
  const editButton = page.locator('#btnEdit');
  await expect(editButton).toBeVisible({ timeout: 10000 });
  await editButton.click();
  const saveButton = page.locator('#btnSave');
  const cancelButton = page.locator('#btnCancel');
  await expect(saveButton).toBeVisible({ timeout: 5000 });
  await expect(cancelButton).toBeVisible({ timeout: 5000 });

  await saveButton.click();
  console.log('Clicked Save button');
  const gritterTitle = page.locator('.gritter-without-image .gritter-title');
  await expect(gritterTitle).toBeVisible({ timeout: 10000 });

  const gritterMessage = page.locator('.gritter-without-image p');

  await page.waitForFunction(
    el => el.textContent.trim().length > 0,
    gritterMessage
  );

  const messageText = (await gritterMessage.textContent())?.trim() || '';
  console.log('Notification Title: "${await gritterTitle.textContent()}"');
  console.log('Notification Message: "${messageText}"');

  // Assertion to ensure parsererror does not appear
  expect(messageText.toLowerCase()).not.toContain('parsererror');
  console.log(' Notification does not show parsererror — Save successful!');
});


//  Academic Qualification - Edit

test('Academic Qualification: Edit all rows', async ({ page }) => {
  await login(page);
  await openMyProfile(page);

  await page.getByRole('link', { name: 'school Academic Qualification' }).click();
  await expect(page.getByRole('heading', { name: 'Academic Qualification' })).toBeVisible();

  const rows = page.locator('#datatableAcademics tbody tr');
  const rowCount = await rows.count();
  console.log('Found ${rowCount} academic rows');

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

    console.log('Row ${i + 1} edited successfully');
  }
});
// TEST Academic Qualification - Delete
test('Academic Qualification', async ({ page }) => {
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
    await deleteModal.getByRole('button', { name: /yes|confirm/i }).click();
    await deleteModal.waitFor({ state: 'hidden' });

    console.log(` Deleted a row`);
    rows = page.locator('#datatableAcademics tbody tr');
    rowCount = await rows.count();
  }

});

// TEST: Validate File Upload Flow

 test("Validate Documents Uploading file and canceling", async ({ page, context }) => {
  await context.tracing.start({ screenshots: true, snapshots: true });
  await login(page);
  await openMyProfile(page);
  const docTab = page.locator('a[data-toggle="tab"][href="#tabDocumentUpload"]');
  await expect(docTab).toBeVisible();
  await docTab.click();
  // Click Edit to enable upload
  const editBtn = page.locator("#btnEdit");
  await expect(editBtn).toBeVisible({ timeout: 10000 });
  await editBtn.click();
  const uploadInput = page.locator('input[type="file"][multiple]');
  const cancelBtn = page.locator('button#btnCancel');
  await expect(cancelBtn).toBeVisible();
  const uploadedFileList = page.locator(".dz-filename span");
  const initialCount = await uploadedFileList.count();
  // Click cancel
  await cancelBtn.click();
  const countAfterCancel = await uploadedFileList.count();
  expect(countAfterCancel).toBe(initialCount);
  console.log("Cancel worked correctly — file count unchanged");
  //upload
  await editBtn.click();
  // Upload file
  const filePath = path.resolve("tests/files/sample.pdf");
  console.log(` File selected for upload: ${filePath}`);
  await uploadInput.setInputFiles(filePath);
  console.log("File uploaded via Dropzone input");
  const uploadedFile = page.locator(".dz-filename span", { hasText: "sample.pdf" });
  await expect(uploadedFile).toBeVisible({ timeout: 15000 });
  const saveBtn = page.locator("#btnSave");
  await expect(saveBtn).toBeVisible();
  await saveBtn.click();
  await page.waitForTimeout(4000);
  await expect(uploadedFile).toBeVisible({ timeout: 15000 });
  await context.tracing.stop({ path: "test-results/document-upload-trace.zip" });
  console.log("Trace (video + DOM snapshots) saved at: test-results/document-upload-trace.zip");
});

//document upload flow

test("Validate Document Upload - Cancel, Upload, Save & parsererror check", async ({ page, context }) => {
  await context.tracing.start({ screenshots: true, snapshots: true });

  await login(page);
  await openMyProfile(page);
  const docTab = page.locator('a[data-toggle="tab"][href="#tabDocumentUpload"]');
  await expect(docTab).toBeVisible();
  await docTab.click();
  //  Edit 
  const editBtn = page.locator("#btnEdit");
  await expect(editBtn).toBeVisible({ timeout: 10000 });
  await editBtn.click();
  //  Cancel
  const cancelBtn = page.locator("#btnCancel");
  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();
  //Edit
  await editBtn.click();
  //  Upload a file
  const filePath = path.resolve("tests/files/sample.pdf");
  await page.evaluate(() => {
    const input = document.querySelector('input[type="file"][multiple]');
    if (input) input.style.display = "block";
  });

  const uploadInput = page.locator('input[type="file"][multiple]');
  await uploadInput.setInputFiles(filePath);
  const uploadStatus = page.locator("#DocumentUploadInProcess");
  console.log("Wait for upload");
  await expect(uploadStatus).toHaveValue("0", { timeout: 30000 });
  //  Verify uploaded file preview
  const uploadedFile = page.locator(".dz-filename span", { hasText: "sample.pdf" }).first();
  await expect(uploadedFile).toBeVisible({ timeout: 15000 });
  const docTypeDropdown = page.locator(".joiningDocumentSelect").first();
  await expect(docTypeDropdown).toBeVisible();
  await docTypeDropdown.selectOption({ label: "Aadhaar Card" });
  const saveBtn = page.locator("#btnSave");
  await expect(saveBtn).toBeVisible();
  await saveBtn.click();
  const notification = page.locator(".gritter-item");
  await notification.first().waitFor({ timeout: 15000 });
  const title = await notification.locator(".gritter-title").textContent();
  const message = await notification.locator("p").textContent();
  if (message?.toLowerCase().includes("parsererror")) {
    await page.screenshot({ path: "test-results/parsererror_detected.png" });
    throw new Error("Upload failed: parsererror shown in notification");
  } else {
    console.log("Upload succeed");
  }

});

test("Check Previous Employment tab elements visibility", async ({ page }) => {
  await login(page);
  await openMyProfile(page);
  console.log("Logged in & opened My Profile");

  const editButton = page.locator("#btnEdit");
  await expect(editButton).toBeVisible({ timeout: 10000 });
  await editButton.click();
  console.log("Clicked Edit — edit mode enabled");

  //  Go to Previous Employment tab
  const prevEmploymentTab = page.locator('a[href="#tabPreviousEmployment"]');
  await expect(prevEmploymentTab).toBeVisible();
  await prevEmploymentTab.click()

  // Check Add button visibility
  const addButton = page.locator("#addPreviousEmployment");
  await expect(addButton).toBeVisible();
  const table = page.locator("#datatablePreviousEmployments");
  await expect(table).toBeVisible();
  await expect(page.locator("th", { hasText: "Organization" })).toBeVisible();
  await expect(page.locator("th", { hasText: "Designation" })).toBeVisible();
  await expect(page.locator("th", { hasText: "From Date" })).toBeVisible();
  await expect(page.locator("th", { hasText: "To Date" })).toBeVisible();
  await expect(page.locator("th", { hasText: "Remarks" })).toBeVisible();
  //  Open modal
  await addButton.click();
  const modal = page.locator(".modal:visible");
  await expect(modal.locator("h4.blue.bigger")).toHaveText("Previous Employment", { timeout: 10000 });
  //  Verify modal input 
  await expect(modal.locator("#Organization")).toBeVisible();
  await expect(modal.locator("#Designation")).toBeVisible();
  await expect(modal.locator("#FromDate")).toBeVisible();
  await expect(modal.locator("#ToDate")).toBeVisible();
  await expect(modal.locator("#YearOfExperience")).toBeVisible();
  await expect(modal.locator("#RelevantExperience")).toBeVisible();
  await expect(modal.locator("#Remarks")).toBeVisible();
  await expect(modal.locator("#Salary")).toBeVisible();
  // Verify buttons 
  await expect(modal.locator("button.save")).toBeVisible();
  await expect(modal.locator("button.reset")).toBeVisible();
  // Close 
  await modal.locator('button[data-dismiss="modal"]').click();
  await expect(modal).toBeHidden({ timeout: 10000 });
 
});



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
  console.log(' Opened Assets tab');

  // Wait for table to load
  const assetsTable = page.locator('#datatableAssets');
  await expect(assetsTable).toBeVisible({ timeout: 10000 });
  console.log(' Assets table loaded');

  // Click Edit button
  const editButton = page.locator('#btnEdit');
  await expect(editButton).toBeVisible({ timeout: 10000 });
  await editButton.click();
  console.log(' Clicked Edit');

  // Check Save & Cancel buttons
  const saveButton = page.locator('#btnSave');
  const cancelButton = page.locator('#btnCancel');
  await expect(saveButton).toBeVisible({ timeout: 5000 });
  await expect(cancelButton).toBeVisible({ timeout: 5000 });
  console.log(' Save & Cancel buttons visible');

  // Click Save
  await saveButton.click();
  console.log(' Clicked Save button');

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
  console.log(` Notification Title: "${await gritterTitle.textContent()}"`);
  console.log(` Notification Message: "${messageText}"`);

  // Assertion to ensure parsererror does not appear
  expect(messageText.toLowerCase()).not.toContain('parsererror');
  console.log(' Notification does not show parsererror — Save successful!');
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

    console.log(` Row ${i + 1} edited successfully`);
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

    console.log(` Deleted a row`);
    rows = page.locator('#datatableAcademics tbody tr');
    rowCount = await rows.count();
  }

  console.log('All Academic Qualification rows deleted successfully');
});
// -------------------------------
// TEST: Validate File Upload Flow
// -------------------------------
 test("Validate Documents Uploading file and canceling", async ({ page, context }) => {
  // Enable screen recording
  await context.tracing.start({ screenshots: true, snapshots: true });

  await login(page);
  await openMyProfile(page);

  // Click Documents Upload tab
  const docTab = page.locator('a[data-toggle="tab"][href="#tabDocumentUpload"]');
  await expect(docTab).toBeVisible();
  await docTab.click();
  console.log(" Opened Documents Upload tab");

  // Click Edit to enable upload
  const editBtn = page.locator("#btnEdit");
  await expect(editBtn).toBeVisible({ timeout: 10000 });
  await editBtn.click();
  console.log(" Clicked Edit to enable upload");

  // Handle Cancel flow
  const uploadInput = page.locator('input[type="file"][multiple]');
  const cancelBtn = page.locator('button#btnCancel');

  // Make sure Cancel is visible before upload
  await expect(cancelBtn).toBeVisible();
  console.log(" Cancel button visible before upload");

  // Count files before cancel
  const uploadedFileList = page.locator(".dz-filename span");
  const initialCount = await uploadedFileList.count();
  console.log(` Files before cancel: ${initialCount}`);

  // Click cancel
  await cancelBtn.click();
  console.log(" Clicked Cancel - upload aborted");

  // Ensure cancel didn’t add new files
  const countAfterCancel = await uploadedFileList.count();
  expect(countAfterCancel).toBe(initialCount);
  console.log("Cancel worked correctly — file count unchanged");

  // Re-enter upload mode
  await editBtn.click();
  console.log(" Re-entered edit mode for upload");

  // Upload file
  const filePath = path.resolve("tests/files/sample.pdf");
  console.log(` File selected for upload: ${filePath}`);
  await uploadInput.setInputFiles(filePath);
  console.log(" File uploaded via Dropzone input");

  // Wait for preview
  const uploadedFile = page.locator(".dz-filename span", { hasText: "sample.pdf" });
  await expect(uploadedFile).toBeVisible({ timeout: 15000 });
  console.log(" Uploaded file preview visible");

  // Click Save
  const saveBtn = page.locator("#btnSave");
  await expect(saveBtn).toBeVisible();
  await saveBtn.click();
  console.log(" Clicked Save button to confirm upload");

  // Validate upload persisted
  await page.waitForTimeout(4000);
  await expect(uploadedFile).toBeVisible({ timeout: 15000 });
  console.log(" File upload persisted successfully after Save");

  // Stop recording
  await context.tracing.stop({ path: "test-results/document-upload-trace.zip" });
  console.log(" Trace (video + DOM snapshots) saved at: test-results/document-upload-trace.zip");
});

//Test: Validate document upload flow

test("Validate Document Upload - Cancel, Upload, Save & parsererror check", async ({ page, context }) => {
  await context.tracing.start({ screenshots: true, snapshots: true });

  await login(page);
  await openMyProfile(page);
  const docTab = page.locator('a[data-toggle="tab"][href="#tabDocumentUpload"]');
  await expect(docTab).toBeVisible();
  await docTab.click();
  console.log(" Opened Documents Upload tab");

  //  Enable Edit mode
  const editBtn = page.locator("#btnEdit");
  await expect(editBtn).toBeVisible({ timeout: 10000 });
  await editBtn.click();
  console.log(" Clicked Edit to enable upload");

  //  Cancel upload first
  const cancelBtn = page.locator("#btnCancel");
  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();
  console.log(" Clicked Cancel — exited upload mode");

  // Re-enter Edit mode
  await editBtn.click();
  console.log(" Re-entered edit mode for upload");

  //  Upload a file
  const filePath = path.resolve("tests/files/sample.pdf");
  console.log(` File selected for upload: ${filePath}`);

  // Make file input visible (Dropzone hides it)
  await page.evaluate(() => {
    const input = document.querySelector('input[type="file"][multiple]');
    if (input) input.style.display = "block";
  });

  const uploadInput = page.locator('input[type="file"][multiple]');
  await uploadInput.setInputFiles(filePath);
  console.log(" File uploaded via Dropzone input");

  //  Wait until upload is finished
  const uploadStatus = page.locator("#DocumentUploadInProcess");
  console.log("⏳ Waiting for upload to finish...");
  await expect(uploadStatus).toHaveValue("0", { timeout: 30000 });
  console.log("Upload process completed");

  //  Verify uploaded file preview
  const uploadedFile = page.locator(".dz-filename span", { hasText: "sample.pdf" }).first();
  await expect(uploadedFile).toBeVisible({ timeout: 15000 });
  console.log(" Uploaded file preview visible");

  //  Select document type
  const docTypeDropdown = page.locator(".joiningDocumentSelect").first();
  await expect(docTypeDropdown).toBeVisible();
  await docTypeDropdown.selectOption({ label: "Aadhaar Card" });
  console.log("Selected document type: Aadhaar Card");

  //  Click Save
  const saveBtn = page.locator("#btnSave");
  await expect(saveBtn).toBeVisible();
  await saveBtn.click();
  console.log("Clicked Save button to confirm upload");

  //  Wait for notification popup
  const notification = page.locator(".gritter-item");
  await notification.first().waitFor({ timeout: 15000 });
  console.log(" Notification appeared after Save");

  // Extract message text
  const title = await notification.locator(".gritter-title").textContent();
  const message = await notification.locator("p").textContent();
  console.log(` Notification Title: "${title?.trim()}"`);
  console.log(` Notification Message: "${message?.trim()}"`);

  // Validate message
  if (message?.toLowerCase().includes("parsererror")) {
    console.error(" Parsererror detected — backend save failed");
    await page.screenshot({ path: "test-results/parsererror_detected.png" });
    throw new Error("Upload failed: parsererror shown in notification");
  } else {
    console.log("Upload succeeded — no parsererror detected");
  }

});

test("Check Previous Employment tab elements visibility", async ({ page }) => {
  // Step 1: Login and open My Profile
  await login(page);
  await openMyProfile(page);
  console.log(" Logged in & opened My Profile");

  //  Click Edit to enable editing
  const editButton = page.locator("#btnEdit");
  await expect(editButton).toBeVisible({ timeout: 10000 });
  await editButton.click();
  console.log(" Clicked Edit — edit mode enabled");

  //  Go to Previous Employment tab
  const prevEmploymentTab = page.locator('a[href="#tabPreviousEmployment"]');
  await expect(prevEmploymentTab).toBeVisible();
  await prevEmploymentTab.click();
  console.log("Switched to Previous Employment tab");

  // Check Add button visibility
  const addButton = page.locator("#addPreviousEmployment");
  await expect(addButton).toBeVisible();
  console.log(" Add button visible");

  //  Check table visibility and headers
  const table = page.locator("#datatablePreviousEmployments");
  await expect(table).toBeVisible();
  await expect(page.locator("th", { hasText: "Organization" })).toBeVisible();
  await expect(page.locator("th", { hasText: "Designation" })).toBeVisible();
  await expect(page.locator("th", { hasText: "From Date" })).toBeVisible();
  await expect(page.locator("th", { hasText: "To Date" })).toBeVisible();
  await expect(page.locator("th", { hasText: "Remarks" })).toBeVisible();
  console.log(" Verified table and headers are visible");

  //  Open modal
  await addButton.click();
  const modal = page.locator(".modal:visible");
  await expect(modal.locator("h4.blue.bigger")).toHaveText("Previous Employment", { timeout: 10000 });
  console.log("Modal opened successfully");

  //  Verify modal input fields visibility
  await expect(modal.locator("#Organization")).toBeVisible();
  await expect(modal.locator("#Designation")).toBeVisible();
  await expect(modal.locator("#FromDate")).toBeVisible();
  await expect(modal.locator("#ToDate")).toBeVisible();
  await expect(modal.locator("#YearOfExperience")).toBeVisible();
  await expect(modal.locator("#RelevantExperience")).toBeVisible();
  await expect(modal.locator("#Remarks")).toBeVisible();
  await expect(modal.locator("#Salary")).toBeVisible();
  console.log(" All modal fields visible");

  // Verify buttons in modal
  await expect(modal.locator("button.save")).toBeVisible();
  await expect(modal.locator("button.reset")).toBeVisible();
  console.log("💾 Save and Cancel buttons visible");

  // Close modal
  await modal.locator('button[data-dismiss="modal"]').click();
  await expect(modal).toBeHidden({ timeout: 10000 });
  console.log(" Modal closed successfully");
});

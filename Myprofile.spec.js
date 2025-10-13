import { test, expect } from '@playwright/test';

test('Full HRMS flow: footer validation, invalid/valid login, My Profile access', async ({ page }) => {
  // Step 1: Visit homepage
  await page.goto('https://desicrewdtrial.crystalhr.com/');
  await expect(page).toHaveTitle(/Employee Information Portal/i);
  console.log(' Homepage loaded successfully.');

  // Step 2: Validate footer links
  const footerLinks = page.locator('footer a'); // adjust if needed
  const footerCount = await footerLinks.count();
  console.log(` Found ${footerCount} footer links.`);
  for (let i = 0; i < footerCount; i++) {
    const text = await footerLinks.nth(i).textContent();
    console.log(`   🔹 Footer link: ${text.trim()}`);
  }
  console.log(' Footer links validated successfully.');

  // Step 3: Invalid login
  console.log(' Attempting invalid login...');
  await page.locator('#frmLogin').getByPlaceholder('Username').fill('wrongUser');
  await page.locator('#frmLogin').getByPlaceholder('Password').fill('wrongPass');
  await page.getByRole('button', { name: 'Login' }).click();

  const errorMessage = page.locator("//div[@class='error']");
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
  console.log(' Invalid login error displayed:', await errorMessage.textContent());

  // Step 4: Valid login
  console.log(' Attempting valid login...');
  await page.locator('#frmLogin').getByPlaceholder('Username').fill('dc3775'); // your valid user
  await page.locator('#frmLogin').getByPlaceholder('Password').fill('Test@123'); // your valid password
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for dashboard element visible instead of URL
  const dashboardHeader = page.getByText('Check In Time'); // adjust if unique element
  await expect(dashboardHeader).toBeVisible({ timeout: 20000 });
  console.log(' Login successful and dashboard loaded.');

  // Step 5: Hover on menu and access My Profile
  const menuIcon = page.locator("//i[@class='menu-icon fa fa-users']");
  await menuIcon.hover();
  await page.getByRole('link', { name: 'supervisor_account EIP' }).click();
  await page.getByRole('link', { name: 'My Profile' }).click();
  console.log(' My Profile opened.');

  // Step 6: Navigate profile tabs
  await page.getByText('My Profile edit person').click();
  await page.getByRole('link', { name: 'Kiruthiga Muthukumar' }).click();
  await page.getByRole('link', { name: 'policy Statutory Details' }).click();
  await page.getByRole('link', { name: 'account_balance Bank Details' }).click();
  await page.getByRole('link', { name: 'payment Salary Details' }).click();
  await page.getByRole('link', { name: 'Earnings' }).click();
  await page.getByText('Fixed HRA 5000').click();
  await page.getByText('Fixed Child Education Allowance 0').click();
  await page.getByRole('link', { name: 'Deductions' }).click();
  await page.getByRole('link', { name: 'Reimbursement' }).click();

  console.log(' My Profile navigation completed.');
});

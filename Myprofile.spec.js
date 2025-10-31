import { test, expect } from '@playwright/test';

test('HRMS flow: footer validation, invalid/valid login, My Profile page', async ({ page }) => {
  // Step 1: Visit homepage
  await page.goto('https://desicrewdtrial.crystalhr.com/');
  await expect(page).toHaveTitle(/Employee Information Portal/i);

  // footer links
  const footerLinks = page.locator('footer a'); 
  const footerCount = await footerLinks.count();
  console.log(` Found ${footerCount} footer links.`);
  for (let i = 0; i < footerCount; i++) {
    const text = await footerLinks.nth(i).textContent();
    console.log('Footer link: ${text.trim()}');
  }

  // Invalid login
  console.log('Invalid login...');
  await page.locator('#frmLogin').getByPlaceholder('Username').fill('wrongUser');
  await page.locator('#frmLogin').getByPlaceholder('Password').fill('wrongPass');
  await page.getByRole('button', { name: 'Login' }).click();
  const errorMessage = page.locator("//div[@class='error']");
  await expect(errorMessage).toBeVisible({ timeout: 10000 });
  console.log('Invalid login error displayed:', await errorMessage.textContent());

  //Valid login
  console.log(' Attempting valid login...');
  await page.locator('#frmLogin').getByPlaceholder('Username').fill('dc3775'); // your valid user
  await page.locator('#frmLogin').getByPlaceholder('Password').fill('Test@123'); // your valid password
  await page.getByRole('button', { name: 'Login' }).click();
  const dashboardHeader = page.getByText('Check In Time'); // adjust if unique element
  await expect(dashboardHeader).toBeVisible({ timeout: 20000 });

  //access My Profile
  const menuIcon = page.locator("//i[@class='menu-icon fa fa-users']");
  await menuIcon.hover();
  await page.getByRole('link', { name: 'supervisor_account EIP' }).click();
  await page.getByRole('link', { name: 'My Profile' }).click();
  // profile tabs
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
});


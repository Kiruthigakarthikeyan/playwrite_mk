// orangehrm.spec.js
const { test, expect } = require('@playwright/test');

let page;

// ============ HOOKS ============

// Runs once before all tests
test.beforeAll(async ({ browser }) => {
  console.log("==== Launching Browser ====");
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto("https://opensource-demo.orangehrmlive.com/");
  console.log("==== Browser Launched and OrangeHRM Opened ====");
});

// Runs once after all tests
test.afterAll(async () => {
  console.log("==== Closing Browser ====");
  await page.context().browser().close();
  console.log("==== Browser Closed ====");
});

// Runs before each test
test.beforeEach(async () => {
  console.log(">>> Before Test Execution <<<");
});

// Runs after each test
test.afterEach(async () => {
  console.log(">>> After Test Execution <<<");
});

// ============ TEST CASE ============

test('Login with valid credentials', async () => {
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForSelector('h6.oxd-topbar-header-breadcrumb-module');
  const header = await page.textContent('h6.oxd-topbar-header-breadcrumb-module');
  await expect(header).toBe('Dashboard');
});


import { test as base, expect } from '@playwright/test';

// Create a custom fixture (userData)
const test = base.extend({
  userData: async ({}, use) => {
    // Setup: define fake user test data
    const data = {
      id: 101,
      name: "Kiruthiga",
      role: "QA Engineer",
      email: "kirthi@example.com"
    };

    // Use the fixture inside test
    await use(data);

    // Teardown (if needed)
    console.log("Fixture cleanup completed");
  },
});

// ---- test using the fixture ----
test('Verify user data fixture', async ({ userData }) => {
  console.log('User Data:', userData);

  expect(userData.name).toBe("Kiruthiga");
  expect(userData.role).toBe("QA Engineer");
});


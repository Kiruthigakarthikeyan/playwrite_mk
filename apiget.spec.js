import { test, expect } from '@playwright/test';

test('API Get', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users?page=2');
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toContain('Michael');
  console.log(await response.json());
});


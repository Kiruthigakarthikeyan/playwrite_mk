// tests/apipost.spec.js
import { test, expect } from '@playwright/test';

test('API GET - Reqres', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users?page=2');

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data.some(u => u.first_name === 'Michael')).toBeTruthy();

  console.log('GET response:', body);
});

test('API POST - Reqres', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/users', {
    data: {
      name: 'kirthi',
      job: 'leader',
    },
  });

  console.log('POST status:', response.status());
  console.log('POST body:', await response.json());

  expect(response.status()).toBe(401);
});

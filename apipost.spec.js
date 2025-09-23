
import { test, expect } from '@playwright/test';

let userId; // shared across tests in this describe block

test.describe('JsonPlaceholder API tests', () => {

test('POST JsonPlaceholder API', async ({ request }) => {
  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    json: { title: 'foo', body: 'bar', userId: 1 }
  });

  expect(response.status()).toBe(201);

  const res = await response.json();
  console.log('POST response:', res);

  userId = 1; // override to a real existing post
});

test('PUT JsonPlaceholder API (Update)', async ({ request }) => {
  const response = await request.put(`https://jsonplaceholder.typicode.com/posts/${userId}`, {
    json: { title: 'foo', body: 'kir', userId: 1 }
  });

  console.log('Status:', response.status());
  console.log('PUT response JSON:', await response.json());

  expect(response.status()).toBe(200);
});
test('JsonPlaceholder API delete', async ({ request }) => {
  const response = await request.delete('https://jsonplaceholder.typicode.com/posts/${userId}')
  expect(response.status()).toBe(200);
})
});
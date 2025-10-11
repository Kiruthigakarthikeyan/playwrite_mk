// pages/LoginPage.js
import { expect } from '@playwright/test';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.loginBox = page.locator('#login-box');
    this.usernameInput = page.locator('#frmLogin').getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async openLoginForm() {
    await this.loginBox.click();
  }

  async login(username, password) {
    await this.usernameInput.click();
    await this.usernameInput.fill(username);

    await this.passwordInput.click();
    await this.passwordInput.fill(password);

    await this.loginButton.click();
  }

  async verifyLoginSuccess() {
    await this.page.waitForURL('**/Home'); // Wait until home page after login
    await expect(this.page).toHaveTitle(/Employee Information Portal/i);
    console.log('✅ Login successful and homepage loaded.');
  }
}

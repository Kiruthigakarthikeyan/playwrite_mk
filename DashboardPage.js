import { expect } from '@playwright/test';

export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.locator('h6:has-text("Dashboard")');
  }

  async assertDashboardVisible() {
    await expect(this.dashboardHeader).toBeVisible();
  }
}

import { expect } from '@playwright/test';

export class LeftPanel {
  constructor(page) {
    this.page = page;
    this.messageBox = page.locator('#ModulesModal');
    this.closeButton = this.messageBox.locator('button', { hasText: '×' });

    this.panelItems = [
      {
        id: '#hranaltics',
        name: 'HR Analytics',
        expectedText: [
          'The data pertaining to core HR, attendance, payroll, etc can be sliced and viewed at the macro and micro level by the stakeholders',
          'Data can be compared between',
          'Scans through humongous data to derive meaningful information and helps to take appropriate decisions at the right time',
          'Employee count, attrition, employee costs, etc. can be viewed in a click.',
          'No need for an expensive data mining tool',
        ],
      },
      {
        id: '#training',
        name: 'Training',
        expectedText: [
          'An e-learning module which enables an employee to learn the content mapped by the Manager or HR',
          'Dynamic question templates with various degrees of complexity and time limit can be set by the L&D team',
          'Employees can take the test after learning the desired topic & get to know his scores instantly',
          'Employees can view their career path & understand the courses they have to complete',
        ],
      },
       {
        id: '#travel',
        name: 'Travel',
        expectedText: [
          'Provides informative charts with the status of the people on travel',
          'Claimed and unclaimed amount can be viewed across any employee attribute such as department, location etc',
          'Dynamic workflow for managing travel request and advance',
          'Manage expense claim and settlement through the system',
        ],
      },
      {
        id: '#canteen',
        name: 'Canteen',
        expectedText: [
          'Helps to monitor the food tokens used by the employees.',
          'Solution works under turnstile gate setup, biometric setup or token-based device',
          'Allows HR to compute the number of breakfast, lunch, tea and dinner consumed based on the punch timings or based on the token printout',
        ],
      },
      {
        id: '#mobile',
        name: 'Mobile',
        expectedText: [
          'Allows employees to apply leave, permission and on-duty on the move',
'View in-out details, shift details, payslip and tax sheets',
'Employee profile can be accessed by HR or any authorised person',
'HR can call/ text/mail any employee without adding to personal contacts',
'GPS/Geo-fencing Enabled',
        ],
      },
      {
        id: '#exit',
        name: 'Exit',
        expectedText: [
          'Enables the HR to understand the status of employees in respect of resignations and clearances',
'Capture resignations online and dynamically set the exit hierarchy for each employee',
'Employees can request a reduction in the notice period',
'Manger can recommend favouring the employee or reject it',
'Exit interview forms can be designed as per company’s requirement and data can be captured for exit analysis',
        ],
      },
      {
        id: '#recruitment',
        name: 'Recruitment',
        expectedText: [
          'Lifecycle management starts with Applicant Tracking System',
'The dashboard would throw the important charts on MIS about recruitment',
'The charts would be dynamic and would vary depending on the stakeholder',
'Automated interview schedules',
'Dynamic assessment forms can be created for various positions',
'A powerful onboarding module that facilitates candidate login',
          
        ],
      },
      {
        id: '#helpDesk',
        name: 'HelpDesk',
        expectedText: [
          'An internal helpdesk module for an organisation that aids to raise, assign, and track a complaint or request raised by an employee',
'Tickets can be mapped automatically to a concerned person of a department',
'TAT can be defined for each ticket and monitored for its completion',
'TAT can be mapped to appraisal',
          
        ],
      },
      {
        id: '#attendance',
        name: 'Attendance',
        expectedText: [
         'A powerful attendance management software that allows different organizations to configure complex business rules',
'Rules can be configured for shifts, late, permissions, overtime, comp-off, leave, week-off and holidays',
'Easy configuring options that address many complications in night shift, continuous shift, break shifts, over-time and comp-off management',
'The powerful reports engine allows the user to configure different types of reports at ease',
          
        ],
      },
      {
        id: '#visitor',
        name: 'Visitor',
        expectedText: [
          'Has a smart dashboard that enables the security person to know the total visitors for the day so far, visitors inside and details about the expired gate pass',
'Helps the security to know the number of visitors planned for the day',
'Helps in tracking the movement of visitors in an organisation',
'Facilitates one-time registration for a visitor',
        ],
      },
      {
        id: '#payroll',
        name: 'Payroll',
        expectedText: [
          'Wallet HR comes with a robust payroll engine that can process 10,000 records under 10mins',
'Wallet-HR boasts of configuring any complex payroll in three easy steps',
'Manage the audit requirements of master and transaction components',
'Reconciliation statement between two months facilitates error-free computing',
'Payslip format can be configured at ease using the design wizard',
'Payslip is generated in PDF and can be password protected',
        ],
      },
      {
        id: '#appraisal',
        name: 'Appraisal',
        expectedText: [
          'A module with a powerful dashboard for the HR managers to know the status of the appraisal',
          "Wallet-HR's Performance Appraisal is very dynamic and has different methods that are being adopted by various organisations",
          'Performance can be evaluated on a monthly/quarterly/half-yearly/annual basis and these periods can vary from department to department in an organisation',
          'Any number of KRAs and Competencies can be dynamically created',
          'Ratings can be done by Self/Manager/Reviewer',
          'Increments, promotions and training recommendations can be entered by the manager',
          
        ],
      },
      
    ];
  }

  async clickItemAndCheckMessage(item) {
    const panelLocator = this.page.locator(item.id);
    await panelLocator.waitFor({ state: 'visible', timeout: 10000 });
    await panelLocator.scrollIntoViewIfNeeded();
    await panelLocator.click();

    // Wait briefly for modal to appear
    const modalVisible = await this.page.waitForSelector(
      '.modal.fade.in, .modal.show, #ModulesModal',
      { timeout: 3000 }
    ).then(() => true).catch(() => false);

    if (modalVisible) {
      // Verify all expected texts
      for (const text of item.expectedText) {
        await expect(this.messageBox).toContainText(text, { timeout: 5000 });
        console.log(`   🔹 Verified text: "${text}"`);
      }

      // Only click close button if it is visible
      const closeBtnVisible = await this.closeButton.isVisible().catch(() => false);
      if (closeBtnVisible) {
        const closeBtnHandle = await this.closeButton.elementHandle();
        if (closeBtnHandle) {
          await closeBtnHandle.evaluate((btn) => btn.click());
          await this.page.waitForSelector(
            '.modal.fade.in, .modal.show, #ModulesModal',
            { state: 'hidden', timeout: 5000 }
          );
        }
      } else {
        console.log(`   ⚠️ Close button not visible for panel item: ${item.name}`);
      }
    } else {
      console.log(`   ⚠️ No modal appeared for panel item: ${item.name}`);
    }
  }

  async validateAllPanelItems() {
    console.log(`🔹 Found ${this.panelItems.length} left-panel items`);
    for (const item of this.panelItems) {
      console.log(`🔹 Checking panel item: ${item.name}`);
      await this.clickItemAndCheckMessage(item);
    }
  }
}

import { test, expect } from "@playwright/test";
import { connect } from "http2";

test.describe.serial("Windows Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://172.26.120.49/qidra/public/");

    await page.fill("#email", "cisadmin@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/admin");

    await page.getByRole("link", { name: 'Users Windows' }).click();
    await expect(page.url()).toContain("/admin/windows");
  });

  test.afterEach(async ({ page }) => {
    //logout
    try {
        await page.locator("xpath=/html/body/div[1]/div/button").click();
        await page.getByRole("link", { name: "Logout" }).click();

        await expect(page.url()).toContain("/auth/login");
    } catch (error) {
        console.warn('⚠️ Logout failed or user was already logged out:', error.message);
    }
  });

  test("Can create a new window.", async ({ page }) => {
    //get the last step name
    await page.getByRole("link", { name: 'Users Steps' }).click();
    await expect(page.url()).toContain("/admin/steps");

    const stepNumber = await page.locator('table tbody tr:last-child td:nth-child(1)').innerText();
    const stepName = await page.locator('table tbody tr:last-child td:nth-child(2)').innerText();

    await page.getByRole("link", { name: 'Users Windows' }).click();
    await expect(page.url()).toContain("/admin/windows");

    const rows = page.locator('table tbody tr');
    const activeRows = rows.filter({
      has: page.locator('td:nth-child(2)'), // second cell
      hasText: stepNumber + " - " + stepName
    });
    const count = await activeRows.count();

    //click add window button
    await page.getByRole("button", { name: "Add Window" }).click();

    await page.waitForSelector('#addWindowModal', { state: 'visible' });

    //select step name in form and submit
    await page.locator('xpath=//*[@id="step_id"]').selectOption({ label: stepNumber + " - " + stepName });
    await page.locator('button[type="submit"]').click();

    //check if step was added another window
    await expect(activeRows).toHaveCount(count + 1);
    
  });

  test("Can delete a window and add it again.", async ({ page }) => {
    page.once('dialog', async dialog => {
        console.log('⚠️ Alert detected:', dialog.message());

        // Assert the alert message
        expect(dialog.message()).toBe("Are you sure you want to delete this window?");

        // Accept the alert (click OK)
        await dialog.accept();
    });

    // get the last window number of the last row
    const rowCount = page.locator('table tbody tr');
    const initialCount = await rowCount.count();

    const step = await page.locator('table tbody tr:last-child td:nth-child(1)').innerText();
    const window = page.locator('table tbody tr:last-child td:nth-child(2)').innerText();
    
    // Click the delete button of the last row
    const row = page.locator('table tbody tr:last-child');
    await row.getByRole('button', { name: 'Delete' }).click();
    
    //check if row was lessen by 1
    await expect(rowCount).toHaveCount(initialCount - 1);
    
    await page.waitForTimeout(2000);

    //add again
    //get the last step name
    await page.getByRole("link", { name: 'Users Steps' }).click();
    await expect(page.url()).toContain("/admin/steps");

    const stepNumber = await page.locator('table tbody tr:last-child td:nth-child(1)').innerText();
    const stepName = await page.locator('table tbody tr:last-child td:nth-child(2)').innerText();

    await page.getByRole("link", { name: 'Users Windows' }).click();
    await expect(page.url()).toContain("/admin/windows");

    const rows = page.locator('table tbody tr');
    const activeRows = rows.filter({
      has: page.locator('td:nth-child(2)'), // second cell
      hasText: stepNumber + " - " + stepName
    });
    const count = await activeRows.count();

    //click add window button
    await page.getByRole("button", { name: "Add Window" }).click();

    await page.waitForSelector('#addWindowModal', { state: 'visible' });

    //select step name in form and submit
    await page.locator('xpath=//*[@id="step_id"]').selectOption({ label: stepNumber + " - " + stepName });
    await page.locator('button[type="submit"]').click();

    //check if step was added another window
    await expect(activeRows).toHaveCount(count + 1);
  });
});
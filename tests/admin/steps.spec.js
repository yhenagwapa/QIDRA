import { test, expect } from "@playwright/test";

test.describe.serial("Steps Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://172.26.120.49/qidra/public/");

    await page.fill("#email", "cisadmin@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/admin");

    await page.getByRole("link", { name: 'Users Steps' }).click();
    await expect(page.url()).toContain("/admin/steps");
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

  test("Can create a new step.", async ({ page }) => {
    //click add user button
    await page.getByRole("button", { name: "Add Step" }).click();

    const modal = page.locator('#addUserModal');
    await expect(modal).toBeVisible();

    //select step name in form and submit
    await modal.locator('#stepName').selectOption({ label: 'Client Feedback' });
    await modal.locator('button[type="submit"]').click();

    //check if step is added
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: "Client Feedback" })).toBeVisible();

    await page.waitForTimeout(2000);
  });

  test("Cannot add duplicate step.", async ({ page }) => {
    //click add step button
    await page.getByRole("button", { name: "Add Step" }).click();

    const modal = page.locator('#addUserModal');
    await expect(modal).toBeVisible();

    //select step name in form and submit
    await modal.locator('#stepName').selectOption({ label: 'Pre-assessment' });
    await page.waitForTimeout(500);

    //step form should display error message
    const warning = await modal.locator('#stepNameError').innerText();
    expect(warning).toBe("This step name already exists in your section.");

    //cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  // test("Cannot create a new step if one or more required fields are empty.", async ({ page }) => {
  //   //count the rows first
  //   const rows = await page.locator('table tbody tr');
  //   const rowCountBefore  = await rows.count();
  //   let rowCountAfter;

  //   //click add step button
  //   await page.getByRole("button", { name: "Add Step" }).click();

  //   await page.waitForSelector('#addUserModal', { state: 'visible' });

  //   //select step name in form and submit
  //   await page.locator('button[type="submit"]').click();

  //   //timeout 2sec
  //   await page.waitForTimeout(2000);

  //   //check if row count is the same
  //   const row = await page.locator('table tbody tr');
  //   rowCountAfter = await row .count();
  //   expect(rowCountAfter).toBe(rowCountBefore);

  //   await page.waitForTimeout(2000);
  // });

  test("Successfully update step name.", async ({ page }) => {
    //count the rows first
    const rows = await page.locator('table tbody tr');
    const rowsCount  = await rows.count();

    //click the step name of the last row
    await page.waitForSelector('table tbody tr:last-child');

    //get the step no and name
    const stepNo = await page.locator('table tbody tr:last-child td:nth-child(1)').innerText();
    const stepName = await page.locator('table tbody tr:last-child td:nth-child(2)').innerText();
    
    // Click the step name of the last row
    const cell = page.locator('table tbody tr:last-child td:nth-child(2) span.editable-step-name');
    await cell.click();

    // Locate the input that becomes visible and fill
    const input = page.locator('table tbody tr:last-child td:nth-child(2) input');
    await input.fill(stepName + " Edited");

    // Confirm edit
    await page.keyboard.press('Enter');

    await page.waitForTimeout(2000);

    //check if step name was edited
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: stepName + " Edited" })).toBeVisible();

    //check if step name was updated in the add user modal
    //go to user page
    await page.getByRole("link", { name: 'Users Users' }).click();

    //click add user button
    await page.getByRole("button", { name: "Add User" }).click();

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //check step dropdown field if edited step was updated
    await page.waitForSelector('xpath=//*[@name="step_id"]');
    await page.locator('xpath=//*[@name="step_id"]').selectOption({ label: stepNo + " - " + stepName + " Edited" });
    await expect(page.locator('select[name="step_id"] option:checked'))
    .toHaveText(new RegExp(`${stepNo}\\s*-\\s*${stepName}\\s*Edited`));

    await page.waitForTimeout(500);

    //close modal
    await page.locator('//*[@id="cancelAddUser"]').click();
  });

  test("Unsuccessfully update step name if step name is already existing.", async ({ page }) => {
    page.once('dialog', async dialog => {
        console.log('⚠️ Alert detected:', dialog.message());

        // Assert the alert message
        expect(dialog.message()).toContain("This step name already exists in your section.");

        // Accept the alert (click OK)
        await dialog.accept();
    });

    //count the rows first
    const rows = await page.locator('table tbody tr');
    const rowsCount  = await rows.count();

    //click the step name of the last row
    await page.waitForSelector('table tbody tr:last-child');

    //get the step name
    const firstRowStepName = await page.locator('table tbody tr:first-child td:nth-child(2)').innerText();
    
    // Click the step name of the last row
    const editedCell = await page.locator('table tbody tr:last-child td:nth-child(2)').innerText();
    const cell = page.locator('table tbody tr:last-child td:nth-child(2) span.editable-step-name');
    await cell.click();

    // Locate the input that becomes visible and fill
    const input = page.locator('table tbody tr:last-child td:nth-child(2) input');
    await page.keyboard.press('Control+A');       // select all text
    await page.keyboard.press('Backspace');
    await input.fill(firstRowStepName);

    // Confirm edit
    await page.keyboard.press('Enter');

    await page.waitForTimeout(2000);

    const editedCell2 = await page.locator("table tbody tr:last-child td:nth-child(2)").innerText();

    //the step name should not be updated
    await page.waitForSelector('table');
    await expect(editedCell2).toBe(editedCell);
  });

  test("Can delete a step and add it again.", async ({ page }) => {
    page.once('dialog', async dialog => {
        console.log('⚠️ Alert detected:', dialog.message());

        // Assert the alert message
        expect(dialog.message()).toBe("Are you sure you want to delete this step?");

        // Accept the alert (click OK)
        await dialog.accept();
    });

    //add a step
    await page.getByRole("button", { name: "Add Step" }).click();

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //select step name in form and submit
    await page.locator('xpath=//*[@id="stepName"]').selectOption({ label: 'Payment' });
    await page.locator('button[type="submit"]').click();

    //check if step is added
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: 'Payment' })).toBeVisible();

    await page.waitForTimeout(2000);

    //get the step name
    const stepName = await page.locator('table tbody tr:last-child td:nth-child(2)').innerText();
    
    // Click the step name of the last row
    const row = page.locator('table tbody tr:last-child');
    await row.getByRole('button', { name: 'Delete' }).click();

    //check if step cannot be found
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: stepName })).not.toBeVisible();

    await page.waitForTimeout(2000);

    //click add step button
    await page.getByRole("button", { name: "Add Step" }).click();

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //select step name in form and submit
    await page.locator('xpath=//*[@id="stepName"]').selectOption({ label: 'Payment' });
    await page.locator('button[type="submit"]').click();

    //check if step is added
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: "Payment" })).toBeVisible();

    await page.waitForTimeout(2000);
  });
});
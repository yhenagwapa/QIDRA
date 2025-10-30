import { test, expect } from "@playwright/test";

test.describe.serial("Steps Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://172.26.120.49/qidra/public/");

    await page.fill("#email", "cis@admin.com");
    await page.fill("#password", "password");
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

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //select step name in form and submit
    await page.locator('xpath=//*[@id="step_name"]').selectOption({ label: 'Client Feedback / Survey' });
    await page.locator('button[type="submit"]').click();

    //check if step is added
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: "ClientFeedback" })).toBeVisible();

    await page.waitForTimeout(2000);
  });

  test("Cannot add duplicate step.", async ({ page }) => {
    //click add user button
    await page.getByRole("button", { name: "Add Step" }).click();

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //select step name in form and submit
    await page.locator('xpath=//*[@id="addUserForm"]/div[3]/div[1]/select').selectOption({ label: 'Client Feedback / Survey' });
    await page.locator('button[type="submit"]').click();

    //step should not be added and if its added, fail the test
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: "ClientFeedback" })).not.toBeVisible();

    await page.waitForTimeout(2000);
  });

  test("Cannot create a new step if one or more required fields are empty.", async ({ page }) => {
    //click add user button
    await page.getByRole("button", { name: "Add Step" }).click();

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //select step name in form and submit
    await page.locator('button[type="submit"]').click();

    //check if step is added
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: "ClientFeedback" })).toBeVisible();

    await page.waitForTimeout(2000);
  });

  test("Can create a new user meeting password complexity requirements.", async ({ page }) => {
    //click add user button
    await page.getByRole("button", { name: "Add User" }).click();

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //fill in form and submit
    await page.fill('input[name="first_name"]', "Linda");
    await page.fill('input[name="last_name"]', "Ramos");
    await page.fill('input[name="email"]', "lindaramos@gmail.com");
    await page.locator('xpath=//*[@id="addUserForm"]/div[3]/div[1]/select').selectOption({ label: 'Social Welfare Aide' });
    await page.locator('xpath=//*[@id="addUserForm"]/div[3]/div[2]/select').selectOption({ label: '2 - Encoding', timeout: 5000 });
    await page.selectOption('select[name="window_id"]', {label: '1'});
    await page.selectOption('select[name="assigned_category"]', {label: 'Regular'});
    await page.fill('input[name="password"]', "Qwerty@12345678");
    await page.locator('button[type="submit"]').click();

    //check if user is added
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: "lindaramos@gmail.com" })).toBeVisible();

    //logout
    await page.locator("xpath=/html/body/div[1]/div/button").click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page.url()).toContain("/auth/login");

    //check if user can login
    await page.fill("#email", "lindaramos@gmail.com");
    await page.fill("#password", "Qwerty@12345678");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //check if user is in the right step
    await page.waitForSelector('xpath=/html/body/div[2]/div[1]/div/div[3]/div[1]');
    const step = await page.locator("xpath=/html/body/div[2]/div[1]/div/div[3]/div[1]").innerText();
    await expect(step).toContain("STEP 2");

    await page.waitForTimeout(2000);
  });

  test("Cannot create a new user not meeting password complexity requirements.", async ({ page }) => {
    page.once('dialog', async dialog => {
        console.log('⚠️ Alert detected:', dialog.message());

        // Assert the alert message
        expect(dialog.message()).toContain("Password must contain");

        // Accept the alert (click OK)
        await dialog.accept();
    });

    //click add user button
    await page.getByRole("button", { name: "Add User" }).click();

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //fill in form and submit
    await page.fill('input[name="first_name"]', "Mary Ann");
    await page.fill('input[name="last_name"]', "Santos");
    await page.fill('input[name="email"]', "santosmaryann@gmail.com");
    await page.locator('xpath=//*[@id="addUserForm"]/div[3]/div[1]/select').selectOption({ label: 'Social Welfare Officer I' });
    await page.locator('xpath=//*[@id="addUserForm"]/div[3]/div[2]/select').selectOption({ label: '1 - Pre-assessment', timeout: 5000 });
    await page.selectOption('select[name="window_id"]', {label: '1'});
    await page.selectOption('select[name="assigned_category"]', {label: 'Regular'});
    await page.fill('input[name="password"]', "password12345678");
    await page.locator('button[type="submit"]').click();

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //close form
    await page.locator('button[id="cancelAddUser"]').click();

    //user should not be added
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: "santosmaryann@gmail.com" })).not.toBeVisible();

    await page.waitForTimeout(2000);
  });

  test("Can delete a user.", async ({ page }) => {
    page.once('dialog', async dialog => {
        console.log('⚠️ Alert detected:', dialog.message());

        // Assert the alert message
        expect(dialog.message()).toBe("Are you sure you want to delete this user?");

        // Accept the alert (click OK)
        await dialog.accept();
    });

    //look for row with an email testuser@dswd.gov.ph and click delete button on the actions column
    const row = page.locator('tr', { hasText: 'testuser@dswd.gov.ph' });
    await row.getByRole('button', { name: 'Delete' }).click();

    //check if user cannot be found
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: "testuser@dswd.gov.ph" })).not.toBeVisible();

    await page.waitForTimeout(2000);
  });

  //test if deleted user can be added again
  test("Can add a deleted user again.", async ({ page }) => {
    //click add user button
    await page.getByRole("button", { name: "Add User" }).click();

    await page.waitForSelector('#addUserModal', { state: 'visible' });

    //fill in form and submit
    await page.fill('input[name="first_name"]', "Test");
    await page.fill('input[name="last_name"]', "User");
    await page.fill('input[name="email"]', "testuser@dswd.gov.ph");
    await page.locator('xpath=//*[@id="addUserForm"]/div[3]/div[1]/select').selectOption({ label: 'Social Welfare Officer I' });
    await page.locator('xpath=//*[@id="addUserForm"]/div[3]/div[2]/select').selectOption({ label: '1 - Pre-assessment', timeout: 5000 });
    await page.selectOption('select[name="window_id"]', {label: '1'});
    await page.selectOption('select[name="assigned_category"]', {label: 'Regular'});
    await page.fill('input[name="password"]', "Qwerty@12345678");
    await page.locator('button[type="submit"]').click();

    //check if user is added
    await page.waitForSelector('table');
    await expect(page.getByRole("cell", { name: "testuser@dswd.gov.ph" })).toBeVisible();

    //logout
    await page.locator("xpath=/html/body/div[1]/div/button").click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page.url()).toContain("/auth/login");

    //check if user can login
    await page.fill("#email", "testuser@dswd.gov.ph");
    await page.fill("#password", "Qwerty@12345678");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //check if user is in the right step
    await page.waitForSelector('xpath=/html/body/div[2]/div[1]/div/div[3]/div[1]');
    const step = await page.locator("xpath=/html/body/div[2]/div[1]/div/div[3]/div[1]").innerText();
    await expect(step).toContain("STEP 1");

    await page.waitForTimeout(2000);
  });
});
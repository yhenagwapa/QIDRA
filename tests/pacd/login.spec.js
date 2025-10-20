import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://172.26.120.49/qidra/public/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Qidra/);
});

test("Login using a registered account and logout.", async ({ page }) => {
  await page.goto("https://172.26.120.49/qidra/public/");

  await page.fill("#email", "cispacd@dswd.gov.ph");
  await page.fill("#password", "password");
  await page.getByLabel("I agree to the Terms and Conditions.").check();

  await page.locator('button[type="submit"]').click();

  await expect(
    page.getByRole("heading", { name: "Generate Ticket", exact: true })
  ).toBeVisible();

  //logout
  await page.locator('xpath=/html/body/div[1]/div/button').click();
  await page.getByRole("link", { name: "Logout" }).click();
  
  await expect(page.url()).toContain("/auth/login");
});

test("Login using an unregistered account.", async ({ page }) => {
  await page.goto("https://172.26.120.49/qidra/public/");

  await page.fill("#email", "cis_pacd@dswd.gov.ph");
  await page.fill("#password", "testpassword");
  await page.getByLabel("I agree to the Terms and Conditions.").check();

  await page.locator('button[type="submit"]').click();

  await page
    .getByText("The provided credentials do not match our records.")
    .isVisible();
});

test("Leaves one or more required fields empty.", async ({ page }) => {
  await page.goto("https://172.26.120.49/qidra/public/");

  await page.fill("#email", "cispacd@dswd.gov.ph");
  await page.getByLabel("I agree to the Terms and Conditions.").check();
  await page.locator('button[type="submit"]').click();

  const pass = page.locator('input[name="password"]');
  const passwordmsg = await pass.evaluate(
    (el, HTMLInputElement) => el.validationMessage
  );
  expect(passwordmsg).toBe("Please fill out this field.");

  await page.fill("#email", "");
  await page.fill("#password", "password");
  await page.getByLabel("I agree to the Terms and Conditions.").check();
  await page.locator('button[type="submit"]').click();

  const email = page.locator('input[name="email"]');
  const emailmsg = await email.evaluate(
    (el, HTMLInputElement) => el.validationMessage
  );
  expect(emailmsg).toBe("Please fill out this field.");
});

test("Leaves both email and password empty.", async ({ page }) => {
  await page.goto("https://172.26.120.49/qidra/public/");

  await page.getByLabel("I agree to the Terms and Conditions.").check();
  await page.locator('button[type="submit"]').click();

  const email = page.locator('input[name="email"]');
  const emailmsg = await email.evaluate(
    (el, HTMLInputElement) => el.validationMessage
  );
  expect(emailmsg).toBe("Please fill out this field.");
});

test("Leaves terms and condition unchecked.", async ({ page }) => {
  await page.goto("https://172.26.120.49/qidra/public/");

  await page.fill("#email", "cispacd@dswd.gov.ph");
  await page.fill("#password", "password");
  await page.locator('button[type="submit"]').click();

  const terms = page.locator('input[name="terms"]');
  const termsmsg = await terms.evaluate(
    (el, HTMLInputElement) => el.validationMessage
  );
  expect(termsmsg).toBe("Please check this box if you want to proceed.");
});

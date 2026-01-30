import { test, expect } from "@playwright/test";

test.describe.serial("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://172.26.120.49/qidra/public/");

    await page.fill("#email", "yvvillamil@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/admin");
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

  test("Verify count of waiting clients.", async ({ page }) => {
      //count waiting status in the in queue client table
      const row = page.locator('table tr', { hasText: "Waiting" });
      const count = await row.count();

      //check if count is the same as displayed in the waiting client card
      const card = page.locator('xpath=/html/body/div[3]/div/div/div[1]/div[1]/p[2]');
      const cardText = await card.innerText();

    //   console.log(cardText);
      await expect(count).toBe(parseInt(cardText));
  })
  test("Verify count of pending clients.", async ({ page }) => {
      //count waiting status in the in queue client table
      const row = page.locator('table tr', { hasText: "Pending" });
      const count = await row.count();

      //check if count is the same as displayed in the waiting client card
      const card = page.locator('xpath=/html/body/div[3]/div/div/div[1]/div[2]/p[2]');
      const cardText = await card.innerText();

    //   console.log(cardText);
      await expect(count).toBe(parseInt(cardText));
  })
  test("Verify count of serving clients.", async ({ page }) => {
      //count waiting status in the in queue client table
      const row = page.locator('table tr', { hasText: "Serving" });
      const count = await row.count();

      //check if count is the same as displayed in the waiting client card
      const card = page.locator('xpath=/html/body/div[3]/div/div/div[1]/div[3]/p[2]');
      const cardText = await card.innerText();

    //   console.log(cardText);
      await expect(count).toBe(parseInt(cardText));
  })
  test("Verify count of regular clients.", async ({ page }) => {
      //count waiting status in the in queue client table
      const row = page.locator('table tr', { hasText: "Regular" });
      const count = await row.count();

      //check if count is the same as displayed in the waiting client card
      const card = page.locator('xpath=/html/body/div[3]/div/div/div[1]/div[4]/p[2]');
      const cardText = await card.innerText();

    //   console.log(cardText);
      await expect(count).toBe(parseInt(cardText));
  })
  test("Verify count of returnee clients.", async ({ page }) => {
      //count waiting status in the in queue client table
      const row = page.locator('table tr', { hasText: "Returnee" });
      const count = await row.count();

      //check if count is the same as displayed in the waiting client card
      const card = page.locator('xpath=/html/body/div[3]/div/div/div[1]/div[5]/p[2]');
      const cardText = await card.innerText();

    //   console.log(cardText);
      await expect(count).toBe(parseInt(cardText));
  })
  test("Verify count of completed clients.", async ({ page }) => {
      //count waiting status in the in queue client table
      const row = page.locator('table tr', { hasText: "Completed" });
      const count = await row.count();

      //check if count is the same as displayed in the waiting client card
      const card = page.locator('xpath=/html/body/div[3]/div/div/div[1]/div[6]/p[2]');
      const cardText = await card.innerText();

    //   console.log(cardText);
      await expect(count).toBe(parseInt(cardText));
  })
//   test("Verify count of priority clients.", async ({ page }) => {
//       //count waiting status in the in queue client table
//       const row = page.locator('table tr', { hasText: "Priority" });
//       const count = await row.count();

//       //check if count is the same as displayed in the waiting client card
//       const card = page.locator('xpath=/html/body/div[3]/div/div/div[1]/div[1]/p[2]');
//       const cardText = await card.innerText();

//     //   console.log(cardText);
//       await expect(count).toBe(parseInt(cardText));
//   })
});
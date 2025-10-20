import { test, expect } from "@playwright/test";

test.describe.serial("Assessment Queueing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://172.26.120.49/qidra/public/");

    await page.fill("#email", "releasing1@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");  
  });

  test("Call next regular queue and forward it to the next step.", async ({ page }) => {
    //get the text of the next queue
    const forReleasing = await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').innerText();

    //call next regular for releasing
    await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const serving = await page.locator('xpath=//*[@id="servingQueue"]/div[1]').innerText();

    await page.waitForTimeout(2000);

    //compare next queue and serving queue
    await expect(serving).toBe(forReleasing);
    
    //proceed serving client for completion
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    await page.waitForTimeout(5000);

    //login pacd user to confirm completion
    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/pacd");

    await page.waitForTimeout(2000);

    //confirm if queue status is completed
    await page.getByRole("link", { name: /in queue/i }).click();

    await expect(page.getByRole("heading", { name: "In Queue Clients", exact: true })).toBeVisible();

    const row = page.locator('table tr', { hasText: serving });
    const statusText = await row.locator('td:nth-child(5)').innerText();

    await expect(statusText).toBe("Completed");

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

  test("Call next priority queue and forward it to the next step.", async ({ page }) => {
    //get the text of the next queue
    const forReleasing = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

    //call next priority
    await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const serving = await page.locator('xpath=//*[@id="servingQueue"]/div[1]').innerText();

    await page.waitForTimeout(2000);

    //compare next queue and serving queue
    await expect(serving).toBe(forReleasing);

    //proceed serving priority queue to next step
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    //login pacd user to confirm completion
    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/pacd");

    await page.waitForTimeout(2000);

    //confirm if queue status is completed
    await page.getByRole("link", { name: /in queue/i }).click();

    await expect(page.getByRole("heading", { name: "In Queue Clients", exact: true })).toBeVisible();

    const row = page.locator('table tr', { hasText: serving });
    const statusText = await row.locator('td:nth-child(5)').innerText();

    await expect(statusText).toBe("Completed");

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

  test("Call next returnee queue and forward it to the next step.", async ({ page }) => {
    //get the text of the next queue
    const text = await page.locator('xpath=//*[@id="upcomingReturnee"]/div[1]').innerText();

    //call next returnee
    await page.locator('xpath=//*[@id="upcomingReturnee"]/div[1]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const serving = await page.locator('xpath=//*[@id="servingQueue"]/div[1]').innerText();

    await page.waitForTimeout(2000);

    //compare next queue and serving queue
    await expect(serving).toBe(text);

    //proceed serving priority queue to next step
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    //login pacd user to confirm completion
    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/pacd");

    await page.waitForTimeout(2000);

    //confirm if queue status was completed
    await page.getByRole("link", { name: /in queue/i }).click();

    await expect(page.getByRole("heading", { name: "In Queue Clients", exact: true })).toBeVisible();

    const row = page.locator('table tr', { hasText: serving });
    const statusText = await row.locator('td:nth-child(5)').innerText();

    await expect(statusText).toBe("Completed");

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

  test("Skip a serving regular queue, serve a skipped regular queue and proceed skipped queue to next step.", async ({ page }) => {
    //get the text of the next queue
    const forReleasing = await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').innerText();

    //call next regular
    await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    let serving = await page.locator("#servingQueue").innerText();

    //click skip button
    await page.locator("#skipBtn").click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(5000);

    //get the text of the skipped queue
    const skipped = await page.locator('xpath=//*[@id="pendingRegu"]/div[1]').innerText();

    //compare serving queue and skipped queue
    await expect(skipped).toBe(serving);

    //serve skipped client
    await page.locator('xpath=//*[@id="pendingRegu"]/div[1]').click();
    await page.locator('xpath=//*[@id="popup-modal"]/div/div/div/button[3]').click();

    await page.waitForTimeout(2000);

    const serving2 = await page.locator("#servingQueue").innerText();

    //compare serving queue and skipped queue
    await expect(serving2).toBe(skipped);

    //skip again, serve and proceed for completion
    await page.locator('xpath=//*[@id="skipBtn"]').click();
    await page.locator("#modalConfirmBtn").click();
    
    //get the text of the next queue
    const text2 = await page.locator('xpath=//*[@id="pendingRegu"]/div[1]').innerText();

    //click pending queue and click proceed
    await page.locator('xpath=//*[@id="pendingRegu"]/div[1]').click();
    await page.locator('xpath=//*[@id="popup-modal"]/div/div/div/button[4]').click();

    await page.waitForTimeout(2000);  

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    //login pacd user to confirm completion
    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();  

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/pacd");

    await page.waitForTimeout(2000);

    //confirm if queue status is completed
    await page.getByRole("link", { name: /in queue/i }).click();

    await expect(page.getByRole("heading", { name: "In Queue Clients", exact: true })).toBeVisible();

    const row = page.locator('table tr', { hasText: serving });
    const statusText = await row.locator('td:nth-child(5)').innerText();

    await expect(statusText).toBe("Completed");

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

  });

  test("Skip a serving priority queue, serve a skipped priority queue and proceed skipped queue to next step.", async ({ page }) => {
    //get the text of the next queue
    const forReleasing = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

    //call next regular
    await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    let serving = await page.locator("#servingQueue").innerText();

    //click skip button
    await page.locator("#skipBtn").click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(5000);

    //get the text of the skipped queue
    const skipped = await page.locator('xpath=//*[@id="pendingPrio"]/div[1]').innerText();

    //compare serving queue and skipped queue
    await expect(skipped).toBe(serving);

    //serve skipped client
    await page.locator('xpath=//*[@id="pendingPrio"]/div[1]').click();
    await page.locator('xpath=//*[@id="popup-modal"]/div/div/div/button[3]').click();

    await page.waitForTimeout(2000);

    const serving2 = await page.locator("#servingQueue").innerText();

    //compare serving queue and skipped queue
    await expect(serving2).toBe(skipped);

    //skip again, serve and proceed for completion
    await page.locator('xpath=//*[@id="skipBtn"]').click();
    await page.locator("#modalConfirmBtn").click();
    
    //get the text of the next queue
    const text2 = await page.locator('xpath=//*[@id="pendingPrio"]/div[1]').innerText();

    //click pending queue and click proceed
    await page.locator('xpath=//*[@id="pendingPrio"]/div[1]').click();
    await page.locator('xpath=//*[@id="popup-modal"]/div/div/div/button[4]').click();

    await page.waitForTimeout(2000);  

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    //login pacd user to confirm completion
    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();  

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/pacd");

    await page.waitForTimeout(2000);

    //confirm if queue status is completed
    await page.getByRole("link", { name: /in queue/i }).click();

    await expect(page.getByRole("heading", { name: "In Queue Clients", exact: true })).toBeVisible();

    const row = page.locator('table tr', { hasText: serving });
    const statusText = await row.locator('td:nth-child(5)').innerText();

    await expect(statusText).toBe("Completed");

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

  });

  test("Skip a serving returnee queue, serve a skipped returnee queue and proceed returnee queue to next step.", async ({ page }) => {
    //get the text of the next queue
    const forReleasing = await page.locator('xpath=//*[@id="upcomingReturnee"]/div[1]').innerText();

    //call next regular
    await page.locator('xpath=//*[@id="upcomingReturnee"]/div[1]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    let serving = await page.locator("#servingQueue").innerText();

    //click skip button
    await page.locator("#skipBtn").click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(5000);

    //get the text of the skipped queue
    const skipped = await page.locator('xpath=//*[@id="pendingReturnee"]/div[1]').innerText();

    //compare serving queue and skipped queue
    await expect(skipped).toBe(serving);

    //serve skipped client
    await page.locator('xpath=//*[@id="pendingReturnee"]/div[1]').click();
    await page.locator('xpath=//*[@id="popup-modal"]/div/div/div/button[3]').click();

    await page.waitForTimeout(2000);

    const serving2 = await page.locator("#servingQueue").innerText();

    //compare serving queue and skipped queue
    await expect(serving2).toBe(skipped);

    //skip again, serve and proceed for completion
    await page.locator('xpath=//*[@id="skipBtn"]').click();
    await page.locator("#modalConfirmBtn").click();
    
    //get the text of the next queue
    const text2 = await page.locator('xpath=//*[@id="pendingReturnee"]/div[1]').innerText();

    //click pending queue and click proceed
    await page.locator('xpath=//*[@id="pendingReturnee"]/div[1]').click();
    await page.locator('xpath=//*[@id="popup-modal"]/div/div/div/button[4]').click();

    await page.waitForTimeout(2000);  

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    //login pacd user to confirm completion
    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();  

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/pacd");

    await page.waitForTimeout(2000);

    //confirm if queue status is completed
    await page.getByRole("link", { name: /in queue/i }).click();

    await expect(page.getByRole("heading", { name: "In Queue Clients", exact: true })).toBeVisible();

    const row = page.locator('table tr', { hasText: serving });
    const statusText = await row.locator('td:nth-child(5)').innerText();

    await expect(statusText).toBe("Completed");

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

  });

  test("Defer regular queue.", async ({ page }) => {
    //get the text of the next queue
    const forReleasing = await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').innerText();

    //call next regular for releasing
    await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const serving = await page.locator("#servingQueue").innerText();

    //compare next queue and serving queue
    await expect(serving).toBe(forReleasing);

    await page.waitForTimeout(5000);

    //defer client
    await page.locator('xpath=//*[@id="deferBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //look for the deferred queue in the pending list
    const divs = page.locator('xpath=//*[@id="deferred"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const deferredClient = await divs.nth(i).innerText();
      console.log(`Div ${i + 1}: ${deferredClient}`);

      if (deferredClient.includes(serving)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page.url()).toContain("/auth/login");

    //login pacd user to confirm completion
    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();  

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/pacd");

    await page.waitForTimeout(2000);

    //confirm if queue status is completed
    await page.getByRole("link", { name: /in queue/i }).click();

    await expect(page.getByRole("heading", { name: "In Queue Clients", exact: true })).toBeVisible();

    const row = page.locator('table tr', { hasText: serving });
    const statusText = await row.locator('td:nth-child(5)').innerText();

    await expect(statusText).toBe("Deferred");

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

  });

  test("Defer priority queue.", async ({ page }) => {
    //get the text of the next queue
    const forReleasing = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

    //call next priority
    await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const serving = await page.locator("#servingQueue").innerText();

    //compare next queue and serving queue
    await expect(serving).toBe(forReleasing);

    await page.waitForTimeout(5000);

    //defer client
    await page.locator('xpath=//*[@id="deferBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //look for the deferred queue in the pending list
    const divs = page.locator('xpath=//*[@id="deferred"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const deferredClient = await divs.nth(i).innerText();
      console.log(`Div ${i + 1}: ${deferredClient}`);

      if (deferredClient.includes(serving)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page.url()).toContain("/auth/login");

    //login pacd user to confirm completion
    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();  

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/pacd");

    await page.waitForTimeout(2000);

    //confirm if queue status is completed
    await page.getByRole("link", { name: /in queue/i }).click();

    await expect(page.getByRole("heading", { name: "In Queue Clients", exact: true })).toBeVisible();

    const row = page.locator('table tr', { hasText: serving });
    const statusText = await row.locator('td:nth-child(5)').innerText();

    await expect(statusText).toBe("Deferred");

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

  test("Defer returnee queue.", async ({ page }) => {
    //get the text of the next queue
    const forReleasing = await page.locator('xpath=//*[@id="upcomingReturnee"]/div[1]').innerText();

    //call next returnee
    await page.locator('xpath=//*[@id="upcomingReturnee"]/div[1]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const serving = await page.locator("#servingQueue").innerText();

    //compare next queue and serving queue
    await expect(serving).toBe(forReleasing);

    await page.waitForTimeout(5000);

    //defer client
    await page.locator('xpath=//*[@id="deferBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //look for the deferred queue in the pending list
    const divs = page.locator('xpath=//*[@id="deferred"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const deferredClient = await divs.nth(i).innerText();
      console.log(`Div ${i + 1}: ${deferredClient}`);

      if (deferredClient.includes(serving)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page.url()).toContain("/auth/login");

    //login pacd user to confirm completion
    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "password");
    await page.getByLabel("I agree to the Terms and Conditions.").check();  

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/pacd");

    await page.waitForTimeout(2000);

    //confirm if queue status is completed
    await page.getByRole("link", { name: /in queue/i }).click();

    await expect(page.getByRole("heading", { name: "In Queue Clients", exact: true })).toBeVisible();

    const row = page.locator('table tr', { hasText: serving });
    const statusText = await row.locator('td:nth-child(5)').innerText();

    await expect(statusText).toBe("Deferred");

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });
});

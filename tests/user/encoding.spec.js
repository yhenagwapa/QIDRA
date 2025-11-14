import { test, expect } from "@playwright/test";

test.describe.serial("Encoding Queueing", () => {
  test("Call next regular queue and forward it to the next step.", async ({ page }) => {
    //visit the page
    await page.goto("https://172.26.120.49/qidra/public/");

    //login as encoding/step 2 user for regular lane
    await page.fill("#email", "encodingregu1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //get the text of the next queue
    const text = await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').innerText();

    //call next regular
    await page.locator('xpath=//*[@id="nextRegularBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const serving = await page.locator('xpath=//*[@id="servingQueue"]/div[1]').innerText();

    await page.waitForTimeout(2000);

    //compare next queue and serving queue
    await expect(serving).toBe(text);
    
    //proceed serving regular queue to next step
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    // await page.waitForTimeout(2000);

    //login step 3 user
    await page.fill("#email", "assessment1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //confirm if queue was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingRegu"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const inqueueClient = await divs.nth(i).innerText();
      console.log(`Div ${i + 1}: ${inqueueClient}, serving: ${serving}`);

      if (inqueueClient.includes(serving)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

  test("Call next priority queue and forward it to the next step.", async ({ page }) => {
    //visit the page
    await page.goto("https://172.26.120.49/qidra/public/");

    //login as encoding/step 2 user for priority lane
    await page.fill("#email", "encodingprio1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //get the text of the next queue
    const text = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

    //call next priority
    await page.locator('xpath=//*[@id="nextPriorityBtn"]').click();
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

    //login step 3 user
    await page.fill("#email", "assessment1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //confirm if priority queue was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingPrio"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const inqueueClient = await divs.nth(i).innerText();
      console.log(`Div ${i + 1}: ${inqueueClient}`);

      if (inqueueClient.includes(serving)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

  test("Skip a serving regular queue, serve a skipped regular queue and proceed skipped queue to next step.", async ({ page }) => {
    //visit the page
    await page.goto("https://172.26.120.49/qidra/public/");

    //login as encoding/step 2 user for regular lane
    await page.fill("#email", "encodingregu1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //get the text of the next queue
    const text = await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').innerText();

    //call next regular
    await page.locator('xpath=//*[@id="nextRegularBtn"]').click();
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

    //proceed skipped client to next step after serving
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();
    
    //get the text of the next queue
    const text2 = await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').innerText();

    //call next regular
    await page.locator('xpath=//*[@id="nextRegularBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);  

    //get the text of the serving queue
    const serving3 = await page.locator("#servingQueue").innerText();

    //compare next queue and serving queue
    await expect(serving3).toBe(text2);

    //click skip button
    await page.locator("#skipBtn").click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the skipped queue
    const skipped2 = await page.locator('xpath=//*[@id="pendingRegu"]/div[1]').innerText();

    //compare serving queue and skipped queue
    await expect(serving3).toBe(skipped2);

    //proceed skipped client to next step
    await page.locator('xpath=//*[@id="pendingRegu"]/div[1]').click();
    await page.locator('xpath=//*[@id="popup-modal"]/div/div/div/button[4]').click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    //login again and check next step if the proceed skipped client was added to the next step
    await page.goto("https://172.26.120.49/qidra/public/");

    //login step 3 user
    await page.fill("#email", "assessment1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.waitForTimeout(2000);

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //look for the proceed skipped client was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingRegu"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const proceededClient = await divs.nth(i).innerText();
      console.log(`Div ${i + 1}: ${proceededClient}, ${skipped2}`);

      if (proceededClient.includes(skipped2)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

  });

  test("Skip a serving priority queue, serve a skipped priority queue and proceed skipped queue to next step.", async ({ page }) => {
    //visit the page
    await page.goto("https://172.26.120.49/qidra/public/");

    //login as encoding/step 2 user for priority lane
    await page.fill("#email", "encodingprio1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    // await expect(page.url()).toContain("/user");

    //get the text of the next queue
    const text = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

    //call next regular
    await page.locator('xpath=//*[@id="nextPriorityBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    let serving = await page.locator("#servingQueue").innerText();

    //click skip button
    await page.locator("#skipBtn").click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

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

    //proceed skipped client to next step after serving
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();
    
    await page.waitForTimeout(2000);

    //get the text of the next queue
    const text2 = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

    //call next regular
    await page.locator('xpath=//*[@id="nextPriorityBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);  

    //get the text of the serving queue
    const serving3 = await page.locator("#servingQueue").innerText();

    //compare next queue and serving queue
    await expect(serving3).toBe(text2);

    //click skip button
    await page.locator("#skipBtn").click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the skipped queue
    const skipped2 = await page.locator('xpath=//*[@id="pendingPrio"]/div[1]').innerText();

    //compare serving queue and skipped queue
    await expect(serving3).toBe(skipped2);

    //proceed skipped client to next step
    await page.locator('xpath=//*[@id="pendingPrio"]/div[1]').click();
    await page.locator('xpath=//*[@id="popup-modal"]/div/div/div/button[4]').click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    //login step 3 user
    await page.fill("#email", "assessment1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //look for the proceed skipped client was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingPrio"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const proceededClient = await divs.nth(i).innerText();
      console.log(`Div ${i + 1}: ${proceededClient}, ${skipped2}`);

      if (proceededClient.includes(skipped2)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

  });

  test("Recall regular queue and forward to the next step.", async ({ page }) => {
    //visit the page
    await page.goto("https://172.26.120.49/qidra/public/");

    //login as encoding/step 2 user for regular lane
    await page.fill("#email", "encodingregu1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //get the text of the next queue
    const text = await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').innerText();

    //call next regular
    await page.locator('xpath=//*[@id="nextRegularBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const serving = await page.locator("#servingQueue").innerText();

    //compare next queue and serving queue
    await expect(serving).toBe(text);

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const recalled = await page.locator("#servingQueue").innerText();

    //recall client
    await page.locator('xpath=//*[@id="recallBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await expect(recalled).toBe(serving);

    await page.waitForTimeout(2000);

    //get the text of the recalled queue
    const recalled2 = await page.locator("#servingQueue").innerText();

    //proceed serving client to next step
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page.url()).toContain("/auth/login");

    //login step 3 user
    await page.fill("#email", "assessment1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //look for the proceed skipped client was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingRegu"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const proceededClient = await divs.nth(i).innerText();
      console.log(`Div ${i + 1}: ${proceededClient}, ${recalled2}`);

      if (proceededClient.includes(recalled2)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

  });
  
  test("Recall priority queue and forward to the next step.", async ({ page }) => {
    //visit the page
    await page.goto("https://172.26.120.49/qidra/public/");

    //login as encoding/step 2 user for priority lane
    await page.fill("#email", "encodingprio1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //get the text of the next queue
    const text = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

    //call next priority
    await page.locator('xpath=//*[@id="nextPriorityBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const serving = await page.locator("#servingQueue").innerText();

    //compare next queue and serving queue
    await expect(serving).toBe(text);

    await page.waitForTimeout(10000);

    //get the text of the serving queue
    const recalled = await page.locator("#servingQueue").innerText();

    //recall client
    await page.locator('xpath=//*[@id="recallBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await expect(recalled).toBe(serving);

    await page.waitForTimeout(2000);

    //get the text of the recalled queue
    const recalled2 = await page.locator("#servingQueue").innerText();

    //proceed serving client to next step
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page.url()).toContain("/auth/login");

    //login step 3 user
    await page.fill("#email", "assessment1@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //look for the proceed skipped client was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingPrio"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const proceededClient = await divs.nth(i).innerText();
      console.log(`Div ${i + 1}: ${proceededClient}, ${recalled2}`);

      if (proceededClient.includes(recalled2)) {
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

  // test("Defer regular queue.", async ({ page }) => {
  //   //visit the page
  //   await page.goto("https://172.26.120.49/qidra/public/");

  //   //login as priority user
  //   await page.fill("#email", "encodingregu1@dswd.gov.ph");
  //   await page.fill("#password", "password");
  //   await page.getByLabel("I agree to the Terms and Conditions.").check();

  //   await page.locator('button[type="submit"]').click();

  //   await expect(page.url()).toContain("/user");

  //   //get the text of the next queue
  //   const text = await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').innerText();

  //   //call next regular
  //   await page.locator('xpath=//*[@id="nextRegularBtn"]').click();
  //   await page.locator("#modalConfirmBtn").click();

  //   await page.waitForTimeout(2000);

  //   //get the text of the serving queue
  //   const serving = await page.locator("#servingQueue").innerText();

  //   //compare next queue and serving queue
  //   await expect(serving).toBe(text);

  //   await page.waitForTimeout(5000);

  //   //defer client
  //   await page.locator('xpath=//*[@id="deferBtn"]').click();
  //   await page.locator("#modalConfirmBtn").click();

  //   await page.waitForTimeout(2000);

  //   //look for the deferred queue in the pending list
  //   const divs = page.locator('xpath=//*[@id="deferred"]/div');
  //   const count = await divs.count();
  //   let found = false;

  //   for (let i = 0; i < count; i++) {
  //     const deferredClient = await divs.nth(i).innerText();
  //     console.log(`Div ${i + 1}: ${deferredClient}`);

  //     if (deferredClient.includes(serving)) {
  //       found = true;
  //       break;
  //     }
  //   }

  //   expect(found).toBeTruthy();

  //   //logout
  //   await page.locator('xpath=/html/body/div[1]/div/button').click();
  //   await page.getByRole("link", { name: "Logout" }).click();

  //   await expect(page.url()).toContain("/auth/login");
  // });

  // test("Defer priority queue.", async ({ page }) => {
  //   //visit the page
  //   await page.goto("https://172.26.120.49/qidra/public/");

  //   //login as priority user
  //   await page.fill("#email", "encodingprio1@dswd.gov.ph");
  //   await page.fill("#password", "password");
  //   await page.getByLabel("I agree to the Terms and Conditions.").check();

  //   await page.locator('button[type="submit"]').click();

  //   await expect(page.url()).toContain("/user");

  //   //get the text of the next queue
  //   const text = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

  //   //call next regular
  //   await page.locator('xpath=//*[@id="nextPriorityBtn"]').click();
  //   await page.locator("#modalConfirmBtn").click();

  //   await page.waitForTimeout(2000);

  //   //get the text of the serving queue
  //   const serving = await page.locator("#servingQueue").innerText();

  //   //compare next queue and serving queue
  //   await expect(serving).toBe(text);

  //   await page.waitForTimeout(5000);

  //   //defer client
  //   await page.locator('xpath=//*[@id="deferBtn"]').click();
  //   await page.locator("#modalConfirmBtn").click();

  //   await page.waitForTimeout(2000);

  //   //look for the deferred queue in the pending list
  //   const divs = page.locator('xpath=//*[@id="deferred"]/div');
  //   const count = await divs.count();
  //   let found = false;

  //   for (let i = 0; i < count; i++) {
  //     const deferredClient = await divs.nth(i).innerText();
  //     console.log(`Div ${i + 1}: ${deferredClient}`);

  //     if (deferredClient.includes(serving)) {
  //       found = true;
  //       break;
  //     }
  //   }

  //   expect(found).toBeTruthy();

  //   //logout
  //   await page.locator('xpath=/html/body/div[1]/div/button').click();
  //   await page.getByRole("link", { name: "Logout" }).click();

  //   await expect(page.url()).toContain("/auth/login");
  // });
});

import { test, expect } from "@playwright/test";

test.describe.serial("Pre-Assessment Queueing", () => {
  test("Call next regular queue and forward it to the next step.", async ({ page }) => {
    //visit the page
    await page.goto("https://172.26.120.49/qidra/public/");

    //login as priority user
    await page.fill("#email", "fosale@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //check if there is a serving queue
    const servingQueue = await page.locator("#servingQueue").innerText();

    console.log(servingQueue);

    //if servingQueue is not empty then click proceed button before calling next queue
    if (servingQueue !== "🚫Empty") {
      //proceed serving regular queue to next step
      await page.locator('#proceedBtn').click();
      await page.locator("#modalConfirmBtn").click();

      await page.waitForTimeout(2000);
    }

    //get the text of the next queue
    const nextQueue = await page.locator('#upcomingRegu > div').first().innerText();

    if (nextQueue.includes("🚫Empty")) {
      //skip test
      test.skip();

    } else {
      //call next regular
      await page.locator('#nextRegularBtn').click();
      await page.locator("#modalConfirmBtn").click();

      await page.waitForTimeout(2000); 
    }

    //get the text of the serving queue
    const serving = await page.locator("#servingQueue").innerText();

    //compare next queue and serving queue
    await expect(serving).toBe(nextQueue);
    
    //proceed serving regular queue to next step
    await page.locator('#proceedBtn').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('body > div:nth-child(1) > div > button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    //login step 2 user
    await page.fill("#email", "fjlvillas@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //confirm if queue was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingRegu"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const inqueueClient = await divs.nth(i).innerText();
      // console.log(`Div ${i + 1}: ${inqueueClient}, serving: ${serving}`);

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

    //login as priority user
    await page.fill("#email", "krajuanico@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //check if there is a serving queue
    const servingQueue = await page.locator("#servingQueue").innerText();

    //if servingQueue is not empty then click proceed button before calling next queue
    if (servingQueue !== "🚫Empty") {
      //proceed serving regular queue to next step
      await page.locator('xpath=//*[@id="proceedBtn"]').click();
      await page.locator("#modalConfirmBtn").click();

      await page.waitForTimeout(2000);
    }

    //get the text of the next queue
    const nextQueue = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

    if (nextQueue.includes("🚫Empty")) {
      //skip test
      test.skip();

    } else {
      //call next regular
      await page.locator('xpath=//*[@id="nextPriorityBtn"]').click();
      await page.locator("#modalConfirmBtn").click();

      await page.waitForTimeout(2000); 
    }

    //get the text of the serving queue
    const serving = await page.locator("#servingQueue").innerText();

    //compare next queue and serving queue
    await expect(serving).toBe(nextQueue);

    //proceed serving priority queue to next step
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    //login step 2 user
    await page.fill("#email", "jdcumbay@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //confirm if priority queue was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingPrio"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const inqueueClient = await divs.nth(i).innerText();
      // console.log(`Div ${i + 1}: ${inqueueClient}`);

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

    //login as regular user
    await page.fill("#email", "fosale@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //get the text of the next queue
    const nextQueue = await page.locator('xpath=//*[@id="upcomingRegu"]/div[1]').innerText();

    if (nextQueue.includes("🚫Empty")) {
      //skip test
      test.skip();
    } 

    //check if there is a serving queue
    const servingQueue = await page.locator("#servingQueue").innerText();

    //if servingQueue is not empty then click proceed button before calling next queue
    if (servingQueue !== "🚫Empty") {
      //proceed serving regular queue to next step
      await page.locator('xpath=//*[@id="proceedBtn"]').click();
      await page.locator("#modalConfirmBtn").click();
      await page.waitForTimeout(2000);
    }

    //call next regular
    await page.locator('xpath=//*[@id="nextRegularBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000); 

    //get the text of the serving queue
    let serving = await page.locator("#servingQueue").innerText();

    //click skip button
    await page.locator("#skipBtn").click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //confirm if queue was added to the pending list
    const skippeddivs = page.locator('xpath=//*[@id="pendingRegu"]/div');
    const skippedcount = await skippeddivs.count();
    let skippedfound = false;

    for (let i = 0; i < skippedcount; i++) {
      const inqueueClient = await skippeddivs.nth(i).innerText();
      // console.log(`Div ${i + 1}: ${inqueueClient}, serving: ${serving}`);

      if (inqueueClient.includes(serving)) {
        skippedfound = true;
        break;
      }
    }

    expect(skippedfound).toBeTruthy();

    await page.waitForTimeout(2000);

  });

  test("Skip a priority queue.", async ({ page }) => {
    //visit the page
    await page.goto("https://172.26.120.49/qidra/public/");

    //login as regular user
    await page.fill("#email", "krajuanico@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //get the text of the next queue
    const nextQueue = await page.locator('xpath=//*[@id="upcomingPrio"]/div[1]').innerText();

    if (nextQueue.includes("🚫Empty")) {
      //skip test
      test.skip();
    } 

    //check if there is a serving queue
    const servingQueue = await page.locator("#servingQueue").innerText();

    //if servingQueue is not empty then click proceed button before calling next queue
    if (servingQueue !== "🚫Empty") {
      //proceed serving regular queue to next step
      await page.locator('xpath=//*[@id="proceedBtn"]').click();
      await page.locator("#modalConfirmBtn").click();
      await page.waitForTimeout(2000);
    }

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

    await page.waitForTimeout(5000);

    //confirm if queue was added to the pending list
    const skippeddivs = page.locator('xpath=//*[@id="pendingPrio"]/div');
    const skippedcount = await skippeddivs.count();
    let skippedfound = false;

    for (let i = 0; i < skippedcount; i++) {
      const inqueueClient = await skippeddivs.nth(i).innerText();
      // console.log(`Div ${i + 1}: ${inqueueClient}, serving: ${serving}`);

      if (inqueueClient.includes(serving)) {
        skippedfound = true;
        break;
      }
    }

    expect(skippedfound).toBeTruthy();

    await page.waitForTimeout(2000);

  });

  test("Serve a skipped priority queue and proceed skipped queue to next step.", async ({ page }) => {
    //visit the page
    await page.goto("https://172.26.120.49/qidra/public/");

    //login as regular user
    await page.fill("#email", "krajuanico@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    //check if pending priority is not empty
    const skippedQueues = await page.locator('#pendingPrio > div').allInnerTexts();

    if (skippedQueues.includes("🚫Empty")) {
      //call a pending priority number
      await page.locator('#nextPriorityBtn').click();
      await page.locator("#modalConfirmBtn").click();
      
      await page.waitForTimeout(2000);

      //click skip button
      await page.locator("#skipBtn").click();
      await page.locator("#modalConfirmBtn").click();
    }

    //serve skipped client
    //get text of skipped queue
    const skipped = await page.locator('#pendingPrio > div').first();
    const skippedQueue = await skipped.innerText();

    console.log(skipped);

    await page.locator('#pendingPrio > div').first().click();
    await page.locator('#popup-modal button').nth(3).click();

    console.log(skipped);

    await page.waitForTimeout(2000);

    const serving = await page.locator("#servingQueue").innerText();

    //compare serving queue and skipped queue
    console.log(serving, skipped);
    await expect(serving).toBe(skippedQueue);

    //proceed skipped client to next step after serving
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();
    
    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);

    // await page.waitForTimeout(2000);

    //login step 2 user
    await page.fill("#email", "jdcumbay@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //look for the proceed skipped client was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingPrio"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const proceededClient = await divs.nth(i).innerText();
      // console.log(`Div ${i + 1}: ${proceededClient}, ${skipped2}`);

      if (proceededClient.includes(serving)) {
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

    //login as priority user
    await page.fill("#email", "fosale@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

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

    //proceed serving client to next step
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page.url()).toContain("/auth/login");

    await page.waitForTimeout(2000);

    //login step 2 user
    await page.fill("#email", "fjlvillas@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //look for the proceed skipped client was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingRegu"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const proceededClient = await divs.nth(i).innerText();
      // console.log(`Div ${i + 1}: ${proceededClient}, ${recalled}`);

      if (proceededClient.includes(recalled)) {
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

    //login as priority user
    await page.fill("#email", "krajuanico@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

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

    await page.waitForTimeout(2000);

    //get the text of the serving queue
    const recalled = await page.locator("#servingQueue").innerText();

    //recall client
    await page.locator('xpath=//*[@id="recallBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await expect(recalled).toBe(serving);

    //proceed serving client to next step
    await page.locator('xpath=//*[@id="proceedBtn"]').click();
    await page.locator("#modalConfirmBtn").click();

    await page.waitForTimeout(2000);

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page.url()).toContain("/auth/login");

    //login step 2 user
    await page.fill("#email", "jdcumbay@dswd.gov.ph");
    await page.fill("#password", "Password@123");

    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toContain("/user");

    await page.waitForTimeout(2000);

    //look for the proceed skipped client was added to the next step
    const divs = page.locator('xpath=//*[@id="upcomingPrio"]/div');
    const count = await divs.count();
    let found = false;

    for (let i = 0; i < count; i++) {
      const proceededClient = await divs.nth(i).innerText();
      // console.log(`Div ${i + 1}: ${proceededClient}, ${recalled}`);

      if (proceededClient.includes(recalled)) {
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
  //   await page.fill("#email", "preassessregu@dswd.gov.ph");
  //   await page.fill("#password", "password");
  //

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
  //   await page.fill("#email", "preassessprio@dswd.gov.ph");
  //   await page.fill("#password", "password");
  //

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

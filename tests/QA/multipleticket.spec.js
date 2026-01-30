import { test, expect } from "@playwright/test";

test.describe.serial("Generate Ticket", () => {
  test("Generate queue number for regular client.", async ({ page }) => {
    let printCount = 0;

    // Capture console logs from all frames (including iframes)
    page.on("console", (msg) => {
      if (msg.text().includes("🖨️ Print triggered")) {
        printCount++;
        console.log(`Detected print call #${printCount}`);
      }
    });

    // Inject script that overrides print() in any new frame
    await page.addInitScript(() => {
      // Override print() in the main window
      const overridePrint = () => {
        const originalPrint = window.print;
        window.print = () => {
          console.log("🖨️ Print triggered");
          // optional: originalPrint(); // skip to avoid blocking
        };
      };

      overridePrint();

      // Also hook into future iframes
      const origCreateElement = document.createElement;
      document.createElement = function (...args) {
        const el = origCreateElement.apply(this, args);
        if (args[0].toLowerCase() === "iframe") {
          setTimeout(() => {
            try {
              const doc = el.contentDocument || el.contentWindow?.document;
              if (doc && el.contentWindow) {
                el.contentWindow.print = () => {
                  console.log("🖨️ Print triggered (iframe)");
                };
              }
            } catch (e) {
              console.warn("Could not override print in iframe", e);
            }
          }, 0);
        }
        return el;
      };
    });

    await page.goto("https://172.26.120.49/qidra/public/");

    await page.fill("#email", "bladsparrow74@gmail.com");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("heading", { name: "Generate Ticket", exact: true })).toBeVisible();

    //for loop to generate 20 tickets and click escape button after firing print dialog
    for (let i = 0; i < 10; i++) {
      await page.getByRole("button", { name: /crisis intervention section/i }).click();
      await page.getByRole("button", { name: /^regular$/i }).click();

      // Wait a bit for window.print() to fire
      await page.waitForTimeout(5000);
      
      // expect(printCount).toBe(2);
      // console.log("✅ Test passed: Print was triggered!");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(2000);

      await page.keyboard.press("Escape");
    }

    //single ticket generation
    // await page.getByRole("button", { name: /crisis intervention section/i }).click();
    // await page.getByRole("button", { name: /^regular$/i }).click();

    // // Wait a bit for window.print() to fire
    // await page.waitForTimeout(10000);
    
    // expect(printCount).toBe(2);
    // console.log("✅ Test passed: Print was triggered!");

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

  test("Generate queue number for priority client.", async ({ page }) => {
    let printCount = 0;

    // Capture console logs from all frames (including iframes)
    page.on("console", (msg) => {
      if (msg.text().includes("🖨️ Print triggered")) {
        printCount++;
        console.log(`Detected print call #${printCount}`);
      }
    });

    // Inject script that overrides print() in any new frame
    await page.addInitScript(() => {
      // Override print() in the main window
      const overridePrint = () => {
        const originalPrint = window.print;
        window.print = () => {
          console.log("🖨️ Print triggered");
          // optional: originalPrint(); // skip to avoid blocking
        };
      };

      overridePrint();

      // Also hook into future iframes
      const origCreateElement = document.createElement;
      document.createElement = function (...args) {
        const el = origCreateElement.apply(this, args);
        if (args[0].toLowerCase() === "iframe") {
          setTimeout(() => {
            try {
              const doc = el.contentDocument || el.contentWindow?.document;
              if (doc && el.contentWindow) {
                el.contentWindow.print = () => {
                  console.log("🖨️ Print triggered (iframe)");
                };
              }
            } catch (e) {
              console.warn("Could not override print in iframe", e);
            }
          }, 0);
        }
        return el;
      };
    });

    await page.goto("https://172.26.120.49/qidra/public/");

    await page.fill("#email", "cispacd@dswd.gov.ph");
    await page.fill("#password", "Password@123");
    await page.getByLabel("I agree to the Terms and Conditions.").check();

    await page.getByRole("button", { name: "Login" }).click();

    await expect(
      page.getByRole("heading", { name: "Generate Ticket", exact: true })
    ).toBeVisible();

    //for loop to generate 20 tickets and click escape button after firing print dialog
    for (let i = 0; i < 10; i++) {
      await page.getByRole("button", { name: /crisis intervention section/i }).click();
      await page.getByRole("button", { name: /^priority$/i }).click();

      // Wait a bit for window.print() to fire
      await page.waitForTimeout(5000);
      
      // expect(printCount).toBe(2);
      // console.log("✅ Test passed: Print was triggered!");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(2000);

      await page.keyboard.press("Escape");
    }

    //single ticket generation
    // await page.getByRole("button", { name: /crisis intervention section/i }).click();
    // await page.getByRole("button", { name: /^priority$/i }).click();

    // // Wait a bit for window.print() to fire
    // await page.waitForTimeout(10000);
    
    // expect(printCount).toBe(2);

    // console.log("✅ Test passed: Print was triggered!");

    //logout
    await page.locator('xpath=/html/body/div[1]/div/button').click();
    await page.getByRole("link", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

});

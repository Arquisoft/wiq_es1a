const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");
const feature = loadFeature("./features/logout.feature");

let page;
let browser;

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({ headless: "new", slowMo: 100 })
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();

    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 });

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.method() === "OPTIONS") {
        req.respond({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
          },
        });
      } else if (req.url().includes("/questions")) {
        req.respond({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          contentType: "application/json",
          body: JSON.stringify([
            {
              pregunta: "Test question",
              respuestas: [
                "Test answer 1",
                "Test answer 2",
                "Test answer 3",
                "Test correct answer",
              ],
              correcta: "Test correct answer",
            },
            {
              pregunta: "Test question 2",
              respuestas: [
                "Test answer 1",
                "Test answer 2",
                "Test answer 3",
                "Test correct answer",
              ],
              correcta: "Test correct answer",
            },
          ]),
        });
      } else {
        req.continue();
      }
    });
  });

  let username;
  let password;

  test("The user can logout", ({ given, when, then }) => {
    given("A logged-in user", async () => {
      username = "testuser";
      password = "Testpassword1";
      await page.waitForSelector("#login-username");
      await page.type("#login-username", username);
      await page.waitForSelector("#login-password");
      await page.type("#login-password", password);
      await page.click("button", { text: "Login" });
    });

    when("I click on the Logout link", async () => {
      await page.waitForTimeout(10000);
      await page.waitForSelector("#menu-button-\\:r3\\:");
      await page.click("#menu-button-\\:r3\\:");
      await page.waitForSelector("#menu-list-\\:r3\\:-menuitem-\\:r9\\:");
      await page.click("#menu-list-\\:r3\\:-menuitem-\\:r9\\:");
      //await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    then(
      "The user should be logged out and the Login screen should be shown",
      async () => {
        const url = page.url();
        expect(url).toContain("/login");
      }
    );
  });

  afterAll(async () => {
    browser.close();
  });
});

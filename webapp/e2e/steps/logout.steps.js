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
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 10000 });

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  let username;
  let password;
    
  test("The user can logout", ({ given, when, then }) => {
    given("A logged-in user", async () => {
      username = "testuser";
      password = "Testpassword1";
      await page.waitForSelector("#login-username");
      await page.type("#login-username", username);
      await page.waitForSelector("#register-password");
      await page.type("#register-password", password);
      await page.click("button", { text: "Login" });
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    when("I click on the Logout link", async () => {
      await page.waitForSelector('[data-testid="profile-menu"]');
      await page.click('[data-testid="profile-menu"]');
      await page.waitForSelector('[data-testid="logout-link"]');
      await page.click('[data-testid="logout-link"]');
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    then("The user should be logged out", async () => {
      const url = page.url();
      expect(url).toContain("/login");
    });
  });

  afterAll(async () => {
    browser.close();
  });
});

const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");
const feature = loadFeature("./features/register-form.feature");

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

  test("The user is registered in the site", ({ given, when, then }) => {
    let username;
    let password;

    given("A logged-in user", async () => {
      await page.waitForSelector("#login-username");
      await page.type("#login-username", "testuser");
      await page.waitForSelector("#register-password");
      await page.type("#register-password", "Testpassword1");
      await page.click("button", { text: "Login" });
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    when("The user clicks on their profile", async () => {
      await page.waitForSelector('[data-testid="profile-menu"]');
      await page.click('[data-testid="profile-menu"]');
      await page.waitForSelector('[data-testid="profile-link"]');
      await page.click('[data-testid="profile-link"]');
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    then("The user's profile page should be displayed", async () => {
      const url = page.url();
      expect(url).toContain("/perfil/testuser");
    });
  });

  afterAll(async () => {
    browser.close();
  });
});

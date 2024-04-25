const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");
const feature = loadFeature("./features/login-form.feature");

let page;
let browser;

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({ headless: 'new', slowMo: 100 })
      : await puppeteer.launch({ headless: 'new', slowMo: 100 });
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

    given("A registered user", async () => {
      username = "testuser";
      password = "Testpassword1";
    });

    when("I fill the data in the form and press submit", async () => {
      await page.waitForSelector('#login-username');
      await page.type('#login-username', username);
      await page.waitForSelector('#login-password');
      await page.type('#login-password', password);
      await page.click("button", { text: "Login" });
    });

    then("The home screen should be shown", async () => {
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toContain("/home");
      browser.close();
    });
  });

  afterAll(async () => {
    browser.close();
  });
});
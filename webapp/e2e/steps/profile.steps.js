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

  test("The user is logged in and can view their profile", ({ given, when, then }) => {
    let username;
    let password;

    given("A registered user", async () => {
      username = "pablo";
      password = "pabloasw";
      await expect(page).toClick("a", { text: "Regístrate" });
    });

    when("I press the Profile link", async () => {
      username = "testuser";
      password = "Testpassword1";
      await page.waitForSelector('#login-username');
      await page.type('#login-username', username);
      await page.waitForSelector('#register-password');
      await page.type('#register-password', password);
      await page.click("button", { text: "Login" });
    });

    then("The user's profile shoud be shown on screen", async () => {
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
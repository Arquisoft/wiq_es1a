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

  test("The user is not registered in the site", ({ given, when, then }) => {
    let username;
    let password;

    given("An unregistered user", async () => {
      await expect(page).toClick("a", { text: "Regístrate" });
    });

    when("I fill the data in the form and press submit", async () => {
      username = "papapa";
      password = "Testpassword1";
      await page.waitForSelector('#register-username');
      await page.type('#register-username', username);
      await page.waitForSelector('#register-password');
      await page.type('#register-password', password);
      await page.waitForSelector('#register-pass2');
      await page.type('#register-pass2', password);
      await page.click("button", { text: "Registrarse" });
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

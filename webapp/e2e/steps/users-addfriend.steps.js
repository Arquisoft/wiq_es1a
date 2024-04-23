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

  test("The user can add a friend", ({ given, when, then }) => {
    let username;
    let password;

    given("A logged-in user", async () => {
      username="testuser";
      password="Testpassword1";
      await page.waitForSelector("#login-username");
      await page.type("#login-username", username);
      await page.waitForSelector("#login-password");
      await page.type("#login-password", password);
      await page.click("button", { text: "Login" });
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    when("I click on the Users link and add a friend", async () => {
      await page.waitForSelector('[data-testid="users"]');
      await page.click('[data-testid="users"]');
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    then("The user should disappear from the Users page", async () => {
      const url = page.url();
      expect(url).toContain("/social/");
      
      const numUsersBefore = await page.$$eval('tr', (rows) => rows.length);

      await page.click('[data-testid="add-friend-button-0"]');
      await page.waitForTimeout(1000);

      const numUsersAfter = await page.$$eval('tr', (rows) => rows.length);

      expect(numUsersAfter).toBeLessThan(numUsersBefore);
    });
  });

  afterAll(async () => {
    browser.close();
  });
});

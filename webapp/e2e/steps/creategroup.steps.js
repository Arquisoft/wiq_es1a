const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");
const feature = loadFeature("./features/creategroup.feature");

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

  test("The user can create a group", ({ given, when, then }) => {
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

    when("I click on the Groups link and create a group", async () => {
      await page.click('[data-testid="groups"]');
      await page.waitForNavigation();

      await page.waitForSelector('[name="name"]');
      await page.type('[name="name"]', "Test Group");
      await page.click("button", { text: "Crear" });
      await page.waitForTimeout(1000);
    });

    then("The Group should be shown on the My Groups page", async () => {
      await page.click('[data-testid="my-groups"]');
      await page.waitForNavigation();

      const groupExists = await page.evaluate(() => {
        const groupName = "Test Group";
        const groups = Array.from(document.querySelectorAll("tbody tr td:first-child"));
        return groups.some(td => td.textContent === groupName);
      });

      expect(groupExists).toBe(true);
    });
  });

  afterAll(async () => {
    browser.close();
  });
});

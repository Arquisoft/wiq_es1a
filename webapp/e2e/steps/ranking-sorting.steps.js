const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");
const feature = loadFeature("./features/ranking-sorting.feature");

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

  test("The user can see the Ranking page and change sorting filter", ({ given, when, then }) => {
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

    when("I click on the Ranking link and in Sort by Total Points", async () => {
      await page.waitForSelector('[data-testid="ranking-link"]');
      await page.click('[data-testid="ranking-link"]');
      await page.select('[data-testid="combobox"]', "totalPoints");
      await page.waitForSelector('th', { text: "Puntos totales" });
      await page.waitForSelector('td');
      await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    then("The ranking (sorted by Total Points) should be shown on screen", async () => {
      const url = page.url();
      expect(url).toContain("/ranking");
      const displayedField = await page.evaluate(() => {
        return document.querySelector('th').textContent;
      });
      expect(displayedField).toContain("Puntos totales");
    });
  });

  afterAll(async () => {
    browser.close();
  });
});

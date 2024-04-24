const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");

const feature = loadFeature("./features/play-calculator.feature");

let page;
let browser;

defineFeature(feature, (test) => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });

    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
    });
  });
  let username;
  let password;
  test("The user can answer a question on Human Calculator mode", ({ given, when, then }) => {
    given("A logged-in user", async () => {
      username = "testuser";
      password = "Testpassword1";
      await page.waitForSelector("#login-username");
      await page.type("#login-username", username);
      await page.waitForSelector("#login-password");
      await page.type("#login-password", password);
      await page.click("button", { text: "Login" });
      
      //await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    when("I play on Human Calculator mode and answer incorrectly", async () => {
      await page.waitForTimeout(1000);
      await page.waitForXPath('//button[contains(text(), "Calculadora humana")]');
      const button = await page.$x('//button[contains(text(), "Calculadora humana")]');
      await button[0].click();
      //await page.waitForNavigation({ waitUntil: "networkidle0" });

      await page.waitForXPath('//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]');
      const jugarButton = await page.$x('//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]');
      await jugarButton[0].click();
      await page.waitForSelector('[data-testid="operation"]');

      const answer = -1;

      await page.type('[data-testid="answer-input"]', answer.toString());

      await page.click('[data-testid="submit-button"]');
    });

    then("The game ends", async () => {
      await page.waitForSelector('[data-testid="play-again-button"]');

      const gameOverMessage = await page.evaluate(() => {
        return document.querySelector('[data-testid="play-again-button"]').textContent;

      });

      expect(gameOverMessage).toContain("Jugar de nuevo");
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});

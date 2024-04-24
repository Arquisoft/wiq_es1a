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
      await page.waitForNavigation();
    });

    when("I play on Human Calculator mode and answer incorrectly", async () => {
      await page.click('[data-testid="calculator"]');
      await page.waitForNavigation();

      await page.waitForSelector('[data-testid="operation"]');

      const operation = await page.evaluate(() => {
        return document.querySelector('[data-testid="operation"]').textContent;
      });

      const answer = -1;

      await page.type('[data-testid="answer-input"]', answer.toString());

      await page.click('[data-testid="submit-button"]');
    });

    then("The game ends", async () => {
      await page.waitForSelector('[data-testid="game-over"]');

      const gameOverMessage = await page.evaluate(() => {
        return document.querySelector('[data-testid="game-over"]').textContent;
      });

      expect(gameOverMessage).toContain("¡Juego terminado!");
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});

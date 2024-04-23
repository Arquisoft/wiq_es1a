const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");

const feature = loadFeature("./features/play-classic.feature");

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

  test("The user can answer a question", ({ given, when, then }) => {
    given("A logged-in user", async () => {

      await page.type("#login-username", "testuser");
      await page.type("#login-password", "Testpassword1");
      await page.click("button", { text: "Login" });
      await page.waitForNavigation();
    });

    when("I play on Classic mode and click on an answer", async () => {
      await page.click('[data-testid="classic-mode"]');
      await page.waitForNavigation();

      await page.waitForSelector('[data-testid="question"]');

      await page.click('[data-testid="answer-button"]');
    });

    then("The right answer should be colored green", async () => {
      await page.waitForTimeout(3000);

      const correctAnswerColor = await page.evaluate(() => {
        const answerButton = document.querySelector('[data-testid="answer-button"]');
        return window.getComputedStyle(answerButton).getPropertyValue("background-color");
      });

      expect(correctAnswerColor).toMatch("rgb(16, 255, 0)");
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});

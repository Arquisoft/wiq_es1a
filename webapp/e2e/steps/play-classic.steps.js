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
  let username;
  let password;
  test("The user can answer a question on Classic mode", ({ given, when, then }) => {
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

    when("I play on Classic mode and click on an answer", async () => {
      await page.click('[data-testid="classic"]');
      await page.waitForNavigation();

      await page.waitForSelector('[data-testid="question"]');

      await page.click('[data-testid="answer-button"]');
    });

    then("The right answer should be colored green", async () => {
        await page.waitForTimeout(3000);
      
        const answerButtons = await page.$$('[data-testid^="answer-button"]');
        let isGreen = false;
      
        for (const button of answerButtons) {
          const buttonColor = await button.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue("background-color");
          });
          if (buttonColor === "rgb(16, 255, 0)") {
            isGreen = true;
            break;
          }
        }
      
        expect(isGreen).toBe(true);
      });
  });

  afterAll(async () => {
    await browser.close();
  });
});

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
      //await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    when("I play on Classic mode and click on an answer", async () => {
      await page.waitForTimeout(1000);
      await page.waitForXPath('//button[contains(text(), "Clásico")]');
      const classicButton = await page.$x('//button[contains(text(), "Clásico")]');
      await classicButton[0].click();
      //await page.waitForNavigation({ waitUntil: "networkidle0" });

      await page.waitForXPath('//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]');
      const jugarButton = await page.$x('//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]');
      await jugarButton[0].click();

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
          if (buttonColor.includes("rgb(44, 122, 123)")) {
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

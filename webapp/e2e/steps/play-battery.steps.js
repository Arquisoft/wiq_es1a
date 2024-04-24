const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");

const feature = loadFeature("./features/play-battery.feature");

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
  let firstquestion;
  test("The user can answer a question on Battery mode", ({ given, when, then }) => {
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

    when("I play on Battery mode and click on an answer", async () => {
      await page.waitForTimeout(1000);
      await page.waitForXPath('//button[contains(text(), "Batería de sabios")]');
      const button = await page.$x('//button[contains(text(), "Batería de sabios")]');
      await button[0].click();
      //await page.waitForNavigation({ waitUntil: "networkidle0" });

      await page.waitForXPath('//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]');
      const jugarButton = await page.$x('//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]');
      await jugarButton[0].click();

      await page.waitForSelector('[data-testid="question"]');

      firstquestion = await page.evaluate(element => 
        element.textContent, await page.$('[data-testid="question"]'));

      await page.click('[data-testid="answer-button-0"]');
    });

    then("The next question should be loaded on screen", async () => {
        await page.waitForTimeout(3000);

        await page.waitForSelector('[data-testid="question"]');

        let secondquestion = await page.evaluate(element => 
          element.textContent, await page.$('[data-testid="question"]'));

        let areDifferent=firstquestion !== secondquestion;
        expect(areDifferent).toBe(true);
      });
  });

  afterAll(async () => {
    await browser.close();
  });
});

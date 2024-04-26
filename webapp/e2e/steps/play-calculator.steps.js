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
      ? await puppeteer.launch({ headless: "new", slowMo: 100 })
      : await puppeteer.launch({ headless: "new", slowMo: 100 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });

    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
    });

    await page.evaluate(() => {
      localStorage.setItem("username","testuser");
      localStorage.setItem("token","abcdefg");
    });
    
    await page.goto("http://localhost:3000/home/calculadora", {
      waitUntil: "networkidle0",
    });

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.method() === "OPTIONS") {
        req.respond({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
          },
        });
      } else if (req.url().includes("/questions")) {
        req.respond({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          contentType: "application/json",
          body: JSON.stringify([
            {
              pregunta: "Test question",
              respuestas: [
                "Test answer 1",
                "Test answer 2",
                "Test answer 3",
                "Test correct answer",
              ],
              correcta: "Test correct answer",
            },
            {
              pregunta: "Test question 2",
              respuestas: [
                "Test answer 1",
                "Test answer 2",
                "Test answer 3",
                "Test correct answer",
              ],
              correcta: "Test correct answer",
            },
          ]),
        });
      } else {
        req.continue();
      }
    });
  });
  test("The user can answer a question on Human Calculator mode", ({
    given,
    when,
    then,
  }) => {
    given("A logged-in user", async () => {

      await page.waitForTimeout(1000);
      await page.waitForXPath(
        '//button[contains(text(), "Calculadora humana")]'
      );
      const button = await page.$x(
        '//button[contains(text(), "Calculadora humana")]'
      );
      await button[0].click();

      await page.waitForXPath(
        '//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]'
      );
      const jugarButton = await page.$x(
        '//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]'
      );
      await jugarButton[0].click();
      //await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    when("I play on Human Calculator mode and answer incorrectly", async () => {
      
      //await page.waitForNavigation({ waitUntil: "networkidle0" });

      
      await page.waitForSelector('[data-testid="operation"]');

      const answer = -999;

      await page.type('[data-testid="answer-input"]', answer.toString());

      await page.click('[data-testid="submit-button"]');
    });

    then("The game ends", async () => {
      await page.waitForSelector('[data-testid="play-again-button"]');
      const gameOverMessage = await page.evaluate(() => {
        return document.querySelector('[data-testid="play-again-button"]')
          .textContent;
      });

      expect(gameOverMessage).toContain("Jugar de nuevo");
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});

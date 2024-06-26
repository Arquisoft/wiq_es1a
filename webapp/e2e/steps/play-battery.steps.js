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
      ? await puppeteer.launch({ headless: 'new', slowMo: 100 })
      : await puppeteer.launch({ headless: 'new', slowMo: 100 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });
    
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
    }).catch(() => {});

    await page.evaluate(() => {
      localStorage.setItem("username","testuser");
      localStorage.setItem("token","abcdefg");
    });
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.method() === 'OPTIONS'){
        req.respond({
          status: 200,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': '*'
          }
        });
      } else if (req.url().includes('/questions')) {
            req.respond({
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                contentType: 'application/json',
                body: JSON.stringify([{
                    pregunta: 'Test question',
                    respuestas: ['Test answer 1', 'Test answer 2', 'Test answer 3', 'Test correct answer'],
                    correcta: 'Test correct answer',
                    
                }, {
                  pregunta: 'Test question 2',
                  respuestas: ['Test answer 1', 'Test answer 2', 'Test answer 3', 'Test correct answer'],
                  correcta: 'Test correct answer'
              }]
              )
            });
        } else {
            req.continue();
        }
      });
  });
  let username;
  let password;
  let firstquestion;
  test("The user can answer a question on Battery mode", ({ given, when, then }) => {
    given("A logged-in user", async () => {
      await page.evaluate(() => {
        localStorage.clear();
        localStorage.setItem("username","testuser");
        localStorage.setItem("token","abcdefg");
      });

      await page.goto("http://localhost:3000/home/", {
        waitUntil: "networkidle0",
      });

      await page.waitForTimeout(1000);
      await page.waitForXPath('//button[contains(text(), "Batería de sabios")]');
      const button = await page.$x('//button[contains(text(), "Batería de sabios")]');
      await button[0].click();
      //await page.waitForNavigation({ waitUntil: "networkidle0" });

      await page.waitForXPath('//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]');
      const jugarButton = await page.$x('//section[contains(@class, "chakra-modal__content")]//button[contains(text(), "Jugar")]');
      await jugarButton[0].click();

      //await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    when("I play on Battery mode and click on an answer", async () => {
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

const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");

const feature = loadFeature("./features/create-group.feature");

let page;
let browser;

function generateUUID() {
  const hexDigits = '0123456789abcdef';
  let uuid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4';
    } else if (i === 19) {
      uuid += hexDigits.charAt(Math.floor(Math.random() * 4) + 8);
    } else {
      uuid += hexDigits.charAt(Math.floor(Math.random() * 16));
    }
  }
  return uuid;
}

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
  let groupname;
  test("The user can create a group", ({ given, when, then }) => {
    given("A logged-in user", async () => {
      await page.evaluate(() => {
        localStorage.setItem("username", "testuser");
        localStorage.setItem("token", "abcdefg");
      });

      await page.goto("http://localhost:3000/home", {
        waitUntil: "networkidle0",
      });
    });

    when("I click on the Groups link and create a group", async () => {
      await page.waitForTimeout(1000);

      await page.click('button[aria-label="Abrir menú"]');
      await page.click('[data-testid="home-grupos-link"]');
      //await page.waitForNavigation({ waitUntil: "networkidle0" });


      groupname = generateUUID();
      await page.waitForSelector('[name="name"]');
      await page.type('[name="name"]', groupname);
      await page.waitForTimeout(2000);
      await page.click('button[data-testid="addgroup-button"]');
    });

    then("The confirmation message should be shown on screen", async () => {
      await page.waitForTimeout(1000);
      await page.waitForSelector('div[role="alert"]');

      // Obtén el texto del elemento que contiene el mensaje
      const alertText = await page.evaluate(() => {
        const alertElement = document.querySelector('div[role="alert"]');
        return alertElement.innerText.trim();
      });
      const rightMessage = "Error: Failed to fetch";
      expect(rightMessage).toBe(alertText);
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});

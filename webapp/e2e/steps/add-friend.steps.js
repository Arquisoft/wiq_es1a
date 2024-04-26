const puppeteer = require("puppeteer");
const { defineFeature, loadFeature } = require("jest-cucumber");
const setDefaultOptions = require("expect-puppeteer").setDefaultOptions;
const { expect } = require("expect-puppeteer");

const feature = loadFeature("./features/add-friend.feature");

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
  let username;
  let password;
  let userCountBefore;
  test("The user can add a friend", ({ given, when, then }) => {
    given("A logged-in user and another user", async () => {
      await expect(page).toClick("a", { text: "Regístrate" });
      username = "Friend";
      password = "Friend123";
      await page.waitForSelector("#register-username");
      await page.type("#register-username", username);
      await page.waitForSelector("#register-password");
      await page.type("#register-password", password);
      await page.waitForSelector("#register-pass2");
      await page.type("#register-pass2", password);
      await page.click("button", { text: "Registrarse" });

      await page.waitForTimeout(1000);

      await page.click('button[aria-label="Abrir menú"]');
      await page.waitForSelector('[data-testid="home-logout-link"]');
      await page.click('[data-testid="home-logout-link"]');

      username = "testuser";
      password = "Testpassword1";
      await page.waitForSelector("#login-username");
      await page.type("#login-username", username);
      await page.waitForSelector("#login-password");
      await page.type("#login-password", password);
      await page.click("button", { text: "Login" });
      //await page.waitForNavigation({ waitUntil: "networkidle0" });
    });

    when("I add the user as a friend", async () => {
      await page.waitForTimeout(1000);

      localStorage.setItem("username", "testuser");
      localStorage.setItem("token", "testtoken");

      await page.goto("http://localhost:3000/social/usuarios", {
        waitUntil: "networkidle0",
      });

      await page.click('button[aria-label="Abrir menú"]');
      await page.click('[data-testid="home-usuarios-link"]');
      //await page.waitForNavigation({ waitUntil: "networkidle0" });
      await page.waitForTimeout(1000);

      const userRowsBefore = await page.$$('[data-testid^="user-row-"]');
      userCountBefore = userRowsBefore.length;

      await page.waitForSelector('[data-testid^="add-friend-button-"]');
      await page.click('[data-testid^="add-friend-button-"]');
    });

    then("The user should disappear from the Users page", async () => {
      await page.waitForTimeout(1000);
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

      const userRowsAfter = await page.$$('[data-testid^="user-row-"]');
      const userCountAfter = userRowsAfter.length;

      expect(userCountAfter).toBe(userCountBefore - 1);
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});

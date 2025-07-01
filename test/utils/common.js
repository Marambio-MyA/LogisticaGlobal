import dotenv from "dotenv";
import { By, until } from "selenium-webdriver";

dotenv.config();
const URL = process.env.TEST_URL;
const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

//Devuelve un string con la fecha y hora actual en formato [YYYY-MM-DD hh:mm:ss]
export function getTimestamp() {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0];
  return `[${date} ${time}]`;
}

// Inicia sesión en la aplicación usando Puppeteer
export async function login(page) {
  await page.goto(URL);

  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', EMAIL);

  await page.waitForSelector('input[type="password"]');
  await page.type('input[type="password"]', PASSWORD);

  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent.trim() === "Entrar"
    );
    if (btn) btn.click();
  });
}

export async function navagation_to_incidents(page) {
  await page.waitForSelector("ul.MuiList-root");
  await page.evaluate(() => {
    const menu = [...document.querySelectorAll("li")].find(
      (li) => li.textContent.trim() === "Incidentes"
    );
    menu?.click();
  });
}

export async function navagation_to_users(page) {
  await page.waitForSelector('ul.MuiList-root');
    await page.evaluate(() => {
      const menu = [...document.querySelectorAll('li')].find(li => li.textContent.trim() === 'Usuarios');
      menu?.click();
    });
}

export async function login_selenium(driver) {
  await driver.get(URL);

  const emailInput = await driver.wait(until.elementLocated(By.name("email")), 5000);
  await emailInput.clear();
  await emailInput.sendKeys(EMAIL);

  const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 5000);
  await passwordInput.clear();
  await passwordInput.sendKeys(PASSWORD);
  const loginBtn = await driver.findElement(
    By.xpath("//button[normalize-space()='Entrar']")
  );
  await loginBtn.click();

  try {
    await driver.wait(until.urlContains("/dashboard"), 5000);
  } catch (_) {
  }
}

export async function navagation_to_incidents_selenium(driver) {
  await driver.wait(until.elementLocated(By.css('ul.MuiList-root')), 5000);
  const menuItems = await driver.findElements(By.css('ul.MuiList-root li'));
  for (const item of menuItems) {
    const text = await item.getText();
    if (text.trim() === 'Incidentes') {
      await item.click();
      break;
    }
  }
  await driver.wait(until.urlContains('/incidentes'), 5000);
}
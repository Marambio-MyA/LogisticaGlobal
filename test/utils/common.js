import dotenv from "dotenv";

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

export default {
  getTimestamp,
  login,
  navagation_to_incidents,
};

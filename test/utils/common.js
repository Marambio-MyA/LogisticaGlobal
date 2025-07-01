require('dotenv').config();


const URL = process.env.TEST_URL;
const EMAIL = process.env.TEST_EMAIL;
const PASSWORD = process.env.TEST_PASSWORD;

//Devuelve un string con la fecha y hora actual en formato [YYYY-MM-DD hh:mm:ss]
function getTimestamp() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  return `[${date} ${time}]`;
}

// Inicia sesión en la aplicación usando Puppeteer
async function login(page) {
  await page.goto(URL);

  await page.waitForSelector('#email-input');
  await page.type('#email-input', EMAIL);

  await page.waitForSelector('#password-input');
  await page.type('#password-input', PASSWORD);

  await page.waitForSelector('#login-button');
  await page.click('#login-button');
}

async function navagation_to_incidents(page) {
  await page.waitForSelector('#drawer-incidentes-btn');
  await page.click('#drawer-incidentes-btn');
}

async function navagation_to_users(page) {
  await page.waitForSelector('#drawer-usuarios-btn');
  await page.click('#drawer-usuarios-btn');
}

module.exports = {
  getTimestamp,
  login,
  navagation_to_incidents,
  navagation_to_users,
};

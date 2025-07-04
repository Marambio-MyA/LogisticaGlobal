import dotenv from "dotenv";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import chalk from "chalk";
import { getTimestamp } from "../utils/common.js";

dotenv.config();

const URL = process.env.TEST_URL;
const SUCCESS_EMAIL = process.env.TEST_EMAIL;
const SUCCESS_PASSWORD = process.env.TEST_PASSWORD;

const loginCases = [
  {
    name: "Email incorrecto",
    email: "correo@noexiste.com",
    password: "contraseñaCorrecta",
    expectSuccess: false,
  },
  {
    name: "Contraseña incorrecta",
    email: "usuario@ejemplo.com",
    password: "contraseñaIncorrecta",
    expectSuccess: false,
  },
  { name: "Campos vacíos", email: "", password: "", expectSuccess: false },
  {
    name: "Solo email válido",
    email: "usuario@ejemplo.com",
    password: "",
    expectSuccess: false,
  },
  {
    name: "Solo contraseña",
    email: "",
    password: "contraseñaCorrecta",
    expectSuccess: false,
  },
  {
    name: "Login exitoso",
    email: SUCCESS_EMAIL,
    password: SUCCESS_PASSWORD,
    expectSuccess: true,
  },
];

export async function runLoginTests() {
  let passed = 0;
  let failed = 0;

  console.log(`${getTimestamp()} ▶ [login-test] Iniciando ${loginCases.length} casos de login…`);

  for (let i = 0; i < loginCases.length; i++) {
    const testCase = loginCases[i];
    const caseNumber = i + 1;

    const options = new chrome.Options();
    options.addArguments("--no-sandbox", "--disable-dev-shm-usage", "--headless");

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    try {
      console.log(`${getTimestamp()} ▶ [login-test] Case ${caseNumber}: "${testCase.name}"`);
      await driver.get(URL);

      const emailInput = await driver.wait(until.elementLocated(By.name("email")), 5000);
      await emailInput.clear();
      await emailInput.sendKeys(testCase.email);

      const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 5000);
      await passwordInput.clear();
      await passwordInput.sendKeys(testCase.password);

      const loginBtn = await driver.findElement(By.xpath("//button[normalize-space()='Entrar']"));
      await loginBtn.click();

      let loginExitoso = false;
      try {
        await driver.wait(until.urlContains("/dashboard"), 5000);
        loginExitoso = true;
      } catch (_) {}

      const finalUrl = await driver.getCurrentUrl();

      if (testCase.expectSuccess && loginExitoso) {
        console.log(`${getTimestamp()} ` + chalk.green("✔ Resultado esperado: login exitoso."));
        try {
          const logoutBtn = await driver.findElement(By.xpath("//button[normalize-space()='Cerrar sesión']"));
          await logoutBtn.click();
        } catch (_) {}
        passed++;
      } else if (!testCase.expectSuccess && !loginExitoso) {
        console.log(`${getTimestamp()}    ` + chalk.yellow("✔ Resultado esperado: login rechazado."));
        passed++;
      } else {
        console.log(`${getTimestamp()}    ` + chalk.red(`✖ Resultado inesperado (URL final: ${finalUrl})`));
        failed++;
      }

    } catch (err) {
      console.error(`${getTimestamp()}    ` + chalk.red("✖ Error en el test case:"), err.message);
      failed++;
    } finally {
      await driver.quit();
    }
  }

  return { passed, failed };
}
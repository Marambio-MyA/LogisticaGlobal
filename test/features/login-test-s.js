import dotenv from "dotenv";
import { Builder, By, until } from "selenium-webdriver";
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
  console.log({ SUCCESS_EMAIL, SUCCESS_PASSWORD, URL });
  const driver = await new Builder().forBrowser("chrome").build();
  let passed = 0;
  let failed = 0;

  console.log(
    `${getTimestamp()} ▶ Iniciando ${loginCases.length} pruebas de login...\n`
  );

  for (let i = 0; i < loginCases.length; i++) {
    const testCase = loginCases[i];
    console.log(`${getTimestamp()} ▶ Prueba ${i + 1}: "${testCase.name}"`);

    try {
      await driver.get(URL);

      const emailInput = await driver.findElement(By.name("email"));
      await emailInput.clear();
      await emailInput.sendKeys(testCase.email);

      const passInput = await driver.findElement(
        By.css('input[type="password"]')
      );
      await passInput.clear();
      await passInput.sendKeys(testCase.password);

      // Click en el botón "Entrar"
      const buttons = await driver.findElements(By.tagName("button"));
      for (const btn of buttons) {
        const text = await btn.getText();
        if (text.trim() === "Entrar") {
          await btn.click();
          break;
        }
      }

      // Espera de navegación
      let loginExitoso = false;
      try {
        // Intenta esperar el dashboard por URL
        await driver.wait(until.urlContains("/dashboard"), 5000);
        loginExitoso = true;
      } catch (_) {
        // O intenta por un elemento clave del dashboard
        try {
          await driver.wait(
            until.elementLocated(By.css('[data-testid="dashboard-header"]')),
            3000
          );
          loginExitoso = true;
        } catch {
          loginExitoso = false;
        }
      }

      const finalUrl = await driver.getCurrentUrl();

      // Validación
      if (testCase.expectSuccess && loginExitoso) {
        console.log(chalk.green(`✔ Login exitoso como se esperaba`));
        // Click en "Cerrar sesión"
        const logoutButtons = await driver.findElements(By.tagName("button"));
        for (const btn of logoutButtons) {
          const text = await btn.getText();
          if (text.trim() === "Cerrar sesión") {
            await btn.click();
            break;
          }
        }
        passed++;
      } else if (!testCase.expectSuccess && !loginExitoso) {
        console.log(chalk.yellow(`✔ Login rechazado como se esperaba`));
        passed++;
      } else {
        console.log(
          chalk.red(`✖ Resultado inesperado (URL final: ${finalUrl})`)
        );
        failed++;
      }
    } catch (err) {
      console.log(
        chalk.red(`✖ Error al ejecutar caso "${testCase.name}": ${err.message}`)
      );
      failed++;
    }

    console.log(""); // línea en blanco
  }

  await driver.quit();
  console.log(
    `${getTimestamp()} ✅ Finalizado. Pasaron: ${passed} | Fallaron: ${failed}`
  );
  return { passed, failed };
}

runLoginTests();

import dotenv from "dotenv";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import chalk from "chalk";
import {
  getTimestamp,
  login,
  navagation_to_incidents,
} from "../utils/common.js";

dotenv.config();

// Datos esperados
const INCIDENT_LOCATION = "Sala de servidores - Piso 3";
const INCIDENT_DESCRIPTION =
  "El servidor principal presenta sobrecalentamiento constante";
const INCIDENT_TYPE = "colision";

export async function runViewIncidentTests() {
  const options = new chrome.Options().headless();
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  let testPassed = false;

  try {
    console.log(`${getTimestamp()} ▶ [view-incident-test] Iniciando sesión...`);
    await login(driver);

    console.log(
      `${getTimestamp()} ▶ [view-incident-test] Navegando a Incidentes...`
    );
    await navagation_to_incidents(driver);

    await driver.wait(
      until.elementsLocated(By.css("tbody.MuiTableBody-root tr")),
      5000
    );

    console.log(
      `${getTimestamp()} ▶ [view-incident-test] Seleccionando último incidente...`
    );
    const rows = await driver.findElements(
      By.css("tbody.MuiTableBody-root tr")
    );
    const lastRow = rows[rows.length - 1];
    const viewBtn = await lastRow.findElement(
      By.css('[data-testid="VisibilityIcon"]')
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      viewBtn
    );
    await viewBtn.click();

    console.log(
      `${getTimestamp()} ▶ [view-incident-test] Verificando datos del incidente...`
    );

    // Función auxiliar: obtener valor de input o textarea por label
    async function getInputValueByLabel(driver, labelText) {
      return await driver.executeScript((label) => {
        const labels = Array.from(document.querySelectorAll("label"));
        const target = labels.find((l) => l.textContent.trim() === label);
        if (!target) return null;
        const input = target.parentElement.querySelector("input, textarea");
        return input?.value ?? null;
      }, labelText);
    }

    const location = await getInputValueByLabel(driver, "Ubicación");
    const description = await getInputValueByLabel(driver, "Descripción");
    const tipo = await getInputValueByLabel(driver, "Tipo de Incidente");

    // Validaciones
    if (
      location === INCIDENT_LOCATION &&
      description === INCIDENT_DESCRIPTION &&
      tipo?.toLowerCase() === INCIDENT_TYPE
    ) {
      console.log(
        `${getTimestamp()} ▶ [view-incident-test] ` +
          chalk.green("✔ Visualización coincide con los datos esperados.")
      );
      testPassed = true;
    } else {
      console.log(
        `${getTimestamp()} ▶ [view-incident-test] ` +
          chalk.yellow("✖ Los datos visualizados no coinciden:")
      );
      console.log(
        `- Ubicación esperada: "${INCIDENT_LOCATION}", obtenida: "${location}"`
      );
      console.log(
        `- Descripción esperada: "${INCIDENT_DESCRIPTION}", obtenida: "${description}"`
      );
      console.log(`- Tipo esperado: "${INCIDENT_TYPE}", obtenido: "${tipo}"`);
      throw new Error(
        "Los datos visualizados no coinciden con los datos esperados."
      );
    }
  } catch (error) {
    console.error(
      `${getTimestamp()} ` + chalk.red(`✖ Error: ${error.message}`)
    );
  } finally {
    await driver.quit();
    return {
      passed: testPassed ? 1 : 0,
      failed: testPassed ? 0 : 1,
    };
  }
}

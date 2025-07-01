import dotenv from "dotenv";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import chalk from "chalk";
import { getTimestamp, login_selenium, navagation_to_incidents_selenium } from "../utils/common.js";

dotenv.config();

const INCIDENT_LOCATION = 'Sala de servidores - Piso 3';
const INCIDENT_DESCRIPTION = 'El servidor principal presenta sobrecalentamiento constante';
const INCIDENT_TYPE = 'Colision';

export async function runViewIncidentTests() {
  const options = new chrome.Options();
  options.addArguments("--no-sandbox", "--disable-dev-shm-usage");
  // Puedes agregar "--headless" si deseas que no se vea el navegador

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  let testPassed = false;

  try {
    console.log(`${getTimestamp()} ▶ [view-incident-test] Iniciando sesión...`);
    await login_selenium(driver);

    console.log(`${getTimestamp()} ▶ [view-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents_selenium(driver);

    await driver.wait(until.elementsLocated(By.css('tbody.MuiTableBody-root tr')), 5000);
    const rows = await driver.findElements(By.css('tbody.MuiTableBody-root tr'));

    if (rows.length === 0) throw new Error("No hay incidentes para visualizar.");

    console.log(`${getTimestamp()} ▶ [view-incident-test] Seleccionando último incidente...`);
    const lastRow = rows[rows.length - 1];
    const viewButton = await lastRow.findElement(By.css('[data-testid="VisibilityIcon"]'));
    await viewButton.click();

    console.log(`${getTimestamp()} ▶ [view-incident-test] Verificando datos del incidente...`);

    // Utilidad para obtener valor de campo por su label
    async function getInputValueByLabel(driver, labelText) {
      const labels = await driver.findElements(By.css("label"));
      for (const label of labels) {
        const text = await label.getText();
        if (text.trim() === labelText) {
          const parent = await label.findElement(By.xpath(".."));
          const input = await parent.findElement(By.css("input, textarea"));
          return await input.getAttribute("value");
        }
      }
      return null;
    }

    const location = await getInputValueByLabel(driver, "Ubicación");
    const description = await getInputValueByLabel(driver, "Descripción");
    const tipo = await getInputValueByLabel(driver, "Tipo de Incidente");

    const normalize = (str) => str.trim().toLowerCase();
    
    if (
        normalize(location) === normalize(INCIDENT_LOCATION) &&
        normalize(description) === normalize(INCIDENT_DESCRIPTION) &&
        normalize(tipo) === normalize(INCIDENT_TYPE)
      ) {
        console.log(`${getTimestamp()} ▶ [view-incident-test] ` + chalk.green("✔ Visualización de incidente coincide con los datos creados."));
        testPassed = true;
      } else {
        console.log(`${getTimestamp()} ▶ [view-incident-test] ` + chalk.yellow("Datos obtenidos:"));
        console.log(`${getTimestamp()} ▶ [view-incident-test] Ubicación esperada: "${INCIDENT_LOCATION}", obtenida: "${location}"`);
        console.log(`${getTimestamp()} ▶ [view-incident-test] Descripción esperada: "${INCIDENT_DESCRIPTION}", obtenida: "${description}"`);
        console.log(`${getTimestamp()} ▶ [view-incident-test] Tipo esperado: "${INCIDENT_TYPE}", obtenido: "${tipo}"`);
        throw new Error("Los datos visualizados no coinciden con los creados.");
      }

  } catch (error) {
    console.error(`${getTimestamp()} ` + chalk.red(`✖ Error: ${error.message}`));
    testPassed = false;
  } finally {
    await driver.quit();
    return {
      passed: testPassed ? 1 : 0,
      failed: testPassed ? 0 : 1,
    };
  }
}

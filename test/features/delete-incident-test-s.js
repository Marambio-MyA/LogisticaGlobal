import dotenv from "dotenv";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import chalk from "chalk";
import { getTimestamp, login_selenium, navagation_to_incidents_selenium } from "../utils/common.js";

dotenv.config();

export async function runDeleteIncidentTests() {
  let passed = 0;
  let failed = 0;

  const options = new chrome.Options();
  options.addArguments("--no-sandbox", "--disable-dev-shm-usage", "--headless"); // Quita "--headless" si quieres ver el navegador
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    console.log(`${getTimestamp()} ▶ [delete-incident-test] Iniciando sesión...`);
    await login_selenium(driver);

    console.log(`${getTimestamp()} ▶ [delete-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents_selenium(driver);

    await driver.wait(until.elementsLocated(By.css("tbody.MuiTableBody-root tr")), 5000);
    const rowsBefore = await driver.findElements(By.css("tbody.MuiTableBody-root tr"));
    const countBefore = rowsBefore.length;

    console.log(`${getTimestamp()} ▶ [delete-incident-test] Total de incidentes actuales: ${countBefore}`);
    if (countBefore === 0) throw new Error("No hay incidentes para eliminar");

    // Seleccionar última fila y botón de eliminar
    const lastRow = rowsBefore[rowsBefore.length - 1];
    const deleteBtn = await lastRow.findElement(By.css('[data-testid="DeleteIcon"]'));

    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
    await driver.sleep(300);

    // Manejar alerta
    const alertPromise = driver.wait(until.alertIsPresent(), 3000);
    await deleteBtn.click();

    const alert = await alertPromise;
    console.log(`${getTimestamp()} ▶ [delete-incident-test] Confirmación: "${await alert.getText()}"`);
    await alert.accept();

    await driver.sleep(2000);
    const rowsAfter = await driver.findElements(By.css("tbody.MuiTableBody-root tr"));
    const countAfter = rowsAfter.length;

    console.log(`${getTimestamp()} ▶ [delete-incident-test] Total de incidentes luego de eliminación: ${countAfter}`);

    if (countAfter < countBefore) {
      console.log(`${getTimestamp()} ` + chalk.green("✔ Incidente eliminado exitosamente"));
      passed++;
    } else {
      throw new Error("El incidente no fue eliminado correctamente.");
    }

  } catch (error) {
    console.error(`${getTimestamp()} ` + chalk.red(`✖ Error: ${error.message}`));
    failed++;
  } finally {
    await driver.quit();
  }

  return { passed, failed };
}
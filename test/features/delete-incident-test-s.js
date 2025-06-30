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

export async function runDeleteIncidentTests() {
  const options = new chrome.Options().headless();
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  let testPassed = false;

  try {
    console.log(
      `${getTimestamp()} ▶ [delete-incident-test] Iniciando sesión...`
    );
    await login(driver);

    console.log(
      `${getTimestamp()} ▶ [delete-incident-test] Navegando a Incidentes...`
    );
    await navagation_to_incidents(driver);

    await driver.wait(
      until.elementsLocated(By.css("tbody.MuiTableBody-root tr")),
      5000
    );
    const rowsBefore = await driver.findElements(
      By.css("tbody.MuiTableBody-root tr")
    );
    const countBefore = rowsBefore.length;
    console.log(
      `${getTimestamp()} ▶ [delete-incident-test] Total de incidentes actuales: ${countBefore}`
    );

    if (countBefore === 0) throw new Error("No hay incidentes para eliminar");

    // Última fila
    const lastRow = rowsBefore[rowsBefore.length - 1];
    const deleteIcon = await lastRow.findElement(
      By.css('[data-testid="DeleteIcon"]')
    );

    if (!deleteIcon) throw new Error("No se encontró el botón DeleteIcon");

    console.log(
      `${getTimestamp()} ▶ [delete-incident-test] Haciendo clic en ícono de eliminar...`
    );

    // Hacer scroll hacia el botón y hacer clic
    await driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      deleteIcon
    );
    await deleteIcon.click();

    // Confirmar el diálogo (este paso depende de cómo tu app implementa el confirm).
    // Selenium no puede interceptar confirm() nativo de navegador como Puppeteer,
    // así que este paso puede variar. Si usas un modal propio (ej. Material UI), deberías manejarlo así:
    try {
      const confirmBtn = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//button[contains(text(),'Confirmar') or contains(text(),'Sí')]"
          )
        ),
        5000
      );
      await confirmBtn.click();
    } catch (e) {
      console.warn(
        `${getTimestamp()} ⚠ No se detectó botón de confirmación. Continuando...`
      );
    }

    // Esperar a que el número de incidentes disminuya
    await driver.wait(async () => {
      const currentRows = await driver.findElements(
        By.css("tbody.MuiTableBody-root tr")
      );
      return currentRows.length < countBefore;
    }, 5000);

    const rowsAfter = await driver.findElements(
      By.css("tbody.MuiTableBody-root tr")
    );
    const countAfter = rowsAfter.length;
    console.log(
      `${getTimestamp()} ▶ [delete-incident-test] Total de incidentes luego de eliminación: ${countAfter}`
    );

    if (countAfter < countBefore) {
      console.log(
        `${getTimestamp()} ` + chalk.green("✔ Incidente eliminado exitosamente")
      );
      testPassed = true;
    } else {
      throw new Error("El incidente no fue eliminado correctamente.");
    }
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
  } finally {
    await driver.quit();
    return {
      passed: testPassed ? 1 : 0,
      failed: testPassed ? 0 : 1,
    };
  }
}

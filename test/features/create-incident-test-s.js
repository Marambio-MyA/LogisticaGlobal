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

const INCIDENT_LOCATION = "Sala de servidores - Piso 3";
const INCIDENT_DESCRIPTION =
  "El servidor principal presenta sobrecalentamiento constante";
const INCIDENT_TYPE = "colision";
const ROBOT_ID = 2;
const ESTADO_DESEADO = "fuera_servicio";

export async function runCreateIncidentTests() {
  const options = new chrome.Options().headless();
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  let testPassed = false;

  try {
    console.log(
      `${getTimestamp()} ▶ [create-incident-test] Iniciando sesión...`
    );
    await login(driver);

    console.log(
      `${getTimestamp()} ▶ [create-incident-test] Navegando a Incidentes...`
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
      `${getTimestamp()} ▶ [create-incident-test] Esperando botón 'Nuevo Incidente'...`
    );
    const newIncidentBtn = await driver.wait(
      until.elementLocated(By.css('[id="nuevo-incidente-btn"]')),
      5000
    );
    await newIncidentBtn.click();

    // Ubicación
    console.log(
      `${getTimestamp()} ▶ [create-incident-test] Rellenando Ubicación...`
    );
    const ubicacionInput = await driver.findElement(
      By.css('[input-id="ubicacion-input"] input')
    );
    await ubicacionInput.clear();
    await ubicacionInput.sendKeys(INCIDENT_LOCATION);

    // Descripción
    console.log(
      `${getTimestamp()} ▶ [create-incident-test] Rellenando Descripción...`
    );
    const descripcionTextarea = await driver.wait(
      until.elementLocated(By.css('[input-id="descripcion-input"] textarea')),
      5000
    );
    await descripcionTextarea.clear();
    await descripcionTextarea.sendKeys(INCIDENT_DESCRIPTION);

    // Tipo de incidente
    console.log(
      `${getTimestamp()} ▶ [create-incident-test] Seleccionando Tipo de Incidente...`
    );
    await driver
      .findElement(By.css('[input-id="tipo-incidente-select"]'))
      .click();
    const tipoOption = await driver.wait(
      until.elementLocated(By.css(`[input-id="tipo-option-${INCIDENT_TYPE}"]`)),
      5000
    );
    await tipoOption.click();

    // Agregar robot
    console.log(
      `${getTimestamp()} ▶ [create-incident-test] Agregando robot ${ROBOT_ID}...`
    );
    await driver
      .wait(
        until.elementLocated(By.css(`[input-id="agregar-robot-${ROBOT_ID}"]`)),
        5000
      )
      .click();
    await driver
      .wait(
        until.elementLocated(By.css(`[input-id="estado-robot-${ROBOT_ID}"]`)),
        5000
      )
      .click();

    console.log(
      `${getTimestamp()} ▶ [create-incident-test] Seleccionando estado "${ESTADO_DESEADO}"...`
    );
    await driver
      .wait(
        until.elementLocated(
          By.css(`[input-id="estado-opcion-${ROBOT_ID}-${ESTADO_DESEADO}"]`)
        ),
        5000
      )
      .click();

    // Confirmación del diálogo (en Selenium no se puede interceptar confirmaciones JS sin modificar código fuente, así que lo ignoraremos)
    console.log(
      `${getTimestamp()} ▶ [create-incident-test] Enviando formulario...`
    );
    await driver
      .wait(
        until.elementLocated(By.css('[button-id="crear-incidente-btn"]')),
        5000
      )
      .click();

    // Revalidar cantidad de incidentes
    await driver.wait(
      until.elementsLocated(By.css("tbody.MuiTableBody-root tr")),
      5000
    );
    const rowsAfter = await driver.findElements(
      By.css("tbody.MuiTableBody-root tr")
    );
    const countAfter = rowsAfter.length;

    if (countAfter > countBefore) {
      console.log(
        `${getTimestamp()} ` + chalk.green("✔ Incidente creado exitosamente")
      );
      testPassed = true;
    } else {
      throw new Error(
        `El número de incidentes no aumentó (antes: ${countBefore}, después: ${countAfter})`
      );
    }
  } catch (error) {
    console.error(
      `${getTimestamp()} ` + chalk.red(`✖ Error: ${error.message}`)
    );
    testPassed = false;
  } finally {
    await driver.quit();
    return {
      passed: testPassed ? 1 : 0,
      failed: testPassed ? 0 : 1,
    };
  }
}

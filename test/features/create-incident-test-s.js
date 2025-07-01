import dotenv from "dotenv";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import chalk from "chalk";
import { getTimestamp, login_selenium, navagation_to_incidents_selenium } from "../utils/common.js";

dotenv.config();

const INCIDENT_LOCATION = "Sala de servidores - Piso 3";
const INCIDENT_DESCRIPTION = "El servidor principal presenta sobrecalentamiento constante";
const INCIDENT_TYPE = "colision";
const ROBOT_ID = 1;
const ESTADO_DESEADO = "fuera_servicio";

export async function runCreateIncidentTests() {
  let passed = 0;
  let failed = 0;

  const options = new chrome.Options();
  // ❗️Quitar "--headless" si quieres ver el navegador
  options.addArguments("--no-sandbox", "--disable-dev-shm-usage");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    console.log(`${getTimestamp()} ▶ [create-incident-test] Iniciando sesión...`);
    await login_selenium(driver);

    console.log(`${getTimestamp()} ▶ [create-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents_selenium(driver);

    await driver.wait(until.elementsLocated(By.css("tbody.MuiTableBody-root tr")), 5000);
    const rowsBefore = await driver.findElements(By.css("tbody.MuiTableBody-root tr"));
    const countBefore = rowsBefore.length;

    // Abrir modal "Nuevo Incidente"
    await driver.wait(until.elementLocated(By.css("#nuevo-incidente-btn")), 5000).then(el => el.click());

    // Ubicación
    console.log(`${getTimestamp()} ▶ [create-incident-test] Rellenando Ubicación...`);
    const ubicacionInput = await driver.findElement(By.css('[input-id="ubicacion-input"] input'));
    await ubicacionInput.clear();
    await ubicacionInput.sendKeys(INCIDENT_LOCATION);

    // Descripción
    console.log("→ Texto que se va a escribir:", INCIDENT_DESCRIPTION);
    console.log(`${getTimestamp()} ▶ [create-incident-test] Rellenando Descripción...`);
    const descripcionInput = await driver.findElement(By.css('[input-id="descripcion-input"] textarea'));
    await descripcionInput.clear();
    for (const char of INCIDENT_DESCRIPTION) {
      await descripcionInput.sendKeys(char);
      await driver.sleep(10); // 10ms entre cada letra
    }

    // Tipo de incidente
    console.log(`${getTimestamp()} ▶ [create-incident-test] Seleccionando Tipo de Incidente...`);
    await driver.findElement(By.css('[input-id="tipo-incidente-select"]')).click();
    await driver.findElement(By.css(`[input-id="tipo-option-${INCIDENT_TYPE}"]`)).click();

    // Agregar robot
    console.log(`${getTimestamp()} ▶ [create-incident-test] Agregando robot ${ROBOT_ID}...`);
    await driver.findElement(By.css(`[input-id="agregar-robot-${ROBOT_ID}"]`)).click();
    await driver.findElement(By.css(`[input-id="estado-robot-${ROBOT_ID}"]`)).click();
    await driver.findElement(By.css(`[input-id="estado-opcion-${ROBOT_ID}-${ESTADO_DESEADO}"]`)).click();

    // Enviar formulario
    console.log(`${getTimestamp()} ▶ [create-incident-test] Enviando formulario...`);
    await driver.findElement(By.css('[button-id="crear-incidente-btn"]')).click();

    // Manejar el diálogo del navegador
    try {
      await driver.wait(until.alertIsPresent(), 3000);
      const alert = await driver.switchTo().alert();
      console.log(`${getTimestamp()} ▶ [create-incident-test] Confirmación del navegador: "${await alert.getText()}"`);
      await alert.accept();
      await driver.sleep(500); // esperar a que se actualice la vista
    } catch (e) {
      console.warn(`${getTimestamp()} ⚠ No se encontró ninguna alerta para aceptar.`);
    }

    // Esperar que el incidente se agregue
    await driver.sleep(2000); // espera corta para que el DOM se actualice
    const rowsAfter = await driver.findElements(By.css("tbody.MuiTableBody-root tr"));
    const countAfter = rowsAfter.length;

    if (countAfter > countBefore) {
      console.log(`${getTimestamp()} ` + chalk.green("✔ Incidente creado exitosamente"));
      passed++;
    } else {
      throw new Error(`El número de incidentes no aumentó (antes: ${countBefore}, después: ${countAfter})`);
    }

  } catch (error) {
    console.error(`${getTimestamp()} ` + chalk.red(`✖ Error: ${error.message}`));
    failed++;
  } finally {
    await driver.quit();
  }

  return { passed, failed };
}

runCreateIncidentTests()
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

// Variables de prueba
const NUEVA_UBICACION = "Zona restringida B";
const NUEVO_TIPO = "software";
const NUEVA_DESCRIPCION = "Actualización del firmware fallida";
const NUEVO_ESTADO_INCIDENTE = "en_investigacion";
const ROBOT_ID = 2;
const NUEVO_ESTADO_ROBOT = "en_reparacion";

export async function runUpdateIncidentTests() {
  const options = new chrome.Options().headless();
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  let testPassed = false;

  try {
    // 1. Login
    console.log(
      `${getTimestamp()} ▶ [update-incident-test] Iniciando sesión...`
    );
    await login(driver);

    // 2. Navegar a "Incidentes"
    console.log(
      `${getTimestamp()} ▶ [update-incident-test] Navegando a Incidentes...`
    );
    await navagation_to_incidents(driver);

    // 3. Esperar tabla y buscar última fila
    await driver.wait(
      until.elementsLocated(By.css("tbody.MuiTableBody-root tr")),
      5000
    );
    const rows = await driver.findElements(
      By.css("tbody.MuiTableBody-root tr")
    );
    if (rows.length === 0)
      throw new Error("No se encontraron filas en la tabla");

    const lastRow = rows[rows.length - 1];
    const editIcon = await lastRow.findElement(
      By.css('button svg[data-testid="EditIcon"]')
    );
    const editButton = await editIcon.findElement(
      By.xpath("./ancestor::button")
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      editButton
    );
    await editButton.click();

    // 4. Esperar el modal
    console.log(
      `${getTimestamp()} ▶ [update-incident-test] Esperando que se abra el modal de edición...`
    );
    await driver.wait(until.elementLocated(By.css('[role="dialog"]')), 5000);

    // 5. Modificar campos
    console.log(
      `${getTimestamp()} ▶ [update-incident-test] Modificando ubicación...`
    );
    const ubicacionInput = await driver.findElement(
      By.css('[input-id="edit-ubicacion-input"] input')
    );
    await ubicacionInput.clear();
    await ubicacionInput.sendKeys(NUEVA_UBICACION);

    console.log(
      `${getTimestamp()} ▶ [update-incident-test] Seleccionando Tipo de Incidente...`
    );
    await driver
      .findElement(By.css('[input-id="edit-tipo-incidente-select"]'))
      .click();
    await driver
      .wait(
        until.elementLocated(
          By.css(`[input-id="edit-tipo-option-${NUEVO_TIPO}"]`)
        ),
        5000
      )
      .click();

    console.log(
      `${getTimestamp()} ▶ [update-incident-test] Modificando descripción...`
    );
    const descripcionInput = await driver.findElement(
      By.css('[input-id="edit-descripcion-input"] textarea')
    );
    await descripcionInput.clear();
    await descripcionInput.sendKeys(NUEVA_DESCRIPCION);

    console.log(
      `${getTimestamp()} ▶ [update-incident-test] Seleccionando Estado del Incidente...`
    );
    await driver.findElement(By.css('[input-id="edit-estado-select"]')).click();
    await driver
      .wait(
        until.elementLocated(
          By.css(`[input-id="edit-estado-opcion-${NUEVO_ESTADO_INCIDENTE}"]`)
        ),
        5000
      )
      .click();

    console.log(
      `${getTimestamp()} ▶ [update-incident-test] Seleccionando Estado del Robot ID ${ROBOT_ID}...`
    );
    await driver
      .findElement(By.css(`[input-id="edit-estado-robot-${ROBOT_ID}"]`))
      .click();
    await driver
      .wait(
        until.elementLocated(
          By.css(
            `[input-id="edit-estado-opcion-${ROBOT_ID}-${NUEVO_ESTADO_ROBOT}"]`
          )
        ),
        5000
      )
      .click();

    // 6. Confirmar y enviar
    console.log(
      `${getTimestamp()} ▶ [update-incident-test] Enviando formulario...`
    );
    try {
      const confirmBtn = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//button[contains(text(),'Confirmar') or contains(text(),'Sí')]"
          )
        ),
        3000
      );
      await confirmBtn.click();
    } catch (_) {
      // Si no hay confirmación, continuar igual
    }

    await driver
      .wait(
        until.elementLocated(By.css('[button-id="edit-guardar-cambios-btn"]')),
        5000
      )
      .click();

    console.log(
      `${getTimestamp()} ` +
        chalk.green("✔ Incidente editado y enviado correctamente")
    );
    testPassed = true;
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

import dotenv from 'dotenv';
import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import chalk from 'chalk';
import { getTimestamp, login_selenium, navagation_to_incidents_selenium } from '../utils/common.js';

dotenv.config();

const NUEVA_UBICACION = 'Zona restringida B';
const NUEVO_TIPO = 'software';
const NUEVA_DESCRIPCION = 'Actualización del firmware fallida';
const NUEVO_ESTADO_INCIDENTE = 'en_investigacion';
const ROBOT_ID = 1;
const NUEVO_ESTADO_ROBOT = 'en_reparacion';

export async function runUpdateIncidentTests() {
  let passed = 0;
  let failed = 0;

  const options = new chrome.Options();
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    console.log(`${getTimestamp()} ▶ [update-incident-test] Iniciando sesión...`);
    await login_selenium(driver);

    console.log(`${getTimestamp()} ▶ [update-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents_selenium(driver);

    await driver.wait(until.elementsLocated(By.css('tbody.MuiTableBody-root tr')), 5000);
    const rows = await driver.findElements(By.css('tbody.MuiTableBody-root tr'));
    const lastRow = rows[rows.length - 1];

    console.log(`${getTimestamp()} ▶ [update-incident-test] Abriendo editor del incidente...`);
    const editIcon = await lastRow.findElement(By.css('svg[data-testid="EditIcon"]'));
    const editBtn = await editIcon.findElement(By.xpath('./ancestor::button'));
    await editBtn.click();

    // Esperar el modal
    console.log(`${getTimestamp()} ▶ [update-incident-test] Esperando modal de edición...`);
    await driver.wait(until.elementLocated(By.css('[role="dialog"]')), 5000);

    // Ubicación
    console.log(`${getTimestamp()} ▶ [update-incident-test] Modificando ubicación...`);
    const ubicacionInput = await driver.findElement(By.css('[input-id="edit-ubicacion-input"] input'));
    await ubicacionInput.sendKeys(Key.CONTROL, 'a', Key.BACK_SPACE);
    for (const char of NUEVA_UBICACION) {
      await ubicacionInput.sendKeys(char);
      await driver.sleep(10);
    }

    // Tipo de incidente
    console.log(`${getTimestamp()} ▶ [update-incident-test] Seleccionando Tipo de Incidente...`);
    await driver.findElement(By.css('[input-id="edit-tipo-incidente-select"]')).click();
    await driver.findElement(By.css(`[input-id="edit-tipo-option-${NUEVO_TIPO}"]`)).click();

    // Descripción
    console.log(`${getTimestamp()} ▶ [update-incident-test] Modificando descripción...`);
    const descripcionTextarea = await driver.findElement(By.css('[input-id="edit-descripcion-input"] textarea'));
    await descripcionTextarea.sendKeys(Key.CONTROL, 'a', Key.BACK_SPACE);
    for (const char of NUEVA_DESCRIPCION) {
      await descripcionTextarea.sendKeys(char);
      await driver.sleep(10);
    }

    // Estado del incidente
    console.log(`${getTimestamp()} ▶ [update-incident-test] Seleccionando Estado del Incidente...`);
    await driver.findElement(By.css('[input-id="edit-estado-select"]')).click();
    await driver.findElement(By.css(`[input-id="edit-estado-opcion-${NUEVO_ESTADO_INCIDENTE}"]`)).click();

    // Estado del robot
    console.log(`${getTimestamp()} ▶ [update-incident-test] Seleccionando Estado del Robot ID ${ROBOT_ID}...`);
    await driver.findElement(By.css(`[input-id="edit-estado-robot-${ROBOT_ID}"]`)).click();
    await driver.findElement(By.css(`[input-id="edit-estado-opcion-${ROBOT_ID}-${NUEVO_ESTADO_ROBOT}"]`)).click();

    // Enviar formulario y aceptar alerta
    console.log(`${getTimestamp()} ▶ [update-incident-test] Enviando formulario...`);
    await driver.findElement(By.css('[button-id="edit-guardar-cambios-btn"]')).click();

    try {
      await driver.wait(until.alertIsPresent(), 3000);
      const alert = await driver.switchTo().alert();
      console.log(`${getTimestamp()} ▶ [update-incident-test] Confirmación del navegador: "${await alert.getText()}"`);
      await alert.accept();
    } catch {
      console.warn(`${getTimestamp()} ⚠ No se encontró alerta de confirmación.`);
    }

    await driver.sleep(1000); // esperar cambio
    console.log(`${getTimestamp()} ` + chalk.green('✔ Incidente editado y enviado correctamente'));
    passed++;

  } catch (error) {
    console.error(`${getTimestamp()} ` + chalk.red(`✖ Error: ${error.message}`));
    failed++;
  } finally {
    await driver.quit();
    return { passed, failed };
  }
}

runUpdateIncidentTests();

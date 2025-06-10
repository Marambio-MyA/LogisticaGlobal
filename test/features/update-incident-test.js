// features/update-incident-test.js

require('dotenv').config();
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { getTimestamp, login, navagation_to_incidents } = require('../utils/common');


// Variables de prueba
const NUEVA_UBICACION = 'Zona restringida B';
const NUEVO_TIPO = 'software';
const NUEVA_DESCRIPCION = 'Actualización del firmware fallida';
const NUEVO_ESTADO_INCIDENTE = 'en_investigacion';
const ROBOT_ID = 2;
const NUEVO_ESTADO_ROBOT = 'en_reparacion';

async function runUpdateIncidentTest() {
   const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: false,
        slowMo: 50,
      });
  const page = await browser.newPage();
  let testPassed = false;

  try {
    // 1. Iniciar sesión
    console.log(`${getTimestamp()} ▶ [update-incident-test] Iniciando sesión...`);
    await login(page);

    // 2. Navegar a Incidentes
    console.log(`${getTimestamp()} ▶ [update-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents(page);

    // 3. Esperar carga de tabla
    await page.waitForSelector('tbody.MuiTableBody-root tr', { visible: true });
    console.log(`${getTimestamp()} ▶ [update-incident-test] Buscando última fila y botón de editar...`);
    const rows = await page.$$('tbody.MuiTableBody-root tr');
    const lastRow = rows[rows.length - 1];
    // Obtener todos los botones dentro de la celda de acciones
    const actionButtons = await lastRow.$$(':scope td:last-child button');
    const editButton = actionButtons[1];
    // Usar el que necesites, por ejemplo:
    await editButton.click();

    // 4. Esperar modal
    console.log(`${getTimestamp()} ▶ [update-incident-test] Esperando que se abra el modal de edición...`);
    await Promise.any([
      page.waitForSelector('.MuiDialog-root', { visible: true, timeout: 5000 }),
      page.waitForSelector('[role="dialog"]', { visible: true, timeout: 5000 }),
    ]);

    // 5. Modificar campos
    console.log(`${getTimestamp()} ▶ [update-incident-test] Modificando campos...`);

    // Ubicación
    console.log(`${getTimestamp()} ▶ [update-incident-test] Modificando ubicación...`);
    await page.$eval('[input-id="edit-ubicacion-input"] input', (input, value) => {
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, NUEVA_UBICACION);

    // Tipo de incidente
    console.log(`${getTimestamp()} ▶ [update-incident-test] Seleccionando Tipo de Incidente...`);
    await page.click('[input-id="edit-tipo-incidente-select"]');
    await page.waitForSelector(`[input-id="edit-tipo-option-${NUEVO_TIPO}"]`);
    await page.click(`[input-id="edit-tipo-option-${NUEVO_TIPO}"]`);

    // Descripción
    console.log(`${getTimestamp()} ▶ [update-incident-test] Modificando descripción...`);
    await page.$eval('[input-id="edit-descripcion-input"] textarea', (textarea, value) => {
      textarea.focus();
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(textarea), 'value')?.set;
      if (setter) {
        setter.call(textarea, value);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, NUEVA_DESCRIPCION);

    // Estado del incidente
    console.log(`${getTimestamp()} ▶ [update-incident-test] Seleccionando Estado del Incidente...`);
    await page.click('[input-id="edit-estado-select"]');
    await page.waitForSelector(`[input-id="edit-estado-opcion-${NUEVO_ESTADO_INCIDENTE}"]`);
    await page.click(`[input-id="edit-estado-opcion-${NUEVO_ESTADO_INCIDENTE}"]`);

    // Estado del robot
    console.log(`${getTimestamp()} ▶ [update-incident-test] Seleccionando Estado del Robot ID ${ROBOT_ID}...`);
    await page.click(`[input-id="edit-estado-robot-${ROBOT_ID}"]`);
    await page.waitForSelector(`[input-id="edit-estado-opcion-${ROBOT_ID}-${NUEVO_ESTADO_ROBOT}"]`);
    await page.click(`[input-id="edit-estado-opcion-${ROBOT_ID}-${NUEVO_ESTADO_ROBOT}"]`);

    // 6. Confirmar y enviar
    console.log(`${getTimestamp()} ▶ [update-incident-test] Enviando formulario...`);
    page.once('dialog', async (dialog) => {
      console.log(`${getTimestamp()} ▶ [update-incident-test] Confirmación del navegador: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.waitForSelector('[button-id="edit-guardar-cambios-btn"]', { visible: true });
    await page.click('[button-id="edit-guardar-cambios-btn"]');

    console.log(`${getTimestamp()} ` + chalk.green('✔ Incidente editado y enviado correctamente'));
    testPassed = true;

  } catch (error) {
    console.error(`${getTimestamp()} ` + chalk.red(`✖ Error: ${error.message}`));
    testPassed = false;
  } finally {
    await browser.close();
    return {
      passed: testPassed ? 1 : 0,
      failed: testPassed ? 0 : 1
    };
  }
}

module.exports = runUpdateIncidentTest;

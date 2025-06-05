// features/update-incident-test.js

require('dotenv').config();
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { getTimestamp } = require('../utils/common');

// Variables de entorno
const URL = process.env.TEST_URL;
const SUCCESS_EMAIL = process.env.TEST_EMAIL;
const SUCCESS_PASSWORD = process.env.TEST_PASSWORD;

// Variables de prueba
const NUEVA_UBICACION = 'Zona restringida B';
const NUEVO_TIPO = 'software';
const NUEVA_DESCRIPCION = 'Actualización del firmware fallida';
const NUEVO_ESTADO_INCIDENTE = 'en_investigacion';
const ROBOT_ID = 2;
const NUEVO_ESTADO_ROBOT = 'en_reparacion';

async function runUpdateIncidentTest() {
  const browser = await puppeteer.launch({ headless: "new", slowMo: 50 });
  const page = await browser.newPage();
  let testPassed = false;

  try {
    // 1. Iniciar sesión
    console.log(`${getTimestamp()} ▶ [update-incident-test] Iniciando sesión...`);
    await page.goto(URL);

    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', SUCCESS_EMAIL);

    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', SUCCESS_PASSWORD);

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.trim() === 'Entrar');
      if (btn) btn.click();
    });

    // 2. Navegar a Incidentes
    console.log(`${getTimestamp()} ▶ [update-incident-test] Navegando a Incidentes...`);
    await page.waitForSelector('ul.MuiList-root');
    await page.evaluate(() => {
      const menu = [...document.querySelectorAll('li')]
        .find(li => li.textContent.trim() === 'Incidentes');
      menu?.click();
    });

    // 3. Esperar carga de tabla
    await page.waitForSelector('tbody.MuiTableBody-root tr', { visible: true });
    console.log(`${getTimestamp()} ▶ [update-incident-test] Buscando última fila y botón de editar...`);
    const rows = await page.$$('tbody.MuiTableBody-root tr');
    if (rows.length === 0) throw new Error('No se encontraron filas en la tabla');
    const lastRow = rows[rows.length - 1];
    const editButton = await lastRow.$('button svg[data-testid="EditIcon"]');
    const parentButton = await editButton.evaluateHandle(svg => svg.closest('button'));
    await parentButton.click();

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
    await page.$eval('[data-testid="edit-ubicacion-input"] input', (input, value) => {
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, NUEVA_UBICACION);

    // Tipo de incidente
    console.log(`${getTimestamp()} ▶ [update-incident-test] Seleccionando Tipo de Incidente...`);
    await page.click('[data-testid="edit-tipo-incidente-select"]');
    await page.waitForSelector(`[data-testid="edit-tipo-option-${NUEVO_TIPO}"]`);
    await page.click(`[data-testid="edit-tipo-option-${NUEVO_TIPO}"]`);

    // Descripción
    console.log(`${getTimestamp()} ▶ [update-incident-test] Modificando descripción...`);
    await page.$eval('[data-testid="edit-descripcion-input"] textarea', (textarea, value) => {
      textarea.focus();
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(textarea), 'value')?.set;
      if (setter) {
        setter.call(textarea, value);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, NUEVA_DESCRIPCION);

    // Estado del incidente
    console.log(`${getTimestamp()} ▶ [update-incident-test] Seleccionando Estado del Incidente...`);
    await page.click('[data-testid="edit-estado-select"]');
    await page.waitForSelector(`[data-testid="edit-estado-opcion-${NUEVO_ESTADO_INCIDENTE}"]`);
    await page.click(`[data-testid="edit-estado-opcion-${NUEVO_ESTADO_INCIDENTE}"]`);

    // Estado del robot
    console.log(`${getTimestamp()} ▶ [update-incident-test] Seleccionando Estado del Robot ID ${ROBOT_ID}...`);
    await page.click(`[data-testid="edit-estado-robot-${ROBOT_ID}"]`);
    await page.waitForSelector(`[data-testid="edit-estado-opcion-${ROBOT_ID}-${NUEVO_ESTADO_ROBOT}"]`);
    await page.click(`[data-testid="edit-estado-opcion-${ROBOT_ID}-${NUEVO_ESTADO_ROBOT}"]`);

    // 6. Confirmar y enviar
    console.log(`${getTimestamp()} ▶ [update-incident-test] Enviando formulario...`);
    page.once('dialog', async (dialog) => {
      console.log(`${getTimestamp()} ▶ [update-incident-test] Confirmación del navegador: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.waitForSelector('[data-testid="edit-guardar-cambios-btn"]', { visible: true });
    await page.click('[data-testid="edit-guardar-cambios-btn"]');

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

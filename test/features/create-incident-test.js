// features/incident-test.js

require('dotenv').config();
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { getTimestamp, login, navagation_to_incidents } = require('../utils/common');

const INCIDENT_LOCATION = 'Sala de servidores - Piso 3';
const INCIDENT_DESCRIPTION = 'El servidor principal presenta sobrecalentamiento constante';
const INCIDENT_TYPE = 'colision';
const ROBOT_ID = 1; 
const ESTADO_DESEADO = 'fuera_servicio';

async function runIncidentTest() {
  const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      slowMo: 50,
    });
  const page = await browser.newPage();
  let testPassed = false;

  try {
    // Iniciar sesión
    console.log(`${getTimestamp()} ▶ [create-incident-test] Iniciando sesión...`);
    await login(page);

    // Navegar a incidentes
    console.log(`${getTimestamp()} ▶ [create-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents(page);

    // Contar incidentes antes
    await page.waitForSelector('tbody.MuiTableBody-root tr');
    const countBefore = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);

    // Abrir formulario nuevo
    console.log(`${getTimestamp()} ▶ [create-incident-test] Abriendo formulario de incidente...`);
    await page.waitForSelector('#nuevo-incidente-btn', { visible: true });
    await page.click('#nuevo-incidente-btn');

    await page.waitForSelector('#ubicacion-input');
    await page.click('#ubicacion-input');
    await page.type('#ubicacion-input', INCIDENT_LOCATION);

    await page.waitForSelector('#descripcion-input');
    await page.click('#descripcion-input');
    await page.type('#descripcion-input', INCIDENT_DESCRIPTION);
    // Tipo de incidente
    console.log(`${getTimestamp()} ▶ [create-incident-test] Seleccionando tipo: ${INCIDENT_TYPE}`);
    await page.click('#tipo-incidente-select');
    await page.waitForSelector(`#tipo-option-${INCIDENT_TYPE}`);
    await page.click(`#tipo-option-${INCIDENT_TYPE}`);

    // Agregar robot
    console.log(`${getTimestamp()} ▶ [create-incident-test] Agregando robot ID ${ROBOT_ID}`);
    await page.waitForSelector(`#agregar-robot-${ROBOT_ID}`);
    await page.click(`#agregar-robot-${ROBOT_ID}`);

    // Cambiar estado del robot
    console.log(`${getTimestamp()} ▶ [create-incident-test] Cambiando estado del robot...`);
    await page.waitForSelector(`#estado-robot-${ROBOT_ID}`);
    await page.click(`#estado-robot-${ROBOT_ID}`);
    await page.waitForSelector(`#estado-opcion-${ROBOT_ID}-${ESTADO_DESEADO}`);
    await page.click(`#estado-opcion-${ROBOT_ID}-${ESTADO_DESEADO}`);

    // Confirmar diálogo nativo del navegador
    console.log(`${getTimestamp()} ▶ [create-incident-test] Confirmando envío...`);
    page.once('dialog', async dialog => {
      console.log(`${getTimestamp()} ▶ Confirmación: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.waitForSelector('#crear-incidente-btn', { visible: true });
    await page.click('#crear-incidente-btn');

    // Verificar aumento de filas
    await page.reload();
    const countAfter = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);

    if (countAfter > countBefore) {
      console.log(`${getTimestamp()} ` + chalk.green('✔ Incidente creado exitosamente'));
      testPassed = true;
    } else {
      throw new Error(`El número de incidentes no aumentó (antes: ${countBefore}, después: ${countAfter})`);
    }

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

module.exports = runIncidentTest;

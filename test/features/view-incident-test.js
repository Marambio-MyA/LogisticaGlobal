// features/view-incident-test.js

require('dotenv').config();
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { getTimestamp, login, navagation_to_incidents} = require('../utils/common');

const INCIDENT_LOCATION = 'Sala de servidores - Piso 3';
const INCIDENT_DESCRIPTION = 'El servidor principal presenta sobrecalentamiento constante';
const INCIDENT_TYPE = 'colision';

async function runViewIncidentTest() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
    slowMo: 25,
  });

  const page = await browser.newPage();
  let testPassed = true;

  try {
    console.log(`${getTimestamp()} ▶ [view-incident-test] Iniciando sesión...`);
    await login(page);

    console.log(`${getTimestamp()} ▶ [view-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents(page);

    await page.waitForSelector('tbody.MuiTableBody-root tr');
    const rows = await page.$$('tbody.MuiTableBody-root tr');

    // Obtener el último botón de ver (usamos el id del incidente desde la celda)
    console.log(`${getTimestamp()} ▶ [view-incident-test] Seleccionando último incidente...`);
    const lastRow = rows[rows.length - 1];

    const viewButton = await lastRow.$('button[id^="ver-incidente-"]');
    await viewButton.click();

    // Esperar a que aparezca el formulario de visualización
    console.log(`${getTimestamp()} ▶ [view-incident-test] Verificando datos del incidente...`);

    // Esperar y obtener valores por ID
    await page.waitForSelector('#ubicacion-view');
    const location = await page.$eval('#ubicacion-view', el => el.value);

    await page.waitForSelector('#descripcion-view');
    const description = await page.$eval('#descripcion-view', el => el.value);

    await page.waitForSelector('#tipo-view');
    const tipo = await page.$eval('#tipo-view', el => el.value);

    // Validar valores
    if (
      location === INCIDENT_LOCATION &&
      description === INCIDENT_DESCRIPTION &&
      tipo.toLowerCase() === INCIDENT_TYPE
    ) {
      console.log(`${getTimestamp()} ▶ ` + chalk.green('✔ Visualización de incidente coincide con los datos creados.'));
      testPassed = true;
    } else {
      console.log(`${getTimestamp()} ▶ ` + chalk.yellow('✖ Datos obtenidos:'));
      console.log(`   Ubicación esperada: "${INCIDENT_LOCATION}", obtenida: "${location}"`);
      console.log(`   Descripción esperada: "${INCIDENT_DESCRIPTION}", obtenida: "${description}"`);
      console.log(`   Tipo esperado: "${INCIDENT_TYPE}", obtenido: "${tipo}"`);
      throw new Error('Los datos visualizados no coinciden con los creados.');
    }

  } catch (error) {
    console.error(`${getTimestamp()} `+ chalk.red(`✖ Error: ${error.message}`));
    testPassed = false;
  } finally {
    await browser.close();
    return {
      passed: testPassed ? 1 : 0,
      failed: testPassed ? 0 : 1
    };
  }
}

module.exports = runViewIncidentTest;

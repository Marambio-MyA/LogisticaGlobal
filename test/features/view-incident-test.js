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
    slowMo: 50,
  });

  const page = await browser.newPage();
  let testPassed = false;

  try {
    console.log(`${getTimestamp()} ▶ [view-incident-test] Iniciando sesión...`);
    await login(page);

    console.log(`${getTimestamp()} ▶ [view-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents(page);

    await page.waitForSelector('tbody.MuiTableBody-root tr');

    // Contar los incidentes existentes
    console.log(`${getTimestamp()} ▶ [view-incident-test] Contando incidentes existentes...`);
    const countBefore = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);
    console.log(`${getTimestamp()} ▶ [view-incident-test] Total de incidentes antes de la prueba: ${countBefore}`);


    // Seleccionar la última fila y hacer clic en el ícono de "Ver"
    console.log(`${getTimestamp()} ▶ [view-incident-test] Seleccionando último incidente...`);
    const rows = await page.$$('tbody.MuiTableBody-root tr');
    const lastRow = rows[rows.length - 1];
    
    const actionButtons = await lastRow.$$(':scope td:last-child button');
    const viewButton = actionButtons[0];
    await viewButton.click();

    // Esperar y verificar campos
    console.log(`${getTimestamp()} ▶ [view-incident-test] Verificando datos del incidente...`);

    async function getInputValueByLabel(page, labelText) {
      return await page.evaluate((labelText) => {
        const labels = Array.from(document.querySelectorAll('label'));
        const targetLabel = labels.find(label => label.textContent.trim() === labelText);
        if (!targetLabel) return null;

        const inputOrTextarea = targetLabel.parentElement.querySelector('input, textarea');
        return inputOrTextarea?.value ?? null;
      }, labelText);
    }

    const location = await getInputValueByLabel(page, 'Ubicación');
    const description = await getInputValueByLabel(page, 'Descripción');
    const tipo = await getInputValueByLabel(page, 'Tipo de Incidente');

    // Validar valores
    if (
      location === INCIDENT_LOCATION &&
      description === INCIDENT_DESCRIPTION &&
      tipo.toLowerCase() === INCIDENT_TYPE
    ) {
      console.log(`${getTimestamp()} ▶ [view-incident-test]` + chalk.green('✔ Visualización de incidente coincide con los datos creados.'));
      testPassed = true;
    } else {
      console.log(`${getTimestamp()} ▶ [view-incident-test]` +chalk.yellow('Datos obtenidos:'));
      console.log(`${getTimestamp()} ▶ [view-incident-test] Ubicación esperada: "${INCIDENT_LOCATION}", obtenida: "${location}"`);
      console.log(`${getTimestamp()} ▶ [view-incident-test] Descripción esperada: "${INCIDENT_DESCRIPTION}", obtenida: "${description}"`);
      console.log(`${getTimestamp()} ▶ [view-incident-test] Tipo esperado: "${INCIDENT_TYPE}", obtenido: "${tipo}"`);
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

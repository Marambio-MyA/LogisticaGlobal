// features/delete-incident-test.js

require('dotenv').config();
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { getTimestamp, login, navagation_to_incidents } = require('../utils/common');

async function runDeleteIncidentTest() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
    slowMo: 50,
  });

  const page = await browser.newPage();
  let testPassed = false;

  try {
    console.log(`${getTimestamp()} ▶ [delete-incident-test] Iniciando sesión...`);
    await login(page);

    console.log(`${getTimestamp()} ▶ [delete-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents(page);

    await page.waitForSelector('tbody.MuiTableBody-root tr');
    const countBefore = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);
    console.log(`${getTimestamp()} ▶ [delete-incident-test] Total de incidentes actuales: ${countBefore}`);

    if (countBefore === 0) throw new Error('No hay incidentes para eliminar');

    // Seleccionar última fila
    const rows = await page.$$('tbody.MuiTableBody-root tr');
    const lastRow = rows[rows.length - 1];
    // Obtener todos los botones dentro de la celda de acciones
    const actionButtons = await lastRow.$$(':scope td:last-child button');
    const deleteIcon = actionButtons[2];

    // Escuchar el diálogo de confirmación
    page.once('dialog', async (dialog) => {
      console.log(`${getTimestamp()} ▶ [delete-incident-test] Confirmación: "${dialog.message()}"`);
      await dialog.accept();
    });

    // Hacer clic en el ícono de eliminar
    await deleteIcon.evaluate(btn => btn.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await deleteIcon.click();

    // Esperar que el número de incidentes disminuya
    await page.waitForFunction(
      (prevCount) => {
        const rows = document.querySelectorAll('tbody.MuiTableBody-root tr');
        return rows.length < prevCount;
      },
      {},
      countBefore
    );

    const countAfter = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);
    console.log(`${getTimestamp()} ▶ [delete-incident-test] Total de incidentes leugo de eliminación: ${countAfter}`);

    if (countAfter < countBefore) {
      console.log(`${getTimestamp()} `+ chalk.green('✔ Incidente eliminado exitosamente'));
      testPassed = true;
    } else {
      throw new Error('El incidente no fue eliminado correctamente.');
    }

  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
  } finally {
    await browser.close();
    return {
      passed: testPassed ? 1 : 0,
      failed: testPassed ? 0 : 1
    };
  }
}

module.exports = runDeleteIncidentTest;

require('dotenv').config();
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { getTimestamp, login, navagation_to_incidents } = require('../utils/common');

async function runDeleteIncidentTest() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
    slowMo: 25,
  });

  const page = await browser.newPage();
  let testPassed = false;

  try {
    console.log(`${getTimestamp()} ▶ [delete-incident-test] Iniciando sesión...`);
    await login(page);

    console.log(`${getTimestamp()} ▶ [delete-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents(page);

    await page.waitForSelector('tbody.MuiTableBody-root tr');
    const rows = await page.$$('tbody.MuiTableBody-root tr');
    const countBefore = rows.length;
    console.log(`${getTimestamp()} ▶ [delete-incident-test] Total de incidentes actuales: ${countBefore}`);

    if (countBefore === 0) throw new Error('No hay incidentes para eliminar');

    const lastRow = rows[rows.length - 1];

    // Buscar el botón cuyo ID comienza con eliminar-incidente-
    const deleteButton = await lastRow.$('button[id^="eliminar-incidente-"]');
    if (!deleteButton) throw new Error('No se encontró el botón de eliminar en la última fila');

    const parentButton = await deleteButton.evaluateHandle(el => el.closest('button'));

    // Escuchar confirmación
    page.once('dialog', async (dialog) => {
      console.log(`${getTimestamp()} ▶ [delete-incident-test] Confirmación: "${dialog.message()}"`);
      await dialog.accept();
    });

    // Hacer clic
    await parentButton.click();

    // Esperar que el incidente se elimine (es decir, que la cantidad de filas baje)
    await page.waitForFunction(
      (prevCount) => document.querySelectorAll('tbody.MuiTableBody-root tr').length < prevCount,
      {},
      countBefore
    );

    const countAfter = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);
    console.log(`${getTimestamp()} ▶ [delete-incident-test] Total luego de eliminar: ${countAfter}`);

    if (countAfter < countBefore) {
      console.log(`${getTimestamp()} ` + chalk.green('✔ Incidente eliminado exitosamente'));
      testPassed = true;
    } else {
      throw new Error('El incidente no fue eliminado correctamente.');
    }

  } catch (error) {
    console.error(`${getTimestamp()} ` + chalk.red(`✖ Error: ${error.message}`));
  } finally {
    await browser.close();
    return {
      passed: testPassed ? 1 : 0,
      failed: testPassed ? 0 : 1
    };
  }
}

module.exports = runDeleteIncidentTest;

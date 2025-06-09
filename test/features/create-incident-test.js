// features/incident-test.js

require('dotenv').config();
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { getTimestamp, login, navagation_to_incidents } = require('../utils/common');

const INCIDENT_LOCATION = 'Sala de servidores - Piso 3';
const INCIDENT_DESCRIPTION = 'El servidor principal presenta sobrecalentamiento constante';
const INCIDENT_TYPE = 'colision';
const ROBOT_ID = 2; 
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
    // Iniciar sesión en la aplicación
    console.log(`${getTimestamp()} ▶ [create-incident-test] Iniciando sesión...`);
    await login(page);

    // Dirigir a la página de Incidentes
    console.log(`${getTimestamp()} ▶ [create-incident-test] Navegando a Incidentes...`);
    await navagation_to_incidents(page);

    // Contar los incidentes existentes
    await page.waitForSelector('tbody.MuiTableBody-root tr');
    const countBefore = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);

    // Boton "Nuevo Incidente"
    console.log(`${getTimestamp()} ▶ [create-incident-test] Esperando botón 'Nuevo Incidente'...`);
    await page.waitForSelector('[id="nuevo-incidente-btn"]', {
      visible: true,
      timeout: 5000,
    });
    console.log(`${getTimestamp()} ▶ [create-incident-test] Haciendo clic en 'Nuevo Incidente' y abrir el modal...`);
    await page.click('[id="nuevo-incidente-btn"]');

    // Rellenar la ubicación
    console.log(`${getTimestamp()} ▶ [create-incident-test] Rellenando Ubicación...`);
    await page.$eval('[input-id="ubicacion-input"] input', (input, value) => {
    input.focus();
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value').set;
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, INCIDENT_LOCATION);

    // Rellenar la descripción
    console.log(`${getTimestamp()} ▶ [create-incident-test] Rellenando Descripción...`);
    await page.waitForSelector('[input-id="descripcion-input"] textarea', { visible: true });

    await page.$eval('[input-id="descripcion-input"] textarea', (textarea, value) => {
      textarea.focus();
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(textarea), 'value').set;
      setter.call(textarea, value);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }, INCIDENT_DESCRIPTION);

    // Seleccionar el tipo de incidente
    console.log(`${getTimestamp()} ▶ [create-incident-test] Seleccionando Tipo de Incidente...`);
    await page.click('[input-id="tipo-incidente-select"]');
    await page.waitForSelector(`[input-id="tipo-option-${INCIDENT_TYPE}"]`, { visible: true });
    await page.click(`[input-id="tipo-option-${INCIDENT_TYPE}"]`);

    
    
    // Hacer clic en el botón AGREGAR del robot
    console.log(`${getTimestamp()} ▶ [create-incident-test] Agregando robot ${ROBOT_ID}...`);
    await page.waitForSelector(`[input-id="agregar-robot-${ROBOT_ID}"]`, { visible: true });
    await page.click(`[input-id="agregar-robot-${ROBOT_ID}"]`);

    await page.waitForSelector(`[input-id="estado-robot-${ROBOT_ID}"]`, { visible: true });
    await page.click(`[input-id="estado-robot-${ROBOT_ID}"]`);


    // Seleccionar el estado del robot
    console.log(`${getTimestamp()} ▶ [create-incident-test] Seleccionando estado "${ESTADO_DESEADO}"...`);
    await page.waitForSelector(
      `[input-id="estado-opcion-${ROBOT_ID}-${ESTADO_DESEADO}"]`,
      { visible: true }
    );
    await page.click(`[input-id="estado-opcion-${ROBOT_ID}-${ESTADO_DESEADO}"]`);

    // Confirmar el diálogo de creación de incidente
    console.log(`${getTimestamp()} ▶ [create-incident-test] Preparando confirmación del diálogo...`);

    const dialogHandler = async dialog => {
      console.log(`${getTimestamp()} ▶ [create-incident-test] Confirmación del navegador: "${dialog.message()}"`);
      await dialog.accept();
    };

    page.once('dialog', dialogHandler);

    console.log(`${getTimestamp()} ▶ [create-incident-test] Enviando formulario...`);
    await page.waitForSelector('[button-id="crear-incidente-btn"]', { visible: true });
    await page.click('[button-id="crear-incidente-btn"]');


    // Contar incidentes después
    const countAfter = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);

    // Validación
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

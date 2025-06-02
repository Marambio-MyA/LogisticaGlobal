// features/incident-test.js

require('dotenv').config();
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { getTimestamp } = require('../utils/common');

const URL = process.env.URL;
const SUCCESS_EMAIL = process.env.EMAIL;
const SUCCESS_PASSWORD = process.env.PASSWORD;

const INCIDENT_LOCATION = 'Sala de servidores - Piso 3';
const INCIDENT_DESCRIPTION = 'El servidor principal presenta sobrecalentamiento constante';
const INCIDENT_TYPE = 'colision';
const ROBOT_ID = 2; 
const ESTADO_DESEADO = 'fuera_servicio';

async function runIncidentTest() {
  const browser = await puppeteer.launch({ headless: "new" , slowMo: 50});
  const page = await browser.newPage();
  let testPassed = false;

  try {
    // Iniciar sesión en la aplicación
    console.log(`${getTimestamp()} ▶ Iniciando sesión...`);
    await page.goto(URL);

    await page.waitForSelector('input[name="email"]');
    await page.type('input[name="email"]', SUCCESS_EMAIL);

    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', SUCCESS_PASSWORD);

    // Click en botón "Entrar"
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.trim() === 'Entrar');
      if (btn) btn.click();
    });

    // Dirigir a la página de Incidentes
    console.log(`${getTimestamp()} ▶ Navegando a Incidentes...`);
    await page.waitForSelector('ul.MuiList-root');
    await page.evaluate(() => {
      const menu = [...document.querySelectorAll('li')]
        .find(li => li.textContent.trim() === 'Incidentes');
      menu?.click();
    });

    // Contar los incidentes existentes
    await page.waitForSelector('tbody.MuiTableBody-root tr');
    const countBefore = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);

    // Boton "Nuevo Incidente"
    console.log(`${getTimestamp()} ▶ Esperando botón 'Nuevo Incidente'...`);
    await page.waitForSelector('[data-testid="nuevo-incidente-btn"]', {
      visible: true,
      timeout: 5000,
    });
    console.log(`${getTimestamp()} ▶ Haciendo clic en 'Nuevo Incidente' y abrir el modal...`);
    await page.click('[data-testid="nuevo-incidente-btn"]');

    // Rellenar la ubicación
    console.log(`${getTimestamp()} ▶ Rellenando Ubicación...`);
    await page.$eval('[data-testid="ubicacion-input"] input', (input, value) => {
    input.focus();
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value').set;
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, INCIDENT_LOCATION);

    // Rellenar la descripción
    console.log(`${getTimestamp()} ▶ Rellenando Descripción...`);
    await page.waitForSelector('[data-testid="descripcion-input"] textarea', { visible: true });

    await page.$eval('[data-testid="descripcion-input"] textarea', (textarea, value) => {
      textarea.focus();
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(textarea), 'value').set;
      setter.call(textarea, value);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }, INCIDENT_DESCRIPTION);

    // Seleccionar el tipo de incidente
    console.log(`${getTimestamp()} ▶ Seleccionando Tipo de Incidente...`);
    await page.click('[data-testid="tipo-incidente-select"]');
    await page.waitForSelector(`[data-testid="tipo-option-${INCIDENT_TYPE}"]`, { visible: true });
    await page.click(`[data-testid="tipo-option-${INCIDENT_TYPE}"]`);

    
    
    // Hacer clic en el botón AGREGAR del robot
    console.log(`${getTimestamp()} ▶ Agregando robot ${ROBOT_ID}...`);
    await page.waitForSelector(`[data-testid="agregar-robot-${ROBOT_ID}"]`, { visible: true });
    await page.click(`[data-testid="agregar-robot-${ROBOT_ID}"]`);

    await page.waitForSelector(`[data-testid="estado-robot-${ROBOT_ID}"]`, { visible: true });
    await page.click(`[data-testid="estado-robot-${ROBOT_ID}"]`);


    // Seleccionar el estado del robot
    console.log(`${getTimestamp()} ▶ Seleccionando estado "${ESTADO_DESEADO}"...`);
    await page.waitForSelector(
      `[data-testid="estado-opcion-${ROBOT_ID}-${ESTADO_DESEADO}"]`,
      { visible: true }
    );
    await page.click(`[data-testid="estado-opcion-${ROBOT_ID}-${ESTADO_DESEADO}"]`);

    // Confirmar el diálogo de creación de incidente
    console.log(`${getTimestamp()} ▶ Preparando confirmación del diálogo...`);

    const dialogHandler = async dialog => {
      console.log(`${getTimestamp()} ▶ Confirmación del navegador: "${dialog.message()}"`);
      await dialog.accept();
    };

    page.once('dialog', dialogHandler);

    console.log(`${getTimestamp()} ▶ Enviando formulario...`);
    await page.waitForSelector('[data-testid="crear-incidente-btn"]', { visible: true });
    await page.click('[data-testid="crear-incidente-btn"]');


    // Contar incidentes después
    const countAfter = await page.$$eval('tbody.MuiTableBody-root tr', rows => rows.length);

    // Validación
    if (countAfter > countBefore) {
      console.log(chalk.green(`${getTimestamp()} ✔ Incidente creado exitosamente`));
      testPassed = true;
    } else {
      throw new Error(`El número de incidentes no aumentó (antes: ${countBefore}, después: ${countAfter})`);
    }

  } catch (error) {
    console.error(chalk.red(`${getTimestamp()} ✖ Error: ${error.message}`));
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

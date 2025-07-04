// features/login-test.js

require('dotenv').config();
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const { getTimestamp } = require('../utils/common');

// Variables de entorno
const URL = process.env.TEST_URL;
const SUCCESS_EMAIL = process.env.TEST_EMAIL;
const SUCCESS_PASSWORD = process.env.TEST_PASSWORD;

/**
 * Cada test case indica:
 * - name: descripción
 * - email, password: datos para inyectar
 * - expectSuccess: si esperamos login válido o no
 */
const loginCases = [
  {
    name: 'Email incorrecto',
    email: 'correo@noexiste.com',
    password: 'contraseñaCorrecta',
    expectSuccess: false,
  },
  {
    name: 'Contraseña incorrecta',
    email: 'usuario@ejemplo.com',
    password: 'contraseñaIncorrecta',
    expectSuccess: false,
  },
  {
    name: 'Campos vacíos',
    email: '',
    password: '',
    expectSuccess: false,
  },
  {
    name: 'Solo email válido',
    email: 'usuario@ejemplo.com',
    password: '',
    expectSuccess: false,
  },
  {
    name: 'Solo contraseña',
    email: '',
    password: 'contraseñaCorrecta',
    expectSuccess: false,
  },
  {
    name: 'Login exitoso',
    email: SUCCESS_EMAIL,
    password: SUCCESS_PASSWORD,
    expectSuccess: true,
  },
];

/**
 * Ejecuta todos los casos de login y devuelve un objeto con
 * la cantidad de tests pasados y fallidos, sin hacer throw.
 */
async function runLoginTests() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });
  let passed = 0;
  let failed = 0;

  // (Opcional) imprimir un encabezado local
  console.log(`${getTimestamp()} ▶ [login-test] Iniciando ${loginCases.length} casos de login…`);

  for (let i = 0; i < loginCases.length; i++) {
    const testCase = loginCases[i];
    const caseNumber = i + 1;
    const page = await browser.newPage();

    console.log(`${getTimestamp()} ▶ [login-test] Case ${caseNumber}: "${testCase.name}"`);

    await page.goto(URL);

    // Email
    await page.waitForSelector('#email-input');
    await page.evaluate(() => {
      document.querySelector('#email-input').value = '';
    });
    await page.type('#email-input', testCase.email);

    // Password
    await page.waitForSelector('#password-input');
    await page.evaluate(() => {
      document.querySelector('#password-input').value = '';
    });
    await page.type('#password-input', testCase.password);

    // Click en botón "Entrar"
    await page.waitForSelector('#login-button');
    await page.click('#login-button');

    // Esperamos navegación: si falla el login, no redirige
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
    } catch (e) {
      // No importa: puede que el login haya fallado y no haya redirección
    }

    const finalUrl = page.url();
    const loginExitoso = finalUrl.includes('/dashboard');

    // Validación
    if (testCase.expectSuccess && loginExitoso) {
      console.log(`${getTimestamp()} ` + chalk.green('✔ Resultado esperado: login exitoso.'));
      // Hacer click en "Cerrar sesión" cuando el login sea exitoso
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button'))
          .find(b => b.textContent.trim() === 'Cerrar sesión');
        if (btn) btn.click();
      });
      passed++;
    } else if (!testCase.expectSuccess && !loginExitoso) {
      console.log(`${getTimestamp()}    ` + chalk.yellow('✔ Resultado esperado: login rechazado.'));
      passed++;
    } else {
      console.log(`${getTimestamp()}    ` + chalk.red(`✖ Resultado inesperado (URL final: ${finalUrl})`));
      failed++;
    }

    await page.close();
  }

  await browser.close();

  // Retornamos los casos pasados y fallidos
  return { passed, failed };
}

module.exports = runLoginTests;

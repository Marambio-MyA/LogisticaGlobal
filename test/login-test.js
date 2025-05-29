const puppeteer = require('puppeteer');
const chalk = require('chalk');

function getTimestamp() {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0];
  return `[${date} ${time}]`;
}


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
    email: 'johndoe@example.com',
    password: 'asdfg',
    expectSuccess: true,
  },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });

  const chalk = require('chalk'); // Asegúrate de tener chalk@4 instalado

  let passed = 0;
  let failed = 0;

// Dentro de tu bucle for
for (let i = 0; i < loginCases.length; i++) {
  const testCase = loginCases[i];
  const caseNumber = i + 1;

  const page = await browser.newPage();
  console.log(`${getTimestamp()}  Case ${caseNumber}: ${testCase.name}`);

  await page.goto('https://logisticaglobal-frontend-production.up.railway.app');


  await page.waitForSelector('input[name="email"]');
  await page.evaluate(() => document.querySelector('input[name="email"]').value = '');
  await page.type('input[name="email"]', testCase.email);

  await page.waitForSelector('input[type="password"]');
  await page.evaluate(() => document.querySelector('input[type="password"]').value = '');
  await page.type('input[type="password"]', testCase.password);

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.trim() === 'Entrar');
    if (btn) btn.click();
  });

  try {
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
  } catch (e) {
    // Navigation puede no suceder si el login falla
  }

  const loginExitoso = page.url().includes('/dashboard');

  if (testCase.expectSuccess && loginExitoso) {
    console.log(`${getTimestamp()}  ` + chalk.green('✔ Login exitoso y redirección detectada'));
    passed++;
  } else if (!testCase.expectSuccess && !loginExitoso) {
    console.log(`${getTimestamp()}  ` + chalk.yellow('✔ Fallo esperado (login rechazado)'));
    passed++;
  } else {
    console.log(`${getTimestamp()}  ` + chalk.red('✖ Resultado inesperado'));
    failed++;
  }

  await page.close();
  }

  await browser.close();

  console.log('\n===============TEST SESSION RESULTS===============');
  console.log(`${getTimestamp()}  Correctly expected cases: ` + chalk.green(passed));
  console.log(`${getTimestamp()}  Cases with unexpected results: ` + chalk.red(failed));
  console.log('===================================================');
})();

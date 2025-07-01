const { getTimestamp } = require('./utils/common');
const chalk = require('chalk');
require('dotenv').config();

// Función para imprimir el resumen de un test específico
function printResults(label, passed, failed) {
  console.log(`${getTimestamp()} [Resumen ${label}] expected cases: ` + chalk.green(passed) + ` | unexpected cases: ` + chalk.red(failed) + `\n`);
}

// Función para imprimir el resumen global de toda la sesión de tests
function printGlobalResults(totalPassed, totalFailed) {
  console.log('\n=============== TEST SESSION RESULTS ===============');
  console.log(`${getTimestamp()} Correctly expected cases:   ` + chalk.green(totalPassed));
  console.log(`${getTimestamp()} Cases with unexpected results: ` + chalk.red(totalFailed));
  console.log('==================================================\n');
}

(async () => {
  console.log('\n===================== STARTING ALL TESTS =====================\n');
  console.log(`URL test: ${process.env.TEST_URL}`);

  try {
    let totalPassed = 0;
    let totalFailed = 0;

    // Lista de tests a ejecutar: [ etiqueta, ruta del módulo ]
    const testsToRun = [
      ['login-test', './features/login-test'],
      ['create-incident-test', './features/create-incident-test'],
      ['view-incident-test', './features/view-incident-test'],
      ['update-incident-test', './features/update-incident-test'],
      ['delete-incident-test', './features/delete-incident-test'],
      ['crud-users-test', './features/crud-users-test'],
      // Agrega más tests aquí si es necesario
    ];

    for (const [label, modulePath] of testsToRun) {
      const runTest = require(modulePath);
      const { passed, failed } = await runTest();

      printResults(label, passed, failed);

      totalPassed += passed;
      totalFailed += failed;

      // Si un test crítico falla, detén la ejecución
      if (failed > 0 && label === 'login-test') {
        console.error(`${getTimestamp()} Some login tests failed. Aborting remaining tests.\n`);
        break;
      }
    }

    printGlobalResults(totalPassed, totalFailed);

    process.exit(totalFailed > 0 ? 1 : 0);
  } catch (err) {
    console.error('\n Error executing some test:\n', err, '\n');
    process.exit(1);
  }
})();

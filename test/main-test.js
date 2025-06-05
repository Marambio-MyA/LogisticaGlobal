const { getTimestamp } = require('./utils/common');
const chalk = require('chalk');


// Muestra por consola el resumen de un conjunto de tests individuales.
function printResults(label, passed, failed) {
  console.log(`${getTimestamp()} [Resumen ${label}] expected cases: ` + chalk.green(passed) + ` | unexpected cases: ` + chalk.red(failed) + `\n`);
}


// Muestra por consola el resumen global de todos los tests que se han ejecutado.
function printGlobalResults(totalPassed, totalFailed) {
  console.log('\n===============TEST SESSION RESULTS===============');
  console.log(`${getTimestamp()} Correctly expected cases:   ` + chalk.green(totalPassed));
  console.log(`${getTimestamp()} Cases with unexpected results: ` + chalk.red(totalFailed));
  console.log('==================================================\n');
}

(async () => {
  console.log('\n===================== STARTING ALL TESTS =====================\n');

  try {
    // Totales globales (acumularemos resultados de cada feature aquí)
    let totalPassed = 0;
    let totalFailed = 0;
    /*
    // 1) Ejecutar tests de login
    const runLoginTests = require('./features/login-test');
    const { passed: loginPassed, failed: loginFailed } = await runLoginTests();
    printResults('login-test', loginPassed, loginFailed);
    totalPassed += loginPassed;
    totalFailed += loginFailed;

    // Si hubo fallos en login, detenemos aquí mismo y mostramos resumen global parcial
    if (loginFailed > 0) {
      console.error(`${getTimestamp()} Some login tests failed. The following tests are stopped.\n`);
      printGlobalResults(totalPassed, totalFailed);
      process.exit(1);
    }

    // 2) Ejecutar tests de creación de incidente
    const runCreateIncidentTests = require('./features/create-incident-test');
    const { passed: createIncidentPassed, failed: createIncidentFailed } = await runCreateIncidentTests();
    printResults('create-incident-test', createIncidentPassed, createIncidentFailed);
    totalPassed += createIncidentPassed;
    totalFailed += createIncidentFailed;
    */
    // 3) Ejecutar tests de actualización de incidente
    const runUpdateIncidentTests = require('./features/update-incident-test');
    const { passed: updateIncidentPassed, failed: updateIncidentFailed } = await runUpdateIncidentTests();
    printResults('update-incident-test', updateIncidentPassed, updateIncidentFailed);
    totalPassed += updateIncidentPassed;
    totalFailed += updateIncidentFailed;

    // Mostrar resumen global final
    printGlobalResults(totalPassed, totalFailed);
    process.exit(0);

  } catch (err) {
    console.error('\n Error executing some test:\n', err, '\n');
    process.exit(1);
  }
})();

import { getTimestamp } from './utils/common.js';
import chalk from 'chalk';

function printResults(label, passed, failed) {
  console.log(
    `${getTimestamp()} [Resumen ${label}] expected cases: ` +
      chalk.green(passed) +
      ` | unexpected cases: ` +
      chalk.red(failed) +
      `\n`
  );
}

function printGlobalResults(totalPassed, totalFailed) {
  console.log('\n=============== TEST SESSION RESULTS ===============');
  console.log(`${getTimestamp()} Correctly expected cases:   ` + chalk.green(totalPassed));
  console.log(`${getTimestamp()} Cases with unexpected results: ` + chalk.red(totalFailed));
  console.log('==================================================\n');
}

const testsToRun = [
  ['login-test', './features/login-test-s.js'],
  ['create-incident-test', './features/create-incident-test-s.js'],
  ['view-incident-test', './features/view-incident-test-s.js'],
  ['update-incident-test', './features/update-incident-test-s.js'],
  ['delete-incident-test', './features/delete-incident-test-s.js'],
  ['view-crud-user-test', './features/crud-users-test-s.js'],
  // Agrega más tests aquí si es necesario
];

let totalPassed = 0;
let totalFailed = 0;

console.log('\n===================== STARTING ALL TESTS =====================\n');

try {
  for (const [label, modulePath] of testsToRun) {
    const module = await import(modulePath);
    const runTest = module.runLoginTests
      || module.runCreateIncidentTests
      || module.runViewIncidentTests
      || module.runUpdateIncidentTests
      || module.runDeleteIncidentTests
      || module.runCrudUsersTests
      || module.default
      || module.runTest;


    if (typeof runTest !== 'function') {
      throw new Error(`No se encontró una función ejecutable en ${modulePath}`);
    }

    const { passed, failed } = await runTest();

    printResults(label, passed, failed);

    totalPassed += passed;
    totalFailed += failed;

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

// Utilidad para generar "LoginTest", "CreateIncidentTest", etc.
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

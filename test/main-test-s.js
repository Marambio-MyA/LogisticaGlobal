import { getTimestamp } from "./utils/common.js";
import chalk from "chalk";
import { runLoginTests } from "./features/login-test-s.js";
import { runCreateIncidentTests } from "./features/create-incident-test-s.js";
import { runViewIncidentTests } from "./features/view-incident-test-s.js";
import { runUpdateIncidentTests } from "./features/update-incident-test-s.js";
import { runDeleteIncidentTests } from "./features/delete-incident-test-s.js";
// Muestra por consola el resumen de un conjunto de tests individuales.
function printResults(label, passed, failed) {
  console.log(
    `${getTimestamp()} [Resumen ${label}] expected cases: ` +
      chalk.green(passed) +
      ` | unexpected cases: ` +
      chalk.red(failed) +
      `\n`
  );
}

// Muestra por consola el resumen global de todos los tests que se han ejecutado.
function printGlobalResults(totalPassed, totalFailed) {
  console.log("\n===============TEST SESSION RESULTS===============");
  console.log(
    `${getTimestamp()} Correctly expected cases:   ` + chalk.green(totalPassed)
  );
  console.log(
    `${getTimestamp()} Cases with unexpected results: ` + chalk.red(totalFailed)
  );
  console.log("==================================================\n");
}

(async () => {
  console.log(
    "\n===================== STARTING ALL TESTS =====================\n"
  );

  try {
    let totalPassed = 0;
    let totalFailed = 0;

    // 1) Login test
    const { passed: loginPassed, failed: loginFailed } = await runLoginTests();
    printResults("login-test", loginPassed, loginFailed);
    totalPassed += loginPassed;
    totalFailed += loginFailed;

    if (loginFailed > 0) {
      console.error(
        `${getTimestamp()} Some login tests failed. The following tests are stopped.\n`
      );
      printGlobalResults(totalPassed, totalFailed);
      process.exit(1);
    }

    // 2) Crear incidente
    const { passed: createIncidentPassed, failed: createIncidentFailed } =
      await runCreateIncidentTests();
    printResults(
      "create-incident-test",
      createIncidentPassed,
      createIncidentFailed
    );
    totalPassed += createIncidentPassed;
    totalFailed += createIncidentFailed;

    // 3) Ver incidente
    const { passed: viewIncidentPassed, failed: viewIncidentFailed } =
      await runViewIncidentTests();
    printResults("view-incident-test", viewIncidentPassed, viewIncidentFailed);
    totalPassed += viewIncidentPassed;
    totalFailed += viewIncidentFailed;

    // 4) Actualizar incidente
    const { passed: updateIncidentPassed, failed: updateIncidentFailed } =
      await runUpdateIncidentTests();
    printResults(
      "update-incident-test",
      updateIncidentPassed,
      updateIncidentFailed
    );
    totalPassed += updateIncidentPassed;
    totalFailed += updateIncidentFailed;

    // 5) Eliminar incidente
    const { passed: deleteIncidentPassed, failed: deleteIncidentFailed } =
      await runDeleteIncidentTests();
    printResults(
      "delete-incident-test",
      deleteIncidentPassed,
      deleteIncidentFailed
    );
    totalPassed += deleteIncidentPassed;
    totalFailed += deleteIncidentFailed;

    // Resumen global
    printGlobalResults(totalPassed, totalFailed);
    process.exit(0);
  } catch (err) {
    console.error("\n Error executing some test:\n", err, "\n");
    process.exit(1);
  }
})();

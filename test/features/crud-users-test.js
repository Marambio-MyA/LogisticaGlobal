require("dotenv").config();
const puppeteer = require("puppeteer");
const chalk = require("chalk");
const { getTimestamp, login, navagation_to_users } = require("../utils/common");

const USER_NAME = "Pedro Godoy";
const USER_EMAIL = "pedro@godoy.cl";
const USER_PASSWORD = "pelaitoGod1234!";
const USER_ROL = "admin";

async function runUsuariosTests() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
    slowMo: 50,
  });

  const page = await browser.newPage();

  // Para aceptar automáticamente alertas/confirmaciones
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  let passed = 0;
  let failed = 0;

  try {
    console.log(`${getTimestamp()} ▶ [usuarios-test] Iniciando sesión...`);
    await login(page);

    console.log(
      `${getTimestamp()} ▶ [usuarios-test] Navegando a la vista de usuarios...`
    );
    await navagation_to_users(page);

    // --- Test 3: Crear nuevo usuario ---
    try {
      await page.waitForSelector("#nuevo-usuario-btn", { timeout: 3000 });
      await page.click("#nuevo-usuario-btn");

      // Boton "Nuevo usuario"
      console.log(
        `${getTimestamp()} ▶ [create-usuario-test] Esperando botón 'Nuevo Incidente'...`
      );
      await page.waitForSelector('[id="nuevo-usuario-btn"]', {
        visible: true,
        timeout: 5000,
      });
      console.log(
        `${getTimestamp()} ▶ [create-usuario-test] Haciendo clic en 'Nuevo usuario' y abrir el modal...`
      );

      // //nombre
      // console.log(
      //   `${getTimestamp()} ▶ [create-usuario-test] Rellenando nombre...`
      // );
      // await page.$eval(
      //   '[input-id="nombre-input"] input',
      //   (input, value) => {
      //     input.focus();
      //     const setter = Object.getOwnPropertyDescriptor(
      //       Object.getPrototypeOf(input),
      //       "value"
      //     ).set;
      //     setter.call(input, value);
      //     input.dispatchEvent(new Event("input", { bubbles: true }));
      //   },
      //   USER_NAME
      // );

      // Rellenar la ubicación
      console.log(
        `${getTimestamp()} ▶ [create-usuario-test] Rellenando Ubicación...`
      );
      await page.$eval(
        'input[input-id="nombre-input"]',
        (input, value) => {
          console.log(input);
          console.log(value);
          input.focus();
          const setter = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(input),
            "value"
          ).set;
          setter.call(input, value);
          input.dispatchEvent(new Event("input", { bubbles: true }));
        },
        USER_NAME
      );

      await page.waitForTimeout(1500);
      console.log(
        `${getTimestamp()} ▶ [usuarios-test] ` +
          chalk.green("✔ Usuario creado correctamente.")
      );
      passed++;
    } catch (err) {
      console.error(
        `${getTimestamp()} ▶ [usuarios-test] ` +
          chalk.red(`✖ Test 3 falló: ${err.message}`)
      );
      failed++;
    }

    // --- Test 4: Editar primer usuario ---
    try {
      await page.waitForSelector("tbody tr", { timeout: 3000 });

      const firstRow = (await page.$$("tbody tr"))[0];
      if (!firstRow) throw new Error("No hay filas en tabla para editar");

      // Botón editar dentro de la fila (buscar por aria-label o svg)
      const editBtn = await firstRow.$(
        'button[aria-label="EditIcon"], button:has(svg[aria-label="EditIcon"])'
      );
      if (!editBtn) throw new Error("Botón editar no encontrado");

      await editBtn.click();

      await page.waitForSelector("#edit-nombre-input", { timeout: 3000 });
      await page.click("#edit-nombre-input", { clickCount: 3 });
      await page.type("#edit-nombre-input", "Usuario Editado");

      const saveBtn = await page.$(
        'button[type=submit], button:has-text("Guardar Cambios")'
      );
      if (!saveBtn) throw new Error("Botón guardar cambios no encontrado");
      await saveBtn.click();

      await page.waitForTimeout(1500);
      console.log(
        `${getTimestamp()} ▶ [usuarios-test] ` +
          chalk.green("✔ Usuario editado correctamente.")
      );
      passed++;
    } catch (err) {
      console.error(
        `${getTimestamp()} ▶ [usuarios-test] ` +
          chalk.red(`✖ Test 4 falló: ${err.message}`)
      );
      failed++;
    }

    // --- Test 5: Eliminar primer usuario ---
    try {
      await page.waitForSelector("tbody tr", { timeout: 3000 });
      const firstRow = (await page.$$("tbody tr"))[0];
      if (!firstRow) throw new Error("No hay filas para eliminar");

      const deleteBtn = await firstRow.$(
        'button[aria-label="DeleteIcon"], button:has(svg[aria-label="DeleteIcon"])'
      );
      if (!deleteBtn) throw new Error("Botón eliminar no encontrado");

      await deleteBtn.click();

      await page.waitForTimeout(1500); // Esperar confirmación (dialog aceptado automáticamente)
      console.log(
        `${getTimestamp()} ▶ [usuarios-test] ` +
          chalk.green("✔ Usuario eliminado correctamente.")
      );
      passed++;
    } catch (err) {
      console.error(
        `${getTimestamp()} ▶ [usuarios-test] ` +
          chalk.red(`✖ Test 5 falló: ${err.message}`)
      );
      failed++;
    }
  } catch (err) {
    console.error(
      `${getTimestamp()} ▶ [usuarios-test] ` +
        chalk.red(`✖ Error en ejecución de tests: ${err.message}`)
    );
    failed++;
  } finally {
    await browser.close();
    return { passed, failed };
  }
}

module.exports = runUsuariosTests;
// Al final de features/crud-users-test.js (solo para pruebas directas):
if (require.main === module) {
  (async () => {
    const { getTimestamp } = require("../utils/common");
    const chalk = require("chalk");

    const { passed, failed } = await module.exports();

    console.log(
      `${getTimestamp()} [Resumen view-crud-user-test] expected cases: ` +
        chalk.green(passed) +
        ` | unexpected cases: ` +
        chalk.red(failed)
    );
  })();
}

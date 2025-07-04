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
  let passed = 0;
  let failed = 0;

  try {
    console.log(`${getTimestamp()} ▶ [usuarios-test] Iniciando sesión...`);
    await login(page);

    console.log(`${getTimestamp()} ▶ [usuarios-test] Navegando a usuarios...`);
    await navagation_to_users(page);

    // Test: Crear usuario
    try {
      console.log(`${getTimestamp()} ▶ [create-user-test] Abriendo formulario...`);
      await page.waitForSelector('#nuevo-usuario-btn', { timeout: 5000 });
      await page.click('#nuevo-usuario-btn');

      await page.waitForSelector('#nombre-input');
      await page.type('#nombre-input', USER_NAME);

      await page.waitForSelector('#email-input');
      await page.type('#email-input', USER_EMAIL);

      await page.waitForSelector('#password-input');
      await page.type('#password-input', USER_PASSWORD);

      await page.click('#rol-select');
      await page.waitForSelector(`#rol-option-${USER_ROL}`);
      await page.click(`#rol-option-${USER_ROL}`);

      page.once('dialog', async (dialog) => {
        console.log(`${getTimestamp()} ▶ [create-user-test] Confirmación: ${dialog.message()}`);
        await dialog.accept();
      });

      await page.click('#crear-usuario-btn');
      await page.reload();

      console.log(`${getTimestamp()} ▶ [create-user-test] ` + chalk.green("Usuario creado correctamente."));
      passed++;
    } catch (err) {
      console.error(`${getTimestamp()} ▶ [create-user-test] ` + chalk.red(`Error: ${err.message}`));
      failed++;
    }

    // Test: Editar primer usuario
    try {
      console.log(`${getTimestamp()} ▶ [edit-user-test] Abriendo editor...`);
      await page.waitForSelector('tbody tr', { timeout: 5000 });

      const firstRow = (await page.$$('tbody tr'))[0];
      const editBtn = await firstRow.$('button[id^="editar-usuario-"]');
      const parentButton = await editBtn.evaluateHandle(el => el.closest('button'));
      await parentButton.click();

      await page.waitForSelector('#edit-nombre-input', { timeout: 5000 });
      await page.click('#edit-nombre-input', { clickCount: 3 });
      await page.type('#edit-nombre-input', 'Usuario Editado');

      page.once('dialog', async (dialog) => {
        console.log(`${getTimestamp()} ▶ [edit-user-test] Confirmación: ${dialog.message()}`);
        await dialog.accept();
      });

      await page.click('#guardar-cambios-btn');
      await page.reload();

      console.log(`${getTimestamp()} ▶ [edit-user-test] ` + chalk.green("Usuario editado correctamente."));
      passed++;
    } catch (err) {
      console.error(`${getTimestamp()} ▶ [edit-user-test] ` + chalk.red(`Error: ${err.message}`));
      failed++;
    }

    // Test: Eliminar último usuario
    try {
      console.log(`${getTimestamp()} ▶ [delete-user-test] Eliminando último usuario...`);
      
      // Contar antes
      await page.waitForSelector('tbody tr');
      const countBefore = await page.$$eval('tbody tr', rows => rows.length);
      console.log(`${getTimestamp()} ▶ [delete-user-test] Total antes de eliminar: ${countBefore}`);

      const rows = await page.$$('tbody tr');
      const lastRow = rows[rows.length - 1];

      const deleteBtn = await lastRow.$('button[id^="eliminar-usuario-"]');
      const parentButton = await deleteBtn.evaluateHandle(el => el.closest('button'));

      page.once('dialog', async (dialog) => {
        console.log(`${getTimestamp()} ▶ [delete-user-test] Confirmación: ${dialog.message()}`);
        await dialog.accept();
      });

      await parentButton.click();
      await page.reload();

      // Contar después
      await page.waitForSelector('tbody tr');
      const countAfter = await page.$$eval('tbody tr', rows => rows.length);
      console.log(`${getTimestamp()} ▶ [delete-user-test] Total después de eliminar: ${countAfter}`);

      if (countAfter < countBefore) {
        console.log(`${getTimestamp()} ▶ [delete-user-test] ` + chalk.green("Usuario eliminado correctamente."));
        passed++;
      } else {
        throw new Error("El número de usuarios no disminuyó tras la eliminación.");
      }

    } catch (err) {
      console.error(`${getTimestamp()} ▶ [delete-user-test] ` + chalk.red(`Error: ${err.message}`));
      failed++;
    }

  } catch (err) {
    console.error(`${getTimestamp()} ▶ [usuarios-test] ` + chalk.red(`Error general: ${err.message}`));
    failed++;
  } finally {
    await browser.close();
    return { passed, failed };
  }
}

module.exports = runUsuariosTests;

if (require.main === module) {
  (async () => {
    const { passed, failed } = await module.exports();
    console.log(
      `${getTimestamp()} ▶ [usuarios-test] Resumen → Casos OK: ` +
        chalk.green(passed) +
        ` | Casos con error: ` +
        chalk.red(failed)
    );
  })();
}
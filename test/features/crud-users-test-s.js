import dotenv from 'dotenv';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import chalk from 'chalk';
import { getTimestamp, login_selenium, navagation_to_users_selenium } from '../utils/common.js';

dotenv.config();

const USER_NAME = 'Pedro Godoy';
const USER_EMAIL = 'pedro@godoy.cl';
const USER_PASSWORD = 'pelaitoGod1234!';
const USER_ROL = 'admin';

export async function runCrudUsersTests() {
  let passed = 0;
  let failed = 0;

  const options = new chrome.Options();
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--headless'); // Quita '--headless' si quieres ver el navegador

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log(`${getTimestamp()} ▶ [crud-users-test] Iniciando sesión...`);
    await login_selenium(driver);

    console.log(`${getTimestamp()} ▶ [crud-users-test] Navegando a Usuarios...`);
    await navagation_to_users_selenium(driver);

    // ========================= CREAR USUARIO ============================
    try {
      console.log(`${getTimestamp()} ▶ [crud-users-test] Test: Crear usuario...`);
      await driver.wait(until.elementLocated(By.css('tbody tr')), 5000);
      const rowsBefore = await driver.findElements(By.css('tbody tr'));
      const countBefore = rowsBefore.length;

      await driver.findElement(By.id('nuevo-usuario-btn')).click();

      await driver.wait(until.elementLocated(By.css('[input-id="nombre-input"] input')), 5000).sendKeys(USER_NAME);
      await driver.findElement(By.css('[input-id="email-input"] input')).sendKeys(USER_EMAIL);
      await driver.findElement(By.css('[input-id="password-input"] input')).sendKeys(USER_PASSWORD);

      await driver.findElement(By.id('rol-select')).click();
      await driver.findElement(By.id(`rol-option-${USER_ROL}`)).click();

      const createBtn = await driver.findElement(By.xpath("//button[contains(., 'Crear usuario')]"));
      await createBtn.click();

      // Confirmación de alerta
      await driver.wait(until.alertIsPresent(), 3000);
      const alert = await driver.switchTo().alert();
      await alert.accept();

      await driver.sleep(1500);

      const rowsAfter = await driver.findElements(By.css('tbody tr'));
      if (rowsAfter.length > countBefore) {
        console.log(`${getTimestamp()} ▶ [crud-users-test] ` + chalk.green("✔ Usuario creado correctamente."));
        passed++;
      } else {
        throw new Error("El número de usuarios no aumentó tras la creación.");
      }

    } catch (err) {
      console.error(`${getTimestamp()} ▶ [crud-users-test] ` + chalk.red(`✖ Crear usuario falló: ${err.message}`));
      failed++;
    }

    // ========================= EDITAR USUARIO ============================
    try {
      console.log(`${getTimestamp()} ▶ [crud-users-test] Test: Editar usuario...`);

      await driver.wait(until.elementLocated(By.css('tbody tr')), 5000);
      const firstRow = (await driver.findElements(By.css('tbody tr')))[0];
      if (!firstRow) throw new Error("No hay usuarios para editar.");

      const editBtn = await firstRow.findElement(By.css('button svg[data-testid="EditIcon"]'));
      const parentBtn = await editBtn.findElement(By.xpath('./ancestor::button'));
      await parentBtn.click();

      const nameInput = await driver.wait(until.elementLocated(By.id("edit-nombre-input")), 5000);

      // Borrar el campo completamente (clear no siempre funciona)
      await nameInput.click();
      await nameInput.sendKeys("\u0001", "\u0008"); // Ctrl+A + Backspace
      await nameInput.sendKeys("Pedro Modificado");

      const saveBtn = await driver.findElement(By.xpath("//button[contains(., 'Guardar Cambios')]"));
      await saveBtn.click();

      await driver.wait(until.alertIsPresent(), 3000);
      const alert = await driver.switchTo().alert();
      await alert.accept();

      await driver.sleep(1500);
      console.log(`${getTimestamp()} ▶ [crud-users-test] ` + chalk.green("✔ Usuario editado correctamente."));
      passed++;
    } catch (err) {
      console.error(`${getTimestamp()} ▶ [crud-users-test] ` + chalk.red(`✖ Editar usuario falló: ${err.message}`));
      failed++;
    }

    // ========================= ELIMINAR USUARIO ============================
    try {
        console.log(`${getTimestamp()} ▶ [crud-users-test] Test: Eliminar usuario...`);

        await driver.wait(until.elementLocated(By.css("tbody tr")), 5000);
        await driver.sleep(1000); // Ver usuarios cargados

        const rowsBefore = await driver.findElements(By.css("tbody tr"));
        const countBefore = rowsBefore.length;
        console.log(`${getTimestamp()} ▶ Usuarios antes de eliminar: ${countBefore}`);

        if (countBefore === 0) throw new Error("No hay usuarios para eliminar");

        const lastRow = rowsBefore[rowsBefore.length - 1];
        const emailCell = await lastRow.findElement(By.css("td:nth-child(2)"));
        const email = await emailCell.getText();
        console.log(`${getTimestamp()} ▶ Usuario a eliminar: ${email}`);

        // Obtener el botón de eliminar del último usuario
        const deleteIcon = await lastRow.findElement(By.css('svg[data-testid="DeleteIcon"]'));
        const deleteButton = await deleteIcon.findElement(By.xpath('./ancestor::button'));
        await deleteButton.click();

        await driver.sleep(1000); // Esperar a que aparezca el alert

        try {
        await driver.wait(until.alertIsPresent(), 3000);
        const alert = await driver.switchTo().alert();
        console.log(`${getTimestamp()} ▶ Confirmación del navegador: "${await alert.getText()}"`);
        await driver.sleep(500);
        await alert.accept();
        console.log(`${getTimestamp()} ▶ Confirmación aceptada`);
        } catch (err) {
        console.warn(`${getTimestamp()} ⚠ No se detectó diálogo de confirmación`);
        }

        await driver.sleep(2500); // Dar tiempo para que DOM se actualice

        const rowsAfter = await driver.findElements(By.css("tbody tr"));
        const countAfter = rowsAfter.length;
        console.log(`${getTimestamp()} ▶ Usuarios después de eliminar: ${countAfter}`);

        if (countAfter < countBefore) {
        console.log(`${getTimestamp()} ▶ ` + chalk.green("✔ Usuario eliminado correctamente."));
        passed++;
        } else {
        throw new Error("El número de usuarios no disminuyó tras eliminación.");
        }
        } catch (err) {
        console.error(`${getTimestamp()} ▶ [crud-users-test] ` + chalk.red(`✖ Eliminar usuario falló: ${err.message}`));
        failed++;
        }

  } catch (err) {
    console.error(`${getTimestamp()} ▶ [crud-users-test] ` + chalk.red(`✖ Error general: ${err.message}`));
    failed++;
  } finally {
    await driver.quit();
    return { passed, failed };
  }
}

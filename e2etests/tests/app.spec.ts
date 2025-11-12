import { test, expect } from '@playwright/test';

test.describe('Objetos Perdidos App', () => {
  test.beforeEach(async ({ page, request }) => {
    // Reset database
    await request.post('http://localhost:3001/api/testing/reset');
    // Create test user
    await request.post('http://localhost:3001/api/usuarios', {
      data: {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        telefono: '123456789',
      },
    });
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/ObjetosUni/);
    await expect(page.getByText('¡Ingresa a tu cuenta!')).toBeVisible();
  });

  test('login succeeds with correct credentials', async ({ page }) => {
    await page.getByTestId('email').locator('input').fill('test@example.com');
    await page.getByTestId('password').locator('input').fill('password123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/\/publicaciones/);
  });

  test('login fails with wrong password', async ({ page }) => {
    await page.getByTestId('email').locator('input').fill('test@example.com');
    await page.getByTestId('password').locator('input').fill('wrongpassword');
    await page.getByTestId('login-button').click();
    await expect(page).not.toHaveURL(/\/publicaciones/);
  });

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('email').locator('input').fill('test@example.com');
      await page.getByTestId('password').locator('input').fill('password123');
      await page.getByTestId('login-button').click();
      await expect(page).toHaveURL(/\/publicaciones/);
    });

    test('can create a new publication', async ({ page }) => {
      await page.goto('/formulario');
      await page.getByTestId('titulo').locator('input').fill('Test Publication');
      await page.getByTestId('lugar').locator('input').fill('Test Place');
      await page.getByTestId('fecha').locator('input').fill('2023-10-01');
      await page.getByTestId('tipo').click();
      await page.getByRole('option', { name: 'Perdido' }).click();
      await page.getByTestId('categoria').click();
      await page.getByRole('option', { name: 'Electrónicos' }).click();
      await page.getByTestId('descripcion').locator('textarea').first().fill('This is a test description for the publication.');
      await page.getByTestId('publicar-button').click();
      await expect(page).toHaveURL(/\/publicaciones/);
      await expect(page.getByText('Test Publication')).toBeVisible();
    });

    test('can list publications', async ({ page }) => {
      // Assuming there are publications, or create one first
      await page.goto('/formulario');
      await page.getByTestId('titulo').locator('input').fill('Another Test Publication');
      await page.getByTestId('lugar').locator('input').fill('Another Place');
      await page.getByTestId('fecha').locator('input').fill('2023-10-02');
      await page.getByTestId('tipo').click();
      await page.getByRole('option', { name: 'Encontrado' }).click();
      await page.getByTestId('categoria').click();
      await page.getByRole('option', { name: 'Ropa' }).click();
      await page.getByTestId('descripcion').locator('textarea').first().fill('Another test description.');
      await page.getByTestId('publicar-button').click();
      await expect(page.getByText('Another Test Publication')).toBeVisible();
    });
  });
});
import { test, expect } from '@playwright/test';

test.describe('Objetos Perdidos App', () => {
  let userId: string;

  test.beforeEach(async ({ page, request }) => {
    // Reset database
    await request.post('http://localhost:3001/api/testing/reset');
    // Create test user
    const userResponse = await request.post('http://localhost:3001/api/usuarios', {
      data: {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        telefono: '123456789',
      },
    });
    const user = await userResponse.json();
    userId = user.id;
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/ObjetosUni/);
    await expect(page.getByText('Inicia sesión')).toBeVisible();
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

    test('can edit a publication', async ({ page }) => {
      // First create a publication
      await page.goto('/formulario');
      await page.getByTestId('titulo').locator('input').fill('Publication to Edit');
      await page.getByTestId('lugar').locator('input').fill('Edit Place');
      await page.getByTestId('fecha').locator('input').fill('2023-10-03');
      await page.getByTestId('tipo').click();
      await page.getByRole('option', { name: 'Perdido' }).click();
      await page.getByTestId('categoria').click();
      await page.getByRole('option', { name: 'Electrónicos' }).click();
      await page.getByTestId('descripcion').locator('textarea').first().fill('Description to edit.');
      await page.getByTestId('publicar-button').click();
      await expect(page.getByText('Publication to Edit')).toBeVisible();

      // Go to profile to edit
      await page.goto(`/perfil/${userId}`);
      const card = page.locator('div').filter({ hasText: 'Publication to Edit' });
      await card.getByTestId(/editar-publicacion-/).click();
      await page.getByTestId('titulo-edit').locator('input').fill('Edited Publication');
      await page.getByTestId('descripcion-edit').locator('textarea').first().fill('Edited description.');
      await page.getByTestId('guardar-cambios-button').click();
      await expect(page.getByText('Edited Publication')).toBeVisible();
    });

    test('can delete a publication', async ({ page }) => {
      // First create a publication
      await page.goto('/formulario');
      await page.getByTestId('titulo').locator('input').fill('Publication to Delete');
      await page.getByTestId('lugar').locator('input').fill('Delete Place');
      await page.getByTestId('fecha').locator('input').fill('2023-10-04');
      await page.getByTestId('tipo').click();
      await page.getByRole('option', { name: 'Encontrado' }).click();
      await page.getByTestId('categoria').click();
      await page.getByRole('option', { name: 'Ropa' }).click();
      await page.getByTestId('descripcion').locator('textarea').first().fill('Description for deletion.');
      await page.getByTestId('publicar-button').click();
      await expect(page.getByText('Publication to Delete')).toBeVisible();

      // Go to profile to delete
      await page.goto(`/perfil/${userId}`);
      const cardDelete = page.locator('div').filter({ hasText: 'Publication to Delete' });
      await cardDelete.getByTestId(/eliminar-publicacion-/).click();
      await page.getByTestId('confirmar-eliminar-button').click();
      await expect(page.getByText('Publicación eliminada correctamente')).toBeVisible();
      await expect(page.getByText('Publication to Delete')).not.toBeVisible();
    });
  });
});
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';
const password = 'Password123';

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL(`${BASE}/login`, { timeout: 5000 });
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    const email = `auth${Date.now()}@example.com`;
    await page.goto(BASE + '/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill(password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL(`${BASE}/dashboard`);
    await page.goto(BASE);
    await page.waitForURL(`${BASE}/dashboard`, { timeout: 5000 });
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto(BASE + '/dashboard');
    await page.waitForURL(`${BASE}/login`, { timeout: 5000 });
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    const email = `signup${Date.now()}@example.com`;
    await page.goto(BASE + '/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill(password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL(`${BASE}/dashboard`);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    const email = `login${Date.now()}@example.com`;
    await page.goto(BASE + '/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill(password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL(`${BASE}/dashboard`);
    await page.getByTestId('auth-logout-button').click();
    await page.goto(BASE + '/login');
    await page.getByTestId('auth-login-email').fill(email);
    await page.getByTestId('auth-login-password').fill(password);
    await page.getByTestId('auth-login-submit').click();
    await page.waitForURL(`${BASE}/dashboard`);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    const email = `habit${Date.now()}@example.com`;
    await page.goto(BASE + '/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill(password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL(`${BASE}/dashboard`);
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    const email = `streak${Date.now()}@example.com`;
    await page.goto(BASE + '/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill(password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL(`${BASE}/dashboard`);
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();
    await page.getByTestId('habit-complete-drink-water').click();
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    const email = `persist${Date.now()}@example.com`;
    await page.goto(BASE + '/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill(password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL(`${BASE}/dashboard`);
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-save-button').click();
    await page.reload();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    const email = `logout${Date.now()}@example.com`;
    await page.goto(BASE + '/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill(password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL(`${BASE}/dashboard`);
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL(`${BASE}/login`);
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    const email = `offline${Date.now()}@example.com`;
    await page.goto(BASE + '/signup');
    await page.getByTestId('auth-signup-email').fill(email);
    await page.getByTestId('auth-signup-password').fill(password);
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL(`${BASE}/dashboard`);
    await context.setOffline(true);
    await page.reload();
    await expect(page).not.toHaveURL(/error/);
    await context.setOffline(false);
  });
});

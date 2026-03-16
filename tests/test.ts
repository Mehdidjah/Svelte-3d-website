import { expect, test } from '@playwright/test';

test('homepage smoke test preserves the current 3D experience', async ({ page }) => {
	const pageErrors: Error[] = [];

	page.on('pageerror', (error) => {
		pageErrors.push(error);
	});

	await page.goto('/');
	await expect(page).toHaveTitle('Svelte-3D');

	await page.waitForTimeout(2600);

	await expect(page.getByText('A new Svelte-3D website')).toBeVisible();
	await expect(page.locator('canvas')).toBeVisible();
	await expect(page.getByRole('link', { name: /check it out on github/i })).toBeVisible();
	expect(pageErrors).toEqual([]);
});

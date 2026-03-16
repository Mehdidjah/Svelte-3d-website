import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'tests',
	testMatch: ['**/test.ts'],
	use: {
		baseURL: 'http://127.0.0.1:4173',
		launchOptions: {
			args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
		}
	},
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1',
		port: 4173,
		reuseExistingServer: false,
		timeout: 120_000
	}
});

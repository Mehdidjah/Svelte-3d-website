import type { Component } from 'svelte';

type ComponentModule = Promise<{ default: Component }>;

const imports: Record<string, ComponentModule> = {};

export async function dynamicImport(module: string, promise: ComponentModule) {
	imports[module] = promise;
	return (await promise).default;
}

export async function waitForImports(modules: string[]) {
	return await Promise.all(modules.map((mod) => imports[mod]).filter(Boolean));
}

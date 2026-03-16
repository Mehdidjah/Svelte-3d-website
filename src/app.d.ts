// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	interface Window {
		dataLayer: Array<Record<string, unknown>>;
	}

	namespace svelteHTML {
		interface HTMLAttributes<_T> {
			'on:intersecting'?: (event: CustomEvent<IntersectionObserverEntry>) => void;
		}
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare module '*.glsl' {
	const source: string;
	export default source;
}

export {};

import type { Action } from 'svelte/action';

type IntersectionAttributes = {
	'on:intersecting'?: (event: CustomEvent<IntersectionObserverEntry>) => void;
};

export const intersection: Action<
	HTMLElement,
	IntersectionObserverInit | undefined,
	IntersectionAttributes
> = (node, options) => {
	let observer = observe(node, options || {});

	return {
		update(options = {}) {
			unobserve(observer);
			observer = observe(node, options);
		},

		destroy() {
			unobserve(observer);
		}
	};
};

function observe(node: HTMLElement, options?: IntersectionObserverInit) {
	// let intersectionObserverEntry: IntersectionObserverEntry | null = null;

	const handler = (entries: IntersectionObserverEntry[]) => {
		if (entries[0]?.isIntersecting) {
			node.dispatchEvent(new CustomEvent('intersecting', { detail: entries[0] }));
		}
	};

	const observer = new IntersectionObserver(handler, options);
	observer.observe(node);

	return observer;
}

function unobserve(observer: IntersectionObserver | null) {
	if (observer) {
		observer.disconnect();
	}
}

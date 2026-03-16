import { onMount } from 'svelte';
import { get } from 'svelte/store';
import type ThreejsHand from 'threejs-hand';

import { smoothScrollStore } from '$lib/stores/threejsHand';

type ScrollListener = (scrollEngine: ThreejsHand) => void;

export function useScroll(callback: ScrollListener) {
	let scrollEngineVal = get(smoothScrollStore);
	let removeListener: (() => void) | undefined;

	const unsubscribe = smoothScrollStore.subscribe((scrollEngine) => {
		removeListener?.();
		scrollEngineVal = scrollEngine;

		if (!scrollEngine) return;

		removeListener = scrollEngine.on('scroll', callback);
		callback(scrollEngine);
	});

	onMount(() => {
		return () => {
			removeListener?.();
			scrollEngineVal?.off('scroll', callback);
			unsubscribe();
		};
	});
}

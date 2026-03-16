import type ThreejsHand from 'threejs-hand';
import { writable } from 'svelte/store';

export const smoothScrollStore = writable<ThreejsHand | null>(null);

export function setSmoothScrollStore(scrollEngine: ThreejsHand | null) {
	smoothScrollStore.set(scrollEngine);
}

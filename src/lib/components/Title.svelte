<script lang="ts">
	import cn from 'clsx';

	import { introOutStore } from '$lib/stores/introOut';
	import WordmarkPrimary from './WordmarkPrimary.svelte';
	import WordmarkSecondary from './WordmarkSecondary.svelte';

	let className = '';

	export { className as class };
</script>

<div class={className}>
	<WordmarkPrimary fill="var(--blue)" />
	<WordmarkSecondary fill="var(--blue)" class={cn($introOutStore && 'translate', 'mobile')} />
</div>

<style lang="scss">
	@use '../styles/_functions' as *;

	$intro-out: 1500ms;

	:global(.translate) {
		@include desktop {
			transform: translate3d(0, -100%, 0);
			transition: transform $intro-out var(--ease-out-expo);
		}
	}

	:global(.mobile) {
		@include mobile {
			transform: translate3d(0, -105%, 0);
		}
	}
</style>

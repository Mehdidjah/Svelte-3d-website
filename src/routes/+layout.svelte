<script lang="ts">
	import { onMount } from 'svelte';
	import ThreejsHand from 'threejs-hand';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import cn from 'clsx';

	import { browser, dev } from '$app/environment';
	import { page } from '$app/stores';
	import { smoothScrollStore as smoothScroll, setSmoothScrollStore } from '$lib/stores/threejsHand';
	import { themeStore } from '$lib/stores/theme';
	import { useScroll } from '$lib/lifecycle-functions/useScroll';
	import { useFrame } from '$lib/lifecycle-functions/useFrame';
	import { raf } from '$lib/utils/tempus';

	import CustomHead from '$lib/components/CustomHead.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import Scrollbar from '$lib/components/Scrollbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import '$lib/styles/global.scss';

	let className = '';

	export { className as class };

	if (browser) {
		gsap.registerPlugin(ScrollTrigger);

		// Merge rafs
		gsap.ticker.remove(gsap.updateRoot);
		raf.add((time) => {
			gsap.updateRoot(time! / 1000);
		}, 0);
	}

	let hash = '';

	useScroll(() => ScrollTrigger.update());

	ScrollTrigger.defaults({ markers: dev });

	// $: if (browser && $smoothScroll) {
	// 	ScrollTrigger.refresh();
	// }

	$: if (browser && $smoothScroll) {
		ScrollTrigger.refresh();
		$smoothScroll.start();
	}

	$: if (browser && $smoothScroll && hash) {
		const target = document.querySelector(hash);

		if (target instanceof HTMLElement) {
			$smoothScroll.scrollTo(target, { offset: 0 });
		}
	}

	onMount(() => {
		window.history.scrollRestoration = 'manual';
		window.scrollTo(0, 0);

		const scrollEngine = new ThreejsHand();
		setSmoothScrollStore(scrollEngine);

		function onLinkClick(e: MouseEvent) {
			e.preventDefault();

			const node = e.currentTarget;
			const nodeHash = (node as HTMLLinkElement).href.split('#').pop();

			hash = '#' + nodeHash;

			setTimeout(() => {
				window.location.hash = hash;
			}, 0);
		}

		const internalLinks: Element[] = [...document.querySelectorAll('[href]')].filter((node) =>
			(node as HTMLLinkElement).href.includes($page.url.pathname + '#')
		);

		internalLinks.forEach((node) => {
			(node as HTMLLinkElement).addEventListener('click', onLinkClick, false);
		});

		return () => {
			internalLinks.forEach((node) => {
				(node as HTMLLinkElement).removeEventListener('click', onLinkClick, false);
			});

			$smoothScroll?.destroy();
			setSmoothScrollStore(null);
		};
	});

	useFrame((time) => {
		if (time !== undefined) {
			$smoothScroll?.raf(time);
		}
	});
</script>

<!-- <RealViewport /> -->
<CustomHead title="Svelte-3D" />
<div class={cn(`theme-${$themeStore}`, 'layout', className)}>
	<!-- <PageTransition /> -->
	<Intro />
	<Cursor />
	<Scrollbar />
	<main class="main"><slot /></main>
	<Footer />
</div>

<style lang="scss">
	@use '../lib/styles/_functions' as *;

	.layout {
		background-color: var(--theme-primary);
		color: var(--theme-secondary);
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		.main {
			flex-grow: 1;
		}
	}
</style>

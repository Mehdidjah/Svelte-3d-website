<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { gsap } from 'gsap';

	import { useWindowSize } from '$lib/lifecycle-functions/useWindowSize';
	import { useMediaQuery } from '$lib/lifecycle-functions/useMediaQuery';
	import { useRect } from '$lib/lifecycle-functions/useRect';
	import { useScroll } from '$lib/lifecycle-functions/useScroll';
	import { clamp, mapRange } from '$lib/utils/maths';

	let wrapperRectRef: HTMLDivElement;
	let elementRectRef: HTMLDivElement;

	const emit = createEventDispatcher();

	const isMobile = useMediaQuery('(max-width: 800px)');
	const [setWrapperRectRef, wrapperRect] = useRect();
	const [setElementRectRef, elementRect] = useRect();

	const [windowSize] = useWindowSize();

	let windowWidth: number = 0;
	let contentWidth = 0;

	const onResize = () => {
		windowWidth = Math.min(window.innerWidth, document.documentElement.offsetWidth);
		contentWidth = elementRectRef?.scrollWidth ?? 0;
	};

	useScroll(({ scroll }) => {
		if (!elementRectRef) return;

		const start = $wrapperRect.top - $windowSize.height;
		const end = $wrapperRect.top + $wrapperRect.height - $windowSize.height;

		let progress = mapRange(start, end, scroll, 0, 1);
		progress = clamp(0, progress, 1);

		const x = progress * Math.max(0, contentWidth - windowWidth);

		const cards = [...elementRectRef.children];

		gsap.to(cards, {
			x: -x,
			stagger: 0.033,
			ease: 'none',
			duration: 0
		});
	});

	onMount(() => {
		onResize();

		setWrapperRectRef(wrapperRectRef);
		setElementRectRef(elementRectRef);

		emit('mounted');
	});
</script>

<svelte:window on:resize={onResize} />

<div
	class="wrapper"
	bind:this={wrapperRectRef}
	style={`${elementRectRef && !$isMobile ? 'height: ' + contentWidth + 'px' : ''}`}
>
	<div class="inner">
		<div bind:this={elementRectRef} class="overflow hide-on-mobile">
			<slot />
		</div>
		<div class="cards hide-on-desktop"><slot /></div>
	</div>
</div>

<style lang="scss">
	@use '../styles/_functions' as *;

	.wrapper {
		.inner {
			overflow: hidden;
			display: flex;

			.overflow {
				display: flex;

				> :global(.card) {
					flex-shrink: 0;
				}
			}

			@include mobile {
				width: mobile-vw(375px);
			}

			@include desktop {
				position: sticky;
				--height: #{desktop-vw(440px)};
				top: calc((100vh - var(--height)) / 2);
			}

			@include mobile {
				.cards {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 100%;

					> :global(.card) {
						margin-bottom: mobile-vw(32px);
					}
				}
			}
		}
	}
</style>

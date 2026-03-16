<script lang="ts">
	import { onMount } from 'svelte';
	import cn from 'clsx';

	import { smoothScrollStore as smoothScroll } from '$lib/stores/threejsHand';
	import { introOutStore } from '$lib/stores/introOut';
	import { addThreshold } from '$lib/stores/thresholds';
	import { setThemeStore, themeStore } from '$lib/stores/theme';
	import {
		homePageLoadedComponentsStore,
		resetHomePageLoadedComponentsStore,
		setHomePageLoadedComponentsStore
	} from '$lib/stores/homePageLoadedComponents';
	import { intersection } from '$lib/actions/intersection';
	import { useRect } from '$lib/lifecycle-functions/useRect';
	import { useWindowSize } from '$lib/lifecycle-functions/useWindowSize';
	import { useScroll } from '$lib/lifecycle-functions/useScroll';
	import { clamp, mapRange } from '$lib/utils/maths';

	import { projects } from '$lib/content/projects';

	import Button from '$lib/components/Button.svelte';
	import Hand from '$lib/components/Hand/index.svelte';
	import Title from '$lib/components/Title.svelte';
	import HeroTextIn from '$lib/components/HeroTextIn.svelte';
	import ListItem from '$lib/components/ListItem.svelte';
	import Card from '$lib/components/Card.svelte';
	import Sfdr from '$lib/components/Icons/Sfdr.svelte';
	import Github from '$lib/components/Icons/Github.svelte';

	type AppearTitleComponent = Awaited<typeof import('../lib/components/AppearTitle.svelte')>['default'];
	type ParallaxComponent = Awaited<typeof import('../lib/components/Parallax.svelte')>['default'];
	type HorizontalSlidesComponent =
		Awaited<typeof import('../lib/components/HorizontalSlides.svelte')>['default'];
	type FeatureCardsComponent =
		Awaited<typeof import('../lib/components/FeatureCards/FeatureCards.svelte')>['default'];

	let AppearTitle: AppearTitleComponent | null = null;
	let Parallax: ParallaxComponent | null = null;
	let HorizontalSlides: HorizontalSlidesComponent | null = null;
	let FeatureCards: FeatureCardsComponent | null = null;

	let hasScrolled = false;
	let visible = false;

	const [size] = useWindowSize();
	const [setZoomWrapperRectRef, zoomWrapperRect] = useRect();
	const [setWhyRectRef, whyRect] = useRect();
	const [setCardsRectRef, cardsRect] = useRect();
	const [setWhiteRectRef, whiteRect] = useRect();
	const [setFeaturesRectRef, featuresRect] = useRect();
	const [setInuseRectRef] = useRect();

	let zoomWrapperRef: HTMLElement;
	let whyRef: HTMLElement;
	let cardsRectRef: HTMLElement;
	let whiteRectRef: HTMLElement;
	let featuresRectRef: HTMLElement;
	let inuseRectRef: HTMLElement;

	$: if (Object.keys($homePageLoadedComponentsStore).length === 4) {
		setRectRefs();

		setTimeout(() => {
			updateThresholds();
		}, 800);
	}

	onMount(() => {
		resetHomePageLoadedComponentsStore();

		void (async () => {
			AppearTitle = (await import('../lib/components/AppearTitle.svelte')).default;
			HorizontalSlides = (await import('../lib/components/HorizontalSlides.svelte')).default;
			Parallax = (await import('../lib/components/Parallax.svelte')).default;
			FeatureCards = (await import('../lib/components/FeatureCards/FeatureCards.svelte')).default;
		})();

		return () => {
			resetHomePageLoadedComponentsStore();
		};
	});

	useScroll(({ scroll }) => {
		hasScrolled = scroll > 10;

		if (!zoomWrapperRef) return;

		const start = $zoomWrapperRect.top + $size.height * 0.5;
		const end = $zoomWrapperRect.top + $zoomWrapperRect.height - $size.height;

		const center = 0.6;
		const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1);
		const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1);
		const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1);

		const theme = progress2 === 1 ? 'light' : 'dark';
		if (theme !== $themeStore) {
			setThemeStore(theme);
		}

		zoomWrapperRef.style.setProperty('--progress1', String(progress1));
		zoomWrapperRef.style.setProperty('--progress2', String(progress2));

		if (progress === 1) {
			zoomWrapperRef.style.setProperty('background-color', 'currentColor');
		} else {
			zoomWrapperRef.style.removeProperty('background-color');
		}
	});

	function setRectRefs() {
		setZoomWrapperRectRef(zoomWrapperRef);
		setWhyRectRef(whyRef);
		setCardsRectRef(cardsRectRef);
		setWhiteRectRef(whiteRectRef);
		setFeaturesRectRef(featuresRectRef);
		setInuseRectRef(inuseRectRef);
	}

	function updateThresholds() {
		addThreshold({ id: 'top', value: 0 });

		const top1 = $whyRect.top - $size.height / 2;
		addThreshold({ id: 'why-start', value: top1 });
		addThreshold({
			id: 'why-end',
			value: top1 + $whyRect.height
		});

		const top2 = $cardsRect.top - $size.height / 2;
		addThreshold({ id: 'cards-start', value: top2 });
		addThreshold({ id: 'cards-end', value: top2 + $cardsRect.height });
		addThreshold({
			id: 'red-end',
			value: top2 + $cardsRect.height + $size.height
		});

		const top3 = $whiteRect.top - $size.height;
		addThreshold({ id: 'light-start', value: top3 });

		const top4 = $featuresRect.top;
		addThreshold({ id: 'features', value: top4 });

		// const top5 = $inuseRect.top;
		const top5 = inuseRectRef.getBoundingClientRect().top;
		addThreshold({ id: 'in-use', value: top5 });

		const top6 = $smoothScroll?.limit;
		addThreshold({ id: 'end', value: top6! });
	}
</script>

<div class="canvas">
	<Hand />
</div>

<section class="hero">
	<div class="layout-grid-inner">
		<Title class="title" />
		<Sfdr class={cn('icon-hero', $introOutStore && 'show')} />
		<span class="sub">
			<HeroTextIn>
				<h2 class="h3 subtitle">Svelte-3D</h2>
			</HeroTextIn>
			<HeroTextIn>
				<h2 class="p-xs tm">
					<span>©</span>
					{new Date().getFullYear()} Mehdi
				</h2>
			</HeroTextIn>
		</span>
	</div>
	<div class="bottom layout-grid">
		<div
			class={cn('hide-on-mobile', 'scroll-hint', hasScrolled && 'hide', $introOutStore && 'show')}
		>
			<div class="text">
				<HeroTextIn>
					<p>scroll</p>
				</HeroTextIn>
				<HeroTextIn>
					<p>to explore</p>
				</HeroTextIn>
			</div>
		</div>
		<h1 class="description p-s">
			<HeroTextIn>
				<p class="p-s">A new Svelte-3D website</p>
			</HeroTextIn>
			<HeroTextIn>
				<p class="p-s">crafted with motion and depth in</p>
			</HeroTextIn>
			<HeroTextIn>
				<p class="p-s">Mehdi's creative lab</p>
			</HeroTextIn>
		</h1>
		<Button
			class={cn('cta', $introOutStore && 'in')}
			arrow={true}
			icon={Github}
			href="https://github.com/Mehdidjah/Svelte-3d-website"
		>
			Check it out on github
		</Button>
	</div>
</section>
<section class="why" data-threejs-hand-scroll-snap-align="start">
	<div class="layout-grid">
		<h2 class="sticky h2">
			{#if AppearTitle}
				<AppearTitle>Why Svelte-3D?</AppearTitle>
			{/if}
		</h2>
		<aside class="features" bind:this={whyRef}>
			<div class="feature">
				<p class="p">
					We’ve heard all the reasons to not push 3D websites further. They can feel heavy,
					over-designed, and hard to control. This project treats Svelte-3D as something that can
					still feel expressive, intentional, and sharp when it is built with care.
				</p>
			</div>
			<div class="feature">
				<h3 class="title h4">Create more immersive interfaces</h3>
				<p class="p">
					Unlock the creative potential and impact of your web experiences. Svelte-3D pulls people
					into the flow of the page with motion and depth that feel substantial instead of
					decorative.
				</p>
			</div>
			<div class="feature">
				<h3 class="title h4">Keep interaction feeling fluid</h3>
				<p class="p">
					Give every visitor a consistent sense of weight and movement whether they use trackpads,
					mouse wheels, or touch. Svelte-3D should feel controlled, polished, and alive from the
					first interaction.
				</p>
			</div>
			<div class="feature">
				<h3 class="title h4">Make your animations feel connected</h3>
				<p class="p">
					When motion, layout, and 3D details move together, the page feels like one system. That
					coordination is what gives Svelte-3D its rhythm and its personality.
				</p>
			</div>
		</aside>
	</div>
</section>
<section class="rethink">
	<div class="layout-grid pre">
		<div class="highlight" data-threejs-hand-scroll-snap-align="start">
			{#if Parallax && AppearTitle}
				<Parallax speed={-0.5} on:mounted={() => setHomePageLoadedComponentsStore('Parallax')}>
					<p class="h2">
						<AppearTitle>Rethinking Svelte-3D</AppearTitle>
					</p>
				</Parallax>
			{/if}
		</div>
		<div class="comparison">
			{#if Parallax}
				<Parallax speed={0.5}>
					<p class="p">
						The goal here is not gimmicks. It is to build a Svelte-3D experience where motion,
						composition, and interaction support each other instead of competing for attention.
					</p>
				</Parallax>
			{/if}
		</div>
	</div>
	<div class="cards" bind:this={cardsRectRef}>
		{#if HorizontalSlides}
			<HorizontalSlides on:mounted={() => setHomePageLoadedComponentsStore('HorizontalSlides')}>
				<Card class="card" number={1} text="Performance without wasting the budget" />
				<Card class="card" number={2} text="Fluid motion that still feels accessible" />
				<Card class="card" number={3} text="3D that supports the story" />
				<Card class="card" number={4} text="Animation systems that scale with the page" />
				<Card class="card" number={5} text="Respect for native web behavior" />
			</HorizontalSlides>
		{/if}
	</div>
</section>
<section bind:this={zoomWrapperRef} class="solution">
	<div class="inner">
		<div class="zoom">
			<h2 class="first h1 vh">
				so we built <br />
				<span class="contrast">web scrolling</span>
			</h2>
			<h2 class="enter h3 vh">
				Enter <br /> 3D WORLD
			</h2>
			<h2 class="second h1 vh">As it should be</h2>
		</div>
	</div>
</section>
<section class="theme-light featuring" bind:this={whiteRectRef}>
	<div class="inner">
		<div class="layout-block intro">
			<p class="p-l">
				This Svelte-3D website showcases fluid motion and 3D interactions built with Svelte and
				Three.js, focused on performance, accessibility, and a delightful user experience.
			</p>
		</div>
	</div>
	<section bind:this={featuresRectRef}>
		{#if FeatureCards}
			<FeatureCards on:mounted={() => setHomePageLoadedComponentsStore('FeatureCards')} />
		{/if}
	</section>
</section>
<section
	bind:this={inuseRectRef}
	class={cn('theme-light', 'in-use', visible && 'visible')}
	use:intersection={{
		threshold: 0.2
	}}
	on:intersecting={() => {
		visible = true;
	}}
>
	<div class="layout-grid">
		<aside class="title">
			<p class="h3">
				{#if AppearTitle}
					<AppearTitle on:mounted={() => setHomePageLoadedComponentsStore('AppearTitle')}
						>Svelte-3D
						<br />
						<span class="grey">in use</span></AppearTitle
					>
				{/if}
			</p>
		</aside>
		<ul class="list">
			{#each projects as { title, source, href }, i (i)}
				<li>
					<ListItem {title} {source} {href} index={i} {visible} />
				</li>
			{/each}
		</ul>
	</div>
</section>

<style lang="scss">
	@use '../lib/styles/_functions' as *;

	.canvas {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 50%;
			height: 100vw;
			width: 200vw;
			background: radial-gradient(var(--blue), var(--blue-transparent) 70%);
			transform: translateX(-50%) translateY(50vh);
			opacity: 0.5;
		}
	}

	$delay-intro-bottom: 150ms;
	$delay-intro-top: 450ms;
	$intro-duration: 2050ms;

	.hide-text {
		overflow: hidden;

		@include desktop {
			> * {
				transform: translate3d(0, 200%, 0);
			}
		}
	}

	.show-text {
		@include desktop {
			> * {
				transform: translate3d(0, 0, 0);
				transition: transform $intro-duration var(--ease-out-expo);
				transition-delay: $delay-intro-top;
			}
		}
	}

	.hero {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
		height: calc(100 * var(--vh));
		margin-bottom: mobile-vw(160px);
		position: relative;

		@include mobile {
			padding-bottom: mobile-vw(16px);

			> div {
				grid-gap: mobile-vw(11px);
			}
		}

		@include desktop {
			height: 100vh;
			margin-bottom: desktop-vw(320px);
		}

		:global(.title) {
			grid-column: 1 / -1;
			margin-top: mobile-vw(30px);
			width: var(--layout-width);

			@include mobile {
				height: mobile-vw(85px);
			}

			@include desktop {
				margin-top: desktop-vw(30px);
				position: absolute;
				top: 0;
				left: 2.5%;
			}
		}

		:global(.icon-hero) {
			width: mobile-vw(44px);
			height: mobile-vw(39px);

			@include desktop {
				position: relative;
				top: desktop-vw(395px);
				width: desktop-vw(44px);
				height: desktop-vw(39px);
				transform: translate3d(0, 100%, 0);
				opacity: 0;
			}

			// &.show {
			// 	@include desktop {
			// 		transition: transform $intro-duration var(--ease-out-expo),
			// 			opacity $intro-duration var(--ease-out-expo);
			// 		transition-delay: $delay-intro-top;
			// 		opacity: 1;
			// 		transform: translate3d(0, 0, 0);
			// 	}
			// }
		}

		:global(.icon-hero.show) {
			@include desktop {
				transition:
					transform $intro-duration var(--ease-out-expo),
					opacity $intro-duration var(--ease-out-expo);
				transition-delay: $delay-intro-top;
				opacity: 1;
				transform: translate3d(0, 0, 0);
			}
		}

		.sub {
			display: flex;
			flex-direction: column;
			text-align: end;
			grid-column: 2 / -1;

			@include desktop {
				position: relative;
				top: desktop-vw(395px);
				grid-column: 6 / span 7;
			}

			.subtitle {
				margin-bottom: mobile-vw(8px);

				@include desktop {
					margin-bottom: desktop-vw(12px);
				}
			}

			.tm {
				color: var(--grey);

				span {
					vertical-align: text-top;
				}
			}
		}

		.bottom {
			width: 100%;
			overflow: hidden;

			@include desktop {
				padding-bottom: desktop-vw(40px);
			}

			// Scroll Hint is only rendered on desktop
			.scroll-hint {
				position: relative;
				grid-column: 1 / span 2;
				transition:
					opacity 0.6s var(--ease-in-out-quad),
					transform 0.6s var(--ease-in-out-quad);

				.text {
					font-family: var(--font-primary);
					font-weight: 900;
					text-transform: uppercase;
					font-stretch: condensed;
					line-height: 100%;
					letter-spacing: -0.01em;

					@include desktop {
						padding-left: desktop-vw(16px);
						font-size: desktop-vw(24px);
					}
				}

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 0;
					height: 100%;
					width: desktop-vw(2px);
					background-color: var(--blue);
					animation: scale 4s infinite;
					animation-play-state: paused;
					transform-origin: 50% 0;
					transform: scale(0);
				}

				@keyframes scale {
					50% {
						transform: scaleY(1.5);
					}
				}

				&.show {
					&::before {
						animation-play-state: running;
					}
				}

				&.hide {
					opacity: 0;
					transform: translateY(20%);

					&::before {
						animation-play-state: paused;
					}
				}
			}

			.description {
				grid-column: 1 / -1;

				@include desktop {
					grid-column: 3 / span 3;
				}
			}

			:global(.cta) {
				grid-column: 1 / -1;
				text-align: end;

				@include desktop {
					transition:
						transform calc($intro-duration - 200ms) var(--ease-out-expo),
						opacity $intro-duration var(--ease-out-expo);
					grid-column: 10 / -1;
					opacity: 0.5;
					transform: translate3d(0, 100%, 0);
				}
			}

			:global(.cta.in) {
				opacity: 1;
				transform: translate3d(0, 0, 0);
			}
		}
	}

	.why {
		margin-bottom: mobile-vw(160px);
		position: relative;

		@include desktop {
			margin-bottom: desktop-vw(640px);
		}

		.sticky {
			grid-column: 1 / -1;

			@include desktop {
				position: sticky;
				top: 33%;
				align-self: start;
				border-left: 4px solid var(--theme-contrast);
				grid-column: 3 / span 4;
				padding: desktop-vw(24px) desktop-vw(32px);
			}
		}

		.features {
			grid-column: 1 / -1;

			@include desktop {
				grid-column: 7 / -1;
				margin-top: desktop-vw(256px);
			}
		}

		.feature {
			&:not(:first-child) {
				margin-top: mobile-vw(120px);
			}

			@include desktop {
				width: columns(4);

				&:not(:first-child) {
					margin-top: desktop-vw(400px);
				}
			}

			.title {
				color: var(--theme-contrast);
				margin-bottom: mobile-vw(16px);

				@include desktop {
					margin-bottom: desktop-vw(24px);
				}
			}
		}
	}

	.rethink {
		position: relative;

		.pre {
			margin-bottom: mobile-vw(160px);

			@include desktop {
				margin-bottom: desktop-vw(240px);
			}

			.highlight {
				@include desktop {
					border-left: 4px solid var(--theme-contrast);
					grid-column: 3 / span 4;
					top: desktop-vw(64px);
					padding: desktop-vw(24px) 0 desktop-vw(24px) desktop-vw(32px);
				}
			}

			.comparison {
				grid-column: 1 / -1;

				@include desktop {
					grid-column: 7 / span 4;
					margin-top: desktop-vw(256px);
				}
			}
		}

		.cards {
			margin-bottom: mobile-vw(160px);

			@include desktop {
				margin-bottom: desktop-vw(400px);
			}

			:global(.card) {
				@include desktop {
					&:first-child {
						margin-left: calc(columns(6) + var(--layout-margin) + var(--layout-columns-gap));
					}

					&:not(:last-child) {
						margin-right: calc(var(--layout-columns-gap) * 2 + var(--layout-column-width));
					}

					&:last-child {
						margin-right: calc(columns(2) + var(--layout-margin) + var(--layout-columns-gap));
					}
				}
			}
		}
	}

	.solution {
		color: var(--white);
		height: 500vh;
		position: relative;

		@include desktop {
			height: 1000vh;
		}

		.inner {
			position: sticky;
			top: 0;
			margin: 0 auto;
			overflow: hidden;
			height: calc(100 * var(--vh, 1vh));

			&::after {
				content: '';
				background-color: currentColor;
				position: absolute;
				height: 100%;
				width: 100%;
				left: 50%;
				transform: translateX(-50%) scaleX(var(--progress2));
				top: 0;
			}

			@include desktop {
				height: 100vh;
			}

			.zoom {
				align-self: start;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100%;
				transform: scale(calc(1 + (var(--progress1)) * 3));
				padding: mobile-vh(16px);

				@include desktop {
					padding: desktop-vh(40px) var(--layout-margin);
				}
			}
		}

		.first {
			transform: translateY(calc(var(--progress1) * -100%));
		}

		.second {
			text-align: end;
		}

		.enter {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-54.2%, -50%) scale(calc((var(--progress1) * 18.2)));
			transform-origin: 50% calc(50% - (var(--progress1) * 27%));
			opacity: calc(var(--progress1) * 2);
			text-align: center;
			// will-change: transform;

			@include desktop {
				transform: translate(-50%, -50%) scale(calc((var(--progress1) * 8.5)));
				transform-origin: 50% calc(50% - (var(--progress1) * 25%));
			}
		}
	}

	.featuring {
		position: relative;
		padding-bottom: mobile-vw(160px);
		color: var(--theme-secondary);

		&::before {
			content: '';
			top: 0;
			left: 0;
			width: 100%;
			height: mobile-vw(150px);
			position: absolute;
			background: linear-gradient(
				to bottom,
				var(--theme-primary),
				var(--theme-primary-transparent)
			);

			@include desktop {
				height: desktop-vw(150px);
			}
		}

		@include desktop {
			padding: desktop-vw(40px) 0;
			padding-bottom: desktop-vw(320px);
		}

		.inner {
			position: relative;
		}

		.intro {
			padding-bottom: mobile-vw(160px);

			@include desktop {
				padding-bottom: desktop-vw(440px);
			}
		}
	}

	.in-use {
		// background-color: var(--theme-primary);
		color: var(--theme-secondary);
		padding-bottom: mobile-vw(160px);
		position: relative;

		@include desktop {
			padding-bottom: desktop-vw(400px);
		}

		.title {
			grid-column: 1 / -1;
			@include desktop {
				grid-column: 1 / span 5;
			}
		}

		.list {
			grid-column: 1 / -1;

			@include desktop {
				grid-column: 6 / span 7;
			}
		}
	}

	.temp {
		height: 100vh;
		opacity: 0.95;
		display: flex;
		align-items: center;
	}
</style>

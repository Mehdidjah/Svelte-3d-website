<script lang="ts">
	import { dev } from '$app/environment';

	export let title = '';
	export let description =
		'Personal SvelteKit project by Mehdi, exploring smooth scrolling, 3D visuals, and modern front-end techniques.';
	export let image = '';
	export let keywords: string[] = [];
</script>

<svelte:head>
	<!-- <meta httpEquiv="x-ua-compatible" content="ie=edge" />
	<meta httpEquiv="x-dns-prefetch-control" content="off" />
	<meta httpEquiv="Window-Target" content="_value" /> -->

	<title>{title}</title>
	<meta name="description" content={description} />

	<meta name="robots" content={!dev ? 'index,follow' : 'noindex,nofollow'} />
	<meta name="googlebot" content={!dev ? 'index,follow' : 'noindex,nofollow'} />

	<meta
		name="keywords"
		content={`${keywords && keywords.length ? keywords.join(',') : keywords}`}
	/>
	<meta name="author" content="Mehdi" />
	<meta name="referrer" content="no-referrer" />
	<meta name="format-detection" content="telephone=no" />
	<meta name="geo.region" content="US" />

	<link rel="manifest" href="/site.webmanifest" />
	<meta name="msapplication-TileColor" content="#000000" />
	<meta name="theme-color" content="#ffffff" />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if image}
		<meta property="og:image" content={image} />
		<meta name="twitter:image" content={image} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>

<!-- <NextSeo
	{title}
	{description}
	openGraph={{
		title,
		description,
		type: 'website',
		locale: 'en_US',
		images: [
			{
				url: image ? image.url : 'https://mehdios.vercel.app/og.jpg',
				width: image ? image.width : 1200,
				height: image ? image.height : 630,
				alt: title
			}
		],
		defaultImageWidth: 1200,
		defaultImageHeight: 630,
		site_name: ''
	}}
	twitter={{
		handle: '@svelte3d',
		cardType: 'summary_large_image'
	}}
/> -->

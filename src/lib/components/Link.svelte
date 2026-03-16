<script lang="ts">
	let className = '';

	export { className as class };
	export let href = '';

	const isProtocol = href?.startsWith('mailto:') || href?.startsWith('tel:');
	const isExternal = href?.startsWith('http');
</script>

{#if typeof href !== 'string'}
	<button class={className}><slot /></button>
{:else if isProtocol || isExternal}
	<a class={className} {href} target="_blank" rel="noopener noreferrer">
		<slot />
	</a>
{:else}
	<a class={className} {href}>
		<slot />
	</a>
{/if}

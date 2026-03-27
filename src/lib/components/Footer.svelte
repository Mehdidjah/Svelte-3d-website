<script lang="ts">
	import { footerContent } from '$lib/content/pages/footer';
</script>

<footer class="theme-light footer">
	<div class="layout-grid top hide-on-mobile">
		<p class="first-line h1">
			{footerContent.desktop.introPrefix} <br />
			<span class="contrast">{footerContent.desktop.introHighlight}</span>
		</p>
		<div class="shameless-plug">
			<p class="h4">{footerContent.desktop.foundersTitle}</p>
			<p class="p-s">
				{footerContent.desktop.foundersText} <br /> {footerContent.desktop.foundersSubtext}
			</p>
		</div>
		<p class="last-line h1">
			{footerContent.desktop.outroLine1} <br />
			<br /> {footerContent.desktop.outroLine2}
		</p>
	</div>
	<div class="layout-block top hide-on-desktop">
		<div class="shameless-plug">
			<p class="h4">{footerContent.mobile.title}</p>
			<p class="p-s">
				{footerContent.mobile.line1} <br /> {footerContent.mobile.line2}
			</p>
		</div>
		<p class="first-line h1">
			{footerContent.mobile.introPrefix} <br />
			<span class="contrast">{footerContent.mobile.introHighlight}</span>
			<br /> {footerContent.mobile.introSuffix1} <br /> {footerContent.mobile.introSuffix2}
		</p>
	</div>
	<div class="bottom">
		<div class="links">
			{#each footerContent.links as link, i (i)}
				<a class="link p-xs" href={link.href}>{link.label}</a>
			{/each}
		</div>
		<p class="p-xs tm">
			<span>©</span>
			{new Date().getFullYear()} {footerContent.copyrightName}
		</p>
	</div>
</footer>

<style lang="scss">
	@use '../styles/_functions' as *;

	.footer {
		// background-color: var(--theme-primary);
		color: var(--theme-secondary);
		padding: mobile-vw(20px) 0;
		height: calc(100 * var(--vh, 1vh));
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;

		@include desktop {
			height: 100vh;
			padding: desktop-vw(40px) 0;
		}

		.top {
			position: relative;
			height: 100%;
			width: 100%;
			padding-bottom: mobile-vw(20px);
			align-items: center;

			@include mobile {
				display: flex;
				flex-direction: column;
			}

			@include desktop {
				padding-bottom: desktop-vw(40px);
			}

			.first-line {
				margin: auto 0;

				@include desktop {
					margin: 0;
					align-self: start;
					grid-column: 1 / span 7;
				}
			}

			.shameless-plug {
				align-self: start;
				display: flex;
				flex-direction: column;

				@include desktop {
					text-align: end;
					grid-column: 9 / span 4;
				}

				p:first-child {
					margin-bottom: mobile-vw(8px);

					@include desktop {
						margin-bottom: desktop-vw(8px);
					}
				}
			}
			.last-line {
				// this line is only rendered on desktop
				text-align: end;
				align-self: end;
				grid-column: 2 / -1;
			}
		}

		.bottom {
			width: var(--layout-width);
			margin: 0 auto;

			@include mobile {
				display: grid;
				grid-template-columns: 1fr 1fr;
			}

			@include desktop {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.links {
				@include desktop {
					.link:not(:first-child) {
						margin: 0;
						margin-left: desktop-vw(32px);
					}
				}

				@include mobile {
					.link:not(:last-child) {
						display: block;
						margin-bottom: mobile-vw(16px);
					}
				}
			}

			.tm {
				@include mobile {
					text-align: end;
					align-self: end;
				}

				span {
					vertical-align: text-top;
				}
			}
		}
	}
</style>

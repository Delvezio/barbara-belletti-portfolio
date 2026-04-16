<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { StrapiEntity, ProjectDTO } from '$lib/services/strapi';
	import { strapiMediaUrl } from '$lib/services/strapi';

	export let open = false;
	export let project: StrapiEntity<ProjectDTO> | null = null;
</script>

<Modal
	bind:open
	titleId="project-modal-title"
	closeLabel="Chiudi"
	duration={520}
	overlayDuration={420}
	offsetY={40}
	headerPadClass="w-full px-6 md:px-12 lg:px-20 xl:px-36"
	contentPadClass="w-full px-6 md:px-12 lg:px-20 xl:px-36 pt-8"
>
	<!-- ✅ slot title: figlio diretto -->
	<div slot="title">{project?.title ?? ''}</div>

	{#if project}
		{@const p = project}

		<div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-8 lg:items-start">
			<div
				class="order-2 lg:order-1 lg:col-span-3 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2 scrollbar-hidden"
			>
				<div class="space-y-8 pb-10">
					{#if p.cover?.url}
						<div
							class="w-full overflow-hidden rounded-3xl bg-silver/20"
							style={`aspect-ratio: ${p.cover.width ?? 3} / ${p.cover.height ?? 2};`}
						>
							<img
								src={strapiMediaUrl(p.cover.url)}
								alt={p.cover.alternativeText ?? p.title}
								class="h-full w-full object-cover"
								width={p.cover.width ?? undefined}
								height={p.cover.height ?? undefined}
								loading="eager"
								decoding="async"
							/>
						</div>
					{/if}

					{#each p.gallery ?? [] as m (m.id)}
						{#if m.url}
							<div
								class="w-full overflow-hidden rounded-3xl bg-silver/20"
								style={`aspect-ratio: ${m.width ?? 3} / ${m.height ?? 2};`}
							>
								<img
									src={strapiMediaUrl(m.url)}
									alt={m.alternativeText ?? p.title}
									class="h-full w-full object-cover"
									width={m.width ?? undefined}
									height={m.height ?? undefined}
									loading="lazy"
									decoding="async"
								/>
							</div>
						{/if}
					{/each}
				</div>
			</div>

			<aside class="order-1 lg:order-2 lg:col-span-1 overflow-anchor-none">
				<div class="mb-12 lg:mb-0">
					<!--<h3 class="text-fluid-3xl font-black tracking-tight text-graphite leading-[0.98]">
                {p.title}
            </h3> -->

					{#if p.description}
						<p class="mt-6 text-[17px] leading-relaxed text-graphite/85">
							{p.description}
						</p>
					{/if}

					<div class="mt-8 h-px w-full bg-silver/40"></div>

					{#if p.service}
						<div class="mt-6">
							<span
								class="inline-flex items-center rounded-full bg-bright-gold-500 px-4 py-2 text-sm font-bold tracking-wide text-graphite"
							>
								{p.service}
							</span>
						</div>
					{/if}
				</div>
			</aside>
		</div>
	{/if}
</Modal>

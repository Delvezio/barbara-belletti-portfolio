<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Container from '$lib/components/ui/Container.svelte';
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte';
  import type { StrapiEntity, ProjectDTO } from '$lib/services/strapi';
  export let onSelect: (p: StrapiEntity<ProjectDTO>) => void = () => {};

function selectProject(p: StrapiEntity<ProjectDTO>) {
  onSelect(p);
}

  export let projects: Array<StrapiEntity<ProjectDTO>> = [];

  const mediaUrl = (url?: string | null) => (url ? `${import.meta.env.VITE_STRAPI_URL}${url}` : null);
</script>

<Section id="portfolio">
  <Container className="mb-8">
    <SectionTitle overtitle="Portfolio" title="Una selezione dei miei lavori" align="center"/>

  </Container>

  <!-- container a padding laterale 0 -->
  <Container padClass="px-6 md:px-12">
    <div class="max-w-340 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:pt-8">
      {#each projects as p (p.id)}
        {@const cover = mediaUrl(p.cover?.url)}

        <article class="group relative aspect-3/2 overflow-hidden rounded-3xl bg-silver/20 cursor-pointer">
            <!-- tutta la cover cliccabile -->
            <button
                type="button"
                class="absolute inset-0 z-10 cursor-pointer focus:outline-none"
                aria-label={"Apri progetto " + p.title}
                on:click={() => selectProject(p)}
            ></button>

            {#if cover}
                <img
                    src={cover}
                    alt={p.cover?.alternativeText ?? p.title}
                    class="h-full w-full object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    />
            {/if}

            <!-- label service -->
            {#if p.service}
                <div class="absolute left-5 top-5 z-20">
                <span class="inline-flex items-center rounded-full bg-bright-gold-500 px-4 py-2 text-sm font-bold tracking-wide text-graphite backdrop-blur">
                    {p.service}
                </span>
                </div>
            {/if}

            <!-- (opzionale) titolo in basso, solo hover, senza bottone 
            <div class="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6">
                <div class="opacity-0 translate-y-2 transition duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                <h3 class="text-2xl font-extrabold text-white drop-shadow">{p.title}</h3>
                </div>
            </div> -->

            <!-- overlay hover leggero (facoltativo, puoi toglierlo) -->
            <div class="pointer-events-none absolute inset-0 bg-graphite/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
        </article>
      {/each}
    </div>
  </Container>
</Section>

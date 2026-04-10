<script lang="ts">
  import Header from '$lib/components/sections/Header.svelte';
  import Hero from '$lib/components/sections/Hero.svelte';
  import About from '$lib/components/sections/About.svelte';
  import Services from '$lib/components/sections/Services.svelte';
  import Method from '$lib/components/sections/Method.svelte';
  import ContactCta from '$lib/components/sections/ContactCta.svelte';
  import Portfolio from '$lib/components/sections/Portfolio.svelte';
  import ProjectModal from '$lib/components/sections/ProjectModal.svelte';
  import Testimonials from '$lib/components/sections/Testimonials.svelte';
  import Footer from '$lib/components/sections/Footer.svelte';

  import type { PageData } from './$types';
  import type { ProjectDTO, StrapiEntity } from '$lib/services/strapi';

  let { data } = $props<{ data: PageData }>();

  let projectOpen = $state(false);
  let selectedProject = $state<StrapiEntity<ProjectDTO> | null>(null);

  $effect(() => {
    if (!projectOpen) selectedProject = null;
  });
</script>

<div id="top"></div>
<Header />
<Hero />

{#if data.about}
  <About about={data.about} />
{/if}

<Services />
<Method />
<ContactCta />

{#if data.projects.length}
  <Portfolio
    projects={data.projects}
    onSelect={(p) => {
      selectedProject = p;
      projectOpen = true;
    }}
  />
{/if}

<ProjectModal bind:open={projectOpen} project={selectedProject} />

{#if data.testimonials.length}
  <Testimonials items={data.testimonials} />
{/if}

<Footer />

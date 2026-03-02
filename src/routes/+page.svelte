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
  import { onMount } from 'svelte';
  import { fetchAbout, fetchProjects, type AboutDTO, type ProjectDTO, type StrapiEntity } from '$lib/services/strapi';
  import { fetchTestimonials, type TestimonialDTO } from '$lib/services/strapi';

  let about: AboutDTO | null = null;
  let projects: Array<StrapiEntity<ProjectDTO>> = [];
  let testimonials: Array<TestimonialDTO> = [];
  let error: string | null = null;

  let projectOpen = false;
    let selectedProject: StrapiEntity<ProjectDTO> | null = null;

  onMount(async () => {
    try {
      about = (await fetchAbout()).data;
      projects = (await fetchProjects(50)).data;
      testimonials = (await fetchTestimonials(50)).data;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Errore fetch';
    }
  });

  $: if (!projectOpen) selectedProject = null;

</script>

<div id="top"></div>
<Header />
<Hero />
{#if error}
  <p class="px-6 py-6 text-neon-pink-500 font-semibold">Errore: {error}</p>
{/if}
{#if about}
  <About {about} />
{/if}
<Services />
<Method />
<ContactCta />
<Portfolio
  {projects}
  onSelect={(p) => {
    selectedProject = p;
    projectOpen = true;
  }}
/>

<ProjectModal bind:open={projectOpen} project={selectedProject} />

<Testimonials items={testimonials} />

<Footer />

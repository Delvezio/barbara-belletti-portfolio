<script lang="ts">
  import { onMount } from 'svelte';
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
  import Section from '$lib/components/ui/Section.svelte';
  import Container from '$lib/components/ui/Container.svelte';
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte';

  import type { PageData } from './$types';
  import {
    fetchAbout,
    fetchProjects,
    fetchTestimonials,
    type AboutDTO,
    type ProjectDTO,
    type StrapiEntity,
    type TestimonialDTO
  } from '$lib/services/strapi';

  let { data } = $props<{ data: PageData }>();

  let projectOpen = $state(false);
  let selectedProject = $state<StrapiEntity<ProjectDTO> | null>(null);
  let about = $state<AboutDTO | null>(null);
  let projects = $state<Array<StrapiEntity<ProjectDTO>>>([]);
  let testimonials = $state<TestimonialDTO[]>([]);
  let aboutState = $state<'loading' | 'ready' | 'error'>('loading');
  let projectsState = $state<'loading' | 'ready' | 'error'>('loading');
  let testimonialsState = $state<'loading' | 'ready' | 'error'>('loading');
  let retrying = $state(false);

  type AboutResult = { key: 'about'; value: Awaited<ReturnType<typeof fetchAbout>> };
  type ProjectsResult = { key: 'projects'; value: Awaited<ReturnType<typeof fetchProjects>> };
  type TestimonialsResult = {
    key: 'testimonials';
    value: Awaited<ReturnType<typeof fetchTestimonials>>;
  };
  type CmsTaskResult = AboutResult | ProjectsResult | TestimonialsResult;

  $effect(() => {
    if (!projectOpen) selectedProject = null;
  });

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async function loadCmsContent({ force = false } = {}) {
    if (retrying && !force) return;

    retrying = true;

    if (!about) aboutState = 'loading';
    if (!projects.length) projectsState = 'loading';
    if (!testimonials.length) testimonialsState = 'loading';

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const tasks: Promise<CmsTaskResult>[] = [];

      if (aboutState !== 'ready') {
        tasks.push(fetchAbout().then((value) => ({ key: 'about' as const, value })));
      }

      if (projectsState !== 'ready') {
        tasks.push(fetchProjects(50).then((value) => ({ key: 'projects' as const, value })));
      }

      if (testimonialsState !== 'ready') {
        tasks.push(fetchTestimonials(50).then((value) => ({ key: 'testimonials' as const, value })));
      }

      if (!tasks.length) break;

      const results = await Promise.allSettled(tasks);

      for (const result of results) {
        if (result.status !== 'fulfilled') continue;

        if (result.value.key === 'about') {
          about = result.value.value.data as AboutDTO;
          aboutState = 'ready';
        }

        if (result.value.key === 'projects') {
          projects = result.value.value.data as Array<StrapiEntity<ProjectDTO>>;
          projectsState = 'ready';
        }

        if (result.value.key === 'testimonials') {
          testimonials = result.value.value.data as TestimonialDTO[];
          testimonialsState = 'ready';
        }
      }

      if (aboutState === 'ready' && projectsState === 'ready' && testimonialsState === 'ready') {
        break;
      }

      if (attempt < maxAttempts) {
        await sleep(1500 * attempt);
      }
    }

    if (aboutState !== 'ready') aboutState = 'error';
    if (projectsState !== 'ready') projectsState = 'error';
    if (testimonialsState !== 'ready') testimonialsState = 'error';

    retrying = false;
  }

  onMount(() => {
    void loadCmsContent();
  });
</script>

<div id="top"></div>
<Header />
<Hero />

{#if aboutState === 'ready' && about}
  <About about={about} />
{:else}
  <Section id="about">
    <Container>
      <div class="rounded-3xl border border-silver/40 bg-white px-6 py-8 lg:px-10">
        <SectionTitle overtitle="Chi sono" title="Sto caricando questa sezione" />
        <p class="mt-4 max-w-2xl text-lg text-graphite/75">
          {aboutState === 'error'
            ? 'I contenuti da Strapi non sono ancora arrivati. Puoi riprovare senza ricaricare tutta la pagina.'
            : 'La struttura del sito e pronta: i contenuti editoriali arrivano in pochi istanti.'}
        </p>

        {#if aboutState === 'error'}
          <button
            type="button"
            class="mt-6 rounded-full bg-neon-pink-500 px-5 py-3 font-bold text-white transition hover:opacity-90"
            onclick={() => loadCmsContent({ force: true })}
          >
            Riprova a caricare i contenuti
          </button>
        {/if}
      </div>
    </Container>
  </Section>
{/if}

<Services />
<Method />
<ContactCta />

{#if projectsState === 'ready'}
  <Portfolio
    projects={projects}
    onSelect={(p) => {
      selectedProject = p;
      projectOpen = true;
    }}
  />
{:else}
  <Section id="portfolio">
    <Container className="mb-8">
      <SectionTitle overtitle="Portfolio" title="Una selezione dei miei lavori" align="center" />
    </Container>
    <Container padClass="px-6 md:px-12">
      <div class="mx-auto max-w-340 rounded-3xl border border-silver/40 bg-white px-6 py-8 text-center">
        <p class="text-lg text-graphite/75">
          {projectsState === 'error'
            ? 'I progetti non sono ancora disponibili. Puoi riprovare senza ricaricare il sito.'
            : 'Sto recuperando il portfolio dal CMS.'}
        </p>

        {#if projectsState === 'error'}
          <button
            type="button"
            class="mt-6 rounded-full bg-neon-pink-500 px-5 py-3 font-bold text-white transition hover:opacity-90"
            onclick={() => loadCmsContent({ force: true })}
          >
            Riprova a caricare i progetti
          </button>
        {/if}
      </div>
    </Container>
  </Section>
{/if}

<ProjectModal bind:open={projectOpen} project={selectedProject} />

{#if testimonialsState === 'ready'}
  <Testimonials items={testimonials} />
{:else}
  <Section id="testimonials" className="relative isolate my-0">
    <Container padClass="px-0 md:px-12" className="z-10">
      <div class="mx-auto max-w-340 rounded-4xl bg-bright-gold-500 px-8 py-10 text-center lg:rounded-[3rem] lg:px-20 lg:py-16">
        <SectionTitle
          overtitle="Dicono di me"
          title="Le opinioni dei miei clienti"
          customclass="max-w-2xl mx-auto"
          align="center"
        />
        <p class="mt-6 text-lg text-graphite/75">
          {testimonialsState === 'error'
            ? 'Le testimonianze non sono ancora arrivate dal CMS. Puoi ritentare tra un momento.'
            : 'Sto caricando le testimonianze.'}
        </p>

        {#if testimonialsState === 'error'}
          <button
            type="button"
            class="mt-6 rounded-full bg-graphite px-5 py-3 font-bold text-white transition hover:opacity-90"
            onclick={() => loadCmsContent({ force: true })}
          >
            Riprova a caricare le testimonianze
          </button>
        {/if}
      </div>
    </Container>
  </Section>
{/if}

<Footer />

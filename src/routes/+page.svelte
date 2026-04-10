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
  let showPortfolioPrompt = $state(false);

  $effect(() => {
    if (!projectOpen) selectedProject = null;
  });

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  function startPortfolioPromptTimer() {
    const timer = window.setTimeout(() => {
      if (projectsState !== 'ready') {
        showPortfolioPrompt = true;
      }
    }, 2500);

    return () => window.clearTimeout(timer);
  }

  type CmsPayload = {
    about: AboutDTO | null;
    projects: Array<StrapiEntity<ProjectDTO>>;
    testimonials: TestimonialDTO[];
    ok: boolean;
  };

  async function loadCmsContent({ force = false } = {}) {
    if (retrying && !force) return;

    retrying = true;

    if (!about) aboutState = 'loading';
    if (!projects.length) projectsState = 'loading';
    if (!testimonials.length) testimonialsState = 'loading';

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetch('/api/cms', {
          headers: {
            Accept: 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`CMS proxy error ${res.status}`);
        }

        const payload = (await res.json()) as CmsPayload;

        if (payload.about) {
          about = payload.about;
          aboutState = 'ready';
        }

        if (payload.projects.length) {
          projects = payload.projects;
          projectsState = 'ready';
        }

        if (payload.testimonials.length) {
          testimonials = payload.testimonials;
          testimonialsState = 'ready';
        }

        if (payload.ok) {
          break;
        }
      } catch {
        // Retry a couple of times before showing the CTA fallbacks.
      }

      if (attempt < maxAttempts) {
        await sleep(1200 * attempt);
      }
    }

    if (aboutState !== 'ready') aboutState = 'error';
    if (projectsState !== 'ready') projectsState = 'error';
    if (testimonialsState !== 'ready') testimonialsState = 'error';

    retrying = false;
  }

  onMount(() => {
    const stopTimer = startPortfolioPromptTimer();
    void loadCmsContent();

    return () => {
      stopTimer();
    };
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
      <div class="flex min-h-90 flex-col items-center justify-center rounded-3xl bg-white/60 px-6 text-center">
        <p class="text-fluid-2xl font-black tracking-tight text-graphite">Vuoi scoprire chi sono?</p>
        <button
          type="button"
          class="mt-6 rounded-full bg-neon-pink-500 px-6 py-3 font-bold text-white transition hover:opacity-90"
          onclick={() => loadCmsContent({ force: true })}
        >
          Scopri ora
        </button>
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
      <div class="mx-auto max-w-340 rounded-3xl border border-silver/40 bg-white px-6 py-10 text-center">
        {#if showPortfolioPrompt || projectsState === 'error'}
          <p class="text-lg font-medium text-graphite">Vuoi vedere il mio portfolio?</p>
          <button
            type="button"
            class="mt-6 rounded-full bg-neon-pink-500 px-6 py-3 font-bold text-white transition hover:opacity-90"
            onclick={() => loadCmsContent({ force: true })}
          >
            Guarda ora
          </button>
        {:else}
          <div class="flex min-h-48 items-center justify-center">
            <div
              class="h-10 w-10 animate-spin rounded-full border-4 border-silver/40 border-t-neon-pink-500"
              aria-label="Caricamento"
            ></div>
          </div>
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
      <div class="mx-auto max-w-340 rounded-4xl bg-bright-gold-500 px-8 py-10 lg:rounded-[3rem] lg:px-20 lg:py-16">
        <SectionTitle
          overtitle="Dicono di me"
          title="Le opinioni dei miei clienti"
          customclass="max-w-2xl"
        />
        <button
          type="button"
          class="mt-8 rounded-full bg-graphite px-6 py-3 font-bold text-white transition hover:opacity-90"
          onclick={() => loadCmsContent({ force: true })}
        >
          Leggi recensioni
        </button>
      </div>
    </Container>
  </Section>
{/if}

<Footer />

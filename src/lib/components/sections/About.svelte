<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Container from '$lib/components/ui/Container.svelte';
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { strapiMediaUrl } from '$lib/services/strapi';
  import type { AboutDTO } from '$lib/services/strapi';

  let aboutOpen = false;

  export let about: AboutDTO;
  

  function openAbout() {
    aboutOpen = true;
  }

  const photoUrl =
    // se in futuro userai photo da Strapi: costruiremo qui l'URL
    null;
</script>

<Section id="about">
  <Container>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <!-- SX: immagine -->
      <div class="rounded-3xl overflow-hidden bg-transparent justify-items-center">
        <img
          src="/images/bbelletti-image-about-image.png"
          alt="Barbara Belletti"
          class="w-full h-full max-w-62.5 sm:max-w-100 object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <!-- DX: testo + CTA -->
      <div class="max-w-xl">
        <SectionTitle overtitle="Chi sono" title={about.introTitle} />

        <p class="mt-6 text-lg leading-relaxed text-graphite/80 max-w-lg">
          {about.shortIntro}
        </p>

        <div class="mt-10">
          <Button size="md" onClick={openAbout}>
            {about.ctaLabel ?? 'Scopri di più'}
          </Button>
        </div>
      </div>
    </div>
  </Container>
</Section>

<Modal bind:open={aboutOpen} titleId="about-modal-title" closeLabel="Chiudi" duration={520} overlayDuration={420} offsetY={40}>
  

  <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-16">
    <!-- SX (lg+): foto 1/3 -->
    <div class="hidden lg:block">
      {#if about.photo?.url}
        <div class="sticky top-24 overflow-hidden bg-transparent">
          <img
            src={strapiMediaUrl(about.photo.url)}
            alt={about.photo.alternativeText ?? 'Barbara Belletti'}
            class="w-full h-auto object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      {/if}
    </div>

    <!-- DX: testo -->
    <div class="lg:col-span-2">
      <h3 class="text-fluid-4xl font-black tracking-tight text-graphite leading-tight">
        {about.bioTitle}
      </h3>

      <div class="mt-8 max-w-[68ch] space-y-6 text-[17px] leading-relaxed text-graphite/85">
        <div class="[&>p]:mb-6 [&>p:last-child]:mb-0 [&>ul]:my-6 [&>ol]:my-6 [&>li]:mb-2 [&>strong]:text-graphite [&>a]:text-neon-pink-500 [&>a]:underline [&>a:hover]:opacity-80">
          {@html about.fullBio}
        </div>
      </div>
    </div>
  </div>
</Modal>

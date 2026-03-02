<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Container from '$lib/components/ui/Container.svelte';
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte';

  const steps = [
    {
      n: '1.',
      title: 'Colloquio conoscitivo',
      desc: 'Ci incontriamo (di persona o online) per capire esigenze, obiettivi e valori del brand o del progetto.',
      img: '/images/vector/colloquio-conoscitivo.svg',
      alt: 'Illustrazione colloquio conoscitivo'
    },
    {
      n: '2.',
      title: 'Presentazione preventivo',
      desc: 'Dopo il briefing, preparo un preventivo dettagliato, modulato su tempi, attività e tipo di fornitura.',
      img: '/images/vector/presentazione-preventivo.svg',
      alt: 'Illustrazione presentazione preventivo'
    },
    {
      n: '3.',
      title: 'Proposta grafica',
      desc: 'Realizzo e presento una proposta visiva basata sulle informazioni raccolte, da cui partire per lo sviluppo finale.',
      img: '/images/vector/Proposta-grafica.svg',
      alt: 'Illustrazione proposta grafica'
    }
  ] as const;
</script>

<Section id="method">
  <Container maxWidth="max-w-[1360px]">
    <!-- Header sezione: titolo max metà su lg+ + freccia 1 solo md+ -->
    <div class="relative">
      <div class="max-w-none lg:max-w-2xl">
        <SectionTitle overtitle="Metodo" title="Un percorso trasparente" />
      </div>

      <!-- freccia grigia accanto al titolo (solo md+) -->
      <img
        src="/images/vector/gray-arrow-1.svg"
        alt=""
        aria-hidden="true"
        class="hidden md:block absolute right-[20%] top-30 w-40 lg:w-56 pointer-events-none opacity-80"
      />
    </div>

    <!-- Steps wrapper -->
    <div class="relative mt-14 space-y-14 lg:space-y-20">
      <!-- Freccia 2 (tra step 1 e 2) — solo md+, a sinistra, metà verticale -->
      <img
        src="/images/vector/gray-arrow-2.svg"
        alt=""
        aria-hidden="true"
        class="hidden md:block absolute -left-10 lg:-left-35 top-[33%] -translate-y-1/2 w-20 lg:w-28 pointer-events-none opacity-80"
      />

      <!-- Freccia 3 (tra step 2 e 3) — solo md+, a destra, metà verticale -->
      <img
        src="/images/vector/gray-arrow-3.svg"
        alt=""
        aria-hidden="true"
        class="hidden md:block absolute -right-10 lg:-right-25 top-[66%] -translate-y-1/2 w-28 lg:w-45 pointer-events-none opacity-80"
      />

      {#each steps as s, i (s.n)}
        <!-- md+: immagine e testo affiancati; alterniamo il lato immagine -->
        <article class="mt-20 sm:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-16 items-center">
          {#if i % 2 === 0}
            <!-- immagine SX -->
            <div class="flex justify-center md:justify-start">
              <img
                src={s.img}
                alt={s.alt}
                class="w-full max-w-105 lg:max-w-115 h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>

            <!-- testo DX -->
            <div>
              <h3 class="text-fluid-3xl leading-tight font-black text-graphite">
                {s.n} {s.title}
              </h3>
              <p class="mt-4 text-[17px] leading-relaxed text-graphite/80 max-w-[52ch]">
                {s.desc}
              </p>
            </div>
          {:else}
            <!-- testo SX -->
            <div class="order-2 md:order-1">
              <h3 class="text-fluid-3xl leading-tight font-black tracking-tight text-graphite">
                {s.n} {s.title}
              </h3>
              <p class="mt-4 text-[17px] leading-relaxed text-graphite/80 max-w-[52ch]">
                {s.desc}
              </p>
            </div>

            <!-- immagine DX -->
            <div class="order-1 md:order-2 flex justify-center md:justify-end">
              <img
                src={s.img}
                alt={s.alt}
                class="w-full max-w-[420px] lg:max-w-[460px] h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          {/if}
        </article>
      {/each}
    </div>
  </Container>
</Section>
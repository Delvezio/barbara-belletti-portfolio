<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Container from '$lib/components/ui/Container.svelte';
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte';
  import ParallaxItem from '../background/ParallaxItem.svelte';

  type Testimonial = { id: number; text: string; author: string; service: string };
  export let items: Testimonial[] = [];

  let index = 0;

  let rootEl: HTMLElement | null = null;
  let inView = false;
  let timer: number | null = null;

  const intervalMs = 2.700;

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    if (timer) return;
    timer = window.setInterval(() => {
      // avanza di 1 su mobile, di 3 su lg+
      next();
    }, intervalMs);
  }

  onMount(() => {
    if (typeof window === 'undefined' || !rootEl) return;

    updateCols();
    window.addEventListener('resize', updateCols);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        if (inView) startAutoplay();
        else stopAutoplay();
      },
      { threshold: 0.35 }
    );

    io.observe(rootEl);

    return () => {
      stopAutoplay();
      io.disconnect();
      window.removeEventListener('resize', updateCols);
    };
  });

  // 1 card su mobile, 3 su lg+
  let cols = 1;
  const updateCols = () => (cols = window.matchMedia('(min-width: 1024px)').matches ? 3 : 1);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const maxIndex = () => Math.max(0, items.length - cols);

  function prev() {
    index = clamp(index - cols, 0, maxIndex());
  }
  function next() {
    index = clamp(index + cols, 0, maxIndex());
  }

  // client-only
  if (typeof window !== 'undefined') {
    updateCols();
    window.addEventListener('resize', updateCols);
  }
</script>

<Section id="testimonials" className="relative isolate my-0">
<ParallaxItem scope="section" speed={-0.5} className="left-4/5 -bottom-80 opacity-100 -z-10">
        <div class="-translate-y-1/2">
            <img
                src="/images/vector/bortered-vector.svg"
                alt=""
                aria-hidden="true"
                class="pointer-events-none w-full h-full"
            />
        </div>
    </ParallaxItem>
  <!-- Pannello giallo: larghezza = container SENZA padding -->
  <Container padClass="px-0 md:px-12" className="z-10" >
    <div bind:this={rootEl}  class="relative isolate max-w-340 mx-auto bg-bright-gold-500 rounded-4xl lg:rounded-[3rem] overflow-hidden">
      <div class="-z-1 absolute -top-18 -right-18 w-80 h-auto pointer-events-none">
        <img src="/images/vector/arco.svg" alt="arco decorativo" class="w-full h-auto" />
      </div>
        
      <!-- padding interno del pannello -->
      <div class="z-10 px-8 md:px-12 lg:px-20 py-8 md:py-12 lg:py-20">
        <SectionTitle
      overtitle="Dicono di me"
      title="Le opinioni dei miei clienti"
      customclass="max-w-2xl"
    />
        <!-- controlli discreti (puoi anche nasconderli del tutto se non li vuoi) -->
        <div class="mb-10 flex items-center justify-end gap-3">
          <button
            type="button"
            class="rounded-full bg-white/40 px-4 py-2 text-sm font-bold text-graphite hover:bg-white/55 transition"
            on:click={() => { stopAutoplay(); prev(); }}
            aria-label="Precedente"
          >
            ←
          </button>
          <button
            type="button"
            class="rounded-full bg-white/40 px-4 py-2 text-sm font-bold text-graphite hover:bg-white/55 transition"
            on:click={() => { stopAutoplay(); next(); }}
            aria-label="Successivo"
          >
            →
          </button>
        </div>

        <!-- slider -->
        <div class="overflow-hidden">
          <div
            class="flex items-start gap-10 transition-transform duration-300 ease-out"
            style={`transform: translateX(calc(-${index} * (100% + 2.5rem)));`}
          >
            {#each items as t (t.id)}
              <article
                class="shrink-0 w-full lg:w-[calc((100%-5rem)/3)] bg-white/50 rounded-2xl p-6 lg:p-10"
              >
                <p class="text-graphite text-[18px] leading-relaxed font-medium">
                  “{t.text}”
                </p>

                <div class="mt-10">
                  <p class="text-graphite font-black tracking-wide">{t.author}</p>
                  <p class="mt-2 text-graphite/80 text-sm font-bold tracking-widest uppercase">
                    {t.service}
                  </p>
                </div>
              </article>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </Container>
</Section>
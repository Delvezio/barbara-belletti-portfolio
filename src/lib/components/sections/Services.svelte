<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Container from '$lib/components/ui/Container.svelte';
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte';
  import ParallaxItem from '../background/ParallaxItem.svelte';

  const services = [
    {
            over: 'Impaginazione',
            title: 'Print & Editorial',
            items: ['Magazine', 'Brochure', 'Cataloghi', 'House organ', 'Report aziendali'],
            desc: 'Impagino contenuti editoriali per la stampa curando gerarchie, tipografia e ritmo, per pagine ordinate e leggibili.',
            featured: false
        },
        {
            over: 'Identità',
            title: 'Brand Identity',
            items: ['Logo design', 'Immagine coordinata', 'Biglietti da visita', 'Preventivi e carta intestata', 'Packaging'],
            desc: 'Costruisco identità visive solide e riconoscibili, traducendo i valori del brand in un sistema grafico coerente.',
            featured: true
        },
        {
            over: 'Promozione',
            title: 'Marketing Design',
            items: ['Insegne', 'Espositori', 'Roll-up', 'Depliant', 'Flyer'],
            desc: 'Progetto i tuoi contenuti con gerarchie ordinate e stile coerente, per una lettura immediata e memorabile.',
            featured: false
        }
    ] as const;
</script>

<Section id="services" className="my-0 relative isolate overflow-x-hidden">

  <ParallaxItem scope="section" speed={0.25} className="left-0 top-1/3 opacity-100 -z-10">
        <div class="-translate-y-1/2">
            <img
                src="/images/vector/yellow-triangles-left.svg"
                alt=""
                aria-hidden="true"
                class="pointer-events-none w-25 h-full"
            />
        </div>
    </ParallaxItem>
    <ParallaxItem scope="section" speed={-0.2} className="-right-10 bottom-10 opacity-100 -z-10">
    <div class="-translate-y-1/2">
        <img
            src="/images/vector/fucsia-triple-angle.svg"
            alt=""
            aria-hidden="true"
            class="pointer-events-none w-auto h-60"
        />
    </div>
    </ParallaxItem>

  <Container>
    <!-- titolo centrato come screenshot -->
    <div class="mx-auto max-w-4xl text-center">
      <SectionTitle
      titleSize="text-fluid-4xl"
        overtitle="I miei servizi"
        title="Soluzioni su misura per il tuo progetto"
        align="center"
      />
    </div>

    <!-- cards -->
    <div class="mt-12 grid grid-cols-1 gap-4 xl:gap-8 lg:grid-cols-3">
      {#each services as s (s.title)}
        <article
          class={[
            'rounded-3xl bg-white border transition flex flex-col h-full overflow-hidden',
            s.featured ? 'border-neon-pink-500' : 'border-silver/60'
            ].join(' ')}
        >
            <div class="p-8 lg:p-10">   
                <p class="text-xs font-bold tracking-widest uppercase text-neon-pink-500">
                    {s.over}
                </p>

                <h3 class="mt-3 text-fluid-3xl font-black tracking-normal leading-none text-graphite">
                    {s.title}
                </h3>

                <ul class="mt-8 space-y-3 text-graphite/80">
                    {#each s.items as it (it)}
                    <li class="flex items-start gap-3">
                        <img
                            src="/icons/check.svg"
                            alt=""
                            class="mt-1 h-4 w-4 shrink-0"
                            aria-hidden="true"
                            />
                        <span class="leading-relaxed">{it}</span>
                    </li>
                    {/each}
                </ul>
            </div>

          <div class="mt-auto">
            <div
  class={[
    'px-8 lg:px-10 py-6 text-sm leading-relaxed text-graphite/70 rounded-2xl', // 👈 aggiungi qui
    s.featured ? 'bg-neon-pink-500/10' : 'bg-silver/10'
  ].join(' ')}
>
  {s.desc}
</div>
          </div>
        </article>
      {/each}
    </div>
  </Container>
</Section>
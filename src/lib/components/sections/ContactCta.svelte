<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Container from '$lib/components/ui/Container.svelte';
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte';
  import ParallaxItem from '../background/ParallaxItem.svelte';
</script>

<Section id="contact" className="relative my-0 isolate">
<ParallaxItem scope="section" speed={0.2} className="left-0 top-2/3 opacity-100 -z-10">
        <div class="-translate-y-1/2">
            <img
                src="/images/vector/fucsia-half-ring.svg"
                alt=""
                aria-hidden="true"
                class="pointer-events-none w-auto h-80"
            />
        </div>
    </ParallaxItem>
    <ParallaxItem scope="section" speed={-0.35} className="right-2 bottom-1/3 opacity-100 -z-10">
    <div class="-translate-y-1/2">
        <img
            src="/images/vector/yellow-scribble.svg"
            alt=""
            aria-hidden="true"
            class="pointer-events-none w-50 h-full"
        />
    </div>
    </ParallaxItem>
  <Container padClass="px-0 md:px-12">
    <div class="relative isolate max-w-340 mx-auto bg-graphite rounded-3xl lg:rounded-[3rem] overflow-hidden shadow-xl">
      <div class="relative z-10 px-8 md:px-12 lg:px-20 py-8 md:py-12 lg:py-20">
        <p class="text-sm tracking-widest font-bold text-neon-pink-500 uppercase">
        Iniziamo da qui
        </p>

        <h2 class="mt-4 text-fluid-6xl font-black tracking-tight text-white leading-tight">
        Hai un progetto in mente?
        <br />
        <a
            class="text-neon-pink-500 underline decoration-neon-pink-500 transition"
            href="mailto:info@bbelletti.it"
        >
            Scrivimi
        </a>
        <span class="text-white"> per fissare un primo colloquio.</span>
        </h2>

        <p class="mt-8 text-white text-xl lg:text-2xl leading-relaxed">
          Se vuoi conoscermi meglio, guarda i progetti che ho realizzato:
          <a class="text-neon-pink-500 font-bold underline decoration-neon-pink-500 hover:opacity-80 transition " href="#portfolio">Portfolio</a>
        </p>
      </div>
    </div>
  </Container>
</Section>
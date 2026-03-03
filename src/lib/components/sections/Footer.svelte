<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Container from '$lib/components/ui/Container.svelte';
</script>

<Section id="footer" className="relative isolate my-0 overflow-x-hidden">
  <Container padClass="px-6 md:px-12" maxWidth="max-w-320 ">
    <div class="lg:min-h-162.5 flex flex-col justify-between lg:py-12">
        <!-- RIGA 1: CTA grande (senza sfondo nero) -->
        <div class="mx-auto">
        <p class="text-sm tracking-widest font-bold text-neon-pink-500 uppercase">
            entra in contatto
        </p>

        <h2 class="mt-4 text-fluid-6xl font-black tracking-tight text-graphite leading-tight">
            Hai un’idea o un progetto da sviluppare? 
            <a
            class="text-neon-pink-500 underline decoration-neon-pink-500 transition hover:opacity-80"
            href="mailto:info@bbelletti.it"
            >
            Contattami
            </a>
        </h2>
        </div>

        <!-- RIGA 2: info + torna su copyright-->
        <div>
            <!-- info + torna su-->
            <div class="mt-16 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <!-- SX: logo + link -->
                <div class="flex items-center gap-5">
                    <img
                    src="/images/bbelletti-icon-logo.svg"
                    alt="Barbara Belletti"
                    class="h-12 w-auto"
                    decoding="async"
                    />

                    <div class="flex flex-col leading-tight">
                        <p class="font-bold text-lg text-graphite">barbara belletti</p>
                        <p class="text-sm text-graphite/70 -mt-1">graphic designer</p>
                    </div>
                </div>

                <div class="mt-3 flex flex-wrap gap-4 text-sm font-semibold ">
                    <a class="text-graphite/30 hover:text-graphite/70 transition" href="https://www.linkedin.com/in/bbelletti/" target="_blank" rel="noreferrer">
                    LinkedIn
                    </a>
                    <a class="text-graphite/30 hover:text-graphite/70 transition" href="https://www.behance.net/BBwip" target="_blank" rel="noreferrer">
                    Behance
                    </a>
                </div>
                
           

            <!-- DX: torna su -->
            <a href="#top" class="inline-flex items-center gap-3 text-fluid-2xl font-black text-graphite">
                Torna su
                <span class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-silver text-graphite">
                <img
                            src="/icons/arrow-back-top.svg"
                            alt=""
                            class="h-6 w-6 shrink-0"
                            aria-hidden="true"
                            />
                </span>
            </a>
            </div>

            <!--  copyright  -->
            <div class="mt-14 border-t border-silver/60 pt-8 text-right text-xs text-graphite/60">
            © {new Date().getFullYear()} barbaraBelletti.it — All rights reserved Made by
            <a class="font-semibold text-graphite/70 hover:text-graphite transition" href="https://delvup.com/" target="_blank" rel="noreferrer">
                DELVUP
            </a>
            </div>
        </div>
    </div>
  </Container>
</Section>
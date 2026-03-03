<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Container from '$lib/components/ui/Container.svelte';
  import ParallaxItem from '../background/ParallaxItem.svelte';
  import { onMount, onDestroy } from 'svelte';

  // ✅ CONFIG (puoi modificare qui)
  const words = ['grafica', 'editoria', 'identità'] as const;

  // tempi (ms)
  const startDelay = 650;        // (2) delay all'avvio animazione
  const typeSpeed = 100;          // (5) velocità scrittura (più alto = più lento)
  const deleteSpeed = 55;        // velocità cancellazione
  const letterJitter = 35;       // (3) micro-delay extra tra lettere (occhio umano)
  const holdAfterType = 1800;    // pausa dopo parola scritta
  const holdBetweenLoops = 7000; // pausa dopo "Identità" prima di ripartire
  const caretPulseMs = 2000;      // (4) timing caret

  const phrasePrefix = 'progetto ';
  const baseWord = 'progetto'; // (1) prima scrive Progetto, poi rimane

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let started = false;

  // stato di cosa stiamo scrivendo: prima "Progetto", poi solo la parola variabile
  let phase: 'prefix' | 'word' = 'prefix';
  let displayed = '';

  let timer: number | null = null;

  const isReduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clearTimer() {
    if (timer) window.clearTimeout(timer);
    timer = null;
  }

  const rand = (n: number) => (n ? Math.floor(Math.random() * n) : 0);

  function schedule(fn: () => void, ms: number) {
    timer = window.setTimeout(fn, ms);
  }

  function tick() {
    if (isReduce) {
      displayed = `${phrasePrefix}${words[0]}`;
      return;
    }

    const current = words[wordIndex];

    // --- Phase 1: scrive "Progetto" una sola volta ---
    if (phase === 'prefix') {
      if (!started) {
        started = true;
        displayed = '';
        charIndex = 0;
      }

      charIndex = Math.min(charIndex + 1, baseWord.length);
      displayed = baseWord.slice(0, charIndex);

      if (charIndex === baseWord.length) {
        // passa alla fase parola variabile, mantenendo "Progetto "
        phase = 'word';
        deleting = false;
        charIndex = 0;

        schedule(tick, 250);
        return;
      }

      schedule(tick, typeSpeed + letterJitter + rand(20));
      return;
    }

    // --- Phase 2: scrive/cancella solo la seconda parola ---
    if (!deleting) {
      charIndex = Math.min(charIndex + 1, current.length);
      displayed = `${phrasePrefix}${current.slice(0, charIndex)}`;

      if (charIndex === current.length) {
        const isLastWord = wordIndex === words.length - 1;

        schedule(() => {
            deleting = true;
            tick();
        }, isLastWord ? holdBetweenLoops : holdAfterType);

        return;
      }

      schedule(tick, typeSpeed + letterJitter + rand(25));
    } else {
      charIndex = Math.max(charIndex - 1, 0);
      displayed = `${phrasePrefix}${current.slice(0, charIndex)}`;

      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;

        schedule(tick, 250);
        return; 
      }

      schedule(tick, deleteSpeed + rand(15));
    }
  }

  onMount(() => {
    if (typeof window === 'undefined') return;

    // reset stato
    displayed = '';
    wordIndex = 0;
    charIndex = 0;
    deleting = false;
    phase = 'prefix';
    started = false;

    // (2) delay iniziale
    timer = window.setTimeout(() => tick(), startDelay);
  });

  onDestroy(() => {
    clearTimer();
  });
</script>

<Section id="top" className="my-0 relative isolate">
  <div class="relative min-h-[calc(75vh-5rem)] flex items-center isolate ">
    <!-- decorativi -->
     <ParallaxItem scope="section" speed={0.35} className="hidden md:block left-25 -bottom-30 opacity-100 -z-10">
        <div class="-translate-y-1/2">
            <img
                src="/images/vector/hero-scribble.svg"
                alt=""
                aria-hidden="true"
                class="pointer-events-none w-50 h-full"
            />
        </div>
    </ParallaxItem>
    <ParallaxItem scope="section" speed={-0.8} className="right-0 top-2/3  opacity-100 -z-10">
    <div class="-translate-y-1/2">
        <img
            src="/images/vector/yellow-half-ring.svg"
            alt=""
            aria-hidden="true"
            class="pointer-events-none w-auto h-80"
        />
    </div>
    </ParallaxItem>

    <Container>
      <div class="min-h-[calc(75vh-5rem)] flex flex-col z-10">
  <!-- Centro verticale -->
  <div class="flex-1 flex items-center justify-center">
    <div class="text-center flex flex-col gap-2">
      <p class="text-xl md:text-2xl tracking-wide font-bold text-graphite">
        sono <span class="text-neon-pink-500">barbara belletti</span>
      </p>

      <h1 class="text-fluid-4xl sm:text-fluid-6xl lg:text-fluid-8xl font-black tracking-tight text-graphite leading-tight">
        <span class="inline-flex items-baseline gap-1">
          <span>{displayed}</span>
          <span class="caret bg-neon-pink-500 motion-safe:caret-anim" aria-hidden="true"></span>
        </span>
      </h1>
    </div>
  </div>

  <!-- Fondo pagina -->
  <div class="pb-10 flex justify-center">
    <a href="#about" class="inline-flex flex-col items-center gap-3 text-neon-pink-500 font-semibold">
      <span class="text-xs tracking-widest uppercase">Scopri di più</span>
      <span aria-hidden="true">↓</span>
    </a>
  </div>
</div>
    </Container>
  </div>
</Section>

<style>
  /* caret base */
  .caret {
    display: inline-block;
    width: 2px;
    height: 1em;
    vertical-align: -0.12em;
  }

  /* animazione solo se motion-safe è applicabile */
  :global(.motion-safe\:caret-anim) {
    animation: caretBlink 1s steps(1, end) infinite;
  }

  /* ON/OFF netto: 0.5s off + 0.5s on */
  @keyframes caretBlink {
    0% { opacity: 0; }
    50% { opacity: 0; }
    50.0001% { opacity: 1; }
    100% { opacity: 1; }
  }

  /* se reduced motion, niente blink */
  @media (prefers-reduced-motion: reduce) {
    :global(.motion-safe\:caret-anim) {
      animation: none !important;
      opacity: 1 !important;
    }
  }
</style>
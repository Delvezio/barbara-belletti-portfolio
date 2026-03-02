<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let speed = 0.15;                 // 0.05–0.25 consigliato
  export let scope: 'viewport' | 'section' = 'section';
  export let className = '';
  export let intensity = 1;
  export let maxShift = 80;                // ✅ clamp px (evita salti strani)

  let inner: HTMLElement;
  let raf = 0;
  let reduce = false;

  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  // base translate (per preservare posizionamenti tipo -translate-y-1/2 fatti nello slot)
  let baseY = 0;
  let initialized = false;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const computeShift = () => {
    const rect = inner.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const delta = rect.top + rect.height / 2 - viewportCenter;
    const y = delta * speed * intensity;
    return clamp(y, -maxShift, maxShift);
  };

  const apply = () => {
    if (!inner || reduce) return;

    // misura base una sola volta, dopo layout stabilizzato
    if (!initialized) {
      // leggi eventuale transform pre-esistente (es. da wrapper slot). Noi NON la tocchiamo:
      // usiamo baseY=0 e facciamo parallax solo su inner, quindi qui fissiamo baseY a 0.
      // (se vuoi un offset fisso, lo fai nelle classi/slot)
      baseY = 0;
      initialized = true;
    }

    const shift = computeShift();
    inner.style.transform = `translate3d(0, ${baseY + shift}px, 0)`;
  };

  const scheduleApply = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      apply();
    });
  };

  onMount(() => {
    if (!isBrowser) return;

    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ✅ init dopo 2 frame (layout + paint), evita flash/jump
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        apply();
      });
    });

    window.addEventListener('scroll', scheduleApply, { passive: true });
    window.addEventListener('resize', scheduleApply, { passive: true });

    // ✅ fix reload/back-forward cache: ricalcola quando la pagina “riappare”
    window.addEventListener('pageshow', scheduleApply);

    return () => {
      window.removeEventListener('scroll', scheduleApply);
      window.removeEventListener('resize', scheduleApply);
      window.removeEventListener('pageshow', scheduleApply);
      if (raf) window.cancelAnimationFrame(raf);
    };
  });

  onDestroy(() => {
    if (!isBrowser) return;
    window.removeEventListener('scroll', scheduleApply);
    window.removeEventListener('resize', scheduleApply);
    window.removeEventListener('pageshow', scheduleApply);
    if (raf) window.cancelAnimationFrame(raf);
  });
</script>

<div class={scope === 'viewport' ? `pointer-events-none fixed ${className}` : `pointer-events-none absolute ${className}`}>
  <div bind:this={inner} class="will-change-transform" style="transform: translate3d(0,0,0);">
    <slot />
  </div>
</div>
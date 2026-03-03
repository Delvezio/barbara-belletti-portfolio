<script lang="ts">
  import { onDestroy, tick } from 'svelte';

  export let open = false;
  export let titleId = 'modal-title';
  export let ariaLabel: string | undefined = undefined;
  export let closeLabel = 'Chiudi';

  export let duration = 300; // ms (più percepibile)
  export let offsetY = 100;   // px (quanto "sale" dal basso)
  export let overlayDuration = 500; // ms (fade overlay)

  export let contentPadClass = 'mx-auto w-full max-w-390 px-6 md:px-12 lg:px-28 xl:px-36 2xl:px-48 py-10';
  export let headerPadClass = 'mx-auto w-full max-w-390 px-6 md:px-12 lg:px-28 xl:px-36 2xl:px-48';


  let previouslyFocused: HTMLElement | null = null;
  let prevBodyOverflowAnchor: string | null = null;

  // ✅ NEW: gestiscono mount + animazione
  let mounted = false; // controlla {#if}
  let active = false;  // controlla data-open (fade/slide)
  let closing = false;

  const DURATION = duration;
  let closeTimer: number | undefined;

  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';


  function lockScroll(locked: boolean) {
  // larghezza scrollbar (0 su sistemi con overlay scrollbar)
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  if (locked) {
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('overflow-hidden');

    // Compensa lo spazio della scrollbar per evitare shift
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Disattiva scroll anchoring (evita micro-jitter)
    prevBodyOverflowAnchor = document.body.style.overflowAnchor;
    document.body.style.overflowAnchor = 'none';
    document.documentElement.style.overflowAnchor = 'none';
  } else {
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');

    // Ripristina padding scrollbar
    document.body.style.paddingRight = '';

    // Ripristina scroll anchoring
    document.body.style.overflowAnchor = prevBodyOverflowAnchor ?? '';
    prevBodyOverflowAnchor = null;
    document.documentElement.style.overflowAnchor = '';
  }
}



  function onKeydown(e: KeyboardEvent) {
    if (!mounted) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      requestClose();
    }
  }

  function requestClose() {
    if (closing) return;
    closing = true;

    // avvia animazione uscita
    active = false;

    if (isBrowser) window.clearTimeout(closeTimer);
    closeTimer = (isBrowser ? window.setTimeout : setTimeout)(() => {
        open = false;
        mounted = false;
        closing = false;
        cleanup();
    }, duration) as unknown as number;
}


  function cleanup() {
  if (!isBrowser) return;
  lockScroll(false);
  window.removeEventListener('keydown', onKeydown);
  previouslyFocused?.focus?.();
}

  // ✅ NEW: quando open diventa true dall'esterno, monta e anima in entrata
  $: (async () => {
    if (!isBrowser) return;

    if (open && !closing) {
        window.clearTimeout(closeTimer);

        if (!mounted) mounted = true;
        await tick();

        previouslyFocused = document.activeElement as HTMLElement | null;
        lockScroll(true);
        window.addEventListener('keydown', onKeydown);

        requestAnimationFrame(() => {
        active = true;
        });
    } else if (!open && mounted && !closing) {
        // open è stato messo a false dall'esterno: chiudi animato
        requestClose();
    }
  })();


  onDestroy(() => {
    if (isBrowser) window.clearTimeout(closeTimer);
    cleanup();
  });
</script>


{#if mounted}
  <div
    class="fixed inset-0 z-100 modal-root"
    data-open={active ? 'true' : 'false'}
    style={`--modal-duration:${duration}ms; --overlay-duration:${overlayDuration}ms; --modal-offset:${offsetY}px;`}
    >
    <!-- overlay -->
    <button
  type="button"
  class="absolute inset-0 z-0 modal-overlay"
  aria-label={closeLabel}
  on:click={requestClose}
></button>

    <!-- panel -->
    <div
      class="absolute inset-x-0 bottom-0 modal-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabel ? undefined : titleId}
      aria-label={ariaLabel}
    >
      <div class="h-full overflow-y-auto modal-scroll">

        <div class="sticky top-10 bg-white/90 backdrop-blur ">
          <div class={`${headerPadClass} h-16 flex items-center justify-between`}>
            <h2 id={titleId} class="text-base font-bold text-graphite">
              <slot name="title" />
            </h2>

            <button
                type="button"
                class=" bg-graphite rounded-full px-5 py-3 text-sm text-white hover:bg-graphite/80 transition"
                on:click={requestClose}
                >    {closeLabel}
            </button>

          </div>
        </div>

        <div class={contentPadClass}>
          <slot />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    background: rgba(51, 51, 51, 0.7);
    opacity: 0;
    transition: opacity var(--overlay-duration, 320ms) ease-out;
  }

  .modal-scroll {
  overflow-anchor: none;
}

  .modal-panel {
    height: 100vh;
    border-radius: 0;
    background: white;
    overflow: hidden;

    opacity: 0;
    transform: translate3d(0, var(--modal-offset, 28px), 0);
    transition:
      transform var(--modal-duration, 420ms) cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity var(--modal-duration, 420ms) ease-out;
}
  @media (min-width: 1024px) {
    .modal-panel {
      height: 100vh;
      border-radius: 0;
    }
  }

  .modal-root[data-open='true'] .modal-overlay {
    opacity: 1;
  }
  .modal-root[data-open='true'] .modal-panel {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (prefers-reduced-motion: reduce) {
    .modal-overlay,
    .modal-panel {
      transition: none !important;
    }
  }
  /* nasconde scrollbar, ma mantiene scroll */
:global(.scrollbar-hidden) {
  scrollbar-width: none; /* Firefox */
}
:global(.scrollbar-hidden::-webkit-scrollbar) {
  width: 0;
  height: 0;
}
</style>

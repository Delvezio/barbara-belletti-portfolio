<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

 let {
  open = $bindable(false),
  titleId = 'modal-title',
  ariaLabel = undefined,
  closeLabel = 'Chiudi',
  duration = 300,
  offsetY = 100,
  overlayDuration = 500,
  contentPadClass = 'mx-auto w-full max-w-[1560px] px-6 md:px-12 lg:px-28 xl:px-36 2xl:px-48 py-10',
  headerPadClass = 'mx-auto w-full max-w-[1560px] px-6 md:px-12 lg:px-28 xl:px-36 2xl:px-48'
} = $props();

  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  let mounted = $state(false);
  let active = $state(false);
  let closing = $state(false);
  let closeTimer = $state<ReturnType<typeof setTimeout> | null>(null);
  let previouslyFocused: HTMLElement | null = null;
  let prevBodyOverflowAnchor: string | null = null;

  function lockScroll(locked: boolean) {
    if (!isBrowser) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (locked) {
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      prevBodyOverflowAnchor = document.body.style.overflowAnchor;
      document.body.style.overflowAnchor = 'none';
      document.documentElement.style.overflowAnchor = 'none';
    } else {
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
      document.body.style.paddingRight = '';
      document.body.style.overflowAnchor = prevBodyOverflowAnchor ?? '';
      prevBodyOverflowAnchor = null;
      document.documentElement.style.overflowAnchor = '';
    }
  }

  function cleanup() {
    if (!isBrowser) return;
    lockScroll(false);
    window.removeEventListener('keydown', onKeydown);
    previouslyFocused?.focus?.();
  }

  function mountModal() {
    if (!isBrowser || mounted) return;

    mounted = true;
    closing = false;
    previouslyFocused = document.activeElement as HTMLElement | null;
    lockScroll(true);
    window.addEventListener('keydown', onKeydown);

    requestAnimationFrame(() => {
      active = true;
    });
  }

  function unmountModal() {
    mounted = false;
    active = false;
    closing = false;
    cleanup();
  }

  function requestClose() {
  if (!isBrowser || closing || !mounted) return;

  closing = true;
  active = false;

  if (closeTimer) clearTimeout(closeTimer);

  closeTimer = setTimeout(() => {
    open = false;

    // reset completo stato modale
    mounted = false;
    closing = false;
    active = false;

    cleanup();
    closeTimer = null;
  }, duration);
}

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      requestClose();
    }
  }

  onMount(() => {
    if (!isBrowser) return;

    if (open) mountModal();

    return () => {
      if (closeTimer) clearTimeout(closeTimer);
      unmountModal();
    };
  });

  $effect(() => {
    if (!isBrowser) return;

    if (open && !mounted) {
      mountModal();
    } else if (!open && mounted && !closing) {
      requestClose();
    }
  });

  onDestroy(() => {
    if (!isBrowser) return;
    if (closeTimer) clearTimeout(closeTimer);
    unmountModal();
  });
</script>

{#if mounted}
  <div
    class="fixed inset-0 z-[100] modal-root"
    data-open={active ? 'true' : 'false'}
    style={`--modal-duration:${duration}ms; --overlay-duration:${overlayDuration}ms; --modal-offset:${offsetY}px;`}
  >
    <button
      type="button"
      class="absolute inset-0 z-0 modal-overlay"
      aria-label={closeLabel}
      onclick={requestClose}
    ></button>

    <div
      class="absolute inset-x-0 bottom-0 z-10 modal-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabel ? undefined : titleId}
      aria-label={ariaLabel}
    >
      <div class="h-full overflow-y-auto modal-scroll">
        <div class="sticky top-0 bg-white/90 backdrop-blur border-b border-silver/40">
          <div class={`${headerPadClass} h-16 flex items-center justify-between`}>
            <h2 id={titleId} class="text-base font-bold text-graphite">
              <slot name="title" />
            </h2>

            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-semibold text-graphite hover:bg-silver/20 transition"
              onclick={requestClose}
            >
              {closeLabel}
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
  .modal-scroll {
    overflow-anchor: none;
  }

  .modal-overlay {
    background: rgba(51, 51, 51, 0.7);
    opacity: 0;
    transition: opacity var(--overlay-duration, 320ms) ease-out;
  }

  .modal-panel {
    height: 100vh;
    background: white;
    border-radius: 0;
    overflow: hidden;
    opacity: 0;
    transform: translate3d(0, var(--modal-offset, 28px), 0);
    transition:
      transform var(--modal-duration, 420ms) cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity var(--modal-duration, 420ms) ease-out;
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
</style>

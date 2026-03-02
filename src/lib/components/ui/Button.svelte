<script lang="ts">
  export let href: string | undefined = undefined;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let className = '';
  export let onClick: ((e: MouseEvent) => void) | undefined = undefined;

  const base =
    'inline-flex items-center justify-center rounded-full bg-neon-pink-500 text-white hover:opacity-90 transition ' +
    'tracking-wide'; // letterspacing un pelo più aperto

  const sizes: Record<typeof size, string> = {
    sm: 'px-5 py-3 text-xs',
    md: 'px-6 py-3.5 text-sm',
    lg: 'px-7 py-4 text-base'
  };
</script>

{#if href}
  <a href={href} class={`${base} ${sizes[size]} ${className}`} on:click={onClick}>
    <slot />
  </a>
{:else}
  <button type={type} class={`${base} ${sizes[size]} ${className}`} on:click={onClick}>
    <slot />
  </button>
{/if}


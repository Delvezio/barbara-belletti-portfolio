<script lang="ts">
  export let id: string | undefined = undefined;
  export let className = '';
</script>

<section id={id} class={`py-16 lg:py-18 ${className}`}>
  <slot />
</section>


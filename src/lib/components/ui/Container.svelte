<script lang="ts">
  export let className = '';
  export let maxWidth = 'max-w-390';
  export let padClass = 'px-6 md:px-12 lg:px-28 xl:px-36 2xl:px-48';
</script>

<div class={`mx-auto w-full ${maxWidth} ${padClass} ${className}`}>
  <slot />
</div>